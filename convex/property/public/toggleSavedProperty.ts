import { v } from "convex/values";

import { mutation } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";
import { requireProfile } from "../../core/lib";

export const toggleSavedProperty = mutation({
  args: { propertyExternalId: v.string() },
  handler: async (ctx, args) => {
    const { profile } = await requireProfile(ctx);
    const listingId = args.propertyExternalId as Id<"listings">;
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
      return { saved: false, listingId, propertyExternalId: listingId };
    }
    await ctx.db.insert("savedListings", {
      profileId: profile._id,
      listingId,
      savedAt: Date.now(),
    });
    return { saved: true, listingId, propertyExternalId: listingId };
  },
});
