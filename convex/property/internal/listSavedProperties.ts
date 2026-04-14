import { v } from "convex/values";

import { internalQuery } from "../../_generated/server";
import { listPropertiesByExternalIds } from "../lib/search";

export const listSavedProperties = internalQuery({
  args: { authUserId: v.string() },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("savedProperties")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.authUserId))
      .take(10);
    const catalog = await listPropertiesByExternalIds(
      ctx,
      saved.map((item) => item.propertyExternalId),
    );
    return saved.map((item) => {
      const property = catalog.find((row) => row.externalId === item.propertyExternalId);
      return {
        externalId: item.propertyExternalId,
        title: property?.title ?? item.propertyExternalId,
        location: property?.location ?? "Unknown",
        priceLabel: property?.priceLabel ?? "Unknown",
        heroUrl: property?.heroUrl ?? "",
        savedAt: item.savedAt,
      };
    });
  },
});
