import { createThread, saveMessage } from "@convex-dev/agent";
import { v } from "convex/values";

import { api, internal } from "../../_generated/api";
import type { Id } from "../../_generated/dataModel";
import { mutation } from "../../_generated/server";
import { requireAuthUser } from "../../auth/requireAuth";
import { ensureProfile } from "../../auth/profile";
import { rateLimiter } from "../../llm/rateLimiter";
import { hasLlmApiKey } from "../../shared/env";
import { agentComponent } from "../lib/component";
import { logAgentEvent } from "../lib/debugLog";
import { getLatestWorkerHeartbeat, isWorkerAvailable } from "../lib/workerHealth";
import { findThreadAccess } from "../lib/threadAccess";

function getIngressReasonCode(error: unknown) {
  if (!(error instanceof Error)) {
    return "workflow_failed";
  }
  const message = error.message.toLowerCase();
  if (message.includes("unauth")) {
    return "auth_required";
  }
  if (message.includes("rate")) {
    return "rate_limited";
  }
  if (message.includes("worker offline")) {
    return "worker_offline";
  }
  if (message.includes("openrouter_api_key") || message.includes("openai_api_key")) {
    return "missing_llm_key";
  }
  return "workflow_failed";
}

export const sendUserMessage = mutation({
  args: { threadId: v.string(), prompt: v.string() },
  handler: async (ctx, args): Promise<{ runId: Id<"agentRuns">; messageId: string; threadId: string }> => {
    logAgentEvent("info", {
      scope: "agent_ingress",
      event: "send_user_message_start",
      threadId: args.threadId,
      promptLength: args.prompt.length,
    });
    try {
      if (!hasLlmApiKey()) {
        logAgentEvent("warn", {
          scope: "agent_ingress",
          event: "send_user_message_blocked",
          reasonCode: "missing_llm_key",
          threadId: args.threadId,
        });
        throw new Error("AI unavailable. Set OPENROUTER_API_KEY or OPENAI_API_KEY on Convex runtime.");
      }

      const authUser = await requireAuthUser(ctx);
      await ensureProfile(ctx, authUser);
      const latestWorker = await getLatestWorkerHeartbeat(ctx);
      if (!isWorkerAvailable(latestWorker)) {
        logAgentEvent("warn", {
          scope: "agent_ingress",
          event: "send_user_message_blocked",
          reasonCode: "worker_offline",
          authUserId: authUser._id,
          threadId: args.threadId,
          workerLastHeartbeatAt: latestWorker?.lastHeartbeatAt ?? null,
        });
        throw new Error("AI worker offline. Start `npm run convex` so the agent worker can process runs.");
      }
      const thread = await findThreadAccess(ctx, args.threadId, authUser._id);
      const threadId = thread
        ? args.threadId
        : await createThread(ctx, agentComponent, {
            userId: authUser._id,
            title: "Recovered thread",
            summary: "Recovered from stale thread reference",
          });
      logAgentEvent(thread ? "info" : "warn", {
        scope: "agent_ingress",
        event: "thread_access_resolved",
        reasonCode: thread ? undefined : "thread_recovered",
        authUserId: authUser._id,
        requestedThreadId: args.threadId,
        threadId,
      });
      await rateLimiter.limit(ctx, "sendMessage", { key: authUser._id, throws: true });
      await rateLimiter.limit(ctx, "messageTokens", { key: authUser._id, count: args.prompt.length, throws: true });
      await rateLimiter.limit(ctx, "globalTokens", { count: args.prompt.length, throws: true });
      const saved = await saveMessage(ctx, agentComponent, {
        threadId,
        userId: authUser._id,
        message: { role: "user", content: args.prompt },
      });
      const runId: Id<"agentRuns"> = await ctx.runMutation(internal.agent.internal.runs.createRun, {
        authUserId: authUser._id,
        threadId,
        promptMessageId: saved.messageId,
        goal: args.prompt,
      });
      logAgentEvent("info", {
        scope: "agent_ingress",
        event: "run_created",
        authUserId: authUser._id,
        threadId,
        runId: String(runId),
        messageId: saved.messageId,
      });
      const workflowId: string = await ctx.runMutation(api.agent.orchestrator.api.startWorkflow, {
        name: "agent-turn",
        input: {
          runId,
          authUserId: authUser._id,
          threadId,
          prompt: args.prompt,
          promptMessageId: saved.messageId,
        },
      });
      logAgentEvent("info", {
        scope: "agent_ingress",
        event: "workflow_dispatched",
        authUserId: authUser._id,
        threadId,
        runId: String(runId),
        workflowId,
      });
      await ctx.runMutation(internal.agent.internal.runs.patchRun, {
        runId,
        status: "queued",
        workflowId,
      });
      logAgentEvent("info", {
        scope: "agent_ingress",
        event: "send_user_message_success",
        authUserId: authUser._id,
        threadId,
        runId: String(runId),
      });
      return { runId, messageId: saved.messageId, threadId };
    } catch (error) {
      logAgentEvent("error", {
        scope: "agent_ingress",
        event: "send_user_message_failed",
        reasonCode: getIngressReasonCode(error),
        threadId: args.threadId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
});
