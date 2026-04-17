import { saveMessage } from "@convex-dev/agent";
import { v } from "convex/values";

import { mutation, query } from "../../_generated/server";
import { agentComponent } from "../lib/component";

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

export const markRunRunning = mutation({
  args: { runId: v.id("agentRuns") },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.stopRequestedAt) {
      return false;
    }

    await ctx.db.patch(args.runId, {
      status: "running",
      startedAt: run.startedAt ?? Date.now(),
      updatedAt: Date.now(),
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
      return false;
    }

    await ctx.db.patch(args.runId, {
      status: "failed",
      diagnostics: args.diagnostics,
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });
    return true;
  },
});
