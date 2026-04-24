import { listMessages, saveMessage } from "@convex-dev/agent";
import { v } from "convex/values";
import { assistantSurfaceCopySchema } from "@zayon/assistant-protocol";

import { mutation, query } from "../../_generated/server";
import { agentComponent } from "../lib/component";
import { logAgentEvent } from "../lib/debugLog";
import { parseSurfaceCopyJson } from "./presentation";

const routeValidator = v.union(
  v.literal("advisor"),
  v.literal("property"),
  v.literal("funding"),
  v.literal("legal"),
  v.literal("mixed"),
);

const motionPresetValidator = v.union(
  v.literal("assistant"),
  v.literal("advisor"),
  v.literal("property"),
  v.literal("funding"),
);
const directionValidator = v.union(v.literal("rtl"), v.literal("ltr"));
const uiLocaleValidator = v.union(v.literal("ar"), v.literal("en"), v.literal("fr"));
const threadPresentationSourceValidator = v.union(v.literal("detected"), v.literal("explicit"));

const memorySourceValidator = v.union(
  v.literal("assistant_turns"),
  v.literal("thread_messages"),
  v.literal("cortex_memory"),
  v.literal("property_searches"),
  v.literal("buyer_preferences"),
  v.literal("tool_calls"),
);

const stagePhaseValidator = v.union(
  v.literal("classify_started"),
  v.literal("classify_done"),
  v.literal("specialist_started"),
  v.literal("specialist_done"),
  v.literal("summary_started"),
  v.literal("summary_done"),
  v.literal("persist_started"),
  v.literal("persist_done"),
);

const stageStatusValidator = v.union(
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("cancelled"),
);

function parseJsonRecord(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function extractAgentMessageText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof (part as { text?: unknown }).text === "string") {
          return String((part as { text: string }).text);
        }
        return "";
      })
      .join("")
      .trim();
  }
  return "";
}

function parseThreadPresentationRow(row: null | {
  threadId: string;
  languageTag: string;
  direction: "rtl" | "ltr";
  uiLocale?: "ar" | "en" | "fr" | null;
  source: "detected" | "explicit";
  confidence: number;
  surfaceCopyJson?: string;
}) {
  if (!row) {
    return null;
  }

  const surfaceCopy = parseSurfaceCopyJson(row.surfaceCopyJson);
  return {
    threadId: row.threadId,
    languageTag: row.languageTag,
    direction: row.direction,
    uiLocale: row.uiLocale ?? null,
    source: row.source,
    confidence: row.confidence,
    ...(surfaceCopy ? { surfaceCopy } : {}),
  };
}

export const getRunForWorker = query({
  args: { runId: v.id("agentRuns") },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run) {
      return null;
    }

    return {
      _id: run._id,
      authUserId: run.authUserId,
      threadId: run.threadId,
      promptMessageId: run.promptMessageId,
      goal: run.goal,
      status: run.status,
      workflowId: run.workflowId,
      stopRequestedAt: run.stopRequestedAt,
      route: run.route,
      specialist: run.specialist,
      motionPreset: run.motionPreset,
    };
  },
});

export const getThreadPresentationForWorker = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("threadPresentations")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .unique();

    return parseThreadPresentationRow(row);
  },
});

