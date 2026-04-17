import type { QueryCtx } from "../../_generated/server";
import type { Doc, Id } from "../../_generated/dataModel";
import { demoProperties } from "../../shared/demoProperties";

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

function mapDemoListing(row: (typeof demoProperties)[number]): PropertyCompat {
  return {
    _id: `demo:${row.externalId}` as Id<"listings">,
    _creationTime: 0,
    externalId: row.externalId,
    title: row.title,
    description: row.aiSummary,
    location: row.location,
    price: row.price,
    priceLabel: row.priceLabel,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    heroUrl: row.heroUrl,
    searchText: `${row.title} ${row.location} ${row.tags.join(" ")} ${row.aiSummary}`.toLowerCase(),
    matchScore: row.matchScore,
    matchReasons: row.matchReasons,
    aiSummary: row.aiSummary,
    tags: row.tags,
  };
}

export function isDemoCatalogEnabled() {
  return process.env.NODE_ENV !== "production";
}

export async function listCatalogListings(ctx: QueryCtx, limit: number) {
  const rows = await ctx.db
    .query("listings")
    .withIndex("by_status", (q) => q.eq("status", "active"))
    .take(limit);
  if (rows.length > 0 || !isDemoCatalogEnabled()) {
    return rows.map(toPropertyCompat);
  }
  return demoProperties.slice(0, limit).map(mapDemoListing);
}

export async function getCatalogListingById(ctx: QueryCtx, listingId: string) {
  try {
    const listing = await ctx.db.get(listingId as Id<"listings">);
    if (listing?.status === "active") {
      return toPropertyCompat(listing);
    }
  } catch {
    // Fall back to demo ids below.
  }
  if (!isDemoCatalogEnabled()) {
    return null;
  }
  const demoId = listingId.startsWith("demo:") ? listingId.slice("demo:".length) : listingId;
  const demo = demoProperties.find((item) => item.externalId === demoId);
  return demo ? mapDemoListing(demo) : null;
}
