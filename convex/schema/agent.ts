import { defineTable } from "convex/server";
import { v } from "convex/values";

export const agentTables = {
  agentRuns: defineTable({
    authUserId: v.string(),
    threadId: v.string(),
    promptMessageId: v.optional(v.string()),
    goal: v.string(),
    status: v.string(),
    summary: v.optional(v.string()),
    diagnostics: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    stopRequestedAt: v.optional(v.number()),
  })
    .index("by_threadId", ["threadId"])
    .index("by_authUserId", ["authUserId"]),
  agentEvents: defineTable({
    runId: v.id("agentRuns"),
    phase: v.string(),
    message: v.string(),
    details: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_runId", ["runId"]),
  recommendationBatches: defineTable({
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
    createdAt: v.number(),
  }).index("by_threadId", ["threadId"]).index("by_runId", ["runId"]),
};
