import { listMessages } from "@convex-dev/agent";
import type { PaginationResult } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import type { Doc } from "../../_generated/dataModel";
import { query } from "../../_generated/server";
import { getOptionalAuthUserId } from "../../auth/requireAuth";
import { agentComponent } from "../lib/component";
import { findThreadAccess } from "../lib/threadAccess";

type ThreadMessageWithMetadata = MessageDoc & {
  metadata?: {
    uiTurn?: unknown;
    meta?: unknown;
    runId?: Doc<"assistantTurns">["runId"];
  };
};

type MessageDoc = {
  _id: string;
  message?: { role?: string };
  text?: string;
  [key: string]: unknown;
};

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

function emptyPaginationResult<T>(cursor: string | null): PaginationResult<T> {
  return {
    page: [],
    isDone: true,
    continueCursor: cursor ?? "",
  };
}

export const getThreadMessages = query({
  args: { threadId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args): Promise<PaginationResult<ThreadMessageWithMetadata>> => {
    const authUserId = await getOptionalAuthUserId(ctx);
    if (!authUserId) {
      return emptyPaginationResult(args.paginationOpts.cursor);
    }

    const thread = await findThreadAccess(ctx, args.threadId, authUserId);
    if (!thread) {
      return emptyPaginationResult(args.paginationOpts.cursor);
    }

    const result: PaginationResult<MessageDoc> = await listMessages(ctx, agentComponent, args);
    const turns: Doc<"assistantTurns">[] = await ctx.runQuery(
      internal.agent.internal.assistantTurns.listAssistantTurnsForThread,
      {
      threadId: args.threadId,
      limit: Math.max(result.page.length * 2, 40),
      },
    );
    const turnsByMessageId = new Map<string, Doc<"assistantTurns">>(turns.map((turn) => [turn.messageId, turn]));

    return {
      ...result,
      page: result.page.map((message): ThreadMessageWithMetadata => {
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
          },
        };
      }),
    };
  },
});
