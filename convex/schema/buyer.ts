import { defineTable } from "convex/server";
import { v } from "convex/values";

const intentType = v.union(
  v.literal("contact"),
  v.literal("schedule_visit"),
  v.literal("financing_request"),
  v.literal("offer_interest"),
);

const intentStatus = v.union(
  v.literal("open"),
  v.literal("in_progress"),
  v.literal("closed"),
  v.literal("cancelled"),
);

const handoffStatus = v.union(
  v.literal("draft"),
  v.literal("shared"),
  v.literal("accepted"),
  v.literal("closed"),
);

export const buyerTables = {
  buyerPreferences: defineTable({
    profileId: v.id("profiles"),
    minBudget: v.optional(v.number()),
    maxBudget: v.optional(v.number()),
    locations: v.array(v.string()),
    propertyTypes: v.array(v.string()),
    financingPreferences: v.array(v.string()),
    confidence: v.number(),
    updatedFrom: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_profileId", ["profileId"]),

  savedListings: defineTable({
    profileId: v.id("profiles"),
    listingId: v.id("listings"),
    savedAt: v.number(),
  })
    .index("by_profileId", ["profileId"])
    .index("by_profileId_and_listingId", ["profileId", "listingId"]),

  buyerIntents: defineTable({
    profileId: v.id("profiles"),
    listingId: v.id("listings"),
    organizationId: v.id("organizations"),
    intentType,
    status: intentStatus,
    source: v.optional(v.string()),
    threadId: v.optional(v.string()),
    prompt: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_profileId_and_status", ["profileId", "status"])
    .index("by_organizationId_and_status", ["organizationId", "status"])
    .index("by_listingId", ["listingId"]),

  conversationHandoffs: defineTable({
    profileId: v.id("profiles"),
    organizationId: v.id("organizations"),
    threadId: v.string(),
    listingId: v.optional(v.id("listings")),
    summary: v.string(),
    sharedFields: v.array(v.string()),
    status: handoffStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_profileId_and_status", ["profileId", "status"])
    .index("by_organizationId_and_status", ["organizationId", "status"])
    .index("by_threadId", ["threadId"]),
};
