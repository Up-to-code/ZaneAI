"use node";

import { OpenMultiAgent, type AgentConfig } from "@jackchen_me/open-multi-agent";
import { v } from "convex/values";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { seededPreferenceProfile, seededProperties } from "./lib/fixtures";
import { chunkSummary } from "./lib/summary";

type RankedProperty = {
  externalId: string;
  title: string;
  location: string;
  matchScore: number;
  matchReasons: string[];
  aiSummary: string;
};

const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";

function rankProperties(goal: string, properties: RankedProperty[]) {
  const goalLower = goal.toLowerCase();
  return [...properties].sort((left, right) => {
    const leftBoost = goalLower.includes(left.location.toLowerCase()) ? 4 : 0;
    const rightBoost = goalLower.includes(right.location.toLowerCase()) ? 4 : 0;
    return right.matchScore + rightBoost - (left.matchScore + leftBoost);
  });
}

function fallbackSummary(goal: string, rankedProperties: RankedProperty[]) {
  const first = rankedProperties[0];
  const second = rankedProperties[1];
  return [
    `Goal read: ${goal}.`,
    first ? `${first.title} leads on confidence and fit.` : "No lead property available.",
    second ? `${second.title} stays close as the flexible alternative.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getModelRuntimeConfig() {
  return {
    apiKey: process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENROUTER_BASE_URL ?? DEFAULT_OPENROUTER_BASE_URL,
    model: process.env.OPENROUTER_MODEL ?? process.env.OPENAI_MODEL ?? DEFAULT_OPENROUTER_MODEL,
  };
}

async function runZayonAgents(args: {
  goal: string;
  userContext: string;
  visibleProperties: RankedProperty[];
  savedState: string[];
  preferenceProfile: Record<string, unknown>;
}) {
  const ranked = rankProperties(args.goal, args.visibleProperties);
  const runtimeConfig = getModelRuntimeConfig();
  const diagnostics = [
    `visible:${args.visibleProperties.length}`,
    `saved:${args.savedState.length}`,
    `locations:${JSON.stringify(args.preferenceProfile.locations ?? [])}`,
    `provider:openrouter`,
    `model:${runtimeConfig.model}`,
  ];

  if (!runtimeConfig.apiKey) {
    return {
      summary: fallbackSummary(args.goal, ranked),
      rankedProperties: ranked,
      preferenceUpdates: {
        updatedFrom: "fallback",
      },
      diagnostics,
    };
  }

  const agents: AgentConfig[] = [
    {
      name: "search-agent",
      provider: "openai",
      model: runtimeConfig.model,
      systemPrompt: "Find the strongest property candidates for the user's current goal.",
    },
    {
      name: "analysis-agent",
      provider: "openai",
      model: runtimeConfig.model,
      systemPrompt: "Assess property value, quality, price context, and fit.",
    },
    {
      name: "ranking-agent",
      provider: "openai",
      model: runtimeConfig.model,
      systemPrompt: "Rank options and avoid duplicate or conflicting recommendations.",
    },
    {
      name: "preference-agent",
      provider: "openai",
      model: runtimeConfig.model,
      systemPrompt: "Infer changes in preference profile from behavior and prompt.",
    },
    {
      name: "summary-agent",
      provider: "openai",
      model: runtimeConfig.model,
      systemPrompt: "Write a calm, short, premium summary for a real-estate decision app.",
    },
  ];

  const orchestrator = new OpenMultiAgent({
    defaultApiKey: runtimeConfig.apiKey,
    defaultBaseURL: runtimeConfig.baseURL,
    defaultModel: runtimeConfig.model,
    defaultProvider: "openai",
  });

  const team = orchestrator.createTeam("zayon-team", {
    name: "zayon-team",
    sharedMemory: true,
    agents,
  });

  const result = await orchestrator.runTeam(
    team,
    [
      `User context: ${args.userContext}`,
      `Goal: ${args.goal}`,
      `Visible properties: ${JSON.stringify(args.visibleProperties)}`,
      `Saved state: ${JSON.stringify(args.savedState)}`,
      `Preference profile: ${JSON.stringify(args.preferenceProfile)}`,
      "Return one unified recommendation summary and preference delta.",
    ].join("\n"),
  );

  const summaryOutput =
    result.agentResults.get("coordinator")?.output ?? fallbackSummary(args.goal, ranked);

  await orchestrator.shutdown();

  return {
    summary: summaryOutput,
    rankedProperties: ranked,
    preferenceUpdates: {
      updatedFrom: "open-multi-agent",
    },
    diagnostics,
  };
}

export const orchestrateTurnNode = action({
  args: {
    userExternalId: v.string(),
    sessionExternalId: v.string(),
    goal: v.string(),
    userContext: v.string(),
    visiblePropertyIds: v.array(v.string()),
    savedState: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const visibleProperties = seededProperties.filter((property) =>
      args.visiblePropertyIds.length > 0 ? args.visiblePropertyIds.includes(property.externalId) : true,
    );

    const result = await runZayonAgents({
      goal: args.goal,
      userContext: args.userContext,
      visibleProperties,
      savedState: args.savedState,
      preferenceProfile: seededPreferenceProfile,
    });

    const runId = await ctx.runMutation(api.agentRuns.createRun, {
      userExternalId: args.userExternalId,
      goal: args.goal,
      summary: result.summary,
      diagnostics: result.diagnostics,
    });

    await ctx.runMutation(api.agentRuns.addEvent, {
      runId,
      phase: "search",
      message: "Search and ranking completed for current goal.",
    });

    const recommendationBatchId = await ctx.runMutation(api.agentRuns.createRecommendationBatch, {
      userExternalId: args.userExternalId,
      requestContext: args.goal,
      propertyIds: result.rankedProperties.map((property) => property.externalId),
      rankingRationale: result.summary,
    });

    await ctx.runMutation(api.analytics.track, {
      eventName: "ai_response_stream_start",
      payload: JSON.stringify({
        userExternalId: args.userExternalId,
        sessionExternalId: args.sessionExternalId,
        goal: args.goal,
        runId,
        recommendationBatchId,
      }),
    });

    const chunks = chunkSummary(result.summary, 12);
    for (const chunk of chunks) {
      await ctx.runMutation(api.chat.upsertAssistantMessage, {
        sessionExternalId: args.sessionExternalId,
        text: chunk,
        streamState: chunk === chunks[chunks.length - 1] ? "complete" : "streaming",
        relatedPropertyIds: result.rankedProperties.map((property) => property.externalId),
      });
    }

    await ctx.runMutation(api.preferences.patch, {
      userExternalId: args.userExternalId,
      updatedFrom: "ai.orchestrateTurn",
    });

    await ctx.runMutation(api.agentRuns.addEvent, {
      runId,
      phase: "summary",
      message: "Summary stream committed to chat messages.",
    });

    await ctx.runMutation(api.analytics.track, {
      eventName: "ai_response_stream_end",
      payload: JSON.stringify({
        userExternalId: args.userExternalId,
        sessionExternalId: args.sessionExternalId,
        runId,
        recommendationBatchId,
      }),
    });

    return result;
  },
});
