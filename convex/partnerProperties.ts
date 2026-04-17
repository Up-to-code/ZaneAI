import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { canManageInventory, requireWorkspace } from "./core/lib";
import {
  buildSearchText,
  mapProjectDocToWorkspaceProject,
  parseOptionalNumber,
  slugifyProjectTitle,
  toPriceLabel,
  type UploadedFileReference,
} from "./partnerWorkspace/lib";

const uploadedFileReference = v.object({
  key: v.string(),
  url: v.string(),
  name: v.string(),
  size: v.optional(v.number()),
  mime: v.optional(v.string()),
});

const galleryDisplayModeValidator = v.union(v.literal("cover"), v.literal("fit"));
const galleryAspectRatioValidator = v.union(
  v.literal("auto"),
  v.literal("landscape"),
  v.literal("square"),
  v.literal("portrait"),
);
const clientVisibilityValidator = v.union(v.literal("private"), v.literal("public"));
const publicationStateValidator = v.union(v.literal("draft"), v.literal("published"), v.literal("archived"));

const projectTypeValues = ["villas", "apartments", "land_plots", "mixed", "standalone", "custom"] as const;
const registrationStatusValues = ["registered", "not_registered", "pending"] as const;

type ProjectType = Doc<"projects">["projectType"];
type RegistrationStatus = NonNullable<Doc<"listingCompliance">["registrationStatus"]>;

function asProjectType(value: string | undefined): ProjectType {
  return projectTypeValues.includes(value as ProjectType) ? (value as ProjectType) : "standalone";
}

function asRegistrationStatus(value: string | undefined): RegistrationStatus | undefined {
  return registrationStatusValues.includes(value as RegistrationStatus) ? (value as RegistrationStatus) : undefined;
}

async function listProjectAssets(ctx: QueryCtx | MutationCtx, projectId: Id<"projects">) {
  return await ctx.db
    .query("realEstateAssets")
    .withIndex("by_projectId_and_visibility", (q) => q.eq("projectId", projectId))
    .take(100);
}

async function listProjectUnitSummaries(ctx: QueryCtx | MutationCtx, projectId: Id<"projects">) {
  const units = await ctx.db
    .query("units")
    .withIndex("by_projectId_and_publicationState", (q) => q.eq("projectId", projectId))
    .take(100);
  return units.map((unit) => ({
    id: unit._id,
    label: unit.label,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    area: unit.area,
    priceLabel: unit.priceLabel,
  }));
}

async function mapProject(ctx: QueryCtx | MutationCtx, project: Doc<"projects">) {
  const [assets, unitSummaries] = await Promise.all([
    listProjectAssets(ctx, project._id),
    listProjectUnitSummaries(ctx, project._id),
  ]);
  return mapProjectDocToWorkspaceProject(project, assets, unitSummaries);
}

async function replaceProjectAssets(
  ctx: MutationCtx,
  args: {
    organizationId: Id<"organizations">;
    projectId: Id<"projects">;
    images: UploadedFileReference[];
    privatePermitFiles: UploadedFileReference[];
    now: number;
  },
) {
  const existing = await ctx.db
    .query("realEstateAssets")
    .withIndex("by_projectId_and_visibility", (q) => q.eq("projectId", args.projectId))
    .take(100);
  for (const asset of existing) {
    await ctx.db.delete(asset._id);
  }
  for (const [index, image] of args.images.entries()) {
    await ctx.db.insert("realEstateAssets", {
      organizationId: args.organizationId,
      projectId: args.projectId,
      kind: "image",
      key: image.key,
      url: image.url,
      name: image.name,
      size: image.size,
      mime: image.mime,
      visibility: "public",
      sortOrder: index,
      createdAt: args.now,
      updatedAt: args.now,
    });
  }
  for (const [index, file] of args.privatePermitFiles.entries()) {
    await ctx.db.insert("realEstateAssets", {
      organizationId: args.organizationId,
      projectId: args.projectId,
      kind: "permit",
      key: file.key,
      url: file.url,
      name: file.name,
      size: file.size,
      mime: file.mime,
      visibility: "conversation_only",
      sortOrder: index,
      createdAt: args.now,
      updatedAt: args.now,
    });
  }
}

