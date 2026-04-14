import { v } from "convex/values";

import { internalMutation } from "../../_generated/server";

export const trackUsage = internalMutation({
  args: {
    authUserId: v.optional(v.string()),
    threadId: v.optional(v.string()),
    runId: v.optional(v.id("agentRuns")),
    quotaKey: v.string(),
    model: v.optional(v.string()),
    units: v.number(),
  },
  handler: async (ctx, args) => await ctx.db.insert("usageLedger", { ...args, createdAt: Date.now() }),
});
