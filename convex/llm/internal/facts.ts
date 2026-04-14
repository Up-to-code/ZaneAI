import { v } from "convex/values";

import { internalMutation, internalQuery } from "../../_generated/server";
import { upsertFact } from "../lib/upsertFact";

export const getFactById = internalQuery({
  args: { factId: v.id("knowledgeFacts") },
  handler: async (ctx, args) => await ctx.db.get(args.factId),
});

export const listFactsByOwner = internalQuery({
  args: { ownerKey: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query("knowledgeFacts")
      .withIndex("by_ownerKey", (q) => q.eq("ownerKey", args.ownerKey))
      .take(50),
});

export const upsertKnowledgeFact = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => await upsertFact(ctx, args),
});

export const markKnowledgeFactSync = internalMutation({
  args: { factId: v.id("knowledgeFacts"), syncStatus: v.string(), ragEntryId: v.optional(v.string()) },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.factId, {
      syncStatus: args.syncStatus,
      ragEntryId: args.ragEntryId,
      updatedAt: Date.now(),
    }),
});

export const patchKnowledgeFact = internalMutation({
  args: {
    factId: v.id("knowledgeFacts"),
    title: v.optional(v.string()),
    value: v.optional(v.string()),
    summary: v.optional(v.string()),
    importance: v.optional(v.number()),
  },
  handler: async (ctx, { factId, ...patch }) =>
    await ctx.db.patch(factId, { ...patch, syncStatus: "pending", updatedAt: Date.now() }),
});
