import { v } from "convex/values";

import { internalMutation } from "../../_generated/server";

export const createRecommendationBatch = internalMutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    runId: v.id("agentRuns"),
    requestContext: v.string(),
    propertyIds: v.array(v.string()),
    rankingRationale: v.string(),
    sources: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
      snippet: v.string(),
    }))),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("recommendationBatches", { ...args, createdAt: Date.now() }),
});
