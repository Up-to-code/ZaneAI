import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ensureProfile } from "./auth/profile";
import { requireAuthUser } from "./auth/requireAuth";
import { mapWorkspacePropertyDocToProject } from "./partnerWorkspace/lib";

async function getProfileByAuthUserId(ctx: any, authUserId: string) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_authUserId", (q: any) => q.eq("authUserId", authUserId))
    .unique();
}

async function getCurrentMembership(ctx: any, profileId: any) {
  const memberships = await ctx.db
    .query("organizationMembers")
    .withIndex("by_profileId", (q: any) => q.eq("profileId", profileId))
    .collect();
  return memberships.find((membership: any) => membership.isDefault) ?? memberships[0] ?? null;
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
    throw new Error("Create or join an organization before managing properties.");
  }
  return { authUser, profile, membership };
}

function toPriceLabel(rawPrice: string) {
  const parsed = Number(rawPrice.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return rawPrice.trim();
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(parsed);
}

export const listWorkspaceProperties = query({
  args: {},
  handler: async (ctx) => {
    const { profile, membership } = await requireWorkspaceContext(ctx);
    void profile;
    const rows = await ctx.db
      .query("workspaceProperties")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", membership.organizationId))
      .collect();
    return rows
      .sort((left, right) => right.updatedAt - left.updatedAt)
      .map((row) => mapWorkspacePropertyDocToProject(row));
  },
});

export const getWorkspaceProperty = query({
  args: {
    propertyId: v.id("workspaceProperties"),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      return null;
    }
    return mapWorkspacePropertyDocToProject(row);
  },
});

export const createWorkspaceProperty = mutation({
  args: {
    name: v.string(),
    price: v.string(),
    location: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    amenitiesText: v.string(),
    hasParking: v.boolean(),
    parkingSpaces: v.string(),
    coverImageKey: v.optional(v.union(v.string(), v.null())),
    galleryDisplayMode: v.union(v.literal("cover"), v.literal("fit")),
    galleryAspectRatio: v.union(v.literal("auto"), v.literal("landscape"), v.literal("square"), v.literal("portrait")),
    privatePermitSummary: v.string(),
    privatePermitFiles: v.array(v.object({
      key: v.string(),
      url: v.string(),
      name: v.string(),
      size: v.optional(v.number()),
      mime: v.optional(v.string()),
    })),
    rooms: v.string(),
    baths: v.string(),
    area: v.string(),
    status: v.string(),
    expectedUnits: v.optional(v.string()),
    clientVisibility: v.union(v.literal("private"), v.literal("public")),
    images: v.array(v.object({
      key: v.string(),
      url: v.string(),
      name: v.string(),
      size: v.optional(v.number()),
      mime: v.optional(v.string()),
    })),
    video: v.optional(v.union(v.string(), v.null())),
    brokerId: v.optional(v.union(v.string(), v.null())),
    // ── Egyptian Unit Fields ──
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
    nearbyPlaces: v.optional(v.array(v.object({
      name: v.string(),
      distance: v.string(),
    }))),
    adLicenseNumber: v.optional(v.string()),
    registrationStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile, membership } = await requireWorkspaceContext(ctx);
    const now = Date.now();
    
    // Publication Logic: Force draft if ad license is missing
    const canPublish = args.adLicenseNumber && args.adLicenseNumber.trim().length > 0;
    const initialPublicationState = canPublish ? "published" : "draft";

    const propertyId = await ctx.db.insert("workspaceProperties", {
      organizationId: membership.organizationId,
      createdByProfileId: profile._id,
      title: args.name.trim(),
      location: args.location.trim(),
      priceLabel: toPriceLabel(args.price),
      summary: args.description.trim(),
      shortDescription: args.shortDescription.trim(),
      image: args.images[0]?.url ?? "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      galleryImages: args.images,
      gallery: {
        coverImageKey: args.coverImageKey ?? args.images[0]?.key ?? null,
        displayMode: args.galleryDisplayMode,
        aspectRatio: args.galleryAspectRatio,
      },
      amenities: args.amenitiesText
        .split(/\n|,/)
        .map((entry) => entry.trim())
        .filter(Boolean),
      parking: {
        hasParking: args.hasParking,
        spaces: args.hasParking ? Number(args.parkingSpaces || "0") || null : null,
        label: args.hasParking ? `${args.parkingSpaces || "1"} parking spaces` : "No parking",
      },
      permit: {
        statusLabel: args.privatePermitFiles.length > 0 ? "Internal pack ready" : "No permit uploaded",
        privateSummary: args.privatePermitSummary.trim() || null,
        privateFiles: args.privatePermitFiles,
        visibility: args.privatePermitFiles.length > 0 ? "conversation_only" : "hidden",
        canShowPrivatePanel: args.privatePermitFiles.length > 0 || Boolean(args.privatePermitSummary.trim()),
      },
      specs: {
        rooms: args.rooms,
        baths: args.baths,
        area: args.area,
        status: args.status,
        unitType: args.unitType as any,
        listingType: args.listingType as any,
        finishingLevel: args.finishingLevel as any,
        floor: args.floor,
      },
      payment: args.payment,
      nearbyPlaces: args.nearbyPlaces,
      adLicenseNumber: args.adLicenseNumber,
      registrationStatus: args.registrationStatus as any,
      expectedUnits: args.expectedUnits ? Number(args.expectedUnits) : undefined,
      publicationState: initialPublicationState as any,
      accessMode: "owner",
      canEdit: true,
      visibility: {
        clientVisibility: args.clientVisibility,
        viewers: [],
      },
      assets: [],
      units: [],
      brokers: [],
      createdAt: now,
      updatedAt: now,
    });
    return { propertyId };
  },
});

