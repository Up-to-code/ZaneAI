import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthUser } from "./auth/requireAuth";
import { ensureProfile } from "./auth/profile";

async function getCurrentMembership(ctx: any, profileId: any) {
  const memberships = await ctx.db
    .query("organizationMembers")
    .withIndex("by_profileId", (q: any) => q.eq("profileId", profileId))
    .collect();
  return memberships.find((m: any) => m.isDefault) ?? memberships[0] ?? null;
}

async function requireWorkspaceContext(ctx: any) {
  const authUser = await requireAuthUser(ctx);
  const profile = await ensureProfile(ctx, {
    _id: authUser._id,
    email: authUser.email ?? "",
    name: authUser.name ?? authUser.email ?? "Workspace user",
  });
  const membership = await getCurrentMembership(ctx, profile._id);
  if (!membership) {
    throw new Error("Create or join an organization before managing units.");
  }
  return { authUser, profile, membership };
}

// ── Queries ─────────────────────────────────────────────

export const listProjectUnits = query({
  args: {
    projectId: v.id("workspaceProperties"),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      return [];
    }
    const rows = await ctx.db
      .query("workspaceUnits")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return rows.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const listWorkspaceUnits = query({
  args: {},
  handler: async (ctx) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const rows = await ctx.db
      .query("workspaceUnits")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", membership.organizationId))
      .collect();
    return rows.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getUnit = query({
  args: {
    unitId: v.id("workspaceUnits"),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const unit = await ctx.db.get(args.unitId);
    if (!unit || unit.organizationId !== membership.organizationId) {
      return null;
    }
    return unit;
  },
});

export const getProjectUnitCounts = query({
  args: {
    projectId: v.id("workspaceProperties"),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      return { total: 0, available: 0, reserved: 0, sold: 0 };
    }
    const units = await ctx.db
      .query("workspaceUnits")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return {
      total: units.length,
      available: units.filter((u) => u.status === "available").length,
      reserved: units.filter((u) => u.status === "reserved").length,
      sold: units.filter((u) => u.status === "sold").length,
    };
  },
});

// ── Mutations ───────────────────────────────────────────

export const createUnit = mutation({
  args: {
    projectId: v.id("workspaceProperties"),
    label: v.string(),
    unitType: v.union(
      v.literal("apartment"),
      v.literal("villa"),
      v.literal("duplex"),
      v.literal("studio"),
      v.literal("penthouse"),
      v.literal("townhouse"),
      v.literal("commercial"),
    ),
    floor: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    area: v.optional(v.string()),
    priceLabel: v.optional(v.string()),
    status: v.union(
      v.literal("available"),
      v.literal("reserved"),
      v.literal("sold"),
    ),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile, membership } = await requireWorkspaceContext(ctx);

    // Verify project belongs to this organization
    const project = await ctx.db.get(args.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      throw new Error("Project not found.");
    }

    const now = Date.now();
    const unitId = await ctx.db.insert("workspaceUnits", {
      organizationId: membership.organizationId,
      projectId: args.projectId,
      createdByProfileId: profile._id,
      label: args.label.trim(),
      unitType: args.unitType,
      floor: args.floor?.trim() || undefined,
      bedrooms: args.bedrooms,
      bathrooms: args.bathrooms,
      area: args.area?.trim() || undefined,
      priceLabel: args.priceLabel?.trim() || undefined,
      status: args.status,
      description: args.description?.trim() || undefined,
      image: args.image || undefined,
      createdAt: now,
      updatedAt: now,
    });
    return { unitId };
  },
});

export const updateUnit = mutation({
  args: {
    unitId: v.id("workspaceUnits"),
    data: v.object({
      label: v.string(),
      unitType: v.union(
        v.literal("apartment"),
        v.literal("villa"),
        v.literal("duplex"),
        v.literal("studio"),
        v.literal("penthouse"),
        v.literal("townhouse"),
        v.literal("commercial"),
      ),
      floor: v.optional(v.string()),
      bedrooms: v.optional(v.number()),
      bathrooms: v.optional(v.number()),
      area: v.optional(v.string()),
      priceLabel: v.optional(v.string()),
      status: v.union(
        v.literal("available"),
        v.literal("reserved"),
        v.literal("sold"),
      ),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const unit = await ctx.db.get(args.unitId);
    if (!unit || unit.organizationId !== membership.organizationId) {
      throw new Error("Unit not found.");
    }
    await ctx.db.patch(args.unitId, {
      label: args.data.label.trim(),
      unitType: args.data.unitType,
      floor: args.data.floor?.trim() || undefined,
      bedrooms: args.data.bedrooms,
      bathrooms: args.data.bathrooms,
      area: args.data.area?.trim() || undefined,
      priceLabel: args.data.priceLabel?.trim() || undefined,
      status: args.data.status,
      description: args.data.description?.trim() || undefined,
      image: args.data.image || undefined,
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

export const deleteUnit = mutation({
  args: {
    unitId: v.id("workspaceUnits"),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const unit = await ctx.db.get(args.unitId);
    if (!unit || unit.organizationId !== membership.organizationId) {
      throw new Error("Unit not found.");
    }
    await ctx.db.delete(args.unitId);
    return { ok: true };
  },
});
