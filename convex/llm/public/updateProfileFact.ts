import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { mutation } from "../../_generated/server";
import { profileOwnerKey } from "../../shared/namespaces";
import { requireAuthUserId } from "../../auth/requireAuth";

export const updateProfileFact = mutation({
  args: {
    factId: v.id("knowledgeFacts"),
    title: v.optional(v.string()),
    value: v.optional(v.string()),
    summary: v.optional(v.string()),
    importance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    const fact = await ctx.db.get(args.factId);
    if (!fact || fact.ownerKey !== profileOwnerKey(authUserId)) throw new Error("Fact not found");
    const { factId, ...patch } = args;
    await ctx.db.patch(factId, { ...patch, syncStatus: "pending", updatedAt: Date.now() });
    await ctx.scheduler.runAfter(0, internal.llm.rag.sync.syncFactToRag, { factId: args.factId });
    return args.factId;
  },
});
