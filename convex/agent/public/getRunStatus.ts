import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { requireThreadAccess } from "../lib/threadAccess";

export const getRunStatus = query({
  args: { threadId: v.string(), runId: v.id("agentRuns") },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    await requireThreadAccess(ctx, args.threadId, authUserId);
    const run = await ctx.runQuery(internal.agent.internal.runs.getRun, {
      runId: args.runId,
    });

    if (!run || run.threadId !== args.threadId || run.authUserId !== authUserId) {
      throw new Error("Run not found");
    }

    return {
      runId: run._id,
      status: run.status,
      summary: run.summary,
      diagnostics: run.diagnostics,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      updatedAt: run.updatedAt,
      stopRequestedAt: run.stopRequestedAt,
    };
  },
});
