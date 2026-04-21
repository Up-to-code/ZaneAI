import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { canManageInventory, requireWorkspace } from "./core/lib";
import { buildSearchText, parseOptionalNumber } from "./partnerWorkspace/lib";

const unitTypeValidator = v.union(
  v.literal("apartment"),
  v.literal("villa"),
  v.literal("duplex"),
  v.literal("studio"),
  v.literal("penthouse"),
  v.literal("townhouse"),
  v.literal("chalet"),
  v.literal("commercial"),
);

const unitStatusValidator = v.union(
  v.literal("available"),
  v.literal("reserved"),
  v.literal("sold"),
);

const listingTypeValidator = v.union(v.literal("sale"), v.literal("rent"));

const rentalPeriodValidator = v.union(v.literal("day"), v.literal("week"), v.literal("month"), v.literal("year"));

const finishingLevelValidator = v.union(
  v.literal("core_shell"),
  v.literal("semi_finished"),
  v.literal("fully_finished"),
  v.literal("extra_super_lux"),
  v.literal("furnished"),
);

const paymentMethodValidator = v.union(
  v.literal("cash"),
  v.literal("installments"),
  v.literal("cash_or_installments"),
);

const registrationStatusValidator = v.union(
  v.literal("registered"),
  v.literal("not_registered"),
  v.literal("pending"),
);

async function getUnitForWorkspace(ctx: Parameters<typeof requireWorkspace>[0], unitId: Id<"units">) {
  const { membership } = await requireWorkspace(ctx);
  const unit = await ctx.db.get(unitId);
  if (!unit || unit.organizationId !== membership.organizationId) {
    throw new Error("Unit not found.");
  }
  return { membership, unit };
}

async function getApprovedCompliance(
  ctx: Parameters<typeof requireWorkspace>[0],
  args: { projectId: Id<"projects">; unitId: Id<"units"> },
) {
  const unitCompliance = (
    await ctx.db
      .query("listingCompliance")
      .withIndex("by_unitId", (q) => q.eq("unitId", args.unitId))
      .take(1)
  )[0];
  if (unitCompliance?.reviewStatus === "approved") {
    return unitCompliance;
  }

  const projectCompliance = (
    await ctx.db
      .query("listingCompliance")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .take(1)
  )[0];
  return projectCompliance?.reviewStatus === "approved" ? projectCompliance : null;
}

async function getUnitHero(
  ctx: Parameters<typeof requireWorkspace>[0],
  args: { unitId: Id<"units">; projectId: Id<"projects"> },
) {
  const unitHero = (
    await ctx.db
      .query("realEstateAssets")
      .withIndex("by_unitId_and_visibility", (q) => q.eq("unitId", args.unitId).eq("visibility", "public"))
      .take(1)
  )[0];
  if (unitHero?.url) {
    return unitHero;
  }
  const projectHero = (
    await ctx.db
      .query("realEstateAssets")
      .withIndex("by_projectId_and_visibility", (q) => q.eq("projectId", args.projectId).eq("visibility", "public"))
      .take(1)
  )[0];
  return projectHero?.url ? projectHero : null;
}

function buildUnitListingPatch(project: Doc<"projects">, unit: Doc<"units">, hero: Doc<"realEstateAssets"> | null) {
  const title = `${project.title} - ${unit.label}`;
  const summary = unit.description ?? project.shortDescription ?? project.description;
  const priceLabel = unit.priceLabel ?? project.priceLabel ?? project.startingPrice ?? "Price on request";
  const tags = [
    unit.unitType,
    unit.listingType,
    unit.finishingLevel,
    unit.paymentMethod,
    unit.compoundName ?? project.compoundName,
    project.location,
  ].filter((value): value is string => Boolean(value));

  return {
    organizationId: unit.organizationId,
    projectId: project._id,
    unitId: unit._id,
    title,
    summary,
    location: project.location,
    price: unit.price ?? parseOptionalNumber(priceLabel),
    priceLabel,
    listingType: unit.listingType,
    rentalPeriod: unit.rentalPeriod,
    unitType: unit.unitType,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    areaSqm: unit.areaSqm ?? parseOptionalNumber(unit.area),
    heroAssetId: hero?._id,
    heroUrl:
      hero?.url ??
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    searchText: buildSearchText([
      title,
      summary,
      project.location,
      unit.unitType,
      unit.compoundName ?? project.compoundName,
      unit.unitCode,
      unit.direction,
      tags.join(" "),
    ]),
    matchScore: 90,
    matchReasons: [
      "Published by a verified Zayon workspace",
      "Includes unit-level availability and pricing signals",
    ],
    aiSummary: summary,
    tags,
    status: "active" as const,
  };
}

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
    listingType: v.optional(listingTypeValidator),
    floor: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    area: v.optional(v.string()),
    priceLabel: v.optional(v.string()),
    finishingLevel: v.optional(finishingLevelValidator),
    paymentMethod: v.optional(paymentMethodValidator),
    downPayment: v.optional(v.string()),
    installmentYears: v.optional(v.number()),
    deliveryDate: v.optional(v.string()),
    rentalPeriod: v.optional(rentalPeriodValidator),
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
      listingType: args.listingType ?? "sale",
      floor: args.floor?.trim() || undefined,
      bedrooms: args.bedrooms,
      bathrooms: args.bathrooms,
      area: args.area?.trim() || undefined,
      areaSqm: args.area ? parseOptionalNumber(args.area) : undefined,
      priceLabel: args.priceLabel?.trim() || undefined,
      finishingLevel: args.finishingLevel,
      paymentMethod: args.paymentMethod,
      downPayment: args.downPayment?.trim() || undefined,
      installmentYears: args.installmentYears,
      deliveryDate: args.deliveryDate?.trim() || undefined,
      rentalPeriod: args.rentalPeriod,
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
      listingType: v.optional(listingTypeValidator),
      floor: v.optional(v.string()),
      bedrooms: v.optional(v.number()),
      bathrooms: v.optional(v.number()),
      area: v.optional(v.string()),
      priceLabel: v.optional(v.string()),
      finishingLevel: v.optional(finishingLevelValidator),
      paymentMethod: v.optional(paymentMethodValidator),
      downPayment: v.optional(v.string()),
      installmentYears: v.optional(v.number()),
      deliveryDate: v.optional(v.string()),
      rentalPeriod: v.optional(rentalPeriodValidator),
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
      listingType: args.data.listingType ?? unit.listingType,
      floor: args.data.floor?.trim() || undefined,
      bedrooms: args.data.bedrooms,
      bathrooms: args.data.bathrooms,
      area: args.data.area?.trim() || undefined,
      areaSqm: args.data.area ? parseOptionalNumber(args.data.area) : undefined,
      priceLabel: args.data.priceLabel?.trim() || undefined,
      finishingLevel: args.data.finishingLevel,
      paymentMethod: args.data.paymentMethod,
      downPayment: args.data.downPayment?.trim() || undefined,
      installmentYears: args.data.installmentYears,
      deliveryDate: args.data.deliveryDate?.trim() || undefined,
      rentalPeriod: args.data.rentalPeriod,
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

