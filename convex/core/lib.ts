import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { authComponent } from "../auth/client";
import { ensureProfile } from "../auth/profile";

export type AppCtx = QueryCtx | MutationCtx;
export type WorkspaceRole = Doc<"organizationMembers">["role"];

export async function getProfileByAuthUserId(ctx: AppCtx, authUserId: string) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
    .unique();
}

export async function requireProfile(ctx: AppCtx) {
  const authUser = await authComponent.getAuthUser(ctx);
  const existing = await getProfileByAuthUserId(ctx, authUser._id);
  if (existing) {
    return { authUser, profile: existing };
  }
  if (!("scheduler" in ctx)) {
    throw new Error("Profile not initialized.");
  }
  const profile = await ensureProfile(ctx, {
    _id: authUser._id,
    email: authUser.email ?? "",
    name: authUser.name ?? authUser.email ?? "Zane-ai user",
  });
  return { authUser, profile };
}

export async function getDefaultMembership(ctx: AppCtx, profileId: Id<"profiles">) {
  const primary = await ctx.db
    .query("organizationMembers")
    .withIndex("by_profileId_and_status", (q) => q.eq("profileId", profileId).eq("status", "active"))
    .take(20);
  return primary.find((membership) => membership.isDefault) ?? primary[0] ?? null;
}

export async function requireWorkspace(ctx: AppCtx) {
  const { authUser, profile } = await requireProfile(ctx);
  const membership = await getDefaultMembership(ctx, profile._id);
  if (!membership) {
    throw new Error("Create or join an organization before using the workspace.");
  }
  const organization = await ctx.db.get(membership.organizationId);
  if (!organization || organization.status !== "active") {
    throw new Error("Workspace organization is not active.");
  }
  return { authUser, profile, membership, organization };
}

export function assertWorkspaceRole(role: WorkspaceRole, allowed: WorkspaceRole[]) {
  if (!allowed.includes(role)) {
    throw new Error("You do not have permission to perform this workspace action.");
  }
}

export function canManageInventory(role: WorkspaceRole) {
  return role === "owner" || role === "manager" || role === "editor";
}

export function canManageOrganization(role: WorkspaceRole) {
  return role === "owner" || role === "manager";
}

export function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export function slugify(value: string, fallback = "workspace") {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || fallback
  );
}

export async function sha256Hex(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
