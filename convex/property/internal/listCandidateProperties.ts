import { internalQuery } from "../../_generated/server";
import { listCatalogProperties } from "../lib/catalog";

export const listCandidateProperties = internalQuery({
  args: {},
  handler: async (ctx) => await listCatalogProperties(ctx, 12),
});
