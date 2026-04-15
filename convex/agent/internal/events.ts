import { v } from "convex/values";

import { internalMutation } from "../../_generated/server";

export const addEvent = internalMutation({
  args: {
    runId: v.id("agentRuns"),
    seq: v.number(),
    eventType: v.union(v.literal("stage"), v.literal("tool"), v.literal("lifecycle")),
    phase: v.string(),
    status: v.optional(v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled"),
    )),
    teamId: v.optional(v.string()),
    agentName: v.optional(v.string()),
    message: v.string(),
    detailsJson: v.optional(v.string()),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("agentEvents", { ...args, createdAt: Date.now() }),
});
