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
  imageUrls?: string[];
  matchScore: number;
  matchReasons: string[];
  aiSummary: string;
  tags: string[];
  searchText: string;
  developerName?: string;
  compoundName?: string;
};

export function toPropertyCompat(listing: ListingDoc): PropertyCompat {
  const imageUrls = [listing.heroUrl].filter(Boolean);

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
    imageUrls,
    matchScore: listing.matchScore,
    matchReasons: listing.matchReasons,
    aiSummary: listing.aiSummary,
    tags: listing.tags,
    searchText: listing.searchText,
  };
}

export async function toPropertyCompatWithAssets(ctx: QueryCtx, listing: ListingDoc): Promise<PropertyCompat> {
  const property = toPropertyCompat(listing);
  const assets = await ctx.db
    .query("realEstateAssets")
    .withIndex("by_listingId_and_visibility", (q) =>
      q.eq("listingId", listing._id).eq("visibility", "public"),
    )
    .collect();
  const imageUrls = assets
    .filter((asset) => asset.kind === "image" && asset.url)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((asset) => asset.url!)
    .filter((url, index, urls) => urls.indexOf(url) === index);

  let developerName = undefined;
  let compoundName = undefined;
  if (listing.projectId) {
    const project = await ctx.db.get(listing.projectId);
    if (project) {
      developerName = project.developerName;
      compoundName = project.compoundName;
    }
  }

  return {
    ...property,
    imageUrls: imageUrls.length ? imageUrls : property.imageUrls,
    developerName,
    compoundName,
  };
}

export async function listCatalogListings(ctx: QueryCtx, limit: number) {
  const rows = await ctx.db
    .query("listings")
    .withIndex("by_status", (q) => q.eq("status", "active"))
    .take(limit);
  return await Promise.all(rows.map((row) => toPropertyCompatWithAssets(ctx, row)));
}

export async function getCatalogListingById(ctx: QueryCtx, listingId: string) {
  try {
    const listing = await ctx.db.get(listingId as Id<"listings">);
    if (listing?.status === "active") {
      return await toPropertyCompatWithAssets(ctx, listing);
    }
  } catch {
    return null;
  }
  return null;
}
