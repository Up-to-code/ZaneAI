import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, type MutationCtx } from "./_generated/server";
import { buildWorkspaceDevSeedFixtures, DEV_SEED_IDENTIFIERS } from "./devSeed/fixtures";
import { assertDevelopmentEnvironment } from "./devSeed/lib";

type SeedProfileMap = Record<string, Id<"profiles">>;
type SeedOrganizationMap = Record<string, Id<"organizations">>;
type SeedProjectMap = Record<string, Id<"projects">>;
type SeedUnitMap = Record<string, Id<"units">>;
type SeedAssetMap = Record<string, Id<"realEstateAssets">>;
type SeedListingMap = Record<string, Id<"listings">>;

async function listAllIds<T extends { _id: unknown }>(
  iter: AsyncIterable<T>,
  predicate: (row: T) => boolean,
) {
  const ids: T["_id"][] = [];
  for await (const row of iter) {
    if (predicate(row)) {
      ids.push(row._id);
    }
  }
  return ids;
}

async function deleteRows(ctx: MutationCtx, ids: readonly unknown[]) {
  for (const id of ids) {
    await ctx.db.delete(id as never);
  }
}

async function resetWorkspaceSeedData(ctx: MutationCtx) {
  const seedProfiles = await listAllIds(ctx.db.query("profiles"), (row) =>
    DEV_SEED_IDENTIFIERS.authUserIds.includes(row.authUserId as (typeof DEV_SEED_IDENTIFIERS.authUserIds)[number]),
  );
  const seedOrganizations = await listAllIds(ctx.db.query("organizations"), (row) =>
    DEV_SEED_IDENTIFIERS.organizationSlugs.includes(row.slug as (typeof DEV_SEED_IDENTIFIERS.organizationSlugs)[number]),
  );

  const profileIdSet = new Set(seedProfiles.map(String));
  const organizationIdSet = new Set(seedOrganizations.map(String));

  const seedProjects = await listAllIds(ctx.db.query("projects"), (row) =>
    organizationIdSet.has(String(row.organizationId))
      || DEV_SEED_IDENTIFIERS.projectSlugs.includes(row.slug as (typeof DEV_SEED_IDENTIFIERS.projectSlugs)[number]),
  );
  const projectIdSet = new Set(seedProjects.map(String));

  const seedUnits = await listAllIds(ctx.db.query("units"), (row) =>
    organizationIdSet.has(String(row.organizationId))
      || projectIdSet.has(String(row.projectId))
      || DEV_SEED_IDENTIFIERS.unitCodes.includes((row.unitCode ?? "") as (typeof DEV_SEED_IDENTIFIERS.unitCodes)[number]),
  );
  const unitIdSet = new Set(seedUnits.map(String));

  const seedListings = await listAllIds(ctx.db.query("listings"), (row) =>
    organizationIdSet.has(String(row.organizationId))
      || (row.projectId ? projectIdSet.has(String(row.projectId)) : false)
      || (row.unitId ? unitIdSet.has(String(row.unitId)) : false),
  );
  const listingIdSet = new Set(seedListings.map(String));

  const seedAssets = await listAllIds(ctx.db.query("realEstateAssets"), (row) =>
    organizationIdSet.has(String(row.organizationId))
      || (row.projectId ? projectIdSet.has(String(row.projectId)) : false)
      || (row.unitId ? unitIdSet.has(String(row.unitId)) : false)
      || (row.listingId ? listingIdSet.has(String(row.listingId)) : false)
      || (row.key?.startsWith(DEV_SEED_IDENTIFIERS.assetKeyPrefix) ?? false),
  );

  const seedCompliance = await listAllIds(ctx.db.query("listingCompliance"), (row) =>
    organizationIdSet.has(String(row.organizationId))
      || (row.projectId ? projectIdSet.has(String(row.projectId)) : false)
      || (row.unitId ? unitIdSet.has(String(row.unitId)) : false),
  );

  const seedSavedListings = await listAllIds(ctx.db.query("savedListings"), (row) =>
    profileIdSet.has(String(row.profileId)) || listingIdSet.has(String(row.listingId)),
  );
  const seedBuyerPreferences = await listAllIds(ctx.db.query("buyerPreferences"), (row) =>
    profileIdSet.has(String(row.profileId)),
  );
  const seedBuyerIntents = await listAllIds(ctx.db.query("buyerIntents"), (row) =>
    profileIdSet.has(String(row.profileId))
      || organizationIdSet.has(String(row.organizationId))
      || listingIdSet.has(String(row.listingId)),
  );
  const seedConversationHandoffs = await listAllIds(ctx.db.query("conversationHandoffs"), (row) =>
    profileIdSet.has(String(row.profileId))
      || organizationIdSet.has(String(row.organizationId))
      || DEV_SEED_IDENTIFIERS.threadIds.includes(row.threadId as (typeof DEV_SEED_IDENTIFIERS.threadIds)[number])
      || row.threadId.startsWith(DEV_SEED_IDENTIFIERS.threadPrefix),
  );
  const seedAnalyticsEvents = await listAllIds(ctx.db.query("analyticsEvents"), (row) =>
    (row.authUserId ? DEV_SEED_IDENTIFIERS.authUserIds.includes(row.authUserId as (typeof DEV_SEED_IDENTIFIERS.authUserIds)[number]) : false)
      || (row.organizationId ? organizationIdSet.has(String(row.organizationId)) : false)
      || (row.threadId ? row.threadId.startsWith(DEV_SEED_IDENTIFIERS.threadPrefix) : false),
  );
  const seedMembers = await listAllIds(ctx.db.query("organizationMembers"), (row) =>
    organizationIdSet.has(String(row.organizationId)) || profileIdSet.has(String(row.profileId)),
  );
  const seedInvites = await listAllIds(ctx.db.query("organizationInvites"), (row) =>
    organizationIdSet.has(String(row.organizationId)) || profileIdSet.has(String(row.inviterProfileId)),
  );

  await deleteRows(ctx, seedAnalyticsEvents);
  await deleteRows(ctx, seedConversationHandoffs);
  await deleteRows(ctx, seedBuyerIntents);
  await deleteRows(ctx, seedSavedListings);
  await deleteRows(ctx, seedBuyerPreferences);
  await deleteRows(ctx, seedCompliance);
  await deleteRows(ctx, seedAssets);
  await deleteRows(ctx, seedListings);
  await deleteRows(ctx, seedUnits);
  await deleteRows(ctx, seedProjects);
  await deleteRows(ctx, seedInvites);
  await deleteRows(ctx, seedMembers);
  await deleteRows(ctx, seedOrganizations);
  await deleteRows(ctx, seedProfiles);

  return {
    profiles: seedProfiles.length,
    organizations: seedOrganizations.length,
    projects: seedProjects.length,
    units: seedUnits.length,
    listings: seedListings.length,
    assets: seedAssets.length,
    compliance: seedCompliance.length,
    buyerPreferences: seedBuyerPreferences.length,
    buyerIntents: seedBuyerIntents.length,
    conversationHandoffs: seedConversationHandoffs.length,
    analyticsEvents: seedAnalyticsEvents.length,
  };
}

