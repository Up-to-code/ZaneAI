import { v } from "convex/values";

import { mutation } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";

export const toggleSavedProperty = mutation({
  args: { propertyExternalId: v.string() },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    const existing = await ctx.db
      .query("savedProperties")
      .withIndex("by_authUserId_and_propertyExternalId", (q) =>
        q.eq("authUserId", authUserId).eq("propertyExternalId", args.propertyExternalId),
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false, propertyExternalId: args.propertyExternalId };
    }
    await ctx.db.insert("savedProperties", {
      authUserId,
      propertyExternalId: args.propertyExternalId,
      savedAt: Date.now(),
    });
    return { saved: true, propertyExternalId: args.propertyExternalId };
  },
});
