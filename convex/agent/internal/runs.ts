import { v } from "convex/values";

import { internalMutation, internalQuery } from "../../_generated/server";

export const getRun = internalQuery({
  args: { runId: v.id("agentRuns") },
  handler: async (ctx, args) => await ctx.db.get(args.runId),
});

export const createRun = internalMutation({
  args: { authUserId: v.string(), threadId: v.string(), promptMessageId: v.string(), goal: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.insert("agentRuns", {
      ...args,
      status: "queued",
      diagnostics: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
});

export const patchRun = internalMutation({
  args: {
    runId: v.id("agentRuns"),
    status: v.string(),
    summary: v.optional(v.string()),
    diagnostics: v.optional(v.array(v.string())),
    workflowId: v.optional(v.string()),
    route: v.optional(v.union(
      v.literal("advisor"),
      v.literal("property"),
      v.literal("funding"),
      v.literal("mixed"),
    )),
    specialist: v.optional(v.string()),
    motionPreset: v.optional(v.union(
      v.literal("assistant"),
      v.literal("advisor"),
      v.literal("property"),
      v.literal("funding"),
    )),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    stopRequestedAt: v.optional(v.number()),
  },
  handler: async (ctx, { runId, ...patch }) => await ctx.db.patch(runId, { ...patch, updatedAt: Date.now() }),
});
