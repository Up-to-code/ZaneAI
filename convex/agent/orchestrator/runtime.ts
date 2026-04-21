import { saveMessage } from "@convex-dev/agent";
import { v } from "convex/values";

import { mutation, query } from "../../_generated/server";
import { agentComponent } from "../lib/component";
import { logAgentEvent } from "../lib/debugLog";

const routeValidator = v.union(
  v.literal("advisor"),
  v.literal("property"),
  v.literal("funding"),
  v.literal("mixed"),
);

const motionPresetValidator = v.union(
  v.literal("assistant"),
  v.literal("advisor"),
  v.literal("property"),
  v.literal("funding"),
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
    agentName: v.optional(v.string()),
    provider: v.optional(v.string()),
    cacheStatus: v.optional(v.string()),
    metadataJson: v.optional(v.string()),
    units: v.number(),
  },
  handler: async (ctx, args) => await ctx.db.insert("usageLedger", { ...args, createdAt: Date.now() }),
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
