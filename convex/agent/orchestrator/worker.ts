import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { ConvexClient } from "convex/browser";
import { workflow, createWorker } from "@akshatgiri/convex-orchestrator";
import { z } from "zod";

import { api } from "../../_generated/api";
import { getChatModel, getLlmApiKey, getOpenAiCompatibleBaseUrl, getTavilyApiKey } from "../../shared/env";
import {
  assertValidAssistantTurn,
  extractTurnPropertyIds,
} from "../../../packages/zayon-assistant-protocol/src";
import type {
  AssistantAction,
  AssistantMotionPreset,
  AssistantRoute,
  AssistantSource,
  AssistantTurn,
} from "../../../packages/zayon-assistant-protocol/src";
import { assistantAgents } from "./registry";

type WorkerRunInput = {
  runId: string;
  authUserId: string;
  threadId: string;
  prompt: string;
  promptMessageId: string;
};

type PropertySearchFilters = {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
};

type PropertyRow = {
  externalId: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  tags: string[];
  description?: string;
};

type PropertySpecialistResult = {
  assistantText: string;
  propertyIds: string[];
  highlights: string[];
  comparisonPoints: string[];
  followupQuestion?: string;
  querySummary?: string;
  filters: PropertySearchFilters;
  sources: AssistantSource[];
};

type FundingSpecialistResult = {
  assistantText: string;
  summary: string;
  options: string[];
  disclaimers: string[];
  followupQuestion?: string;
};

type AdvisorSpecialistResult = {
  assistantText: string;
  title: string;
  body: string;
  bullets: string[];
  followupQuestion?: string;
};

type WorkflowSpecialistResult = {
  property?: PropertySpecialistResult;
  funding?: FundingSpecialistResult;
  advisor?: AdvisorSpecialistResult;
};

const propertyFiltersSchema = z.object({
  query: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minBeds: z.number().int().positive().optional(),
});

const propertyResultSchema = z.object({
  assistantText: z.string().min(1),
  propertyIds: z.array(z.string().min(1)).max(4),
  highlights: z.array(z.string().min(1)).min(1).max(5),
  comparisonPoints: z.array(z.string().min(1)).max(4),
  followupQuestion: z.string().min(1).optional(),
  querySummary: z.string().min(1).optional(),
});

const fundingResultSchema = z.object({
  assistantText: z.string().min(1),
  summary: z.string().min(1),
  options: z.array(z.string().min(1)).min(1).max(5),
  disclaimers: z.array(z.string().min(1)).max(4),
  followupQuestion: z.string().min(1).optional(),
});

const advisorResultSchema = z.object({
  assistantText: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  bullets: z.array(z.string().min(1)).max(5),
  followupQuestion: z.string().min(1).optional(),
});

const propertyKeywords = [
  "property",
  "properties",
  "apartment",
  "apartments",
  "villa",
  "home",
  "house",
  "bedroom",
  "compare",
  "listing",
  "real estate",
  "location",
  "area",
  "rent",
  "buy",
];

const fundingKeywords = [
  "fund",
  "funding",
  "finance",
  "financing",
  "mortgage",
  "loan",
  "budget",
  "afford",
  "affordability",
  "down payment",
  "installment",
  "monthly payment",
];

const greetingKeywords = [
  "hi",
  "hello",
  "hey",
  "good morning",
  "good evening",
];

function hasAnyKeyword(input: string, keywords: string[]) {
  return keywords.some((keyword) => input.includes(keyword));
}

function routePrompt(prompt: string): {
  route: AssistantRoute;
  specialists: Array<"property" | "funding" | "advisor">;
  motionPreset: AssistantMotionPreset;
} {
  const normalized = prompt.toLowerCase();
  const propertyMatch = hasAnyKeyword(normalized, propertyKeywords);
  const fundingMatch = hasAnyKeyword(normalized, fundingKeywords);
  const greetingMatch = hasAnyKeyword(normalized, greetingKeywords);

  if (propertyMatch && fundingMatch) {
    return {
      route: "mixed",
      specialists: ["property", "funding"],
      motionPreset: "property",
    };
  }

  if (propertyMatch) {
    return {
      route: "property",
      specialists: ["property"],
      motionPreset: "property",
    };
  }

  if (fundingMatch) {
    return {
      route: "funding",
      specialists: ["funding"],
      motionPreset: "funding",
    };
  }

  return {
    route: "advisor",
    specialists: [greetingMatch ? "advisor" : "advisor"],
    motionPreset: "advisor",
  };
}

