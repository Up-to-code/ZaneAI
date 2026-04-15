import { defineTable } from "convex/server";
import { v } from "convex/values";

const uploadedFileReference = v.object({
  key: v.string(),
  url: v.string(),
  name: v.string(),
  size: v.optional(v.number()),
  mime: v.optional(v.string()),
});

const propertyViewerSummary = v.object({
  authUserId: v.string(),
  name: v.string(),
  email: v.optional(v.union(v.string(), v.null())),
  accessSource: v.union(v.literal("manual"), v.literal("chat_share")),
  createdAt: v.number(),
  updatedAt: v.number(),
});

const brokerPresence = v.object({
  id: v.string(),
  name: v.string(),
  title: v.string(),
  clientName: v.optional(v.string()),
  summary: v.optional(v.string()),
});

const unitReference = v.object({
  id: v.string(),
  label: v.string(),
  bedrooms: v.optional(v.number()),
  bathrooms: v.optional(v.number()),
  area: v.optional(v.string()),
  priceLabel: v.optional(v.string()),
});

export const workspacePropertyTables = {
  workspaceProperties: defineTable({
    organizationId: v.id("organizations"),
    createdByProfileId: v.id("profiles"),
    title: v.string(),
    location: v.string(),
    priceLabel: v.string(),
    summary: v.string(),
    shortDescription: v.string(),
    image: v.string(),
    galleryImages: v.array(uploadedFileReference),
    gallery: v.object({
      coverImageKey: v.optional(v.union(v.string(), v.null())),
      displayMode: v.union(v.literal("cover"), v.literal("fit")),
      aspectRatio: v.union(v.literal("auto"), v.literal("landscape"), v.literal("square"), v.literal("portrait")),
    }),
    amenities: v.array(v.string()),
    parking: v.object({
      hasParking: v.boolean(),
      spaces: v.optional(v.union(v.number(), v.null())),
      label: v.string(),
    }),
    permit: v.object({
      statusLabel: v.string(),
      privateSummary: v.optional(v.union(v.string(), v.null())),
      privateFiles: v.array(uploadedFileReference),
      visibility: v.union(v.literal("conversation_only"), v.literal("hidden")),
      canShowPrivatePanel: v.boolean(),
    }),
    specs: v.object({
      rooms: v.string(),
      baths: v.string(),
      area: v.string(),
      status: v.string(),
      // ── New Egyptian Unit Specs ──
      unitType: v.optional(v.union(
        v.literal("apartment"), v.literal("villa"), v.literal("duplex"), 
        v.literal("studio"), v.literal("penthouse"), v.literal("townhouse"), 
        v.literal("chalet"), v.literal("commercial")
      )),
      listingType: v.optional(v.union(v.literal("sale"), v.literal("rent"))),
      finishingLevel: v.optional(v.union(
        v.literal("core_shell"), v.literal("semi_finished"), v.literal("fully_finished"), 
        v.literal("extra_super_lux"), v.literal("furnished")
      )),
      floor: v.optional(v.string()),
    }),
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
    registrationStatus: v.optional(v.union(v.literal("registered"), v.literal("not_registered"), v.literal("pending"))),
    expectedUnits: v.optional(v.number()),
    projectType: v.optional(
      v.union(
        v.literal("villas"),
        v.literal("apartments"),
        v.literal("land_plots"),
        v.literal("mixed"),
        v.literal("custom"),
      ),
    ),
    developerName: v.optional(v.string()),
    startingPrice: v.optional(v.string()),
    installmentYears: v.optional(v.number()),
    compoundAmenities: v.optional(v.array(v.string())),
    masterPlanImageKey: v.optional(v.string()),
    publicationState: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    accessMode: v.union(v.literal("owner"), v.literal("shared")),
    canEdit: v.boolean(),
    visibility: v.object({
      clientVisibility: v.union(v.literal("private"), v.literal("public")),
      viewers: v.array(propertyViewerSummary),
    }),
    assets: v.array(v.any()),
    units: v.array(unitReference),
    brokers: v.array(brokerPresence),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_createdByProfileId", ["createdByProfileId"])
    .index("by_organizationId_and_publicationState", ["organizationId", "publicationState"]),
};
