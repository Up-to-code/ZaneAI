import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { canManageInventory, requireWorkspace } from "./core/lib";

const unitTypeValidator = v.union(
  v.literal("apartment"),
  v.literal("villa"),
  v.literal("duplex"),
  v.literal("studio"),
  v.literal("penthouse"),
  v.literal("townhouse"),
  v.literal("commercial"),
);

const unitStatusValidator = v.union(
  v.literal("available"),
  v.literal("reserved"),
  v.literal("sold"),
);

function toClientUnit<T extends { availability: string }>(unit: T) {
  return { ...unit, status: unit.availability };
}

export const listProjectUnits = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      return [];
    }
    const rows = await ctx.db
      .query("units")
      .withIndex("by_projectId_and_publicationState", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .take(100);
    return rows.map(toClientUnit);
  },
});

export const listWorkspaceUnits = query({
  args: {},
  handler: async (ctx) => {
    const { membership } = await requireWorkspace(ctx);
    const rows = await ctx.db
      .query("units")
      .withIndex("by_organizationId_and_publicationState", (q) => q.eq("organizationId", membership.organizationId))
      .order("desc")
      .take(100);
    return rows.map(toClientUnit);
  },
});

export const getUnit = query({
  args: { unitId: v.id("units") },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    const unit = await ctx.db.get(args.unitId);
    if (!unit || unit.organizationId !== membership.organizationId) {
      return null;
    }
    return toClientUnit(unit);
  },
});

export const getProjectUnitCounts = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      return { total: 0, available: 0, reserved: 0, sold: 0 };
    }
    const units = await ctx.db
      .query("units")
      .withIndex("by_projectId_and_publicationState", (q) => q.eq("projectId", args.projectId))
      .take(100);
    return {
      total: units.length,
      available: units.filter((unit) => unit.availability === "available").length,
      reserved: units.filter((unit) => unit.availability === "reserved").length,
      sold: units.filter((unit) => unit.availability === "sold").length,
    };
  },
});

export const createUnit = mutation({
  args: {
    projectId: v.id("projects"),
    label: v.string(),
    unitType: unitTypeValidator,
    floor: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    area: v.optional(v.string()),
    priceLabel: v.optional(v.string()),
    status: unitStatusValidator,
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    compoundName: v.optional(v.string()),
    unitCode: v.optional(v.string()),
    direction: v.optional(v.string()),
    currency: v.optional(v.union(v.literal("EGP"), v.literal("USD"))),
    maintenanceFees: v.optional(v.string()),
    monthlyInstallment: v.optional(v.string()),
    reception: v.optional(v.number()),
    negotiable: v.optional(v.boolean()),
    pricePerMeter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { profile, membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to create unit drafts.");
    }
    const project = await ctx.db.get(args.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      throw new Error("Project not found.");
    }

    const now = Date.now();
    const unitId = await ctx.db.insert("units", {
      organizationId: membership.organizationId,
      projectId: args.projectId,
      createdByProfileId: profile._id,
      label: args.label.trim(),
      unitType: args.unitType,
      listingType: "sale",
      floor: args.floor?.trim() || undefined,
      bedrooms: args.bedrooms,
      bathrooms: args.bathrooms,
      area: args.area?.trim() || undefined,
      priceLabel: args.priceLabel?.trim() || undefined,
      availability: args.status,
      publicationState: "draft",
      description: args.description?.trim() || undefined,
      compoundName: args.compoundName?.trim() || undefined,
      unitCode: args.unitCode?.trim() || undefined,
      direction: args.direction?.trim() || undefined,
      currency: args.currency || "EGP",
      maintenanceFees: args.maintenanceFees?.trim() || undefined,
      monthlyInstallment: args.monthlyInstallment?.trim() || undefined,
      reception: args.reception,
      negotiable: args.negotiable,
      price: args.pricePerMeter,
      createdAt: now,
      updatedAt: now,
    });
    return { unitId };
  },
});

export const updateUnit = mutation({
  args: {
    unitId: v.id("units"),
    data: v.object({
      label: v.string(),
      unitType: unitTypeValidator,
      floor: v.optional(v.string()),
      bedrooms: v.optional(v.number()),
      bathrooms: v.optional(v.number()),
      area: v.optional(v.string()),
      priceLabel: v.optional(v.string()),
      status: unitStatusValidator,
      description: v.optional(v.string()),
      image: v.optional(v.string()),
      compoundName: v.optional(v.string()),
      unitCode: v.optional(v.string()),
      direction: v.optional(v.string()),
      currency: v.optional(v.union(v.literal("EGP"), v.literal("USD"))),
      maintenanceFees: v.optional(v.string()),
      monthlyInstallment: v.optional(v.string()),
      reception: v.optional(v.number()),
      negotiable: v.optional(v.boolean()),
      pricePerMeter: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to update units.");
    }
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
      availability: args.data.status,
      publicationState: unit.publicationState === "published" ? "ready" : unit.publicationState,
      description: args.data.description?.trim() || undefined,
      compoundName: args.data.compoundName?.trim() || undefined,
      unitCode: args.data.unitCode?.trim() || undefined,
      direction: args.data.direction?.trim() || undefined,
      currency: args.data.currency || unit.currency || "EGP",
      maintenanceFees: args.data.maintenanceFees?.trim() || undefined,
      monthlyInstallment: args.data.monthlyInstallment?.trim() || undefined,
      reception: args.data.reception,
      negotiable: args.data.negotiable,
      price: args.data.pricePerMeter,
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

export const deleteUnit = mutation({
  args: { unitId: v.id("units") },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to delete units.");
    }
    const unit = await ctx.db.get(args.unitId);
    if (!unit || unit.organizationId !== membership.organizationId) {
      throw new Error("Unit not found.");
    }
    if (unit.publishedListingId) {
      await ctx.db.patch(unit.publishedListingId, { status: "archived", updatedAt: Date.now() });
    }
    await ctx.db.patch(args.unitId, {
      publicationState: "archived",
      availability: "hidden",
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});
