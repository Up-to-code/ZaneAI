import { v } from "convex/values";

import { internal } from "../../_generated/api";
import type { Doc } from "../../_generated/dataModel";
import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { findThreadAccess } from "../lib/threadAccess";

export const getRunStatus = query({
  args: { threadId: v.string(), runId: v.id("agentRuns") },
  handler: async (ctx, args): Promise<{
    runId: Doc<"agentRuns">["_id"];
    status: Doc<"agentRuns">["status"];
    summary: Doc<"agentRuns">["summary"];
    diagnostics: Doc<"agentRuns">["diagnostics"];
    workflowId: Doc<"agentRuns">["workflowId"];
    route: Doc<"agentRuns">["route"];
    specialist: Doc<"agentRuns">["specialist"];
    motionPreset: Doc<"agentRuns">["motionPreset"];
    startedAt: Doc<"agentRuns">["startedAt"];
    completedAt: Doc<"agentRuns">["completedAt"];
    updatedAt: Doc<"agentRuns">["updatedAt"];
    stopRequestedAt: Doc<"agentRuns">["stopRequestedAt"];
  } | null> => {
    const authUserId = await requireAuthUserId(ctx);
    const thread = await findThreadAccess(ctx, args.threadId, authUserId);
    if (!thread) {
      return null;
    }

    const run: Doc<"agentRuns"> | null = await ctx.runQuery(internal.agent.internal.runs.getRun, {
      runId: args.runId,
    });

    if (!run || run.threadId !== args.threadId || run.authUserId !== authUserId) {
      return null;
    }

    return {
      runId: run._id,
      status: run.status,
      summary: run.summary,
      diagnostics: run.diagnostics,
      workflowId: run.workflowId,
      route: run.route,
      specialist: run.specialist,
      motionPreset: run.motionPreset,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      updatedAt: run.updatedAt,
      stopRequestedAt: run.stopRequestedAt,
    };
  },
});
