import { v } from "convex/values";

import { query } from "./_generated/server";
import { seededProperties } from "./lib/fixtures";

export const getById = query({
  args: {
    propertyExternalId: v.string(),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db
      .query("properties")
      .withIndex("by_external_id", (query) => query.eq("externalId", args.propertyExternalId))
      .unique();

    return property ?? seededProperties.find((candidate) => candidate.externalId === args.propertyExternalId) ?? null;
  },
});
