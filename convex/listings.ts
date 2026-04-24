import { v } from "convex/values";
import type { PaginationResult } from "convex/server";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getProfileIfExists, requireProfile } from "./core/lib";
import { getCatalogListingById, listCatalogListings, toPropertyCompat, toPropertyCompatWithAssets, type PropertyCompat } from "./property/lib/catalog";
import { filterListings, listPropertiesByExternalIds, searchCatalogProperties } from "./property/lib/search";

export const listCandidateListings = query({
  args: {},
  handler: async (ctx) => await listCatalogListings(ctx, 12),
});

export const getListing = query({
  args: { listingId: v.string() },
  handler: async (ctx, args) => await getCatalogListingById(ctx, args.listingId),
});

export const listListingsByIds = query({
  args: { listingIds: v.array(v.string()) },
  handler: async (ctx, args) => await listPropertiesByExternalIds(ctx, args.listingIds),
});

export const searchListings = query({
  args: {
    query: v.optional(v.string()),
    location: v.optional(v.string()),
    maxPrice: v.optional(v.number()),
    minPrice: v.optional(v.number()),
    minBeds: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => await searchCatalogProperties(ctx, args),
});

export const searchListingsPaginated = query({
  args: {
    query: v.optional(v.string()),
    location: v.optional(v.string()),
    maxPrice: v.optional(v.number()),
    minPrice: v.optional(v.number()),
    minBeds: v.optional(v.number()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args): Promise<PaginationResult<PropertyCompat>> => {
    const trimmedQuery = args.query?.trim();
    const result = trimmedQuery
      ? await ctx.db
        .query("listings")
        .withSearchIndex("search_listings", (q) => q.search("searchText", trimmedQuery).eq("status", "active"))
        .paginate(args.paginationOpts)
      : await ctx.db
        .query("listings")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .paginate(args.paginationOpts);

    const page = await Promise.all(
      result.page.map((row) => toPropertyCompatWithAssets(ctx, row)),
    );

    return {
      ...result,
      page: filterListings(page, args),
    };
  },
});

export const listSavedListings = query({
  args: {},
  handler: async (ctx) => {
    const { profile } = await getProfileIfExists(ctx);
    if (!profile) {
      return [];
    }
    const rows = await ctx.db
      .query("savedListings")
      .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
      .order("desc")
      .take(100);
    return await Promise.all(
      rows.map(async (row) => {
        const listing = await ctx.db.get(row.listingId);
        return {
          ...row,
          listingId: row.listingId,
          property: listing ? toPropertyCompat(listing) : null,
        };
      }),
    );
  },
});

export const toggleSavedListing = mutation({
  args: { listingId: v.string() },
  handler: async (ctx, args) => {
    const { profile } = await requireProfile(ctx);
    const listingId = args.listingId as Id<"listings">;
    const listing = await ctx.db.get(listingId);
    if (!listing || listing.status !== "active") {
      throw new Error("Listing not found.");
    }
    const existing = await ctx.db
      .query("savedListings")
      .withIndex("by_profileId_and_listingId", (q) =>
        q.eq("profileId", profile._id).eq("listingId", listingId),
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false, listingId };
    }
    await ctx.db.insert("savedListings", {
      profileId: profile._id,
      listingId,
      savedAt: Date.now(),
    });
    return { saved: true, listingId };
  },
});