export const upsertThreadPresentationForWorker = mutation({
  args: {
    threadId: v.string(),
    languageTag: v.string(),
    direction: directionValidator,
    uiLocale: v.optional(v.union(uiLocaleValidator, v.null())),
    source: threadPresentationSourceValidator,
    confidence: v.number(),
    surfaceCopyJson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.surfaceCopyJson) {
      try {
        const parsed = JSON.parse(args.surfaceCopyJson);
        assistantSurfaceCopySchema.parse(parsed);
      } catch (error) {
        logAgentEvent("warn", {
          scope: "orchestrator_runtime",
          event: "thread_presentation_surface_copy_invalid",
          threadId: args.threadId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const existing = await ctx.db
      .query("threadPresentations")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .unique();
    const now = Date.now();
    const patch = {
      threadId: args.threadId,
      languageTag: args.languageTag,
      direction: args.direction,
      uiLocale: args.uiLocale ?? null,
      source: args.source,
      confidence: args.confidence,
      ...(args.surfaceCopyJson ? { surfaceCopyJson: args.surfaceCopyJson } : {}),
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await ctx.db.insert("threadPresentations", {
      ...patch,
      createdAt: now,
    });
  },
});

export const heartbeatWorker = mutation({
  args: {
    workerId: v.string(),
    version: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("agentWorkers")
      .withIndex("by_workerId", (q) => q.eq("workerId", args.workerId))
      .unique();

    if (existing) {
      const wasOnline = existing.status === "online";
      await ctx.db.patch(existing._id, {
        status: "online",
        version: args.version ?? existing.version,
        lastHeartbeatAt: now,
        updatedAt: now,
      });
      if (!wasOnline) {
        logAgentEvent("info", {
          scope: "orchestrator_runtime",
          event: "worker_recovered",
          workerId: args.workerId,
          workerRecordId: String(existing._id),
          lastHeartbeatAt: now,
          version: args.version ?? existing.version ?? null,
        });
      }
      return existing._id;
    }

    const workerRecordId = await ctx.db.insert("agentWorkers", {
      workerId: args.workerId,
      status: "online",
      version: args.version,
      startedAt: now,
      lastHeartbeatAt: now,
      updatedAt: now,
    });
    logAgentEvent("info", {
      scope: "orchestrator_runtime",
      event: "worker_registered",
      workerId: args.workerId,
      workerRecordId: String(workerRecordId),
      lastHeartbeatAt: now,
      version: args.version ?? null,
    });
    return workerRecordId;
  },
});

export const markRunRunning = mutation({
  args: { runId: v.id("agentRuns") },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.stopRequestedAt) {
      logAgentEvent("warn", {
        scope: "orchestrator_runtime",
        event: "run_mark_running_skipped",
        reasonCode: run?.stopRequestedAt ? "workflow_cancelled" : "run_not_found",
        runId: String(args.runId),
        threadId: run?.threadId,
        workflowId: run?.workflowId,
      });
      return false;
    }

    await ctx.db.patch(args.runId, {
      status: "running",
      startedAt: run.startedAt ?? Date.now(),
      updatedAt: Date.now(),
    });
    logAgentEvent("info", {
      scope: "orchestrator_runtime",
      event: "run_marked_running",
      runId: String(args.runId),
      threadId: run.threadId,
      authUserId: run.authUserId,
      workflowId: run.workflowId,
    });
    return true;
  },
});

export const setRunRoute = mutation({
  args: {
    runId: v.id("agentRuns"),
    route: routeValidator,
    specialist: v.string(),
    motionPreset: motionPresetValidator,
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.stopRequestedAt) {
      logAgentEvent("warn", {
        scope: "orchestrator_runtime",
        event: "set_run_route_skipped",
        reasonCode: run?.stopRequestedAt ? "workflow_cancelled" : "run_not_found",
        runId: String(args.runId),
        threadId: run?.threadId,
        workflowId: run?.workflowId,
      });
      return false;
    }

    await ctx.db.patch(args.runId, {
      route: args.route,
      specialist: args.specialist,
      motionPreset: args.motionPreset,
      updatedAt: Date.now(),
    });
    return true;
  },
});

export const addStageEvent = mutation({
  args: {
    runId: v.id("agentRuns"),
    seq: v.number(),
    phase: stagePhaseValidator,
    status: stageStatusValidator,
    message: v.string(),
    route: v.optional(routeValidator),
    specialist: v.optional(v.string()),
    motionPreset: v.optional(motionPresetValidator),
    handoffFrom: v.optional(v.string()),
    handoffTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agentEvents")
      .withIndex("by_runId_and_seq", (q) => q.eq("runId", args.runId).eq("seq", args.seq))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        eventType: "stage",
        createdAt: existing.createdAt,
      });
      return true;
    }

    await ctx.db.insert("agentEvents", {
      ...args,
      eventType: "stage",
      createdAt: Date.now(),
    });
    return true;
  },
});

export const trackWorkerUsage = mutation({
  args: {
    authUserId: v.optional(v.string()),
    threadId: v.optional(v.string()),
    runId: v.optional(v.id("agentRuns")),
    quotaKey: v.string(),
    model: v.optional(v.string()),
    stepModel: v.optional(v.string()),
    agentName: v.optional(v.string()),
    provider: v.optional(v.string()),
    cacheStatus: v.optional(v.string()),
    stepEstimatedCostUsd: v.optional(v.number()),
    domain: v.optional(v.string()),
    editorUsed: v.optional(v.boolean()),
    metadataJson: v.optional(v.string()),
    units: v.number(),
  },
  handler: async (ctx, args) => await ctx.db.insert("usageLedger", { ...args, createdAt: Date.now() }),
});

