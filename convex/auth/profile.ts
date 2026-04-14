import type { MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export async function ensureProfile(ctx: MutationCtx, authUser: {
  _id: string;
  email: string;
  name: string;
}) {
  const existing = await ctx.db
    .query("profiles")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", authUser._id))
    .unique();
  if (existing) return existing;
  const profileId = await ctx.db.insert("profiles", {
    authUserId: authUser._id,
    email: authUser.email,
    name: authUser.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return (await ctx.db.get(profileId)) as Doc<"profiles">;
}
