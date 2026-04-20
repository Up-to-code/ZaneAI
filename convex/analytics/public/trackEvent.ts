import { v } from "convex/values";

import { mutation } from "../../_generated/server";

export const trackEvent = mutation({
  args: {
    eventName: v.string(),
    organizationId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    threadId: v.optional(v.string()),
    route: v.optional(v.string()),
    source: v.optional(v.string()),
    payload: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    await ctx.db.insert("analyticsEvents", {
      authUserId: identity?.tokenIdentifier,
      organizationId: args.organizationId,
      sessionId: args.sessionId,
      threadId: args.threadId,
      route: args.route,
      eventName: args.eventName,
      source: args.source,
      payload: args.payload ?? "{}",
      createdAt: Date.now(),
    });
    return { ok: true };
  },
});