function createModel() {
  const apiKey = getLlmApiKey();
  if (!apiKey) {
    throw new Error("AI runtime unavailable: missing OPENROUTER_API_KEY or OPENAI_API_KEY.");
  }

  const provider = createOpenAI({
    apiKey,
    baseURL: getOpenAiCompatibleBaseUrl(),
  });

  return provider.chat(getChatModel());
}

async function generateStructuredObject<TSchema extends z.ZodTypeAny>(args: {
  schema: TSchema;
  system: string;
  prompt: string;
}) {
  const result = await generateObject({
    model: createModel(),
    schema: args.schema,
    system: args.system,
    prompt: args.prompt,
    temperature: 0.2,
  });

  return result.object;
}

async function searchWeb(query: string, limit = 3): Promise<AssistantSource[]> {
  const apiKey = getTavilyApiKey();
  if (!apiKey) {
    return [];
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: limit,
      topic: "general",
    }),
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json() as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };

  return (payload.results ?? [])
    .filter((item): item is { title?: string; url: string; content?: string } => Boolean(item.url))
    .map((item) => ({
      title: item.title ?? item.url,
      url: item.url,
      snippet: item.content?.slice(0, 220) ?? item.url,
    }));
}

function shouldFetchLiveContext(prompt: string) {
  const normalized = prompt.toLowerCase();
  return [
    "market",
    "context",
    "trend",
    "price",
    "pricing",
    "compare",
    "neighborhood",
    "area",
  ].some((keyword) => normalized.includes(keyword));
}

function buildPropertySearchPrompt(prompt: string, filters: PropertySearchFilters, candidates: PropertyRow[], sources: AssistantSource[]) {
  return [
    `User request: ${prompt}`,
    "",
    `Applied filters: ${JSON.stringify(filters)}`,
    "",
    `Candidate properties: ${JSON.stringify(candidates)}`,
    "",
    `Sources: ${JSON.stringify(sources)}`,
    "",
    "Return the best shortlist grounded in the candidate properties only.",
  ].join("\n");
}

async function runPropertySpecialist(client: ConvexClient, prompt: string): Promise<PropertySpecialistResult> {
  const extractedFilters = await generateStructuredObject({
    schema: propertyFiltersSchema,
    system: "Extract property search filters from the user request. Only return fields that are explicitly or strongly implied.",
    prompt,
  });

  const candidates = await client.query(api.property.public.searchProperties.searchProperties, {
    ...extractedFilters,
    query: extractedFilters.query ?? prompt,
    limit: 4,
  }) as PropertyRow[];

  const sources = shouldFetchLiveContext(prompt) ? await searchWeb(prompt) : [];

  if (candidates.length === 0) {
    return {
      assistantText: "I could not find a strong match yet, but I can refine the search with a tighter area, budget, or bedroom count.",
      propertyIds: [],
      highlights: ["The current brief is still too broad or outside the visible catalog."],
      comparisonPoints: [],
      followupQuestion: "Which area or budget should I lock first?",
      querySummary: extractedFilters.query,
      filters: extractedFilters,
      sources,
    };
  }

  const ranked = await generateStructuredObject({
    schema: propertyResultSchema,
    system: "You are the property specialist. Rank the provided candidates, write concise highlights, and avoid inventing properties.",
    prompt: buildPropertySearchPrompt(prompt, extractedFilters, candidates, sources),
  });

  const validatedPropertyIds = ranked.propertyIds.filter((propertyId) =>
    candidates.some((candidate) => candidate.externalId === propertyId),
  );

  return {
    ...ranked,
    propertyIds: validatedPropertyIds.length > 0
      ? validatedPropertyIds
      : candidates.slice(0, 3).map((candidate) => candidate.externalId),
    filters: extractedFilters,
    sources,
  };
}

async function runFundingSpecialist(prompt: string): Promise<FundingSpecialistResult> {
  return await generateStructuredObject({
    schema: fundingResultSchema,
    system: "You are the funding specialist. Give practical, concise guidance, highlight tradeoffs, and avoid pretending to approve a real loan.",
    prompt,
  });
}

async function runAdvisorSpecialist(prompt: string): Promise<AdvisorSpecialistResult> {
  return await generateStructuredObject({
    schema: advisorResultSchema,
    system: "You are the advisor specialist. Reply clearly, calmly, and in a way that can power a lightweight assistant UI block.",
    prompt,
  });
}

