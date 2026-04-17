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
import { findThreadAccess } from "../lib/threadAccess";

export const sendUserMessage = mutation({
  args: { threadId: v.string(), prompt: v.string() },
  handler: async (ctx, args): Promise<{ runId: Id<"agentRuns">; messageId: string; threadId: string }> => {
    if (!hasLlmApiKey()) {
      throw new Error("AI unavailable. Set OPENROUTER_API_KEY or OPENAI_API_KEY on Convex runtime.");
    }

    const authUser = await requireAuthUser(ctx);
    await ensureProfile(ctx, authUser);
    const thread = await findThreadAccess(ctx, args.threadId, authUser._id);
    const threadId = thread
      ? args.threadId
      : await createThread(ctx, agentComponent, {
          userId: authUser._id,
          title: "Recovered thread",
          summary: "Recovered from stale thread reference",
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
    await ctx.runMutation(internal.agent.internal.runs.patchRun, {
      runId,
      status: "queued",
      workflowId,
    });
    return { runId, messageId: saved.messageId, threadId };
  },
});
