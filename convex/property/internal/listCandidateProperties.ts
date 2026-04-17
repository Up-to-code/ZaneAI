import { internalQuery } from "../../_generated/server";
import { listCatalogListings } from "../lib/catalog";

export const listCandidateProperties = internalQuery({
  args: {},
  handler: async (ctx) => await listCatalogListings(ctx, 12),
});
