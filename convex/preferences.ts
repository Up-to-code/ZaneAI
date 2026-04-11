import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { seededPreferenceProfile } from "./lib/fixtures";

export const get = query({
  args: {
    userExternalId: v.string(),
  },
  handler: async (ctx, args) => {
    const preference = await ctx.db
      .query("user_preferences")
      .withIndex("by_user", (query) => query.eq("userExternalId", args.userExternalId))
      .unique();

    return preference ?? { userExternalId: args.userExternalId, ...seededPreferenceProfile };
  },
});

export const patch = mutation({
  args: {
    userExternalId: v.string(),
    budgetRange: v.optional(v.array(v.number())),
    locations: v.optional(v.array(v.string())),
    bedrooms: v.optional(v.array(v.number())),
    propertyTypes: v.optional(v.array(v.string())),
    commutePrefs: v.optional(v.array(v.string())),
    confidence: v.optional(v.number()),
    updatedFrom: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("user_preferences")
      .withIndex("by_user", (query) => query.eq("userExternalId", args.userExternalId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
      return existing._id;
    }

    return ctx.db.insert("user_preferences", {
      userExternalId: args.userExternalId,
      budgetRange: args.budgetRange ?? seededPreferenceProfile.budgetRange,
      locations: args.locations ?? seededPreferenceProfile.locations,
      bedrooms: args.bedrooms ?? seededPreferenceProfile.bedrooms,
      propertyTypes: args.propertyTypes ?? seededPreferenceProfile.propertyTypes,
      commutePrefs: args.commutePrefs ?? seededPreferenceProfile.commutePrefs,
      confidence: args.confidence ?? seededPreferenceProfile.confidence,
      updatedFrom: args.updatedFrom ?? "mutation",
    });
  },
});
