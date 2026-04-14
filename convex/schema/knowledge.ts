import { defineTable } from "convex/server";
import { v } from "convex/values";

export const knowledgeTables = {
  knowledgeFacts: defineTable({
    ownerKey: v.string(),
    authUserId: v.string(),
    organizationId: v.optional(v.id("organizations")),
    scope: v.string(),
    key: v.string(),
    title: v.string(),
    value: v.string(),
    summary: v.string(),
    source: v.string(),
    importance: v.number(),
    syncStatus: v.string(),
    ragEntryId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_ownerKey", ["ownerKey"])
    .index("by_ownerKey_and_key", ["ownerKey", "key"])
    .index("by_authUserId", ["authUserId"]),
};