export const getRunCostSummary = query({
  args: {
    runId: v.id("agentRuns"),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("usageLedger")
      .withIndex("by_runId", (q) => q.eq("runId", args.runId))
      .take(500);

    let totalTokens = 0;
    let totalCostUsd = 0;
    const byAgent: Record<string, { tokens: number; costUsd: number }> = {};
    const byDomain: Record<string, { tokens: number; costUsd: number }> = {};

    for (const row of rows) {
      if (row.quotaKey !== "message_tokens") {
        continue;
      }

      const tokens = row.units ?? 0;
      const costUsd = row.stepEstimatedCostUsd ?? 0;
      totalTokens += tokens;
      totalCostUsd += costUsd;

      const agentKey = row.agentName ?? "unknown";
      const domainKey = row.domain ?? "unknown";
      byAgent[agentKey] ??= { tokens: 0, costUsd: 0 };
      byDomain[domainKey] ??= { tokens: 0, costUsd: 0 };
      byAgent[agentKey].tokens += tokens;
      byAgent[agentKey].costUsd += costUsd;
      byDomain[domainKey].tokens += tokens;
      byDomain[domainKey].costUsd += costUsd;
    }

    const blendedUsdPerMillionTokens = totalTokens > 0
      ? Number(((totalCostUsd / totalTokens) * 1_000_000).toFixed(4))
      : 0;

    return {
      totalTokens,
      totalCostUsd: Number(totalCostUsd.toFixed(6)),
      blendedUsdPerMillionTokens,
      rollingAverageUsdPerMillionTokens: blendedUsdPerMillionTokens,
      byAgent,
      byDomain,
    };
  },
});

export const recordWorkerToolCall = mutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    runId: v.optional(v.id("agentRuns")),
    toolName: v.string(),
    inputHash: v.string(),
    inputJson: v.string(),
    outputSummary: v.optional(v.string()),
    cacheStatus: v.optional(v.union(v.literal("hit"), v.literal("miss"), v.literal("skipped"))),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("agentToolCalls", {
      ...args,
      createdAt: Date.now(),
    }),
});

export const getRecentPropertySearchesForWorker = query({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("propertySearchSessions")
      .withIndex("by_threadId_and_updatedAt", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .take(Math.min(args.limit ?? 3, 8));

    return rows.filter((row) => row.authUserId === args.authUserId);
  },
});

export const getRecentAssistantTurnsForWorker = query({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("assistantTurns")
      .withIndex("by_threadId_and_createdAt", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .take(Math.min(args.limit ?? 4, 8));

    return rows
      .filter((row) => row.authUserId === args.authUserId)
      .map((row) => ({
        assistantText: row.assistantText,
        route: row.route,
        status: row.status,
        propertyIds: row.propertyIds,
        createdAt: row.createdAt,
      }));
  },
});

