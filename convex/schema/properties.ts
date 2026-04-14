import { defineTable } from "convex/server";
import { v } from "convex/values";

const amenityValidator = v.object({
  id: v.string(),
  label: v.string(),
  iconName: v.string(),
  category: v.optional(v.string()),
});

const brokerValidator = v.object({
  id: v.string(),
  name: v.string(),
  agency: v.string(),
  avatarUrl: v.string(),
  rating: v.number(),
  activeListingsCount: v.number(),
  phone: v.string(),
  description: v.string(),
});

const priceAnalysisValidator = v.object({
  propertyAskPrice: v.number(),
  areaAveragePrice: v.number(),
  historicalData: v.array(v.object({
    month: v.string(),
    value: v.number(),
  })),
});

export const propertyTables = {
  properties: defineTable({
    externalId: v.string(),
    sourceId: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
    title: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    priceLabel: v.string(),
    location: v.string(),
    beds: v.number(),
    baths: v.number(),
    area: v.number(),
    heroUrl: v.string(),
    matchScore: v.number(),
    matchReasons: v.array(v.string()),
    aiSummary: v.string(),
    tags: v.array(v.string()),
    amenities: v.optional(v.array(amenityValidator)),
    broker: v.optional(brokerValidator),
    priceAnalysis: v.optional(priceAnalysisValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_location", ["location"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["location"],
    }),
  savedProperties: defineTable({
    authUserId: v.string(),
    propertyExternalId: v.string(),
    savedAt: v.number(),
  })
    .index("by_authUserId", ["authUserId"])
    .index("by_authUserId_and_propertyExternalId", ["authUserId", "propertyExternalId"]),
};
