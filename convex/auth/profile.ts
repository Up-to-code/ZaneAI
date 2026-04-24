import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { components } from "../_generated/api";

type AuthCtx = QueryCtx | MutationCtx;

type GoogleIdTokenClaims = {
  name?: string;
  picture?: string;
};

function decodeJwtPayload(token: string): GoogleIdTokenClaims | null {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as GoogleIdTokenClaims;
  } catch {
    return null;
  }
}

async function getGoogleIdTokenClaims(ctx: AuthCtx, authUserId: string) {
  const account = await ctx.runQuery(components.betterAuth.adapter.findOne, {
    model: "account",
    where: [
      { field: "userId", value: authUserId },
      { field: "providerId", value: "google" },
    ],
  }) as { idToken?: string | null } | null;

  if (!account?.idToken) {
    return null;
  }

  return decodeJwtPayload(account.idToken);
}

export async function getResolvedAuthUserProfile(
  ctx: AuthCtx,
  authUser: {
    _id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  },
) {
  const claims = await getGoogleIdTokenClaims(ctx, authUser._id);
  return {
    name: claims?.name?.trim() || authUser.name || authUser.email || "Zane-ai user",
    image: claims?.picture?.trim() || authUser.image || null,
  };
}

export async function syncResolvedAuthUserProfile(
  ctx: MutationCtx,
  authUser: {
    _id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  },
) {
  const resolved = await getResolvedAuthUserProfile(ctx, authUser);
  const update: { name?: string; image?: string | null } = {};

  if (resolved.name !== (authUser.name || authUser.email || "Zane-ai user")) {
    update.name = resolved.name;
  }

  if (resolved.image !== (authUser.image || null)) {
    update.image = resolved.image;
  }

  if (Object.keys(update).length > 0) {
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        update,
        where: [{ field: "_id", value: authUser._id }],
      },
    });
  }

  return {
    ...authUser,
    ...update,
  };
}

export async function ensureProfile(ctx: MutationCtx, authUser: {
  _id: string;
  email: string;
  name: string;
  kind?: Doc<"profiles">["kind"];
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
    kind: authUser.kind ?? "buyer",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return (await ctx.db.get(profileId)) as Doc<"profiles">;
}
