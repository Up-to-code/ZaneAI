import { v } from "convex/values";

import { internalMutation } from "../../_generated/server";

export const addEvent = internalMutation({
  args: {
    runId: v.id("agentRuns"),
    seq: v.number(),
    eventType: v.union(v.literal("stage"), v.literal("tool"), v.literal("lifecycle")),
    phase: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled"),
    )),
    message: v.string(),
    route: v.optional(v.union(
      v.literal("advisor"),
      v.literal("property"),
      v.literal("funding"),
      v.literal("legal"),
      v.literal("mixed"),
    )),
    specialist: v.optional(v.string()),
    motionPreset: v.optional(v.union(
      v.literal("assistant"),
      v.literal("advisor"),
      v.literal("property"),
      v.literal("funding"),
    )),
    handoffFrom: v.optional(v.string()),
    handoffTo: v.optional(v.string()),
    detailsJson: v.optional(v.string()),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("agentEvents", { ...args, createdAt: Date.now() }),
});
