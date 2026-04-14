import { v } from "convex/values";

import { internal } from "../../_generated/api";
import type { Id } from "../../_generated/dataModel";
import { mutation } from "../../_generated/server";
import { profileOwnerKey } from "../../shared/namespaces";
import { requireAuthUserId } from "../../auth/requireAuth";

export const promoteProfileFact = mutation({
  args: {
    key: v.string(),
    title: v.string(),
    value: v.string(),
    summary: v.string(),
    importance: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Id<"knowledgeFacts">> => {
    const authUserId = await requireAuthUserId(ctx);
    const factId: Id<"knowledgeFacts"> = await ctx.runMutation(internal.llm.internal.facts.upsertKnowledgeFact, {
      ownerKey: profileOwnerKey(authUserId),
      authUserId,
      scope: "personal",
      key: args.key,
      title: args.title,
      value: args.value,
      summary: args.summary,
      source: "manual",
      importance: args.importance ?? 0.9,
    });
    await ctx.scheduler.runAfter(0, internal.llm.rag.sync.syncFactToRag, { factId });
    return factId;
  },
});
