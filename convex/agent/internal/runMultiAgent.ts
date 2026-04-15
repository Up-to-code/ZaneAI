"use node";

import type { AgentRunResult } from "@jackchen_me/open-multi-agent";
import { AgentPool } from "@jackchen_me/open-multi-agent";

import { assertValidBuyerAssistantTurn } from "../../../packages/zayon-assistant-protocol/src/schemas";
import type { BuyerAssistantTurn } from "../../../packages/zayon-assistant-protocol/src/types";
import { getAnalysisAgentConfig } from "../agents/analysis/config";
import { analysisSchema } from "../agents/analysis/schema";
import { getPreferenceAgentConfig } from "../agents/preference/config";
import { preferenceSchema } from "../agents/preference/schema";
import { getRankingAgentConfig } from "../agents/ranking/config";
import { rankingSchema } from "../agents/ranking/schema";
import type { TeamTurnResult, ToolRuntime, WebSource } from "../lib/runtimeTypes";
import { createAgent } from "../lib/tools/createAgent";
import {
  buildAnalysisTools,
  buildPreferenceTools,
  buildRankingTools,
  buildSearchTools,
  buildSummaryTools,
} from "../lib/tools";
import { getSearchAgentConfig } from "../agents/search/config";
import { searchSchema } from "../agents/search/schema";
import { getSummaryAgentConfig } from "../agents/summary/config";
import { summarySchema } from "../agents/summary/schema";
import { getZaneAiTeamConfig } from "../team/config";
import { requireStructured, tokenUnits } from "../team/structured";
import {
  buildAnalysisTask,
  buildPreferenceTask,
  buildRankingTask,
  buildSearchTask,
  buildSummaryTask,
} from "../team/turnPrompts";
import { internal } from "../../_generated/api";

type SearchOutput = import("../lib/runtimeTypes").StructuredResult<typeof searchSchema>;
type AnalysisOutput = import("../lib/runtimeTypes").StructuredResult<typeof analysisSchema>;
type PreferenceOutput = import("../lib/runtimeTypes").StructuredResult<typeof preferenceSchema>;
type RankingOutput = import("../lib/runtimeTypes").StructuredResult<typeof rankingSchema>;
type SummaryOutput = import("../lib/runtimeTypes").StructuredResult<typeof summarySchema>;

const PARALLEL_AGENT_LIMIT = 2;

export async function runMultiAgent(runtime: ToolRuntime, prompt: string): Promise<TeamTurnResult> {
  const { team, search, analysis, ranking, preference, summary, pool } = createTeamAgents(runtime);
  const stage = createStageEmitter(runtime);

  try {
    await stage({
      phase: "intent_started",
      status: "running",
      message: "Interpreting the buyer request and preparing the team.",
    });
    await stage({
      phase: "intent_done",
      status: "completed",
      message: "Buyer intent resolved; launching search and preference work.",
      teamId: team.name,
    });

    const { searchResult, searchOutput, preferenceResult, preferenceOutput } = await runSupportAgents({
      pool,
      search,
      preference,
      prompt,
      stage,
    });

    const analysisResult = await runAgentWithStage({
      agent: analysis,
      prompt: buildAnalysisTask(prompt, buildSearchContext(searchResult, searchOutput)),
      stage,
    });
    const analysisOutput = requireStructured<AnalysisOutput>(analysisResult, analysis.name);

    await stage({
      phase: "merge_started",
      status: "running",
      message: "Merging search, analysis, and preference findings for final ranking.",
    });

    const rankingResult = await runAgentWithStage({
      agent: ranking,
      prompt: buildRankingTask(
        prompt,
        buildSearchContext(searchResult, searchOutput),
        buildAnalysisContext(analysisOutput),
        buildPreferenceContext(preferenceOutput),
      ),
      stage,
    });
    const rankingOutput = requireStructured<RankingOutput>(rankingResult, ranking.name);

    const summaryResult = await runAgentWithStage({
      agent: summary,
      prompt: buildSummaryTask(
        prompt,
        buildSearchContext(searchResult, searchOutput),
        buildAnalysisContext(analysisOutput),
        buildRankingContext(rankingOutput),
        buildPreferenceContext(preferenceOutput),
      ),
      stage,
    });
    const finalOutput = assertValidBuyerAssistantTurn(
      requireStructured<SummaryOutput>(summaryResult, summary.name),
    );

    await stage({
      phase: "merge_done",
      status: "completed",
      message: "Final buyer assistant turn prepared.",
    });

    return {
      assistantText: finalOutput.assistantText,
      turn: finalOutput,
      rankingRationale: finalOutput.rankingRationale,
      propertyIds: finalOutput.propertyIds,
      sources: dedupeSources([...searchOutput.sources, ...extractTurnSources(finalOutput)]),
      diagnostics: buildDiagnostics(team.name, preferenceOutput, searchOutput, analysisOutput, rankingOutput),
      tokenUnits: tokenUnits(searchResult, preferenceResult, analysisResult, rankingResult, summaryResult),
    };
  } finally {
    await pool.shutdown();
    analysis.reset();
    ranking.reset();
    summary.reset();
  }
}

