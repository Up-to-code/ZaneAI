import type { MutationCtx } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";

type FactInput = {
  ownerKey: string;
  authUserId: string;
  organizationId?: Id<"organizations">;
  scope: string;
  key: string;
  title: string;
  value: string;
  summary: string;
  source: string;
  importance: number;
};

export async function upsertFact(ctx: MutationCtx, args: FactInput) {
  const existing = await ctx.db
    .query("knowledgeFacts")
    .withIndex("by_ownerKey_and_key", (q) => q.eq("ownerKey", args.ownerKey).eq("key", args.key))
    .unique();
  const patch = { ...args, syncStatus: "pending", updatedAt: Date.now() };
  if (existing) {
    await ctx.db.patch(existing._id, patch);
    return existing._id;
  }
  return await ctx.db.insert("knowledgeFacts", { ...patch, createdAt: Date.now() });
}
