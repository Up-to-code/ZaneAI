import type { QueryCtx } from "../../_generated/server";
import type { Doc } from "../../_generated/dataModel";
import { getCatalogPropertyByExternalId, listCatalogProperties } from "./catalog";

export type PropertySearchArgs = {
  query?: string;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  minBeds?: number;
  limit?: number;
};

export function filterProperties(rows: Doc<"properties">[], args: PropertySearchArgs) {
  return rows.filter((row) => {
    const haystack = `${row.title} ${row.location} ${row.tags.join(" ")} ${row.description ?? ""}`.toLowerCase();
    return (!args.query || haystack.includes(args.query.toLowerCase()))
      && (!args.location || row.location.toLowerCase().includes(args.location.toLowerCase()))
      && (!args.maxPrice || row.price <= args.maxPrice)
      && (!args.minPrice || row.price >= args.minPrice)
      && (!args.minBeds || row.beds >= args.minBeds);
  });
}

export async function searchCatalogProperties(ctx: QueryCtx, args: PropertySearchArgs) {
  const rows = await listCatalogProperties(ctx, 50);
  const filtered = filterProperties(rows, args);
  return filtered.slice(0, Math.min(args.limit ?? 6, 12));
}

export async function listPropertiesByExternalIds(ctx: QueryCtx, externalIds: string[]) {
  const seen = new Set<string>();
  const rows = await Promise.all(
    externalIds.map(async (externalId) => {
      if (seen.has(externalId)) return null;
      seen.add(externalId);
      return await getCatalogPropertyByExternalId(ctx, externalId);
    }),
  );
  return rows.filter((row): row is Doc<"properties"> => row !== null);
}
