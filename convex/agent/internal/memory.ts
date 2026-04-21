import { v } from "convex/values";

import { internalMutation, internalQuery } from "../../_generated/server";

const optionalRunId = v.optional(v.id("agentRuns"));

export const recordToolCall = internalMutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    runId: optionalRunId,
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

export const recordPropertySearch = internalMutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    runId: optionalRunId,
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

export const getRecentPropertySearches = internalQuery({
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
