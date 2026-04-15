"use node";
import { saveMessage } from "@convex-dev/agent";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";
import { agentComponent } from "../lib/component";
import { getChatModel, hasLlmApiKey } from "../../shared/env";
import { runMultiAgent } from "./runMultiAgent";

export const runTurn = internalAction({
  args: { runId: v.id("agentRuns"), authUserId: v.string(), threadId: v.string(), prompt: v.string(), promptMessageId: v.string() },
  handler: async (ctx, args): Promise<{ assistantText: string; propertyIds: string[] }> => {
    await ctx.runMutation(internal.agent.internal.runs.patchRun, { runId: args.runId, status: "running", startedAt: Date.now() });
    try {
      if (!hasLlmApiKey()) {
        throw new Error("AI runtime unavailable: missing OPENROUTER_API_KEY or OPENAI_API_KEY.");
      }

      const result = await runMultiAgent({ ctx, runId: args.runId, authUserId: args.authUserId, threadId: args.threadId }, args.prompt);
      await ctx.runMutation(internal.agent.internal.events.addEvent, {
        runId: args.runId,
        seq: 9001,
        eventType: "stage",
        phase: "action_started",
        status: "running",
        teamId: "compatibility",
        agentName: "orchestrator",
        message: "Saving recommendation compatibility artifacts.",
      });
      const saved = await saveMessage(ctx, agentComponent, {
        threadId: args.threadId,
        userId: args.authUserId,
        promptMessageId: args.promptMessageId,
        agentName: "summary-agent",
        message: { role: "assistant", content: result.assistantText },
      });
      const recommendationBatchId = await ctx.runMutation(internal.agent.internal.recommendations.createRecommendationBatch, {
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
        seq: 9002,
        eventType: "stage",
        phase: "action_done",
        status: "completed",
        teamId: "compatibility",
        agentName: "orchestrator",
        message: "Recommendation batch saved for legacy property hydration.",
      });
      await ctx.runMutation(internal.agent.internal.events.addEvent, {
        runId: args.runId,
        seq: 9003,
        eventType: "stage",
        phase: "persist_started",
        status: "running",
        teamId: "persistence",
        agentName: "orchestrator",
        message: "Persisting buyer assistant turn.",
      });
      await ctx.runMutation(internal.agent.internal.assistantTurns.upsertAssistantTurn, {
        authUserId: args.authUserId,
        threadId: args.threadId,
        runId: args.runId,
        messageId: saved.messageId,
        assistantText: result.assistantText,
        turnVersion: result.turn.version,
        intent: result.turn.intent,
        status: result.turn.status,
        propertyIds: result.turn.propertyIds,
        rankingRationale: result.turn.rankingRationale,
        recommendationBatchId,
        turnJson: JSON.stringify(result.turn),
        metaJson: JSON.stringify({
          runId: args.runId,
          recommendationBatchId,
          sources: result.sources,
          diagnostics: result.diagnostics,
        }),
      });
      await ctx.runMutation(internal.agent.internal.events.addEvent, {
        runId: args.runId,
        seq: 9004,
        eventType: "stage",
        phase: "persist_done",
        status: "completed",
        teamId: "persistence",
        agentName: "orchestrator",
        message: "Buyer assistant turn saved and linked to the thread.",
        detailsJson: JSON.stringify({ propertyIds: result.propertyIds, sources: result.sources.length }),
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
        summary: result.assistantText,
        diagnostics: result.diagnostics,
        completedAt: Date.now(),
      });
      return { assistantText: result.assistantText, propertyIds: result.propertyIds };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await ctx.runMutation(internal.agent.internal.events.addEvent, {
        runId: args.runId,
        seq: 9999,
        eventType: "lifecycle",
        phase: "failure",
        status: "failed",
        message: "Turn failed before completion.",
        detailsJson: message,
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
