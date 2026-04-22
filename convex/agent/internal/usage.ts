import { v } from "convex/values";

import { internalMutation } from "../../_generated/server";

export const trackUsage = internalMutation({
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