export const updateWorkspaceProperty = mutation({
  args: {
    propertyId: v.id("workspaceProperties"),
    data: v.object({
      name: v.string(),
      price: v.string(),
      location: v.string(),
      description: v.string(),
      shortDescription: v.string(),
      amenitiesText: v.string(),
      hasParking: v.boolean(),
      parkingSpaces: v.string(),
      coverImageKey: v.optional(v.union(v.string(), v.null())),
      galleryDisplayMode: v.union(v.literal("cover"), v.literal("fit")),
      galleryAspectRatio: v.union(v.literal("auto"), v.literal("landscape"), v.literal("square"), v.literal("portrait")),
      privatePermitSummary: v.string(),
      privatePermitFiles: v.array(v.object({
        key: v.string(),
        url: v.string(),
        name: v.string(),
        size: v.optional(v.number()),
        mime: v.optional(v.string()),
      })),
      rooms: v.string(),
      baths: v.string(),
      area: v.string(),
      status: v.string(),
      expectedUnits: v.optional(v.string()),
      clientVisibility: v.union(v.literal("private"), v.literal("public")),
      images: v.array(v.object({
        key: v.string(),
        url: v.string(),
        name: v.string(),
        size: v.optional(v.number()),
        mime: v.optional(v.string()),
      })),
      video: v.optional(v.union(v.string(), v.null())),
      brokerId: v.optional(v.union(v.string(), v.null())),
      // ── Egyptian Unit Fields ──
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
      nearbyPlaces: v.optional(v.array(v.object({
        name: v.string(),
        distance: v.string(),
      }))),
      adLicenseNumber: v.optional(v.string()),
      registrationStatus: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      throw new Error("Property not found.");
    }

    // Enforce publication rule on update
    let nextPublicationState = row.publicationState;
    const hasLicense = args.data.adLicenseNumber && args.data.adLicenseNumber.trim().length > 0;
    if (!hasLicense && row.publicationState === "published") {
      nextPublicationState = "draft";
    }

    await ctx.db.patch(args.propertyId, {
      title: args.data.name.trim(),
      location: args.data.location.trim(),
      priceLabel: toPriceLabel(args.data.price),
      summary: args.data.description.trim(),
      shortDescription: args.data.shortDescription.trim(),
      image: args.data.images[0]?.url ?? row.image,
      galleryImages: args.data.images,
      gallery: {
        coverImageKey: args.data.coverImageKey ?? args.data.images[0]?.key ?? null,
        displayMode: args.data.galleryDisplayMode,
        aspectRatio: args.data.galleryAspectRatio,
      },
      amenities: args.data.amenitiesText
        .split(/\n|,/)
        .map((entry) => entry.trim())
        .filter(Boolean),
      parking: {
        hasParking: args.data.hasParking,
        spaces: args.data.hasParking ? Number(args.data.parkingSpaces || "0") || null : null,
        label: args.data.hasParking ? `${args.data.parkingSpaces || "1"} parking spaces` : "No parking",
      },
      permit: {
        statusLabel: args.data.privatePermitFiles.length > 0 ? "Internal pack ready" : "No permit uploaded",
        privateSummary: args.data.privatePermitSummary.trim() || null,
        privateFiles: args.data.privatePermitFiles,
        visibility: args.data.privatePermitFiles.length > 0 ? "conversation_only" : "hidden",
        canShowPrivatePanel: args.data.privatePermitFiles.length > 0 || Boolean(args.data.privatePermitSummary.trim()),
      },
      specs: {
        rooms: args.data.rooms,
        baths: args.data.baths,
        area: args.data.area,
        status: args.data.status,
        unitType: args.data.unitType as any,
        listingType: args.data.listingType as any,
        finishingLevel: args.data.finishingLevel as any,
        floor: args.data.floor,
      },
      payment: args.data.payment,
      nearbyPlaces: args.data.nearbyPlaces,
      adLicenseNumber: args.data.adLicenseNumber,
      registrationStatus: args.data.registrationStatus as any,
      expectedUnits: args.data.expectedUnits ? Number(args.data.expectedUnits) : undefined,
      publicationState: nextPublicationState,
      visibility: {
        clientVisibility: args.data.clientVisibility,
        viewers: row.visibility.viewers,
      },
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

export const setWorkspacePropertyPublicationState = mutation({
  args: {
    propertyId: v.id("workspaceProperties"),
    publicationState: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      throw new Error("Property not found.");
    }
    const now = Date.now();
    await ctx.db.patch(args.propertyId, {
      publicationState: args.publicationState,
      publishedAt: args.publicationState === "published" ? now : undefined,
      updatedAt: now,
    });
    return { ok: true };
  },
});

export const deleteWorkspaceProperty = mutation({
  args: {
    propertyId: v.id("workspaceProperties"),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspaceContext(ctx);
    const row = await ctx.db.get(args.propertyId);
    if (!row || row.organizationId !== membership.organizationId) {
      throw new Error("Property not found.");
    }
    await ctx.db.delete(args.propertyId);
    return { ok: true };
  },
});
