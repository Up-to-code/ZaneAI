import { defineTable } from "convex/server";
import { v } from "convex/values";

export const profileTables = {
  profiles: defineTable({
    authUserId: v.string(),
    email: v.string(),
    name: v.string(),
    primaryOrganizationId: v.optional(v.id("organizations")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_authUserId", ["authUserId"]),
};