async function upsertProjectCompliance(
  ctx: MutationCtx,
  args: {
    organizationId: Id<"organizations">;
    projectId: Id<"projects">;
    adLicenseNumber?: string;
    registrationStatus?: RegistrationStatus;
    privateNotes?: string;
    now: number;
  },
) {
  const existing = (
    await ctx.db
      .query("listingCompliance")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .take(1)
  )[0];
  const reviewStatus = args.adLicenseNumber?.trim() ? "approved" : "missing";
  if (existing) {
    await ctx.db.patch(existing._id, {
      adLicenseNumber: args.adLicenseNumber?.trim() || undefined,
      registrationStatus: args.registrationStatus,
      reviewStatus,
      privateNotes: args.privateNotes,
      updatedAt: args.now,
    });
    return existing._id;
  }
  return await ctx.db.insert("listingCompliance", {
    organizationId: args.organizationId,
    projectId: args.projectId,
    adLicenseNumber: args.adLicenseNumber?.trim() || undefined,
    registrationStatus: args.registrationStatus,
    reviewStatus,
    privateNotes: args.privateNotes,
    createdAt: args.now,
    updatedAt: args.now,
  });
}

async function publishProject(ctx: MutationCtx, project: Doc<"projects">) {
  const compliance = (
    await ctx.db
      .query("listingCompliance")
      .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
      .take(1)
  )[0];
  if (!compliance || compliance.reviewStatus !== "approved") {
    throw new Error("Add valid listing compliance before publishing this project.");
  }
  const publicImages = (await listProjectAssets(ctx, project._id)).filter(
    (asset) => asset.kind === "image" && asset.visibility === "public" && asset.url,
  );
  const hero = publicImages[0];
  const now = Date.now();
  const price = parseOptionalNumber(project.priceLabel ?? project.startingPrice);
  const listingPatch = {
    organizationId: project.organizationId,
    projectId: project._id,
    title: project.title,
    summary: project.shortDescription ?? project.description,
    location: project.location,
    price,
    priceLabel: project.priceLabel ?? project.startingPrice ?? "Price on request",
    listingType: "sale" as const,
    heroAssetId: hero?._id,
    heroUrl:
      hero?.url ??
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    searchText: buildSearchText([project.title, project.location, project.description, project.projectType]),
    matchScore: 92,
    matchReasons: ["Published by a verified Zane-ai workspace", "Matches your real estate search context"],
    aiSummary: project.shortDescription ?? project.description,
    tags: [project.projectType, project.location],
    status: "active" as const,
    updatedAt: now,
    publishedAt: project.publishedAt ?? now,
  };

  const listingId = project.publishedListingId
    ? (await ctx.db.patch(project.publishedListingId, listingPatch), project.publishedListingId)
    : await ctx.db.insert("listings", { ...listingPatch, createdAt: now });

  await ctx.db.patch(project._id, {
    publicationState: "published",
    status: "published",
    publishedListingId: listingId,
    publishedAt: now,
    updatedAt: now,
  });
  return listingId;
}

export const listWorkspaceProperties = query({
  args: {},
  handler: async (ctx) => {
    const { membership } = await requireWorkspace(ctx);
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_organizationId_and_publicationState", (q) => q.eq("organizationId", membership.organizationId))
      .order("desc")
      .take(100);
    return await Promise.all(rows.map((row) => mapProject(ctx, row)));
  },
});

export const getWorkspaceProperty = query({
  args: { propertyId: v.id("projects") },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      return null;
    }
    return await mapProject(ctx, row);
  },
});

const projectInputValidator = {
  name: v.string(),
  price: v.string(),
  location: v.string(),
  description: v.string(),
  shortDescription: v.string(),
  amenitiesText: v.string(),
  hasParking: v.boolean(),
  parkingSpaces: v.string(),
  coverImageKey: v.optional(v.union(v.string(), v.null())),
  galleryDisplayMode: galleryDisplayModeValidator,
  galleryAspectRatio: galleryAspectRatioValidator,
  privatePermitSummary: v.string(),
  privatePermitFiles: v.array(uploadedFileReference),
  rooms: v.string(),
  baths: v.string(),
  area: v.string(),
  status: v.string(),
  expectedUnits: v.optional(v.string()),
  clientVisibility: clientVisibilityValidator,
  images: v.array(uploadedFileReference),
  video: v.optional(v.union(v.string(), v.null())),
  brokerId: v.optional(v.union(v.string(), v.null())),
  unitType: v.optional(v.string()),
  listingType: v.optional(v.string()),
  finishingLevel: v.optional(v.string()),
  floor: v.optional(v.string()),
  payment: v.optional(v.object({
    method: v.union(v.literal("cash"), v.literal("installments"), v.literal("cash_or_installments")),
    downPayment: v.optional(v.string()),
    installmentYears: v.optional(v.number()),
    deliveryDate: v.optional(v.string()),
  })),
  nearbyPlaces: v.optional(v.array(v.object({ name: v.string(), distance: v.string() }))),
  adLicenseNumber: v.optional(v.string()),
  registrationStatus: v.optional(v.string()),
};

