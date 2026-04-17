import { listMessages } from "@convex-dev/agent";
import type { PaginationResult } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import type { Doc } from "../../_generated/dataModel";
import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { agentComponent } from "../lib/component";
import { logAgentEvent } from "../lib/debugLog";
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

function parseJson<T>(value: string | undefined, diagnostics?: Record<string, unknown>): T | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    logAgentEvent("warn", {
      scope: "message_assembly",
      event: "thread_message_json_parse_failed",
      reasonCode: "json_parse_failed",
      ...diagnostics,
      error: error instanceof Error ? error.message : String(error),
    });
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
    const authUserId = await requireAuthUserId(ctx);
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
          if (message.message?.role === "assistant") {
            logAgentEvent("warn", {
              scope: "message_assembly",
              event: "assistant_turn_link_missing",
              reasonCode: "turn_link_missing",
              authUserId,
              threadId: args.threadId,
              messageId: message._id,
            });
          }
          return message;
        }

        return {
          ...message,
          metadata: {
            uiTurn: parseJson(turn.turnJson, {
              authUserId,
              threadId: args.threadId,
              runId: String(turn.runId),
              messageId: message._id,
              jsonField: "turnJson",
            }),
            meta: parseJson(turn.metaJson, {
              authUserId,
              threadId: args.threadId,
              runId: String(turn.runId),
              messageId: message._id,
              jsonField: "metaJson",
            }),
            runId: turn.runId,
          },
        };
      }),
    };
  },
});
