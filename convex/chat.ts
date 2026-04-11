import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createUserTurn = mutation({
  args: {
    sessionExternalId: v.string(),
    text: v.string(),
    relatedPropertyIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("chat_messages", {
      sessionExternalId: args.sessionExternalId,
      role: "user",
      kind: "text",
      text: args.text,
      streamState: "complete",
      relatedPropertyIds: args.relatedPropertyIds ?? [],
      createdAt: Date.now(),
    });
  },
});

export const upsertAssistantMessage = mutation({
  args: {
    sessionExternalId: v.string(),
    text: v.string(),
    streamState: v.string(),
    relatedPropertyIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const latest = await ctx.db
      .query("chat_messages")
      .withIndex("by_session", (query) => query.eq("sessionExternalId", args.sessionExternalId))
      .order("desc")
      .first();

    if (latest && latest.role === "assistant") {
      await ctx.db.patch(latest._id, {
        text: args.text,
        streamState: args.streamState,
        relatedPropertyIds: args.relatedPropertyIds,
      });
      return latest._id;
    }

    return ctx.db.insert("chat_messages", {
      sessionExternalId: args.sessionExternalId,
      role: "assistant",
      kind: "property_bundle",
      text: args.text,
      streamState: args.streamState,
      relatedPropertyIds: args.relatedPropertyIds,
      createdAt: Date.now(),
    });
  },
});
