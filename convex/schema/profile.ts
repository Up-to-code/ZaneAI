import { defineTable } from "convex/server";
import { v } from "convex/values";

export const profileTables = {
  profiles: defineTable({
    authUserId: v.string(),
    email: v.string(),
    name: v.string(),
    kind: v.optional(v.union(v.literal("buyer"), v.literal("professional"), v.literal("platform_admin"))),
    primaryOrganizationId: v.optional(v.id("organizations")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_authUserId", ["authUserId"]),
};