async function seedWorkspaceData(ctx: MutationCtx, baseNow: number) {
  const fixtures = buildWorkspaceDevSeedFixtures(baseNow);
  const profileIds: SeedProfileMap = {};
  const organizationIds: SeedOrganizationMap = {};
  const projectIds: SeedProjectMap = {};
  const unitIds: SeedUnitMap = {};
  const assetIds: SeedAssetMap = {};
  const listingIds: SeedListingMap = {};

  for (const profile of fixtures.profiles) {
    const profileId = await ctx.db.insert("profiles", {
      authUserId: profile.authUserId,
      email: profile.email,
      name: profile.name,
      kind: profile.kind,
      createdAt: baseNow,
      updatedAt: baseNow,
    });
    profileIds[profile.key] = profileId;
  }

  for (const organization of fixtures.organizations) {
    const organizationId = await ctx.db.insert("organizations", {
      name: organization.name,
      slug: organization.slug,
      ownerProfileId: profileIds[organization.ownerProfileKey],
      type: organization.type,
      status: organization.status,
      description: organization.description,
      website: organization.website,
      contactEmail: organization.contactEmail,
      phone: organization.phone,
      defaultKnowledgeScope: organization.defaultKnowledgeScope,
      createdAt: baseNow,
      updatedAt: baseNow,
    });
    organizationIds[organization.key] = organizationId;
  }

  for (const membership of fixtures.memberships) {
    await ctx.db.insert("organizationMembers", {
      organizationId: organizationIds[membership.organizationKey],
      profileId: profileIds[membership.profileKey],
      role: membership.role,
      isDefault: membership.isDefault,
      status: membership.status,
      createdAt: baseNow,
      updatedAt: baseNow,
    });
  }

  for (const profile of fixtures.profiles) {
    const defaultMembership = fixtures.memberships.find((membership) => membership.profileKey === profile.key && membership.isDefault);
    await ctx.db.patch(profileIds[profile.key], {
      primaryOrganizationId: defaultMembership ? organizationIds[defaultMembership.organizationKey] : undefined,
      updatedAt: baseNow,
    });
  }

  for (const project of fixtures.projects) {
    const projectId = await ctx.db.insert("projects", {
      organizationId: organizationIds[project.organizationKey],
      createdByProfileId: profileIds[project.createdByProfileKey],
      title: project.title,
      slug: project.slug,
      projectType: project.projectType,
      location: project.location,
      description: project.description,
      shortDescription: project.shortDescription,
      priceLabel: project.priceLabel,
      startingPrice: project.startingPrice,
      expectedUnits: project.expectedUnits,
      developerName: project.developerName,
      installmentYears: project.installmentYears,
      listingType: project.listingType,
      rentalPeriod: project.rentalPeriod,
      status: project.status,
      publicationState: project.publicationState,
      publishedAt: project.publishedAt,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      compoundName: project.compoundName,
      unitCode: project.unitCode,
      direction: project.direction,
      currency: project.currency,
      maintenanceFees: project.maintenanceFees,
      monthlyInstallment: project.monthlyInstallment,
      reception: project.reception,
      negotiable: project.negotiable,
    });
    projectIds[project.key] = projectId;
  }

  for (const unit of fixtures.units) {
    const unitId = await ctx.db.insert("units", {
      organizationId: organizationIds[unit.organizationKey],
      projectId: projectIds[unit.projectKey],
      createdByProfileId: profileIds[unit.createdByProfileKey],
      label: unit.label,
      unitType: unit.unitType,
      listingType: unit.listingType,
      floor: unit.floor,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      area: unit.area,
      areaSqm: unit.areaSqm,
      price: unit.price,
      priceLabel: unit.priceLabel,
      finishingLevel: unit.finishingLevel,
      paymentMethod: unit.paymentMethod,
      downPayment: unit.downPayment,
      installmentYears: unit.installmentYears,
      deliveryDate: unit.deliveryDate,
      rentalPeriod: unit.rentalPeriod,
      availability: unit.availability,
      publicationState: unit.publicationState,
      description: unit.description,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
      publishedAt: unit.publishedAt,
      compoundName: unit.compoundName,
      unitCode: unit.unitCode,
      direction: unit.direction,
      currency: unit.currency,
      maintenanceFees: unit.maintenanceFees,
      monthlyInstallment: unit.monthlyInstallment,
      reception: unit.reception,
      negotiable: unit.negotiable,
    });
    unitIds[unit.key] = unitId;
  }

  for (const asset of fixtures.assets) {
    const assetId = await ctx.db.insert("realEstateAssets", {
      organizationId: organizationIds[asset.organizationKey],
      projectId: asset.projectKey ? projectIds[asset.projectKey] : undefined,
      unitId: asset.unitKey ? unitIds[asset.unitKey] : undefined,
      listingId: asset.listingKey ? listingIds[asset.listingKey] : undefined,
      kind: asset.kind,
      key: asset.keyName,
      url: asset.url,
      name: asset.name,
      size: asset.size,
      mime: asset.mime,
      visibility: asset.visibility,
      sortOrder: asset.sortOrder,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    });
    assetIds[asset.key] = assetId;
  }

  for (const compliance of fixtures.projectCompliance) {
    await ctx.db.insert("listingCompliance", {
      organizationId: organizationIds[compliance.organizationKey],
      projectId: compliance.projectKey ? projectIds[compliance.projectKey] : undefined,
      unitId: undefined,
      adLicenseNumber: compliance.adLicenseNumber,
      registrationStatus: compliance.registrationStatus,
      reviewStatus: compliance.reviewStatus,
      privateNotes: compliance.privateNotes,
      createdAt: compliance.createdAt,
      updatedAt: compliance.updatedAt,
    });
  }

  for (const compliance of fixtures.unitCompliance) {
    await ctx.db.insert("listingCompliance", {
      organizationId: organizationIds[compliance.organizationKey],
      projectId: compliance.projectKey ? projectIds[compliance.projectKey] : undefined,
      unitId: compliance.unitKey ? unitIds[compliance.unitKey] : undefined,
      adLicenseNumber: compliance.adLicenseNumber,
      registrationStatus: compliance.registrationStatus,
      reviewStatus: compliance.reviewStatus,
      privateNotes: compliance.privateNotes,
      createdAt: compliance.createdAt,
      updatedAt: compliance.updatedAt,
    });
  }

  for (const listing of fixtures.listings) {
    const listingId = await ctx.db.insert("listings", {
      organizationId: organizationIds[listing.organizationKey],
      projectId: listing.projectKey ? projectIds[listing.projectKey] : undefined,
      unitId: listing.unitKey ? unitIds[listing.unitKey] : undefined,
      title: listing.title,
      summary: listing.summary,
      location: listing.location,
      price: listing.price,
      priceLabel: listing.priceLabel,
      listingType: listing.listingType,
      rentalPeriod: listing.rentalPeriod,
      unitType: listing.unitType,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      areaSqm: listing.areaSqm,
      heroAssetId: listing.heroAssetKey ? assetIds[listing.heroAssetKey] : undefined,
      heroUrl: listing.heroAssetKey ? fixtures.assets.find((asset) => asset.key === listing.heroAssetKey)?.url ?? "" : "",
      searchText: listing.searchText,
      matchScore: listing.matchScore,
      matchReasons: listing.matchReasons,
      aiSummary: listing.aiSummary,
      tags: listing.tags,
      status: listing.status,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      publishedAt: listing.publishedAt,
    });
    listingIds[listing.key] = listingId;
  }

  await ctx.db.patch(projectIds.palmHorizon, {
    publishedListingId: listingIds.palmProjectListing,
    publishedAt: fixtures.projects.find((project) => project.key === "palmHorizon")?.publishedAt,
    publicationState: "published",
    status: "published",
  });
  await ctx.db.patch(projectIds.northCoastHouse, {
    publishedListingId: listingIds.northCoastProjectListing,
    publishedAt: fixtures.projects.find((project) => project.key === "northCoastHouse")?.publishedAt,
    publicationState: "published",
    status: "published",
  });
  await ctx.db.patch(unitIds.palmA01, {
    publishedListingId: listingIds.palmUnitListing,
    publishedAt: fixtures.units.find((unit) => unit.key === "palmA01")?.publishedAt,
    publicationState: "published",
  });
  await ctx.db.patch(unitIds.coastVilla, {
    publishedListingId: listingIds.northCoastVillaListing,
    publishedAt: fixtures.units.find((unit) => unit.key === "coastVilla")?.publishedAt,
    publicationState: "published",
  });

  for (const preference of fixtures.buyerPreferences) {
    await ctx.db.insert("buyerPreferences", {
      profileId: profileIds[preference.profileKey],
      minBudget: preference.minBudget,
      maxBudget: preference.maxBudget,
      locations: preference.locations,
      propertyTypes: preference.propertyTypes,
      financingPreferences: preference.financingPreferences,
      confidence: preference.confidence,
      updatedFrom: preference.updatedFrom,
      createdAt: preference.createdAt,
      updatedAt: preference.updatedAt,
    });
  }

  for (const saved of fixtures.savedListings) {
    await ctx.db.insert("savedListings", {
      profileId: profileIds[saved.profileKey],
      listingId: listingIds[saved.listingKey],
      savedAt: saved.savedAt,
    });
  }

  for (const intent of fixtures.buyerIntents) {
    await ctx.db.insert("buyerIntents", {
      profileId: profileIds[intent.profileKey],
      listingId: listingIds[intent.listingKey],
      organizationId: organizationIds[intent.organizationKey],
      intentType: intent.intentType,
      status: intent.status,
      source: intent.source,
      threadId: intent.threadId,
      prompt: intent.prompt,
      createdAt: intent.createdAt,
      updatedAt: intent.updatedAt,
    });
  }

  for (const handoff of fixtures.conversationHandoffs) {
    await ctx.db.insert("conversationHandoffs", {
      profileId: profileIds[handoff.profileKey],
      organizationId: organizationIds[handoff.organizationKey],
      threadId: handoff.threadId,
      listingId: handoff.listingKey ? listingIds[handoff.listingKey] : undefined,
      summary: handoff.summary,
      sharedFields: handoff.sharedFields,
      status: handoff.status,
      createdAt: handoff.createdAt,
      updatedAt: handoff.updatedAt,
    });
  }

  for (const event of fixtures.analyticsEvents) {
    await ctx.db.insert("analyticsEvents", {
      authUserId: event.authUserId,
      organizationId: String(organizationIds[event.organizationKey]),
      sessionId: undefined,
      threadId: event.threadId,
      route: event.route,
      eventName: event.eventName,
      source: event.source,
      payload: event.payloadJson,
      createdAt: event.createdAt,
    });
  }

  return {
    profiles: fixtures.profiles.length,
    organizations: fixtures.organizations.length,
    memberships: fixtures.memberships.length,
    projects: fixtures.projects.length,
    units: fixtures.units.length,
    assets: fixtures.assets.length,
    listings: fixtures.listings.length,
    buyerPreferences: fixtures.buyerPreferences.length,
    savedListings: fixtures.savedListings.length,
    buyerIntents: fixtures.buyerIntents.length,
    conversationHandoffs: fixtures.conversationHandoffs.length,
    analyticsEvents: fixtures.analyticsEvents.length,
  };
}

