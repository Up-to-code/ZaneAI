import { defineTable } from "convex/server";
import { v } from "convex/values";

const projectStatus = v.union(
  v.literal("draft"),
  v.literal("ready"),
  v.literal("published"),
  v.literal("archived"),
);

const projectType = v.union(
  v.literal("villas"),
  v.literal("apartments"),
  v.literal("land_plots"),
  v.literal("mixed"),
  v.literal("standalone"),
  v.literal("custom"),
);

const unitType = v.union(
  v.literal("apartment"),
  v.literal("villa"),
  v.literal("duplex"),
  v.literal("studio"),
  v.literal("penthouse"),
  v.literal("townhouse"),
  v.literal("chalet"),
  v.literal("commercial"),
);

const listingType = v.union(v.literal("sale"), v.literal("rent"));

const publicationState = v.union(
  v.literal("draft"),
  v.literal("ready"),
  v.literal("published"),
  v.literal("archived"),
);

const availability = v.union(
  v.literal("available"),
  v.literal("reserved"),
  v.literal("sold"),
  v.literal("hidden"),
);

const paymentMethod = v.union(
  v.literal("cash"),
  v.literal("installments"),
  v.literal("cash_or_installments"),
);

const finishingLevel = v.union(
  v.literal("core_shell"),
  v.literal("semi_finished"),
  v.literal("fully_finished"),
  v.literal("extra_super_lux"),
  v.literal("furnished"),
);

const listingStatus = v.union(v.literal("active"), v.literal("paused"), v.literal("archived"));

const rentalPeriod = v.union(v.literal("day"), v.literal("week"), v.literal("month"), v.literal("year"));


const assetKind = v.union(
  v.literal("image"),
  v.literal("video"),
  v.literal("document"),
  v.literal("permit"),
  v.literal("floor_plan"),
);

const assetVisibility = v.union(
  v.literal("public"),
  v.literal("organization"),
  v.literal("conversation_only"),
);

const registrationStatus = v.union(
  v.literal("registered"),
  v.literal("not_registered"),
  v.literal("pending"),
);

const reviewStatus = v.union(
  v.literal("missing"),
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
);

export const realEstateTables = {
  projects: defineTable({
    organizationId: v.id("organizations"),
    createdByProfileId: v.id("profiles"),
    title: v.string(),
    slug: v.string(),
    projectType,
    location: v.string(),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    priceLabel: v.optional(v.string()),
    startingPrice: v.optional(v.string()),
    expectedUnits: v.optional(v.number()),
    developerName: v.optional(v.string()),
    installmentYears: v.optional(v.number()),
    listingType: v.optional(listingType),
    rentalPeriod: v.optional(rentalPeriod),
    status: projectStatus,
    publicationState,
    publishedListingId: v.optional(v.id("listings")),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizationId_and_status", ["organizationId", "status"])
    .index("by_organizationId_and_publicationState", ["organizationId", "publicationState"])
    .index("by_organizationId_and_slug", ["organizationId", "slug"])
    .index("by_createdByProfileId", ["createdByProfileId"]),

  units: defineTable({
    organizationId: v.id("organizations"),
    projectId: v.id("projects"),
    createdByProfileId: v.id("profiles"),
    label: v.string(),
    unitType,
    listingType,
    floor: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    area: v.optional(v.string()),
    areaSqm: v.optional(v.number()),
    price: v.optional(v.number()),
    priceLabel: v.optional(v.string()),
    finishingLevel: v.optional(finishingLevel),
    paymentMethod: v.optional(paymentMethod),
    downPayment: v.optional(v.string()),
    installmentYears: v.optional(v.number()),
    deliveryDate: v.optional(v.string()),
    rentalPeriod: v.optional(rentalPeriod),
    availability,
    publicationState,
    publishedListingId: v.optional(v.id("listings")),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_projectId_and_publicationState", ["projectId", "publicationState"])
    .index("by_projectId_and_availability", ["projectId", "availability"])
    .index("by_organizationId_and_publicationState", ["organizationId", "publicationState"])
    .index("by_organizationId_and_availability", ["organizationId", "availability"]),

  listings: defineTable({
    organizationId: v.id("organizations"),
    projectId: v.optional(v.id("projects")),
    unitId: v.optional(v.id("units")),
    title: v.string(),
    summary: v.string(),
    location: v.string(),
    price: v.optional(v.number()),
    priceLabel: v.string(),
    listingType,
    rentalPeriod: v.optional(rentalPeriod),
    unitType: v.optional(unitType),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    areaSqm: v.optional(v.number()),
    heroAssetId: v.optional(v.id("realEstateAssets")),
    heroUrl: v.string(),
    searchText: v.string(),
    matchScore: v.number(),
    matchReasons: v.array(v.string()),
    aiSummary: v.string(),
    tags: v.array(v.string()),
    status: listingStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.number(),
  })
    .index("by_organizationId_and_status", ["organizationId", "status"])
    .index("by_status", ["status"])
    .index("by_projectId_and_status", ["projectId", "status"])
    .index("by_unitId_and_status", ["unitId", "status"])
    .searchIndex("search_listings", {
      searchField: "searchText",
      filterFields: ["status", "location", "listingType", "unitType"],
    }),

  realEstateAssets: defineTable({
    organizationId: v.id("organizations"),
    projectId: v.optional(v.id("projects")),
    unitId: v.optional(v.id("units")),
    listingId: v.optional(v.id("listings")),
    kind: assetKind,
    storageId: v.optional(v.id("_storage")),
    key: v.optional(v.string()),
    url: v.optional(v.string()),
    name: v.string(),
    size: v.optional(v.number()),
    mime: v.optional(v.string()),
    visibility: assetVisibility,
    sortOrder: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId_and_visibility", ["projectId", "visibility"])
    .index("by_unitId_and_visibility", ["unitId", "visibility"])
    .index("by_listingId_and_visibility", ["listingId", "visibility"])
    .index("by_organizationId_and_visibility", ["organizationId", "visibility"]),

  listingCompliance: defineTable({
    organizationId: v.id("organizations"),
    projectId: v.optional(v.id("projects")),
    unitId: v.optional(v.id("units")),
    adLicenseNumber: v.optional(v.string()),
    registrationStatus: v.optional(registrationStatus),
    reviewStatus,
    privateNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_unitId", ["unitId"])
    .index("by_organizationId_and_reviewStatus", ["organizationId", "reviewStatus"]),
};
