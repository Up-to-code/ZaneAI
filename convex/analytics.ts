import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const track = mutation({
  args: {
    eventName: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("analytics_events", {
      eventName: args.eventName,
      payload: args.payload,
      createdAt: Date.now(),
    });
  },
});
