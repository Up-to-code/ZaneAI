import { updateThreadMetadata } from "@convex-dev/agent";
import { v } from "convex/values";

import { api, internal } from "../../_generated/api";
import type { Id } from "../../_generated/dataModel";
import { mutation, type MutationCtx } from "../../_generated/server";
import { requireAuthUser } from "../../auth/requireAuth";
import { ensureProfile } from "../../auth/profile";
import { rateLimiter } from "../../llm/rateLimiter";
import { hasLlmApiKey } from "../../shared/env";
import { agentComponent } from "../lib/component";
import { logAgentEvent } from "../lib/debugLog";
import { requireThreadAccess } from "../lib/threadAccess";
import { buildThreadTitleFromPrompt } from "../lib/threadTitle";
import { getLatestWorkerHeartbeat, isWorkerAvailable } from "../lib/workerHealth";

type AgentMessageDoc = {
  _id: string;
  threadId: string;
  userId?: string | null;
  message?: { role?: string; content?: unknown };
  order: number;
  stepOrder: number;
  _creationTime: number;
};

function getEditReasonCode(error: unknown) {
  if (!(error instanceof Error)) {
    return "workflow_failed";
  }
  const message = error.message.toLowerCase();
  if (message.includes("thread not found")) return "thread_not_found";
  if (message.includes("message not found")) return "thread_not_found";
  if (message.includes("only user messages")) return "workflow_failed";
  if (message.includes("worker offline")) return "worker_offline";
  if (message.includes("openrouter_api_key") || message.includes("openai_api_key")) {
    return "missing_llm_key";
  }
  return "workflow_failed";
}

async function deleteThreadTail(ctx: MutationCtx, target: AgentMessageDoc) {
  let startOrder = target.order;
  let startStepOrder = target.stepOrder + 1;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await ctx.runMutation(agentComponent.messages.deleteByOrder, {
      threadId: target.threadId as never,
      startOrder,
      startStepOrder,
      endOrder: Number.MAX_SAFE_INTEGER,
    });

    if (result.isDone) {
      return;
    }

    startOrder = result.lastOrder ?? startOrder;
    startStepOrder = result.lastStepOrder ?? startStepOrder;
  }

  throw new Error("Message tail is too large to rewrite in one edit.");
}

async function deleteSearchSession(ctx: MutationCtx, sessionId: Id<"propertySearchSessions">) {
  for await (const result of ctx.db
    .query("propertySearchResults")
    .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))) {
    await ctx.db.delete(result._id);
  }
  await ctx.db.delete(sessionId);
}

async function truncateOperationalMemoryAfter(ctx: MutationCtx, threadId: string, cutoffAt: number) {
  const staleRuns: Id<"agentRuns">[] = [];
  const now = Date.now();

  for await (const run of ctx.db.query("agentRuns").withIndex("by_threadId", (q) => q.eq("threadId", threadId))) {
    if (run.createdAt <= cutoffAt) {
      continue;
    }
    staleRuns.push(run._id);
    await ctx.db.patch(run._id, {
      status: "cancelled",
      diagnostics: [...(run.diagnostics ?? []), "Thread was rewritten from an edited user message."].slice(-8),
      stopRequestedAt: run.stopRequestedAt ?? now,
      completedAt: run.completedAt ?? now,
      updatedAt: now,
    });
  }

  for (const runId of staleRuns) {
    for await (const event of ctx.db.query("agentEvents").withIndex("by_runId", (q) => q.eq("runId", runId))) {
      await ctx.db.delete(event._id);
    }
  }

  for await (const turn of ctx.db
    .query("assistantTurns")
    .withIndex("by_threadId_and_createdAt", (q) => q.eq("threadId", threadId).gt("createdAt", cutoffAt))) {
    await ctx.db.delete(turn._id);
  }

  for await (const toolCall of ctx.db
    .query("agentToolCalls")
    .withIndex("by_threadId", (q) => q.eq("threadId", threadId))) {
    if (toolCall.createdAt > cutoffAt) {
      await ctx.db.delete(toolCall._id);
    }
  }

  for await (const session of ctx.db
    .query("propertySearchSessions")
    .withIndex("by_threadId_and_updatedAt", (q) => q.eq("threadId", threadId).gt("updatedAt", cutoffAt))) {
    await deleteSearchSession(ctx, session._id);
  }
}