export const getRecentMemoryBundleForWorker = query({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    sources: v.array(memorySourceValidator),
    contextBudget: v.object({
      assistantTurns: v.number(),
      threadMessages: v.number(),
      cortexMemories: v.number(),
      propertySearchSessions: v.number(),
      resultIds: v.number(),
      toolCalls: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const sources = new Set(args.sources);
    const threadMessages = sources.has("thread_messages")
      ? (await listMessages(ctx, agentComponent, {
        threadId: args.threadId,
        excludeToolMessages: true,
        paginationOpts: {
          numItems: Math.min(args.contextBudget.threadMessages || 8, 12),
          cursor: null,
        },
      })).page
        .sort((left, right) => left._creationTime - right._creationTime)
        .map((message) => ({
          messageId: String(message._id),
          role: message.message?.role ?? "unknown",
          text: extractAgentMessageText(message.message?.content).slice(0, 900),
          createdAt: message._creationTime,
          source: "recent",
        }))
        .filter((message) => message.text.length > 0)
      : [];

    const assistantTurns = sources.has("assistant_turns")
      ? (await ctx.db
        .query("assistantTurns")
        .withIndex("by_threadId_and_createdAt", (q) => q.eq("threadId", args.threadId))
        .order("desc")
        .take(Math.min(args.contextBudget.assistantTurns || 4, 8)))
        .filter((row) => row.authUserId === args.authUserId)
        .map((row) => ({
          assistantText: row.assistantText,
          route: row.route,
          status: row.status,
          propertyIds: row.propertyIds.slice(0, args.contextBudget.resultIds || 4),
          createdAt: row.createdAt,
        }))
      : [];

    const propertySearches = sources.has("property_searches")
      ? (await ctx.db
        .query("propertySearchSessions")
        .withIndex("by_threadId_and_updatedAt", (q) => q.eq("threadId", args.threadId))
        .order("desc")
        .take(Math.min(args.contextBudget.propertySearchSessions || 3, 8)))
        .filter((row) => row.authUserId === args.authUserId)
        .map((row) => ({
          _id: row._id,
          generatedQuery: row.generatedQuery,
          normalizedQuery: row.normalizedQuery,
          filtersJson: row.filtersJson,
          relaxedConstraintsJson: row.relaxedConstraintsJson,
          resultIds: row.resultIds.slice(0, args.contextBudget.resultIds || 12),
          ...(row.selectedResultId ? { selectedResultId: row.selectedResultId } : {}),
          updatedAt: row.updatedAt,
        }))
      : [];

    const toolCalls = sources.has("tool_calls")
      ? (await ctx.db
        .query("agentToolCalls")
        .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
        .order("desc")
        .take(Math.min(args.contextBudget.toolCalls || 4, 8)))
        .filter((row) => row.authUserId === args.authUserId)
        .map((row) => ({
          toolName: row.toolName,
          ...(row.outputSummary ? { outputSummary: row.outputSummary } : {}),
          ...(row.cacheStatus ? { cacheStatus: row.cacheStatus } : {}),
          createdAt: row.createdAt,
        }))
      : [];

    let buyerPreferences = null as null | {
      minBudget?: number;
      maxBudget?: number;
      locations: string[];
      propertyTypes: string[];
      financingPreferences: string[];
      confidence: number;
      updatedFrom: string;
      updatedAt: number;
    };
    if (sources.has("buyer_preferences")) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", args.authUserId))
        .unique();
      const preferences = profile
        ? await ctx.db
          .query("buyerPreferences")
          .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
          .unique()
        : null;
      buyerPreferences = preferences
        ? {
          ...(preferences.minBudget !== undefined ? { minBudget: preferences.minBudget } : {}),
          ...(preferences.maxBudget !== undefined ? { maxBudget: preferences.maxBudget } : {}),
          locations: preferences.locations,
          propertyTypes: preferences.propertyTypes,
          financingPreferences: preferences.financingPreferences,
          confidence: preferences.confidence,
          updatedFrom: preferences.updatedFrom,
          updatedAt: preferences.updatedAt,
        }
        : null;
    }

    return {
      threadMessages,
      assistantTurns,
      propertySearches,
      toolCalls,
      buyerPreferences,
    };
  },
});

function normalizeStringList(values: string[] | undefined) {
  return values
    ?.map((value) => value.trim())
    .filter((value, index, list) => value.length > 0 && list.indexOf(value) === index);
}

function clampConfidence(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0.55));
}

export const recordPreferencePromotionForWorker = mutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    minBudget: v.optional(v.number()),
    maxBudget: v.optional(v.number()),
    locations: v.optional(v.array(v.string())),
    propertyTypes: v.optional(v.array(v.string())),
    financingPreferences: v.optional(v.array(v.string())),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.confidence < 0.8) {
      return { updated: false, reason: "confidence_below_threshold" };
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.authUserId))
      .unique();
    if (!profile) {
      return { updated: false, reason: "profile_not_found" };
    }

    const existing = await ctx.db
      .query("buyerPreferences")
      .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
      .unique();
    const now = Date.now();
    const next = {
      profileId: profile._id,
      ...((args.minBudget ?? existing?.minBudget) !== undefined ? { minBudget: args.minBudget ?? existing?.minBudget } : {}),
      ...((args.maxBudget ?? existing?.maxBudget) !== undefined ? { maxBudget: args.maxBudget ?? existing?.maxBudget } : {}),
      locations: normalizeStringList(args.locations) ?? existing?.locations ?? [],
      propertyTypes: normalizeStringList(args.propertyTypes) ?? existing?.propertyTypes ?? [],
      financingPreferences: normalizeStringList(args.financingPreferences) ?? existing?.financingPreferences ?? [],
      confidence: Math.max(clampConfidence(args.confidence), existing?.confidence ?? 0),
      updatedFrom: `agent:${args.threadId}`,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, next);
      return { updated: true, preferenceId: existing._id, reason: "updated" };
    }

    const preferenceId = await ctx.db.insert("buyerPreferences", {
      ...next,
      createdAt: now,
    });
    return { updated: true, preferenceId, reason: "created" };
  },
});

