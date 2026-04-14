import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { mutation } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { requireThreadAccess } from "../lib/threadAccess";

export const stopRun = mutation({
  args: { runId: v.id("agentRuns"), threadId: v.string() },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    await requireThreadAccess(ctx, args.threadId, authUserId);
    const run = await ctx.db.get(args.runId);
    if (!run || run.authUserId !== authUserId) throw new Error("Run not found");
    await ctx.runMutation(internal.agent.internal.runs.patchRun, {
      runId: args.runId,
      status: "cancelled",
      stopRequestedAt: Date.now(),
      completedAt: Date.now(),
    });
    return args.runId;
  },
});
