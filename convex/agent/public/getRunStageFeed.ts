import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { findThreadAccess } from "../lib/threadAccess";

const assistantStagePhases = new Set([
  "classify_started",
  "classify_done",
  "specialist_started",
  "specialist_done",
  "summary_started",
  "summary_done",
  "persist_started",
  "persist_done",
] as const);

function isAssistantStagePhase(value: string | undefined): value is typeof assistantStagePhases extends Set<infer T> ? T : never {
  return value !== undefined && assistantStagePhases.has(value as never);
}

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
    const thread = await findThreadAccess(ctx, args.threadId, authUserId);
    if (!thread) {
      return [];
    }

    const run = await ctx.runQuery(internal.agent.internal.runs.getRun, { runId: args.runId });
    if (!run) {
      return [];
    }

    if (run.threadId !== args.threadId || run.authUserId !== authUserId) {
      return [];
    }

    const rows = await ctx.db
      .query("agentEvents")
      .withIndex("by_runId_and_seq", (q) => q.eq("runId", args.runId))
      .order("asc")
      .take(40);

    return rows
      .filter((row) => row.eventType === "stage" && isAssistantStagePhase(row.phase))
      .map((row) => ({
        seq: row.seq,
        eventType: "stage" as const,
        phase: row.phase,
        status: row.status ?? "running",
        message: row.message,
        timestamp: row.createdAt,
        route: row.route,
        specialist: row.specialist,
        motionPreset: row.motionPreset,
        handoffFrom: row.handoffFrom,
        handoffTo: row.handoffTo,
        details: parseDetails(row.detailsJson),
      }));
  },
});