export const recordWorkerPropertySearch = mutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    runId: v.optional(v.id("agentRuns")),
    normalizedQuery: v.string(),
    generatedQuery: v.string(),
    filtersJson: v.string(),
    relaxedConstraintsJson: v.string(),
    resultIds: v.array(v.string()),
    results: v.array(v.object({
      propertyId: v.string(),
      rank: v.number(),
      score: v.number(),
      reasons: v.array(v.string()),
      relaxationStage: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sessionId = await ctx.db.insert("propertySearchSessions", {
      authUserId: args.authUserId,
      threadId: args.threadId,
      runId: args.runId,
      normalizedQuery: args.normalizedQuery,
      generatedQuery: args.generatedQuery,
      filtersJson: args.filtersJson,
      relaxedConstraintsJson: args.relaxedConstraintsJson,
      resultIds: args.resultIds.slice(0, 12),
      createdAt: now,
      updatedAt: now,
    });

    for (const result of args.results.slice(0, 12)) {
      await ctx.db.insert("propertySearchResults", {
        sessionId,
        propertyId: result.propertyId,
        rank: result.rank,
        score: result.score,
        reasons: result.reasons.slice(0, 5),
        relaxationStage: result.relaxationStage,
        createdAt: now,
      });
    }

    return sessionId;
  },
});

export const completeRun = mutation({
  args: {
    runId: v.id("agentRuns"),
    route: routeValidator,
    motionPreset: motionPresetValidator,
    assistantText: v.string(),
    propertyIds: v.array(v.string()),
    turnVersion: v.string(),
    turnStatus: v.string(),
    turnJson: v.string(),
    metaJson: v.optional(v.string()),
    diagnostics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.stopRequestedAt) {
      return false;
    }

    const nextMetaJson = JSON.stringify({
      ...(parseJsonRecord(args.metaJson) ?? {}),
      ...(run.workflowId ? { workflowId: run.workflowId } : {}),
    });

    const existingTurns = await ctx.db
      .query("assistantTurns")
      .withIndex("by_runId", (q) => q.eq("runId", args.runId))
      .take(1);
    const existingTurn = existingTurns[0];

    let messageId = existingTurn?.messageId;

    if (!messageId) {
      const saved = await saveMessage(ctx, agentComponent, {
        threadId: run.threadId,
        userId: run.authUserId,
        promptMessageId: run.promptMessageId,
        agentName: `${args.route}-agent`,
        message: { role: "assistant", content: args.assistantText },
      });
      messageId = saved.messageId;
    }

    if (existingTurn) {
      await ctx.db.patch(existingTurn._id, {
        authUserId: run.authUserId,
        threadId: run.threadId,
        runId: args.runId,
        messageId,
        assistantText: args.assistantText,
        turnVersion: args.turnVersion,
        route: args.route,
        status: args.turnStatus,
        propertyIds: args.propertyIds,
        turnJson: args.turnJson,
        metaJson: nextMetaJson,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("assistantTurns", {
        authUserId: run.authUserId,
        threadId: run.threadId,
        runId: args.runId,
        messageId,
        assistantText: args.assistantText,
        turnVersion: args.turnVersion,
        route: args.route,
        status: args.turnStatus,
        propertyIds: args.propertyIds,
        turnJson: args.turnJson,
        metaJson: nextMetaJson,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.patch(args.runId, {
      status: "completed",
      route: args.route,
      specialist: "summary",
      motionPreset: args.motionPreset,
      summary: args.assistantText,
      diagnostics: args.diagnostics,
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });
    logAgentEvent("info", {
      scope: "orchestrator_runtime",
      event: "run_completed",
      runId: String(args.runId),
      threadId: run.threadId,
      authUserId: run.authUserId,
      workflowId: run.workflowId,
      messageId,
      diagnosticsCount: args.diagnostics.length,
    });

    return true;
  },
});

export const failRun = mutation({
  args: {
    runId: v.id("agentRuns"),
    diagnostics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.stopRequestedAt) {
      logAgentEvent("warn", {
        scope: "orchestrator_runtime",
        event: "fail_run_skipped",
        reasonCode: run?.stopRequestedAt ? "workflow_cancelled" : "run_not_found",
        runId: String(args.runId),
        threadId: run?.threadId,
        workflowId: run?.workflowId,
      });
      return false;
    }

    await ctx.db.patch(args.runId, {
      status: "failed",
      diagnostics: args.diagnostics,
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });
    logAgentEvent("error", {
      scope: "orchestrator_runtime",
      event: "run_failed_persisted",
      reasonCode: "workflow_failed",
      runId: String(args.runId),
      threadId: run.threadId,
      authUserId: run.authUserId,
      workflowId: run.workflowId,
      diagnostics: args.diagnostics,
    });
    return true;
  },
});
