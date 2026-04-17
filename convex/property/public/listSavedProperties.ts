import { query } from "../../_generated/server";
import { requireProfile } from "../../core/lib";
import { toPropertyCompat } from "../lib/catalog";

export const listSavedProperties = query({
  args: {},
  handler: async (ctx) => {
    const { profile } = await requireProfile(ctx);
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
          propertyExternalId: row.listingId,
          property: listing ? toPropertyCompat(listing) : null,
        };
      }),
    );
  },
});
