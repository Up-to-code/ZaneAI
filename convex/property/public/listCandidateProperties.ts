import { query } from "../../_generated/server";
import { listCatalogProperties } from "../lib/catalog";

export const listCandidateProperties = query({
  args: {},
  handler: async (ctx) => await listCatalogProperties(ctx, 12),
});
