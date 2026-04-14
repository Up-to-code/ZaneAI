import { v } from "convex/values";

import { internalMutation } from "../../_generated/server";

export const addEvent = internalMutation({
  args: { runId: v.id("agentRuns"), phase: v.string(), message: v.string(), details: v.optional(v.string()) },
  handler: async (ctx, args) =>
    await ctx.db.insert("agentEvents", { ...args, createdAt: Date.now() }),
});