export const createWorkspaceProperty = mutation({
  args: projectInputValidator,
  handler: async (ctx, args) => {
    const { profile, membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to create project drafts.");
    }
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      organizationId: membership.organizationId,
      createdByProfileId: profile._id,
      title: args.name.trim(),
      slug: slugifyProjectTitle(args.name),
      projectType: asProjectType(args.unitType),
      location: args.location.trim(),
      description: args.description.trim(),
      shortDescription: args.shortDescription.trim() || args.description.trim(),
      priceLabel: toPriceLabel(args.price),
      expectedUnits: args.expectedUnits ? Number(args.expectedUnits) || undefined : undefined,
      status: "draft",
      publicationState: "draft",
      createdAt: now,
      updatedAt: now,
    });
    await replaceProjectAssets(ctx, {
      organizationId: membership.organizationId,
      projectId,
      images: args.images,
      privatePermitFiles: args.privatePermitFiles,
      now,
    });
    await upsertProjectCompliance(ctx, {
      organizationId: membership.organizationId,
      projectId,
      adLicenseNumber: args.adLicenseNumber,
      registrationStatus: asRegistrationStatus(args.registrationStatus),
      privateNotes: args.privatePermitSummary.trim() || undefined,
      now,
    });
    return { propertyId: projectId };
  },
});

export const updateWorkspaceProperty = mutation({
  args: {
    propertyId: v.id("projects"),
    data: v.object(projectInputValidator),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to update project drafts.");
    }
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      throw new Error("Project not found.");
    }
    const now = Date.now();
    await ctx.db.patch(args.propertyId, {
      title: args.data.name.trim(),
      slug: slugifyProjectTitle(args.data.name),
      projectType: asProjectType(args.data.unitType),
      location: args.data.location.trim(),
      description: args.data.description.trim(),
      shortDescription: args.data.shortDescription.trim() || args.data.description.trim(),
      priceLabel: toPriceLabel(args.data.price),
      expectedUnits: args.data.expectedUnits ? Number(args.data.expectedUnits) || undefined : undefined,
      publicationState: row.publicationState === "published" ? "ready" : row.publicationState,
      status: row.status === "published" ? "ready" : row.status,
      updatedAt: now,
    });
    await replaceProjectAssets(ctx, {
      organizationId: membership.organizationId,
      projectId: args.propertyId,
      images: args.data.images,
      privatePermitFiles: args.data.privatePermitFiles,
      now,
    });
    await upsertProjectCompliance(ctx, {
      organizationId: membership.organizationId,
      projectId: args.propertyId,
      adLicenseNumber: args.data.adLicenseNumber,
      registrationStatus: asRegistrationStatus(args.data.registrationStatus),
      privateNotes: args.data.privatePermitSummary.trim() || undefined,
      now,
    });
    return { ok: true };
  },
});

export const setWorkspacePropertyPublicationState = mutation({
  args: {
    propertyId: v.id("projects"),
    publicationState: publicationStateValidator,
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to publish projects.");
    }
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      throw new Error("Project not found.");
    }
    if (args.publicationState === "published") {
      const listingId = await publishProject(ctx, row);
      return { ok: true, listingId };
    }
    const now = Date.now();
    if (row.publishedListingId) {
      await ctx.db.patch(row.publishedListingId, {
        status: args.publicationState === "archived" ? "archived" : "paused",
        updatedAt: now,
      });
    }
    await ctx.db.patch(args.propertyId, {
      publicationState: args.publicationState,
      status: args.publicationState,
      updatedAt: now,
    });
    return { ok: true };
  },
});

export const deleteWorkspaceProperty = mutation({
  args: { propertyId: v.id("projects") },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    if (!canManageInventory(membership.role)) {
      throw new Error("You do not have permission to delete projects.");
    }
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      throw new Error("Project not found.");
    }
    if (row.publishedListingId) {
      await ctx.db.patch(row.publishedListingId, { status: "archived", updatedAt: Date.now() });
    }
    await ctx.db.patch(args.propertyId, { publicationState: "archived", status: "archived", updatedAt: Date.now() });
    return { ok: true };
  },
});
