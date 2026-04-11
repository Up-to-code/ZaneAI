import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    userExternalId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("saved_properties")
      .withIndex("by_user", (query) => query.eq("userExternalId", args.userExternalId))
      .collect();
  },
});

export const toggle = mutation({
  args: {
    userExternalId: v.string(),
    propertyExternalId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = (
      await ctx.db
      .query("saved_properties")
      .withIndex("by_user", (query) => query.eq("userExternalId", args.userExternalId))
      .collect()
    ).find((savedProperty) => savedProperty.propertyExternalId === args.propertyExternalId);

    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    }

    await ctx.db.insert("saved_properties", {
      ...args,
      savedAt: Date.now(),
    });
    return { saved: true };
  },
});
