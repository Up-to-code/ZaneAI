import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireProfile } from "./core/lib";

const intentTypeValidator = v.union(
  v.literal("contact"),
  v.literal("schedule_visit"),
  v.literal("financing_request"),
  v.literal("offer_interest"),
);

const preferencePatchValidator = v.object({
  minBudget: v.optional(v.number()),
  maxBudget: v.optional(v.number()),
  locations: v.optional(v.array(v.string())),
  propertyTypes: v.optional(v.array(v.string())),
  financingPreferences: v.optional(v.array(v.string())),
  confidence: v.optional(v.number()),
  updatedFrom: v.string(),
});

function normalizeStringList(values: string[] | undefined) {
  return values
    ?.map((value) => value.trim())
    .filter((value, index, list) => value.length > 0 && list.indexOf(value) === index);
}

function clampConfidence(value: number | undefined, fallback: number) {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, Math.min(1, value));
}

export const getBuyerPreferences = query({
  args: {},
  handler: async (ctx) => {
    const { profile } = await requireProfile(ctx);
    return await ctx.db
      .query("buyerPreferences")
      .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
      .unique();
  },
});

export const updateBuyerPreferences = mutation({
  args: { patch: preferencePatchValidator },
  handler: async (ctx, args) => {
    const { profile } = await requireProfile(ctx);
    const existing = await ctx.db
      .query("buyerPreferences")
      .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
      .unique();
    const now = Date.now();
    const next = {
      profileId: profile._id,
      minBudget: args.patch.minBudget ?? existing?.minBudget,
      maxBudget: args.patch.maxBudget ?? existing?.maxBudget,
      locations: normalizeStringList(args.patch.locations) ?? existing?.locations ?? [],
      propertyTypes: normalizeStringList(args.patch.propertyTypes) ?? existing?.propertyTypes ?? [],
      financingPreferences:
        normalizeStringList(args.patch.financingPreferences) ?? existing?.financingPreferences ?? [],
      confidence: clampConfidence(args.patch.confidence, existing?.confidence ?? 0.55),
      updatedFrom: args.patch.updatedFrom.trim() || "mobile",
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, next);
      return { preferenceId: existing._id };
    }

    const preferenceId = await ctx.db.insert("buyerPreferences", {
      ...next,
      createdAt: now,
    });
    return { preferenceId };
  },
});

export const createBuyerIntent = mutation({
  args: {
    listingId: v.string(),
    intentType: intentTypeValidator,
    source: v.optional(v.string()),
    threadId: v.optional(v.string()),
    prompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { authUser, profile } = await requireProfile(ctx);
    const listingId = args.listingId as Id<"listings">;
    const listing = await ctx.db.get(listingId);

    if (!listing || listing.status !== "active") {
      throw new Error("Listing not found.");
    }

    const existing = (
      await ctx.db
        .query("buyerIntents")
        .withIndex("by_listingId", (q) => q.eq("listingId", listingId))
        .take(50)
    ).find(
      (intent) =>
        intent.profileId === profile._id &&
        intent.intentType === args.intentType &&
        intent.status === "open",
    );
    const now = Date.now();
    const patch = {
      organizationId: listing.organizationId,
      source: args.source?.trim() || undefined,
      threadId: args.threadId?.trim() || undefined,
      prompt: args.prompt?.trim() || undefined,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return { intentId: existing._id, status: "open" as const };
    }

    const intentId = await ctx.db.insert("buyerIntents", {
      profileId: profile._id,
      listingId,
      intentType: args.intentType,
      status: "open",
      createdAt: now,
      ...patch,
    });

    await ctx.db.insert("analyticsEvents", {
      authUserId: authUser._id,
      organizationId: listing.organizationId,
      sessionId: undefined,
      threadId: args.threadId,
      route: "buyer_intent",
      eventName: args.intentType === "schedule_visit" ? "schedule_visit" : "contact_agent",
      source: args.source ?? "mobile",
      payload: JSON.stringify({
        listingId,
        intentType: args.intentType,
      }),
      createdAt: now,
    });

    return { intentId, status: "open" as const };
  },
});
