import { v } from "convex/values";

import { internalQuery } from "../../_generated/server";

export const listSavedProperties = internalQuery({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("savedListings")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .take(20);
    return await Promise.all(
      saved.map(async (row) => {
        const listing = await ctx.db.get(row.listingId);
        return {
          listingId: row.listingId,
          propertyExternalId: row.listingId,
          title: listing?.title ?? row.listingId,
          location: listing?.location,
          priceLabel: listing?.priceLabel,
          heroUrl: listing?.heroUrl,
          savedAt: row.savedAt,
        };
      }),
    );
  },
});
