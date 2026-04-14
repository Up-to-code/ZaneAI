"use node";
import { saveMessage } from "@convex-dev/agent";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";
import { agentComponent } from "../lib/component";
import { getChatModel } from "../../shared/env";
import { runMultiAgent } from "./runMultiAgent";

export const runTurn = internalAction({
  args: { runId: v.id("agentRuns"), authUserId: v.string(), threadId: v.string(), prompt: v.string(), promptMessageId: v.string() },
  handler: async (ctx, args): Promise<{ summary: string; propertyIds: string[] }> => {
    await ctx.runMutation(internal.agent.internal.runs.patchRun, { runId: args.runId, status: "running", startedAt: Date.now() });
    try {
      const result = await runMultiAgent({ ctx, runId: args.runId, authUserId: args.authUserId, threadId: args.threadId }, args.prompt);
      await saveMessage(ctx, agentComponent, {
        threadId: args.threadId,
        userId: args.authUserId,
        promptMessageId: args.promptMessageId,
        agentName: "decision-agent",
        message: { role: "assistant", content: result.summary },
      });
      await ctx.runMutation(internal.agent.internal.recommendations.createRecommendationBatch, {
        authUserId: args.authUserId,
        threadId: args.threadId,
        runId: args.runId,
        requestContext: args.prompt,
        propertyIds: result.propertyIds,
        rankingRationale: result.rankingRationale,
        sources: result.sources,
      });
      await ctx.runMutation(internal.agent.internal.events.addEvent, {
        runId: args.runId,
        phase: "decision",
        message: "Turn completed and final recommendation saved to thread.",
        details: JSON.stringify({ propertyIds: result.propertyIds, sources: result.sources.length }),
      });
      await ctx.runMutation(internal.agent.internal.usage.trackUsage, {
        authUserId: args.authUserId,
        threadId: args.threadId,
        runId: args.runId,
        quotaKey: "message_tokens",
        model: getChatModel(),
        units: result.tokenUnits,
      });
      await ctx.runMutation(internal.agent.internal.runs.patchRun, {
        runId: args.runId,
        status: "completed",
        summary: result.summary,
        diagnostics: result.diagnostics,
        completedAt: Date.now(),
      });
      return { summary: result.summary, propertyIds: result.propertyIds };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await ctx.runMutation(internal.agent.internal.events.addEvent, {
        runId: args.runId,
        phase: "failure",
        message: "Turn failed before completion.",
        details: message,
      });
      await ctx.runMutation(internal.agent.internal.runs.patchRun, {
        runId: args.runId,
        status: "failed",
        diagnostics: [message],
        completedAt: Date.now(),
      });
      throw error;
    }
  },
});