/**
 * WHY:   Local workspace QA needs a realistic linked Convex dataset without mutating normal onboarding flows.
 * WHAT:  Recreates a development-only seed dataset for developer, broker, buyer, inventory, matching, and handoff testing.
 * HOW:   Deletes only the prior seed namespace, then inserts a deterministic fixture graph with stable slugs, auth ids, asset keys, and thread ids.
 */
export const seedWorkspaceDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    assertDevelopmentEnvironment();
    const baseNow = Date.now();
    const resetCounts = await resetWorkspaceSeedData(ctx);
    const seedCounts = await seedWorkspaceData(ctx, baseNow);

    return {
      ok: true,
      mode: "reseed",
      resetCounts,
      seedCounts,
      namespace: DEV_SEED_IDENTIFIERS.threadPrefix.replace(/\/thread\/$/, ""),
    };
  },
});

/**
 * WHY:   Repeatable local QA sometimes needs a clean slate without immediately recreating the demo dataset.
 * WHAT:  Removes only rows owned by the development seed namespace.
 * HOW:   Matches stable seed slugs, auth ids, asset key prefixes, and thread ids before deleting linked rows in dependency-safe order.
 */
export const resetWorkspaceDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    assertDevelopmentEnvironment();
    const resetCounts = await resetWorkspaceSeedData(ctx);
    return { ok: true, resetCounts };
  },
});
