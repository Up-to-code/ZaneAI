import { listMessages } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { agentComponent } from "../lib/component";
import { requireThreadAccess } from "../lib/threadAccess";

function parseJson<T>(value: string | undefined): T | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export const getThreadMessages = query({
  args: { threadId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    await requireThreadAccess(ctx, args.threadId, authUserId);
    const result = await listMessages(ctx, agentComponent, args);
    const turns = await ctx.runQuery(internal.agent.internal.assistantTurns.listAssistantTurnsForThread, {
      threadId: args.threadId,
      limit: Math.max(result.page.length * 2, 40),
    });
    const turnsByMessageId = new Map(turns.map((turn) => [turn.messageId, turn]));

    return {
      ...result,
      page: result.page.map((message) => {
        const turn = turnsByMessageId.get(message._id);
        if (!turn) {
          return message;
        }

        return {
          ...message,
          metadata: {
            uiTurn: parseJson(turn.turnJson),
            meta: parseJson(turn.metaJson),
            runId: turn.runId,
            recommendationBatchId: turn.recommendationBatchId,
          },
        };
      }),
    };
  },
});
