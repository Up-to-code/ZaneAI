import { v } from "convex/values";

import { query } from "../../_generated/server";
import { searchCatalogProperties } from "../lib/search";

export const searchProperties = query({
  args: {
    query: v.optional(v.string()),
    location: v.optional(v.string()),
    maxPrice: v.optional(v.number()),
    minPrice: v.optional(v.number()),
    minBeds: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => await searchCatalogProperties(ctx, args),
});
