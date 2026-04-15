import { defineTable } from "convex/server";
import { v } from "convex/values";

const buyerStageEventType = v.union(v.literal("stage"), v.literal("tool"), v.literal("lifecycle"));
const buyerStagePhase = v.union(
  v.literal("intent_started"),
  v.literal("intent_done"),
  v.literal("team_started"),
  v.literal("team_done"),
  v.literal("merge_started"),
  v.literal("merge_done"),
  v.literal("action_started"),
  v.literal("action_done"),
  v.literal("persist_started"),
  v.literal("persist_done"),
);
const buyerStageStatus = v.union(
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("cancelled"),
);

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
    seq: v.optional(v.number()),
    eventType: v.optional(buyerStageEventType),
    phase: v.string(),
    status: v.optional(buyerStageStatus),
    teamId: v.optional(v.string()),
    agentName: v.optional(v.string()),
    message: v.string(),
    details: v.optional(v.string()),
    detailsJson: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_runId", ["runId"]).index("by_runId_and_seq", ["runId", "seq"]),
  assistantTurns: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_threadId", ["threadId"])
    .index("by_threadId_and_createdAt", ["threadId", "createdAt"])
    .index("by_authUserId", ["authUserId"])
    .index("by_messageId", ["messageId"])
    .index("by_runId", ["runId"]),
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
  })
    .index("by_threadId", ["threadId"])
    .index("by_runId", ["runId"])
    .index("by_authUserId", ["authUserId"]),
};