export const upsertListingCompliance = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    unitId: v.optional(v.id("units")),
    adLicenseNumber: v.optional(v.string()),
    registrationStatus: v.optional(registrationStatusValidator),
    privateNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to update listing compliance.");
    }
    if (!args.projectId && !args.unitId) {
      throw new Error("Select a project or unit for compliance.");
    }

    let organizationId = membership.organizationId;
    if (args.unitId) {
      const unit = await ctx.db.get(args.unitId);
      if (!unit || unit.organizationId !== membership.organizationId) {
        throw new Error("Unit not found.");
      }
      organizationId = unit.organizationId;
    }
    if (args.projectId) {
      const project = await ctx.db.get(args.projectId);
      if (!project || project.organizationId !== membership.organizationId) {
        throw new Error("Project not found.");
      }
      organizationId = project.organizationId;
    }

    const existing = args.unitId
      ? (
          await ctx.db
            .query("listingCompliance")
            .withIndex("by_unitId", (q) => q.eq("unitId", args.unitId!))
            .take(1)
        )[0]
      : (
          await ctx.db
            .query("listingCompliance")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId!))
            .take(1)
        )[0];
    const now = Date.now();
    const reviewStatus = args.adLicenseNumber?.trim() ? ("approved" as const) : ("missing" as const);
    const patch = {
      organizationId,
      projectId: args.projectId,
      unitId: args.unitId,
      adLicenseNumber: args.adLicenseNumber?.trim() || undefined,
      registrationStatus: args.registrationStatus,
      reviewStatus,
      privateNotes: args.privateNotes?.trim() || undefined,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return { complianceId: existing._id, reviewStatus };
    }

    const complianceId = await ctx.db.insert("listingCompliance", {
      ...patch,
      createdAt: now,
    });
    return { complianceId, reviewStatus };
  },
});

export const publishUnit = mutation({
  args: { unitId: v.id("units") },
  handler: async (ctx, args) => {
    const { membership, unit } = await getUnitForWorkspace(ctx, args.unitId);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to publish units.");
    }
    if (unit.availability !== "available") {
      throw new Error("Only available units can be published.");
    }
    const project = await ctx.db.get(unit.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      throw new Error("Project not found.");
    }
    const compliance = await getApprovedCompliance(ctx, {
      projectId: project._id,
      unitId: unit._id,
    });
    if (!compliance) {
      throw new Error("Add valid listing compliance before publishing this unit.");
    }

    const hero = await getUnitHero(ctx, { unitId: unit._id, projectId: project._id });
    const now = Date.now();
    const listingPatch = {
      ...buildUnitListingPatch(project, unit, hero),
      updatedAt: now,
      publishedAt: unit.publishedAt ?? now,
    };
    const listingId = unit.publishedListingId
      ? (await ctx.db.patch(unit.publishedListingId, listingPatch), unit.publishedListingId)
      : await ctx.db.insert("listings", { ...listingPatch, createdAt: now });

    await ctx.db.patch(unit._id, {
      publicationState: "published",
      publishedListingId: listingId,
      publishedAt: now,
      updatedAt: now,
    });

    return { ok: true, listingId };
  },
});

export const unpublishUnit = mutation({
  args: { unitId: v.id("units") },
  handler: async (ctx, args) => {
    const { membership, unit } = await getUnitForWorkspace(ctx, args.unitId);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to unpublish units.");
    }
    const now = Date.now();
    if (unit.publishedListingId) {
      await ctx.db.patch(unit.publishedListingId, {
        status: "paused",
        updatedAt: now,
      });
    }
    await ctx.db.patch(unit._id, {
      publicationState: "ready",
      updatedAt: now,
    });
    return { ok: true };
  },
});