function createTeamAgents(runtime: ToolRuntime) {
  const team = getZaneAiTeamConfig();
  const search = createAgent(getSearchAgentConfig(), buildSearchTools(runtime));
  const analysis = createAgent(getAnalysisAgentConfig(), buildAnalysisTools(runtime));
  const ranking = createAgent(getRankingAgentConfig(), buildRankingTools(runtime));
  const preference = createAgent(getPreferenceAgentConfig(), buildPreferenceTools(runtime));
  const summary = createAgent(getSummaryAgentConfig(), buildSummaryTools(runtime));
  const pool = new AgentPool(PARALLEL_AGENT_LIMIT);

  pool.add(search);
  pool.add(preference);

  return { team, search, analysis, ranking, preference, summary, pool };
}

async function runSupportAgents({
  pool,
  search,
  preference,
  prompt,
  stage,
}: {
  pool: AgentPool;
  search: ReturnType<typeof createAgent>;
  preference: ReturnType<typeof createAgent>;
  prompt: string;
  stage: ReturnType<typeof createStageEmitter>;
}) {
  await stage({
    phase: "team_started",
    status: "running",
    teamId: search.name,
    agentName: search.name,
    message: "Search agent is gathering matching properties and market context.",
  });
  await stage({
    phase: "team_started",
    status: "running",
    teamId: preference.name,
    agentName: preference.name,
    message: "Preference agent is reviewing durable buyer signals.",
  });

  const parallelResults = await pool.runParallel([
    { agent: search.name, prompt: buildSearchTask(prompt) },
    { agent: preference.name, prompt: buildPreferenceTask(prompt) },
  ]);

  const searchResult = getRequiredResult(parallelResults.get(search.name), search.name);
  const preferenceResult = getRequiredResult(parallelResults.get(preference.name), preference.name);
  await stage({
    phase: "team_done",
    status: searchResult.success ? "completed" : "failed",
    teamId: search.name,
    agentName: search.name,
    message: "Search agent completed its shortlist.",
  });
  await stage({
    phase: "team_done",
    status: preferenceResult.success ? "completed" : "failed",
    teamId: preference.name,
    agentName: preference.name,
    message: "Preference agent completed its signal review.",
  });

  return {
    searchResult,
    searchOutput: requireStructured<SearchOutput>(searchResult, search.name),
    preferenceResult,
    preferenceOutput: requireStructured<PreferenceOutput>(preferenceResult, preference.name),
  };
}

function getRequiredResult(result: AgentRunResult | undefined, agentName: string) {
  if (!result) {
    throw new Error(`${agentName} did not return a result.`);
  }

  return result;
}

