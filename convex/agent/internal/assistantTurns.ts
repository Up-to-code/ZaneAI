import { v } from "convex/values";

import { internalMutation, internalQuery } from "../../_generated/server";

export const upsertAssistantTurn = internalMutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    runId: v.id("agentRuns"),
    messageId: v.string(),
    assistantText: v.string(),
    turnVersion: v.string(),
    intent: v.string(),
    status: v.string(),
    propertyIds: v.array(v.string()),
    rankingRationale: v.string(),
    recommendationBatchId: v.optional(v.id("recommendationBatches")),
    turnJson: v.string(),
    metaJson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("assistantTurns")
      .withIndex("by_messageId", (q) => q.eq("messageId", args.messageId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("assistantTurns", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listAssistantTurnsForThread = internalQuery({
  args: { threadId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) =>
    await ctx.db
      .query("assistantTurns")
      .withIndex("by_threadId_and_createdAt", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .take(Math.min(args.limit ?? 60, 100)),
});
