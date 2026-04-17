import { query } from "../../_generated/server";
import { listCatalogListings } from "../lib/catalog";

export const listCandidateProperties = query({
  args: {},
  handler: async (ctx) => await listCatalogListings(ctx, 12),
});
