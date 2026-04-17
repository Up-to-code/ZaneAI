import { v } from "convex/values";

import { query } from "../../_generated/server";
import { getCatalogListingById } from "../lib/catalog";

export const getById = query({
  args: { propertyExternalId: v.string() },
  handler: async (ctx, args) => await getCatalogListingById(ctx, args.propertyExternalId),
});
