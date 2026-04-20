import { defineTable } from "convex/server";
import { v } from "convex/values";

export const usageTables = {
  usageLedger: defineTable({
    authUserId: v.optional(v.string()),
    threadId: v.optional(v.string()),
    runId: v.optional(v.id("agentRuns")),
    quotaKey: v.string(),
    model: v.optional(v.string()),
    units: v.number(),
    createdAt: v.number(),
  }).index("by_authUserId_and_quotaKey", ["authUserId", "quotaKey"]),
  llmCacheEntries: defineTable({
    scopeKey: v.string(),
    kind: v.string(),
    model: v.string(),
    inputHash: v.string(),
    payload: v.string(),
    version: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_scopeKey_and_kind_and_model_and_inputHash", [
    "scopeKey",
    "kind",
    "model",
    "inputHash",
  ]),
  analyticsEvents: defineTable({
    authUserId: v.optional(v.string()),
    organizationId: v.optional(v.string()), // Added organizationId
    sessionId: v.optional(v.string()),
    threadId: v.optional(v.string()),
    route: v.optional(v.string()),
    eventName: v.string(),
    source: v.optional(v.string()),
    payload: v.string(),
    createdAt: v.number(),
  })
    .index("by_eventName", ["eventName"])
    .index("by_authUserId", ["authUserId"])
    .index("by_organizationId", ["organizationId"]) // Added index
    .index("by_sessionId", ["sessionId"])
    .index("by_threadId", ["threadId"]),
};
