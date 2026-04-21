import { v } from "convex/values";

import { internalQuery } from "../../_generated/server";
import { smartSearchCatalogProperties } from "../lib/search";

const budgetMode = v.union(v.literal("target"), v.literal("max"), v.literal("range"), v.literal("unknown"));

export const smartSearchProperties = internalQuery({
  args: {
    query: v.optional(v.string()),
    location: v.optional(v.string()),
    maxPrice: v.optional(v.number()),
    minPrice: v.optional(v.number()),
    targetPrice: v.optional(v.number()),
    budgetMode: v.optional(budgetMode),
    minBeds: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => await smartSearchCatalogProperties(ctx, args),
});

