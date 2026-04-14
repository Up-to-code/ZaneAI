import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { listPropertiesByExternalIds } from "../lib/search";

export const listSavedProperties = query({
  args: {},
  handler: async (ctx) => {
    const authUserId = await requireAuthUserId(ctx);
    const saved = await ctx.db
      .query("savedProperties")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .take(50);
    const properties = await listPropertiesByExternalIds(
      ctx,
      saved.map((item) => item.propertyExternalId),
    );
    return saved.map((item) => ({
      ...item,
      property: properties.find((property) => property.externalId === item.propertyExternalId) ?? null,
    }));
  },
});
