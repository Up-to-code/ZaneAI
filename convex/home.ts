import { query } from "./_generated/server";
import { seededInsights, seededProperties } from "./lib/fixtures";

export const getFeed = query({
  args: {},
  handler: async (ctx) => {
    const properties = await ctx.db.query("properties").collect();
    const sessions = await ctx.db.query("chat_sessions").collect();
    const recommendationBatches = await ctx.db.query("recommendation_batches").collect();

    return {
      insights: seededInsights,
      properties: properties.length > 0 ? properties : seededProperties,
      sessions,
      recommendationBatches,
    };
  },
});
