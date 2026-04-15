import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizationTables = {
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerProfileId: v.id("profiles"),
    type: v.union(v.literal("broker"), v.literal("red")),
    status: v.union(v.literal("active"), v.literal("pending")),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    defaultKnowledgeScope: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_ownerProfileId", ["ownerProfileId"]),
  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    profileId: v.id("profiles"),
    role: v.union(v.literal("manager"), v.literal("member"), v.literal("viewer")),
    isDefault: v.boolean(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_profileId", ["profileId"])
    .index("by_organizationId_and_profileId", ["organizationId", "profileId"]),
  organizationInvites: defineTable({
    organizationId: v.id("organizations"),
    inviterProfileId: v.id("profiles"),
    email: v.string(),
    role: v.union(v.literal("manager"), v.literal("member"), v.literal("viewer")),
    token: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("canceled")),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_organizationId", ["organizationId"])
    .index("by_inviterProfileId", ["inviterProfileId"]),
};
