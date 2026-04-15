import { defineTable } from "convex/server";
import { v } from "convex/values";

export const workspaceUnitTables = {
  workspaceUnits: defineTable({
    organizationId: v.id("organizations"),
    projectId: v.optional(v.id("workspaceProperties")),
    createdByProfileId: v.id("profiles"),
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
    // ── Physical Specs ──
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
    // ── Egyptian Market Fields ──
    finishingLevel: v.optional(v.union(
      v.literal("core_shell"),
      v.literal("semi_finished"),
      v.literal("fully_finished"),
      v.literal("extra_super_lux"),
      v.literal("furnished"),
    )),
    paymentMethod: v.optional(v.union(
      v.literal("cash"),
      v.literal("installments"),
      v.literal("cash_or_installments"),
    )),
    downPayment: v.optional(v.string()),
    installmentYears: v.optional(v.number()),
    deliveryDate: v.optional(v.string()),
    // ── Amenities & Features ──
    parking: v.optional(v.number()),
    unitAmenities: v.optional(v.array(v.string())),
    nearbyPlaces: v.optional(v.array(v.string())),
    // ── Legal ──
    adLicenseNumber: v.optional(v.string()),
    registrationStatus: v.optional(v.union(
      v.literal("registered"),
      v.literal("not_registered"),
      v.literal("pending"),
    )),
    // ── Media ──
    galleryImages: v.optional(v.array(v.string())),
    // ── Timestamps ──
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_organizationId", ["organizationId"])
    .index("by_projectId_and_status", ["projectId", "status"]),
};
