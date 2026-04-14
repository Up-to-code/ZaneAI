import { v } from "convex/values";

import { internalMutation, internalQuery } from "../../_generated/server";

export const getCacheEntry = internalQuery({
  args: { scopeKey: v.string(), kind: v.string(), model: v.string(), inputHash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("llmCacheEntries")
      .withIndex("by_scopeKey_and_kind_and_model_and_inputHash", (q) =>
        q.eq("scopeKey", args.scopeKey).eq("kind", args.kind).eq("model", args.model).eq("inputHash", args.inputHash),
      )
      .unique();
  },
});

export const putCacheEntry = internalMutation({
  args: {
    scopeKey: v.string(),
    kind: v.string(),
    model: v.string(),
    inputHash: v.string(),
    payload: v.string(),
    version: v.number(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("llmCacheEntries")
      .withIndex("by_scopeKey_and_kind_and_model_and_inputHash", (q) =>
        q.eq("scopeKey", args.scopeKey).eq("kind", args.kind).eq("model", args.model).eq("inputHash", args.inputHash),
      )
      .unique();
    const patch = { ...args, updatedAt: Date.now() };
    if (existing) return await ctx.db.patch(existing._id, patch);
    return await ctx.db.insert("llmCacheEntries", { ...patch, createdAt: Date.now() });
  },
});
