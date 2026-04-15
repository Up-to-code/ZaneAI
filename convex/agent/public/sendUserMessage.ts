import { saveMessage } from "@convex-dev/agent";
import { v } from "convex/values";

import { internal } from "../../_generated/api";
import type { Id } from "../../_generated/dataModel";
import { mutation } from "../../_generated/server";
import { requireAuthUser } from "../../auth/requireAuth";
import { ensureProfile } from "../../auth/profile";
import { rateLimiter } from "../../llm/rateLimiter";
import { hasLlmApiKey } from "../../shared/env";
import { agentComponent } from "../lib/component";
import { requireThreadAccess } from "../lib/threadAccess";

export const sendUserMessage = mutation({
  args: { threadId: v.string(), prompt: v.string() },
  handler: async (ctx, args): Promise<{ runId: Id<"agentRuns">; messageId: string }> => {
    if (!hasLlmApiKey()) {
      throw new Error("AI unavailable. Set OPENROUTER_API_KEY or OPENAI_API_KEY on Convex runtime.");
    }

    const authUser = await requireAuthUser(ctx);
    await ensureProfile(ctx, authUser);
    await requireThreadAccess(ctx, args.threadId, authUser._id);
    await rateLimiter.limit(ctx, "sendMessage", { key: authUser._id, throws: true });
    await rateLimiter.limit(ctx, "messageTokens", { key: authUser._id, count: args.prompt.length, throws: true });
    await rateLimiter.limit(ctx, "globalTokens", { count: args.prompt.length, throws: true });
    const saved = await saveMessage(ctx, agentComponent, {
      threadId: args.threadId,
      userId: authUser._id,
      message: { role: "user", content: args.prompt },
    });
    const runId: Id<"agentRuns"> = await ctx.runMutation(internal.agent.internal.runs.createRun, {
      authUserId: authUser._id,
      threadId: args.threadId,
      promptMessageId: saved.messageId,
      goal: args.prompt,
    });
    await ctx.scheduler.runAfter(0, internal.agent.internal.orchestrate.runTurn, {
      runId,
      authUserId: authUser._id,
      threadId: args.threadId,
      prompt: args.prompt,
      promptMessageId: saved.messageId,
    });
    return { runId, messageId: saved.messageId };
  },
});