function buildPropertyActions(result: PropertySpecialistResult): AssistantAction[] {
  const actions: AssistantAction[] = [];

  for (const propertyId of result.propertyIds.slice(0, 3)) {
    actions.push({
      id: `open-${propertyId}`,
      title: "Open property",
      name: "open_property",
      payload: { propertyId },
    });
  }

  if (result.propertyIds[0]) {
    actions.push({
      id: `save-${result.propertyIds[0]}`,
      title: "Save top match",
      name: "save_property",
      payload: { propertyId: result.propertyIds[0] },
    });
  }

  if (result.propertyIds[1]) {
    actions.push({
      id: `compare-${result.propertyIds[1]}`,
      title: "Compare top picks",
      name: "compare_property",
      payload: { propertyId: result.propertyIds[1] },
    });
  }

  actions.push({
    id: "continue-property-thread",
    title: "Refine this search",
    name: "continue_thread",
    payload: {
      prompt: result.followupQuestion ?? "Refine this search using a tighter area or budget.",
    },
  });

  actions.push({
    id: "open-search",
    title: "Open search",
    name: "open_search",
    payload: result.filters,
  });

  return actions.slice(0, 8);
}

function buildAssistantTurn(args: {
  input: WorkerRunInput;
  route: AssistantRoute;
  motionPreset: AssistantMotionPreset;
  specialistResults: WorkflowSpecialistResult;
}): AssistantTurn {
  const participants = ["orchestrator", ...Object.keys(args.specialistResults), "summary"]
    .filter((value, index, values) => value && values.indexOf(value) === index);
  const propertyResult = args.specialistResults.property;
  const fundingResult = args.specialistResults.funding;
  const advisorResult = args.specialistResults.advisor;

  if (args.route === "property" || args.route === "mixed") {
    const actions = propertyResult ? buildPropertyActions(propertyResult) : [];
    const blocks: AssistantTurn["blocks"] = [];

    if (propertyResult?.propertyIds.length) {
      blocks.push({
        type: "property_list",
        id: "property-list",
        title: args.route === "mixed" ? "Properties that fit the brief" : "Best property matches",
        subtitle: propertyResult.querySummary,
        propertyIds: propertyResult.propertyIds,
        querySummary: propertyResult.querySummary,
      });
    } else {
      blocks.push({
        type: "empty",
        id: "property-empty",
        title: "No strong property match yet",
        body: propertyResult?.highlights[0] ?? "I need one more search signal to tighten the shortlist.",
        suggestions: propertyResult?.followupQuestion ? [propertyResult.followupQuestion] : undefined,
      });
    }

    if (propertyResult?.comparisonPoints.length) {
      blocks.push({
        type: "comparison",
        id: "property-comparison",
        title: "What separates the top options",
        propertyIds: propertyResult.propertyIds.slice(0, Math.max(2, Math.min(4, propertyResult.propertyIds.length))),
        points: propertyResult.comparisonPoints,
      });
    } else if (propertyResult?.highlights.length) {
      blocks.push({
        type: "advisor_note",
        id: "property-highlights",
        title: "What stands out",
        body: propertyResult.highlights[0],
        bullets: propertyResult.highlights.slice(1),
      });
    }

    if (fundingResult) {
      blocks.push({
        type: "funding_options",
        id: "funding-options",
        title: "Funding angle",
        summary: fundingResult.summary,
        options: fundingResult.options,
        disclaimers: fundingResult.disclaimers,
      });
    }

    if (propertyResult?.sources.length) {
      blocks.push({
        type: "sources",
        id: "property-sources",
        title: "Live market sources",
        sources: propertyResult.sources,
      });
    }

    const followupPrompt = fundingResult?.followupQuestion ?? propertyResult?.followupQuestion;
    if (followupPrompt) {
      blocks.push({
        type: "followup",
        id: "property-followup",
        title: "Next useful step",
        prompt: followupPrompt,
      });
    }

    if (actions.length) {
      blocks.push({
        type: "actions",
        id: "property-actions",
        title: "Actions",
        actionIds: actions.map((action) => action.id),
      });
    }

    return assertValidAssistantTurn({
      version: "assistant_turn.v1",
      route: args.route,
      status: propertyResult?.propertyIds.length ? "completed" : "needs_input",
      assistantText: args.route === "mixed"
        ? `${propertyResult?.assistantText ?? "I reviewed the property side."} ${fundingResult?.assistantText ?? ""}`.trim()
        : propertyResult?.assistantText ?? "I reviewed the property side of your request.",
      blocks,
      actions,
      agent: {
        primaryAgent: args.route === "mixed" ? "summary" : "property",
        participatingAgents: participants,
        handoffs: fundingResult
          ? [{ from: "property", to: "funding", reason: "The prompt included financing intent." }]
          : [],
        confidence: propertyResult?.propertyIds.length ? 0.84 : 0.58,
      },
      motion: {
        preset: args.motionPreset,
        emphasis: args.route === "mixed" ? "high" : "medium",
        phaseHints: propertyResult?.propertyIds.length ? ["shortlist", "compare"] : ["clarify"],
      },
      analytics: {
        source: "assistant",
        threadId: args.input.threadId,
        runId: args.input.runId,
        route: args.route,
      },
    });
  }

  if (args.route === "funding" && fundingResult) {
    const actions: AssistantAction[] = [
      {
        id: "continue-funding-thread",
        title: "Continue funding planning",
        name: "continue_thread",
        payload: {
          prompt: fundingResult.followupQuestion ?? "Help me tighten the financing plan for this purchase.",
        },
      },
    ];

    return assertValidAssistantTurn({
      version: "assistant_turn.v1",
      route: "funding",
      status: "completed",
      assistantText: fundingResult.assistantText,
      blocks: [
        {
          type: "funding_options",
          id: "funding-options",
          title: "Funding plan",
          summary: fundingResult.summary,
          options: fundingResult.options,
          disclaimers: fundingResult.disclaimers,
        },
        {
          type: "actions",
          id: "funding-actions",
          title: "Actions",
          actionIds: actions.map((action) => action.id),
        },
      ],
      actions,
      agent: {
        primaryAgent: "funding",
        participatingAgents: participants,
        handoffs: [],
        confidence: 0.8,
      },
      motion: {
        preset: args.motionPreset,
        emphasis: "medium",
        phaseHints: ["funding", "decision"],
      },
      analytics: {
        source: "assistant",
        threadId: args.input.threadId,
        runId: args.input.runId,
        route: "funding",
      },
    });
  }

  const advisorActions: AssistantAction[] = [
    {
      id: "continue-advisor-thread",
      title: "Continue",
      name: "continue_thread",
      payload: {
        prompt: advisorResult?.followupQuestion ?? "Help me with the next step.",
      },
    },
  ];

  return assertValidAssistantTurn({
    version: "assistant_turn.v1",
    route: "advisor",
    status: "completed",
    assistantText: advisorResult?.assistantText ?? "How can I help?",
    blocks: [
      {
        type: "advisor_note",
        id: "advisor-note",
        title: advisorResult?.title ?? "Advisor",
        body: advisorResult?.body ?? "Tell me what you want to figure out and I will guide the next step.",
        bullets: advisorResult?.bullets,
      },
      {
        type: "actions",
        id: "advisor-actions",
        title: "Actions",
        actionIds: advisorActions.map((action) => action.id),
      },
    ],
    actions: advisorActions,
    agent: {
      primaryAgent: "advisor",
      participatingAgents: participants,
      handoffs: [],
      confidence: 0.76,
    },
    motion: {
      preset: args.motionPreset,
      emphasis: "low",
      phaseHints: ["conversation"],
    },
    analytics: {
      source: "assistant",
      threadId: args.input.threadId,
      runId: args.input.runId,
      route: "advisor",
    },
  });
}

