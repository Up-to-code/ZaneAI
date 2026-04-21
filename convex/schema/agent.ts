import { defineTable } from "convex/server";
import { v } from "convex/values";

const assistantStageEventType = v.union(v.literal("stage"), v.literal("tool"), v.literal("lifecycle"));
const assistantStagePhase = v.union(
  v.literal("classify_started"),
  v.literal("classify_done"),
  v.literal("specialist_started"),
  v.literal("specialist_done"),
  v.literal("summary_started"),
  v.literal("summary_done"),
  v.literal("persist_started"),
  v.literal("persist_done"),
);
const assistantStageStatus = v.union(
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("cancelled"),
);
const assistantRoute = v.union(
  v.literal("advisor"),
  v.literal("property"),
  v.literal("funding"),
  v.literal("mixed"),
);
const motionPreset = v.union(
  v.literal("assistant"),
  v.literal("advisor"),
  v.literal("property"),
  v.literal("funding"),
);

export const agentTables = {
  agentWorkers: defineTable({
    workerId: v.string(),
    status: v.union(v.literal("online"), v.literal("stopped")),
    version: v.optional(v.string()),
    startedAt: v.number(),
    lastHeartbeatAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workerId", ["workerId"])
    .index("by_lastHeartbeatAt", ["lastHeartbeatAt"]),
  agentRuns: defineTable({
    authUserId: v.string(),
    threadId: v.string(),
    promptMessageId: v.optional(v.string()),
    goal: v.string(),
    status: v.string(),
    summary: v.optional(v.string()),
    diagnostics: v.array(v.string()),
    workflowId: v.optional(v.string()),
    route: v.optional(assistantRoute),
    specialist: v.optional(v.string()),
    motionPreset: v.optional(motionPreset),
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
    eventType: v.optional(assistantStageEventType),
    // Compatibility: legacy agentEvents rows still store pre-orchestrator tool/lifecycle
    // phase strings (for example "tool:promote_profile_fact"). Keep storage widened
    // until those rows are migrated or expired.
    phase: v.optional(v.string()),
    status: v.optional(assistantStageStatus),
    message: v.string(),
    route: v.optional(assistantRoute),
    specialist: v.optional(v.string()),
    motionPreset: v.optional(motionPreset),
    handoffFrom: v.optional(v.string()),
    handoffTo: v.optional(v.string()),
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
    route: assistantRoute,
    status: v.string(),
    propertyIds: v.array(v.string()),
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
  agentToolCalls: defineTable({
    authUserId: v.string(),
    threadId: v.string(),
    runId: v.optional(v.id("agentRuns")),
    toolName: v.string(),
    inputHash: v.string(),
    inputJson: v.string(),
    outputSummary: v.optional(v.string()),
    cacheStatus: v.optional(v.union(v.literal("hit"), v.literal("miss"), v.literal("skipped"))),
    createdAt: v.number(),
  })
    .index("by_threadId", ["threadId"])
    .index("by_runId", ["runId"])
    .index("by_toolName_and_inputHash", ["toolName", "inputHash"]),
  propertySearchSessions: defineTable({
    authUserId: v.string(),
    threadId: v.string(),
    runId: v.optional(v.id("agentRuns")),
    normalizedQuery: v.string(),
    generatedQuery: v.string(),
    filtersJson: v.string(),
    relaxedConstraintsJson: v.string(),
    resultIds: v.array(v.string()),
    selectedResultId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_threadId_and_updatedAt", ["threadId", "updatedAt"])
    .index("by_authUserId_and_updatedAt", ["authUserId", "updatedAt"]),
  propertySearchResults: defineTable({
    sessionId: v.id("propertySearchSessions"),
    propertyId: v.string(),
    rank: v.number(),
    score: v.number(),
    reasons: v.array(v.string()),
    relaxationStage: v.string(),
    createdAt: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_propertyId", ["propertyId"]),
};
