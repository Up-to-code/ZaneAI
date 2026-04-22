import { v } from "convex/values";

import { internalMutation, internalQuery } from "../../_generated/server";
import { logAgentEvent } from "../lib/debugLog";

function canParseJson(value: string | undefined) {
  if (!value) {
    return false;
  }
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export const upsertAssistantTurn = internalMutation({
  args: {
    authUserId: v.string(),
    threadId: v.string(),
    runId: v.id("agentRuns"),
    messageId: v.string(),
    assistantText: v.string(),
    turnVersion: v.string(),
    route: v.union(
      v.literal("advisor"),
      v.literal("property"),
      v.literal("funding"),
      v.literal("legal"),
      v.literal("mixed"),
    ),
    status: v.string(),
    propertyIds: v.array(v.string()),
    turnJson: v.string(),
    metaJson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const parseTurnOk = canParseJson(args.turnJson);
    const parseMetaOk = !args.metaJson || canParseJson(args.metaJson);
    if (!parseTurnOk || !parseMetaOk) {
      logAgentEvent("warn", {
        scope: "message_assembly",
        event: "assistant_turn_json_invalid",
        reasonCode: "json_parse_failed",
        authUserId: args.authUserId,
        threadId: args.threadId,
        runId: String(args.runId),
        messageId: args.messageId,
        parseTurnOk,
        parseMetaOk,
      });
    }
    const existing = await ctx.db
      .query("assistantTurns")
      .withIndex("by_messageId", (q) => q.eq("messageId", args.messageId))
      .unique();

    if (existing) {
      logAgentEvent("info", {
        scope: "message_assembly",
        event: "assistant_turn_upsert_update",
        authUserId: args.authUserId,
        threadId: args.threadId,
        runId: String(args.runId),
        messageId: args.messageId,
        parseTurnOk,
        parseMetaOk,
      });
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    logAgentEvent("info", {
      scope: "message_assembly",
      event: "assistant_turn_upsert_insert",
      authUserId: args.authUserId,
      threadId: args.threadId,
      runId: String(args.runId),
      messageId: args.messageId,
      parseTurnOk,
      parseMetaOk,
    });
    return await ctx.db.insert("assistantTurns", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listAssistantTurnsForThread = internalQuery({
  args: { threadId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) =>
    await ctx.db
      .query("assistantTurns")
      .withIndex("by_threadId_and_createdAt", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .take(Math.min(args.limit ?? 60, 100)),
});