async function getRunState(client: ConvexClient, runId: string) {
  return await client.query(api.agent.orchestrator.runtime.getRunForWorker, {
    runId: runId as never,
  });
}

async function ensureRunActive(client: ConvexClient, runId: string) {
  const run = await getRunState(client, runId);
  if (!run || run.stopRequestedAt || run.status === "cancelled") {
    throw new Error("Run cancelled before workflow step completed.");
  }

  return run;
}

async function emitStage(client: ConvexClient, args: {
  runId: string;
  seq: number;
  phase: "classify_started" | "classify_done" | "specialist_started" | "specialist_done" | "summary_started" | "summary_done" | "persist_started" | "persist_done";
  status: "running" | "completed" | "failed" | "cancelled";
  message: string;
  route?: AssistantRoute;
  specialist?: string;
  motionPreset?: AssistantMotionPreset;
  handoffFrom?: string;
  handoffTo?: string;
}) {
  await client.mutation(api.agent.orchestrator.runtime.addStageEvent, {
    ...args,
    runId: args.runId as never,
  });
}

export const agentTurnWorkflow = workflow("agent-turn", async (ctx, input: WorkerRunInput) => {
  const client = new ConvexClient(process.env.CONVEX_URL!);

  try {
    await client.mutation(api.agent.orchestrator.runtime.markRunRunning, {
      runId: input.runId as never,
    });

    await emitStage(client, {
      runId: input.runId,
      seq: 100,
      phase: "classify_started",
      status: "running",
      message: "Routing the request to the right specialists.",
      motionPreset: "assistant",
    });

    const routing = await ctx.step("classify-turn", async () => routePrompt(input.prompt));

    await client.mutation(api.agent.orchestrator.runtime.setRunRoute, {
      runId: input.runId as never,
      route: routing.route,
      specialist: routing.specialists[0] ?? "advisor",
      motionPreset: routing.motionPreset,
    });

    await emitStage(client, {
      runId: input.runId,
      seq: 110,
      phase: "classify_done",
      status: "completed",
      message: `Routed this turn through ${routing.specialists.join(" + ")}.`,
      route: routing.route,
      specialist: routing.specialists[0],
      motionPreset: routing.motionPreset,
    });

    await ensureRunActive(client, input.runId);

    const specialistResults: WorkflowSpecialistResult = {};

    for (const [index, specialist] of routing.specialists.entries()) {
      await emitStage(client, {
        runId: input.runId,
        seq: 200 + index * 20,
        phase: "specialist_started",
        status: "running",
        message: `${specialist} specialist is working on the request.`,
        route: routing.route,
        specialist,
        motionPreset: assistantAgents.find((agent) => agent.id === specialist)?.motionPreset ?? routing.motionPreset,
      });

      await ensureRunActive(client, input.runId);

      if (specialist === "property") {
        specialistResults.property = await ctx.step("run-property-specialist", async () =>
          await runPropertySpecialist(client, input.prompt));
      } else if (specialist === "funding") {
        specialistResults.funding = await ctx.step("run-funding-specialist", async () =>
          await runFundingSpecialist(input.prompt));
      } else {
        specialistResults.advisor = await ctx.step("run-advisor-specialist", async () =>
          await runAdvisorSpecialist(input.prompt));
      }

      await emitStage(client, {
        runId: input.runId,
        seq: 210 + index * 20,
        phase: "specialist_done",
        status: "completed",
        message: `${specialist} specialist finished.`,
        route: routing.route,
        specialist,
        motionPreset: assistantAgents.find((agent) => agent.id === specialist)?.motionPreset ?? routing.motionPreset,
      });
    }

    await emitStage(client, {
      runId: input.runId,
      seq: 300,
      phase: "summary_started",
      status: "running",
      message: "Building the final assistant response.",
      route: routing.route,
      specialist: "summary",
      motionPreset: routing.motionPreset,
    });

    await ensureRunActive(client, input.runId);

    const turn = await ctx.step("build-final-turn", async () =>
      buildAssistantTurn({
        input,
        route: routing.route,
        motionPreset: routing.motionPreset,
        specialistResults,
      }));

    await emitStage(client, {
      runId: input.runId,
      seq: 310,
      phase: "summary_done",
      status: "completed",
      message: "Final assistant response is ready.",
      route: routing.route,
      specialist: "summary",
      motionPreset: routing.motionPreset,
    });

    await emitStage(client, {
      runId: input.runId,
      seq: 400,
      phase: "persist_started",
      status: "running",
      message: "Saving the assistant turn.",
      route: routing.route,
      specialist: "summary",
      motionPreset: routing.motionPreset,
    });

    await ctx.step("persist-assistant-turn", async () => {
      // WHY: Workflow steps are at-least-once, so persistence must be idempotent.
      // WHAT: completeRun upserts by runId before writing a final assistant turn.
      // HOW: Replays reuse the stored step result instead of saving a second turn.
      await client.mutation(api.agent.orchestrator.runtime.completeRun, {
        runId: input.runId as never,
        route: turn.route,
        motionPreset: turn.motion.preset,
        assistantText: turn.assistantText,
        propertyIds: extractTurnPropertyIds(turn),
        turnVersion: turn.version,
        turnStatus: turn.status,
        turnJson: JSON.stringify(turn),
        metaJson: JSON.stringify({
          workflowId: input.runId,
          diagnostics: [],
        }),
        diagnostics: [],
      });

      return { persisted: true };
    });

    await emitStage(client, {
      runId: input.runId,
      seq: 410,
      phase: "persist_done",
      status: "completed",
      message: "Assistant turn saved.",
      route: routing.route,
      specialist: "summary",
      motionPreset: routing.motionPreset,
    });

    return {
      runId: input.runId,
      route: turn.route,
      status: turn.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await client.mutation(api.agent.orchestrator.runtime.failRun, {
      runId: input.runId as never,
      diagnostics: [message],
    });

    throw error;
  } finally {
    client.close();
  }
});

export async function startAgentWorker() {
  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing CONVEX_URL for agent worker.");
  }

  const client = new ConvexClient(convexUrl);
  const worker = createWorker(client, api.agent.orchestrator.api, {
    workflows: [agentTurnWorkflow],
    maxConcurrentWorkflows: 2,
  });

  await worker.start();
}