async function isFirstUserMessage(ctx: MutationCtx, target: AgentMessageDoc) {
  const result = await ctx.runQuery(agentComponent.messages.listMessagesByThreadId, {
    threadId: target.threadId as never,
    order: "asc",
    excludeToolMessages: true,
    statuses: ["success"],
    paginationOpts: { numItems: 24, cursor: null },
    upToAndIncludingMessageId: target._id as never,
  });
  const firstUser = result.page.find((message: AgentMessageDoc) => message.message?.role === "user");
  return firstUser?._id === target._id;
}

export const editUserMessage = mutation({
  args: {
    threadId: v.string(),
    messageId: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, args): Promise<{ runId: Id<"agentRuns">; messageId: string; threadId: string }> => {
    logAgentEvent("info", {
      scope: "agent_ingress",
      event: "edit_user_message_start",
      threadId: args.threadId,
      messageId: args.messageId,
      promptLength: args.prompt.length,
    });

    try {
      if (!hasLlmApiKey()) {
        throw new Error("AI unavailable. Set OPENROUTER_API_KEY or OPENAI_API_KEY on Convex runtime.");
      }

      const prompt = args.prompt.trim();
      if (!prompt) {
        throw new Error("Message cannot be empty.");
      }

      const authUser = await requireAuthUser(ctx);
      await ensureProfile(ctx, authUser);
      await requireThreadAccess(ctx, args.threadId, authUser._id);

      const latestWorker = await getLatestWorkerHeartbeat(ctx);
      if (!isWorkerAvailable(latestWorker)) {
        throw new Error("AI worker offline. Start `npm run convex` so the agent worker can process runs.");
      }

      await rateLimiter.limit(ctx, "sendMessage", { key: authUser._id, throws: true });
      await rateLimiter.limit(ctx, "messageTokens", { key: authUser._id, count: prompt.length, throws: true });
      await rateLimiter.limit(ctx, "globalTokens", { count: prompt.length, throws: true });

      const [target] = await ctx.runQuery(agentComponent.messages.getMessagesByIds, {
        messageIds: [args.messageId as never],
      }) as Array<AgentMessageDoc | null>;

      if (!target) {
        throw new Error("Message not found");
      }
      if (target.threadId !== args.threadId) {
        throw new Error("Message not found in this thread");
      }
      if (target.message?.role !== "user") {
        throw new Error("Only user messages can be edited.");
      }
      if (target.userId && target.userId !== authUser._id) {
        throw new Error("Message not found");
      }

      const shouldUpdateTitle = await isFirstUserMessage(ctx, target);

      await ctx.runMutation(agentComponent.messages.updateMessage, {
        messageId: args.messageId as never,
        patch: {
          message: { role: "user", content: prompt },
          status: "success",
        },
      });

      await deleteThreadTail(ctx, target);
      await truncateOperationalMemoryAfter(ctx, args.threadId, target._creationTime);

      if (shouldUpdateTitle) {
        await updateThreadMetadata(ctx, agentComponent, {
          threadId: args.threadId,
          patch: {
            title: buildThreadTitleFromPrompt(prompt),
            summary: prompt.replace(/\s+/g, " ").slice(0, 160),
          },
        });
      }

      const runId: Id<"agentRuns"> = await ctx.runMutation(internal.agent.internal.runs.createRun, {
        authUserId: authUser._id,
        threadId: args.threadId,
        promptMessageId: args.messageId,
        goal: prompt,
      });

      const workflowId: string = await ctx.runMutation(api.agent.orchestrator.api.startWorkflow, {
        name: "agent-turn",
        input: {
          runId,
          authUserId: authUser._id,
          threadId: args.threadId,
          prompt,
          promptMessageId: args.messageId,
        },
      });

      await ctx.runMutation(internal.agent.internal.runs.patchRun, {
        runId,
        status: "queued",
        workflowId,
      });

      logAgentEvent("info", {
        scope: "agent_ingress",
        event: "edit_user_message_success",
        authUserId: authUser._id,
        threadId: args.threadId,
        runId: String(runId),
        messageId: args.messageId,
      });

      return { runId, messageId: args.messageId, threadId: args.threadId };
    } catch (error) {
      logAgentEvent("error", {
        scope: "agent_ingress",
        event: "edit_user_message_failed",
        reasonCode: getEditReasonCode(error),
        threadId: args.threadId,
        messageId: args.messageId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
});
