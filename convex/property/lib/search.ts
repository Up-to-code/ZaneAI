import type { QueryCtx } from "../../_generated/server";
import { getCatalogListingById, listCatalogListings, toPropertyCompat, type PropertyCompat } from "./catalog";

export type PropertySearchArgs = {
  query?: string;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  minBeds?: number;
  limit?: number;
};

export function filterListings(rows: PropertyCompat[], args: PropertySearchArgs) {
  return rows.filter((row) => {
    const haystack = row.searchText || `${row.title} ${row.location} ${row.tags.join(" ")} ${row.description ?? ""}`.toLowerCase();
    return (!args.query || haystack.includes(args.query.toLowerCase()))
      && (!args.location || row.location.toLowerCase().includes(args.location.toLowerCase()))
      && (!args.maxPrice || !row.price || row.price <= args.maxPrice)
      && (!args.minPrice || !row.price || row.price >= args.minPrice)
      && (!args.minBeds || !row.beds || row.beds >= args.minBeds);
  });
}

export async function searchCatalogProperties(ctx: QueryCtx, args: PropertySearchArgs) {
  const limit = Math.min(args.limit ?? 6, 12);
  if (args.query?.trim()) {
    const rows = await ctx.db
      .query("listings")
      .withSearchIndex("search_listings", (q) => q.search("searchText", args.query!.trim()).eq("status", "active"))
      .take(limit);
    if (rows.length > 0) {
      return filterListings(rows.map(toPropertyCompat), args).slice(0, limit);
    }
  }
  const rows = await listCatalogListings(ctx, 50);
  return filterListings(rows, args).slice(0, limit);
}

export async function listPropertiesByExternalIds(ctx: QueryCtx, listingIds: string[]) {
  const seen = new Set<string>();
  const rows = await Promise.all(
    listingIds.map(async (listingId) => {
      if (seen.has(listingId)) return null;
      seen.add(listingId);
      return await getCatalogListingById(ctx, listingId);
    }),
  );
  return rows.filter((row): row is PropertyCompat => row !== null);
}
