import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const tables = {
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.optional(v.union(v.null(), v.string())),
  }).index("userId", ["userId"]).index("email_name", ["email", "name"]),
  session: defineTable({
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.union(v.null(), v.string())),
    userAgent: v.optional(v.union(v.null(), v.string())),
    userId: v.string(),
  }).index("token", ["token"]).index("userId", ["userId"]),
  account: defineTable({
    accountId: v.string(),
    providerId: v.string(),
    userId: v.string(),
    password: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("accountId_providerId", ["accountId", "providerId"]),
  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("identifier", ["identifier"]),
  jwks: defineTable({
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
    expiresAt: v.optional(v.union(v.null(), v.number())),
  }),
  rateLimit: defineTable({
    key: v.string(),
    count: v.number(),
    lastRequest: v.number(),
  }).index("key", ["key"]),
};

export default defineSchema(tables);
