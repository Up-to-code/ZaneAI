import type { QueryCtx } from "../../_generated/server";
import type { Doc, Id } from "../../_generated/dataModel";

export type ListingDoc = Doc<"listings">;
export type PropertyCompat = {
  _id: Id<"listings">;
  _creationTime: number;
  externalId: string;
  title: string;
  description?: string;
  price: number;
  priceLabel: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  heroUrl: string;
  matchScore: number;
  matchReasons: string[];
  aiSummary: string;
  tags: string[];
  searchText: string;
};

export function toPropertyCompat(listing: ListingDoc): PropertyCompat {
  return {
    _id: listing._id,
    _creationTime: listing._creationTime,
    externalId: listing._id,
    title: listing.title,
    description: listing.summary,
    price: listing.price ?? 0,
    priceLabel: listing.priceLabel,
    location: listing.location,
    beds: listing.bedrooms ?? 0,
    baths: listing.bathrooms ?? 0,
    area: listing.areaSqm ?? 0,
    heroUrl: listing.heroUrl,
    matchScore: listing.matchScore,
    matchReasons: listing.matchReasons,
    aiSummary: listing.aiSummary,
    tags: listing.tags,
    searchText: listing.searchText,
  };
}

export async function listCatalogListings(ctx: QueryCtx, limit: number) {
  const rows = await ctx.db
    .query("listings")
    .withIndex("by_status", (q) => q.eq("status", "active"))
    .take(limit);
  return rows.map(toPropertyCompat);
}

export async function getCatalogListingById(ctx: QueryCtx, listingId: string) {
  try {
    const listing = await ctx.db.get(listingId as Id<"listings">);
    if (listing?.status === "active") {
      return toPropertyCompat(listing);
    }
  } catch {
    return null;
  }
  return null;
}
