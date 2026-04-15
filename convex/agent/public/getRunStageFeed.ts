import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { requireThreadAccess } from "../lib/threadAccess";

function parseDetails(detailsJson: string | undefined) {
  if (!detailsJson) {
    return undefined;
  }

  try {
    return JSON.parse(detailsJson) as Record<string, string | number | boolean | null>;
  } catch {
    return undefined;
  }
}

export const getRunStageFeed = query({
  args: { threadId: v.string(), runId: v.id("agentRuns") },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    await requireThreadAccess(ctx, args.threadId, authUserId);
    const run = await ctx.runQuery(internal.agent.internal.runs.getRun, { runId: args.runId });
    if (!run || run.threadId !== args.threadId || run.authUserId !== authUserId) {
      throw new Error("Run not found");
    }

    const rows = await ctx.db
      .query("agentEvents")
      .withIndex("by_runId_and_seq", (q) => q.eq("runId", args.runId))
      .order("asc")
      .take(40);

    return rows
      .filter((row) => row.eventType === "stage")
      .map((row) => ({
        seq: row.seq,
        eventType: "stage" as const,
        phase: row.phase,
        status: row.status ?? "running",
        teamId: row.teamId,
        agentName: row.agentName,
        message: row.message,
        timestamp: row.createdAt,
        details: parseDetails(row.detailsJson),
      }));
  },
});
