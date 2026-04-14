import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizationTables = {
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerProfileId: v.id("profiles"),
    defaultKnowledgeScope: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]).index("by_ownerProfileId", ["ownerProfileId"]),
  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    profileId: v.id("profiles"),
    role: v.string(),
    isDefault: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_profileId", ["profileId"])
    .index("by_organizationId_and_profileId", ["organizationId", "profileId"]),
};
