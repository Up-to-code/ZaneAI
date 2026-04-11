import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createRun = mutation({
  args: {
    userExternalId: v.string(),
    goal: v.string(),
    summary: v.string(),
    diagnostics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("agent_runs", {
      userExternalId: args.userExternalId,
      goal: args.goal,
      summary: args.summary,
      diagnostics: args.diagnostics,
      createdAt: Date.now(),
    });
  },
});

export const addEvent = mutation({
  args: {
    runId: v.id("agent_runs"),
    phase: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("agent_events", {
      runId: args.runId,
      phase: args.phase,
      message: args.message,
      createdAt: Date.now(),
    });
  },
});

export const createRecommendationBatch = mutation({
  args: {
    userExternalId: v.string(),
    requestContext: v.string(),
    propertyIds: v.array(v.string()),
    rankingRationale: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("recommendation_batches", {
      userExternalId: args.userExternalId,
      requestContext: args.requestContext,
      propertyIds: args.propertyIds,
      rankingRationale: args.rankingRationale,
      createdAt: Date.now(),
    });
  },
});
