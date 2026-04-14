import { v } from "convex/values";

import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { requireThreadAccess } from "../lib/threadAccess";
import { listPropertiesByExternalIds } from "../../property/lib/search";

export const listRecommendationsForThread = query({
  args: { threadId: v.string() },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    await requireThreadAccess(ctx, args.threadId, authUserId);
    const batches = await ctx.db
      .query("recommendationBatches")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .take(10);
    const propertyIds = batches.flatMap((batch) => batch.propertyIds);
    const properties = await listPropertiesByExternalIds(ctx, propertyIds);
    return batches.map((batch) => ({
      ...batch,
      properties: batch.propertyIds
        .map((propertyId) => properties.find((property) => property.externalId === propertyId) ?? null)
        .filter((property): property is (typeof properties)[number] => property !== null),
    }));
  },
});