function buildSearchContext(searchResult: AgentRunResult, searchOutput: SearchOutput) {
  // Prefer the search agent's free-form output because it can include ranking nuance
  // and tool context that we intentionally do not force into the strict schema.
  if (searchResult.output) {
    return searchResult.output;
  }

  return [
    `Summary: ${searchOutput.summary}`,
    `Candidate property ids: ${joinOrNone(searchOutput.propertyIds)}`,
    `Market notes: ${joinOrNone(searchOutput.marketNotes)}`,
    `Suggested follow-ups: ${joinOrNone(searchOutput.followups)}`,
  ].join("\n");
}

function buildAnalysisContext(analysisOutput: AnalysisOutput) {
  return [
    `Summary: ${analysisOutput.summary}`,
    `Market signal: ${analysisOutput.marketSignal}`,
    ...analysisOutput.propertyInsights.map((insight) =>
      `${insight.propertyId}: strengths=${joinOrNone(insight.strengths)}; risks=${joinOrNone(insight.risks)}; pricing=${insight.pricingNote}`),
  ].join("\n");
}

function buildPreferenceContext(preferenceOutput: PreferenceOutput) {
  return [
    `Summary: ${preferenceOutput.summary}`,
    `Saved keys: ${joinOrNone(preferenceOutput.savedKeys)}`,
    `Inferred needs: ${joinOrNone(preferenceOutput.inferredNeeds)}`,
    `Suggested follow-ups: ${joinOrNone(preferenceOutput.suggestedFollowups)}`,
  ].join("\n");
}

function buildRankingContext(rankingOutput: RankingOutput) {
  return [
    `Summary: ${rankingOutput.summary}`,
    `Ranked property ids: ${joinOrNone(rankingOutput.propertyIds)}`,
    `Rationale: ${rankingOutput.rankingRationale}`,
    `Comparison points: ${joinOrNone(rankingOutput.comparisonPoints)}`,
  ].join("\n");
}

function buildDiagnostics(
  teamName: string,
  preferenceOutput: PreferenceOutput,
  searchOutput: SearchOutput,
  analysisOutput: AnalysisOutput,
  rankingOutput: RankingOutput,
) {
  return [
    `team:${teamName}`,
    `preferences:${preferenceOutput.savedKeys.length}`,
    `market:${searchOutput.marketNotes.length}`,
    `analysis:${analysisOutput.propertyInsights.length}`,
    `ranked:${rankingOutput.propertyIds.length}`,
  ];
}

function joinOrNone(values: string[]) {
  return values.length > 0 ? values.join(", ") : "none";
}

function extractTurnSources(turn: BuyerAssistantTurn): WebSource[] {
  const sourceCard = turn.cards.find((card) => card.type === "market_sources");
  if (!sourceCard || sourceCard.type !== "market_sources") {
    return [];
  }

  return sourceCard.sources;
}

function dedupeSources(sources: WebSource[]): WebSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

function createStageEmitter(runtime: ToolRuntime) {
  let seq = 0;

  return async (input: {
    phase: string;
    status: "running" | "completed" | "failed" | "cancelled";
    message: string;
    teamId?: string;
    agentName?: string;
    details?: Record<string, string | number | boolean | null>;
  }) => {
    seq += 1;
    await runtime.ctx.runMutation(internal.agent.internal.events.addEvent, {
      runId: runtime.runId,
      seq,
      eventType: "stage",
      phase: input.phase,
      status: input.status,
      teamId: input.teamId,
      agentName: input.agentName,
      message: input.message,
      detailsJson: input.details ? JSON.stringify(input.details) : undefined,
    });
  };
}

async function runAgentWithStage(args: {
  agent: ReturnType<typeof createAgent>;
  prompt: string;
  stage: ReturnType<typeof createStageEmitter>;
}) {
  await args.stage({
    phase: "team_started",
    status: "running",
    teamId: args.agent.name,
    agentName: args.agent.name,
    message: `${args.agent.name} is working on the current buyer turn.`,
  });
  const result = await args.agent.run(args.prompt);
  await args.stage({
    phase: "team_done",
    status: result.success ? "completed" : "failed",
    teamId: args.agent.name,
    agentName: args.agent.name,
    message: `${args.agent.name} completed its step.`,
  });
  return result;
}
