import type { Doc } from "../_generated/dataModel";
import { buildSearchText } from "../partnerWorkspace/lib";
import { DEV_SEED_ASSET_KEY_PREFIX, DEV_SEED_THREAD_PREFIX } from "./lib";

type ProfileKind = NonNullable<Doc<"profiles">["kind"]>;
type OrganizationType = Doc<"organizations">["type"];
type OrganizationStatus = Doc<"organizations">["status"];
type MembershipRole = Doc<"organizationMembers">["role"];
type ProjectType = Doc<"projects">["projectType"];
type ProjectStatus = Doc<"projects">["status"];
type PublicationState = Doc<"projects">["publicationState"];
type ListingType = NonNullable<Doc<"listings">["listingType"]>;
type RentalPeriod = NonNullable<Doc<"projects">["rentalPeriod"]>;
type UnitType = Doc<"units">["unitType"];
type Availability = Doc<"units">["availability"];
type FinishingLevel = NonNullable<Doc<"units">["finishingLevel"]>;
type PaymentMethod = NonNullable<Doc<"units">["paymentMethod"]>;
type AssetKind = Doc<"realEstateAssets">["kind"];
type AssetVisibility = Doc<"realEstateAssets">["visibility"];
type ReviewStatus = Doc<"listingCompliance">["reviewStatus"];
type RegistrationStatus = NonNullable<Doc<"listingCompliance">["registrationStatus"]>;
type ListingStatus = Doc<"listings">["status"];
type IntentType = Doc<"buyerIntents">["intentType"];
type IntentStatus = Doc<"buyerIntents">["status"];
type HandoffStatus = Doc<"conversationHandoffs">["status"];

export type SeedProfileKey =
  | "developerOwner"
  | "developerManager"
  | "brokerOwner"
  | "brokerAgent"
  | "buyerLead";
export type SeedOrganizationKey = "developerOrg" | "brokerOrg";
export type SeedProjectKey =
  | "palmHorizon"
  | "cedarBusinessPark"
  | "northCoastHouse"
  | "zayedVilla";
export type SeedUnitKey =
  | "palmA01"
  | "palmB07"
  | "palmP02"
  | "coastVilla";
export type SeedAssetKey =
  | "palmHero"
  | "palmGallery"
  | "palmPermit"
  | "cedarHero"
  | "cedarPrivateDoc"
  | "coastHero"
  | "coastPermit"
  | "palmUnitHero"
  | "palmDuplexHero"
  | "coastVillaHero";
export type SeedListingKey =
  | "palmProjectListing"
  | "palmUnitListing"
  | "sheikhZayedCompoundListing"
  | "maadiVillaListing"
  | "newCapitalInvestmentListing"
  | "octoberFamilyListing"
  | "northCoastProjectListing"
  | "northCoastVillaListing";

type SeedProfileFixture = {
  key: SeedProfileKey;
  authUserId: string;
  email: string;
  name: string;
  kind: ProfileKind;
};

type SeedOrganizationFixture = {
  key: SeedOrganizationKey;
  slug: string;
  name: string;
  ownerProfileKey: SeedProfileKey;
  type: OrganizationType;
  status: OrganizationStatus;
  description: string;
  website: string;
  contactEmail: string;
  phone: string;
  defaultKnowledgeScope: string;
};

type SeedMembershipFixture = {
  organizationKey: SeedOrganizationKey;
  profileKey: SeedProfileKey;
  role: MembershipRole;
  isDefault: boolean;
  status: Doc<"organizationMembers">["status"];
};

type SeedProjectFixture = {
  key: SeedProjectKey;
  organizationKey: SeedOrganizationKey;
  createdByProfileKey: SeedProfileKey;
  slug: string;
  title: string;
  projectType: ProjectType;
  location: string;
  description: string;
  shortDescription?: string;
  priceLabel?: string;
  startingPrice?: string;
  expectedUnits?: number;
  developerName?: string;
  installmentYears?: number;
  listingType?: ListingType;
  rentalPeriod?: RentalPeriod;
  status: ProjectStatus;
  publicationState: PublicationState;
  compoundName?: string;
  unitCode?: string;
  direction?: string;
  currency?: "EGP" | "USD";
  maintenanceFees?: string;
  monthlyInstallment?: string;
  reception?: number;
  negotiable?: boolean;
  createdOffsetDays: number;
  updatedOffsetDays: number;
  publishedOffsetDays?: number;
};

type SeedUnitFixture = {
  key: SeedUnitKey;
  organizationKey: SeedOrganizationKey;
  projectKey: SeedProjectKey;
  createdByProfileKey: SeedProfileKey;
  label: string;
  unitType: UnitType;
  listingType: ListingType;
  floor?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  areaSqm?: number;
  price?: number;
  priceLabel?: string;
  finishingLevel?: FinishingLevel;
  paymentMethod?: PaymentMethod;
  downPayment?: string;
  installmentYears?: number;
  deliveryDate?: string;
  rentalPeriod?: RentalPeriod;
  availability: Availability;
  publicationState: PublicationState;
  description?: string;
  compoundName?: string;
  unitCode?: string;
  direction?: string;
  currency?: "EGP" | "USD";
  maintenanceFees?: string;
  monthlyInstallment?: string;
  reception?: number;
  negotiable?: boolean;
  createdOffsetDays: number;
  updatedOffsetDays: number;
  publishedOffsetDays?: number;
};

type SeedAssetFixture = {
  key: SeedAssetKey;
  organizationKey: SeedOrganizationKey;
  projectKey?: SeedProjectKey;
  unitKey?: SeedUnitKey;
  listingKey?: SeedListingKey;
  kind: AssetKind;
  visibility: AssetVisibility;
  name: string;
  url: string;
  mime: string;
  size: number;
  sortOrder: number;
  createdOffsetDays: number;
  updatedOffsetDays: number;
};

type SeedComplianceFixture = {
  organizationKey: SeedOrganizationKey;
  projectKey?: SeedProjectKey;
  unitKey?: SeedUnitKey;
  adLicenseNumber?: string;
  registrationStatus?: RegistrationStatus;
  reviewStatus: ReviewStatus;
  privateNotes?: string;
  createdOffsetDays: number;
  updatedOffsetDays: number;
};

type SeedListingFixture = {
  key: SeedListingKey;
  organizationKey: SeedOrganizationKey;
  projectKey?: SeedProjectKey;
  unitKey?: SeedUnitKey;
  heroAssetKey?: SeedAssetKey;
  title: string;
  summary: string;
  location: string;
  price?: number;
  priceLabel: string;
  listingType: ListingType;
  rentalPeriod?: RentalPeriod;
  unitType?: UnitType;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  searchParts: string[];
  matchScore: number;
  matchReasons: string[];
  aiSummary: string;
  tags: string[];
  status: ListingStatus;
  createdOffsetDays: number;
  updatedOffsetDays: number;
  publishedOffsetDays: number;
};

type SeedBuyerPreferenceFixture = {
  profileKey: SeedProfileKey;
  minBudget?: number;
  maxBudget?: number;
  locations: string[];
  propertyTypes: string[];
  financingPreferences: string[];
  confidence: number;
  updatedFrom: string;
  createdOffsetDays: number;
  updatedOffsetDays: number;
};

type SeedSavedListingFixture = {
  profileKey: SeedProfileKey;
  listingKey: SeedListingKey;
  savedOffsetDays: number;
};

type SeedBuyerIntentFixture = {
  profileKey: SeedProfileKey;
  listingKey: SeedListingKey;
  organizationKey: SeedOrganizationKey;
  intentType: IntentType;
  status: IntentStatus;
  source?: string;
  threadId?: string;
  prompt?: string;
  createdOffsetDays: number;
  updatedOffsetDays: number;
};

type SeedConversationHandoffFixture = {
  profileKey: SeedProfileKey;
  organizationKey: SeedOrganizationKey;
  listingKey?: SeedListingKey;
  threadId: string;
  summary: string;
  sharedFields: string[];
  status: HandoffStatus;
  createdOffsetDays: number;
  updatedOffsetDays: number;
};

type SeedAnalyticsEventFixture = {
  authUserId: string;
  organizationKey: SeedOrganizationKey;
  threadId?: string;
  route?: string;
  eventName: string;
  source?: string;
  payload: Record<string, unknown>;
  createdOffsetDays: number;
};

function atDay(baseNow: number, offsetDays: number) {
  return baseNow - offsetDays * 24 * 60 * 60 * 1000;
}

function assetKey(suffix: string) {
  return `${DEV_SEED_ASSET_KEY_PREFIX}${suffix}`;
}

function threadId(suffix: string) {
  return `${DEV_SEED_THREAD_PREFIX}${suffix}`;
}

export const DEV_SEED_IDENTIFIERS = {
  authUserIds: [
    "dev-seed-developer-owner",
    "dev-seed-developer-manager",
    "dev-seed-broker-owner",
    "dev-seed-broker-agent",
    "dev-seed-buyer-lead",
  ],
  profileEmails: [
    "developer.owner@seed.zayon.ai",
    "developer.manager@seed.zayon.ai",
    "broker.owner@seed.zayon.ai",
    "broker.agent@seed.zayon.ai",
    "buyer.lead@seed.zayon.ai",
  ],
  organizationSlugs: [
    "dev-seed-atlas-developments",
    "dev-seed-harbor-bridge-realty",
  ],
  projectSlugs: [
    "dev-seed-palm-horizon-residences",
    "dev-seed-cedar-business-park",
    "dev-seed-north-coast-beach-house",
    "dev-seed-zayed-family-villa-exclusive",
  ],
  unitCodes: [
    "seed-palm-a01",
    "seed-palm-b07",
    "seed-palm-p02",
    "seed-coast-v1",
  ],
  assetKeyPrefix: DEV_SEED_ASSET_KEY_PREFIX,
  threadPrefix: DEV_SEED_THREAD_PREFIX,
  threadIds: [
    threadId("palm-handoff"),
    threadId("coast-handoff"),
  ],
} as const;

export function buildWorkspaceDevSeedFixtures(baseNow: number) {
  const profiles: SeedProfileFixture[] = [
    {
      key: "developerOwner",
      authUserId: "dev-seed-developer-owner",
      email: "developer.owner@seed.zayon.ai",
      name: "Atlas Dev Owner",
      kind: "professional",
    },
    {
      key: "developerManager",
      authUserId: "dev-seed-developer-manager",
      email: "developer.manager@seed.zayon.ai",
      name: "Mariam Delivery",
      kind: "professional",
    },
    {
      key: "brokerOwner",
      authUserId: "dev-seed-broker-owner",
      email: "broker.owner@seed.zayon.ai",
      name: "Harbor Broker Owner",
      kind: "professional",
    },
    {
      key: "brokerAgent",
      authUserId: "dev-seed-broker-agent",
      email: "broker.agent@seed.zayon.ai",
      name: "Youssef Leasing",
      kind: "professional",
    },
    {
      key: "buyerLead",
      authUserId: "dev-seed-buyer-lead",
      email: "buyer.lead@seed.zayon.ai",
      name: "Nour Buyer",
      kind: "buyer",
    },
  ];

  const organizations: SeedOrganizationFixture[] = [
    {
      key: "developerOrg",
      slug: "dev-seed-atlas-developments",
      name: "Atlas Developments Seed",
      ownerProfileKey: "developerOwner",
      type: "developer",
      status: "active",
      description: "Development-only workspace fixture for realistic developer inventory testing.",
      website: "https://atlas.seed.zayon.ai",
      contactEmail: "developer.owner@seed.zayon.ai",
      phone: "+20 101 000 1000",
      defaultKnowledgeScope: "workspace",
    },
    {
      key: "brokerOrg",
      slug: "dev-seed-harbor-bridge-realty",
      name: "Harbor Bridge Realty Seed",
      ownerProfileKey: "brokerOwner",
      type: "brokerage",
      status: "active",
      description: "Development-only workspace fixture for realistic broker inventory and handoff testing.",
      website: "https://harbor.seed.zayon.ai",
      contactEmail: "broker.owner@seed.zayon.ai",
      phone: "+20 102 000 2000",
      defaultKnowledgeScope: "workspace",
    },
  ];

  const memberships: SeedMembershipFixture[] = [
    { organizationKey: "developerOrg", profileKey: "developerOwner", role: "owner", isDefault: true, status: "active" },
    { organizationKey: "developerOrg", profileKey: "developerManager", role: "manager", isDefault: true, status: "active" },
    { organizationKey: "brokerOrg", profileKey: "brokerOwner", role: "owner", isDefault: true, status: "active" },
    { organizationKey: "brokerOrg", profileKey: "brokerAgent", role: "editor", isDefault: true, status: "active" },
  ];

  const projects: SeedProjectFixture[] = [
    {
      key: "palmHorizon",
      organizationKey: "developerOrg",
      createdByProfileKey: "developerOwner",
      slug: "dev-seed-palm-horizon-residences",
      title: "Palm Horizon Residences",
      projectType: "apartments",
      location: "New Cairo, Cairo",
      description: "Launch-ready residential inventory with mixed unit availability, private permits, and published buyer-facing coverage.",
      shortDescription: "Seeded flagship residential release for realistic developer workspace testing.",
      priceLabel: "EGP 12,400,000",
      startingPrice: "EGP 8,950,000",
      expectedUnits: 48,
      developerName: "Atlas Developments Seed",
      installmentYears: 8,
      listingType: "sale",
      status: "published",
      publicationState: "published",
      compoundName: "Palm Horizon",
      currency: "EGP",
      monthlyInstallment: "EGP 115,000",
      maintenanceFees: "EGP 280,000",
      reception: 2,
      negotiable: true,
      createdOffsetDays: 45,
      updatedOffsetDays: 2,
      publishedOffsetDays: 6,
    },
    {
      key: "cedarBusinessPark",
      organizationKey: "developerOrg",
      createdByProfileKey: "developerManager",
      slug: "dev-seed-cedar-business-park",
      title: "Cedar Business Park",
      projectType: "mixed",
      location: "Sheikh Zayed City, Giza",
      description: "Mixed-use project held in draft to exercise private workspace review and missing-compliance behavior.",
      shortDescription: "Draft commercial-ready development with organization-only review documents.",
      priceLabel: "EGP 18,200,000",
      startingPrice: "EGP 14,500,000",
      expectedUnits: 24,
      developerName: "Atlas Developments Seed",
      installmentYears: 6,
      listingType: "sale",
      status: "draft",
      publicationState: "draft",
      compoundName: "Cedar Business Park",
      currency: "EGP",
      createdOffsetDays: 20,
      updatedOffsetDays: 4,
    },
    {
      key: "northCoastHouse",
      organizationKey: "brokerOrg",
      createdByProfileKey: "brokerOwner",
      slug: "dev-seed-north-coast-beach-house",
      title: "North Coast Beach House",
      projectType: "standalone",
      location: "Ras El Hekma, North Coast",
      description: "Broker-managed coastal property with both project-level and unit-level published listing coverage.",
      shortDescription: "Published broker listing ready for buyer matching and handoff testing.",
      priceLabel: "EGP 9,850,000",
      startingPrice: "EGP 8,700,000",
      expectedUnits: 1,
      developerName: "Harbor Bridge Realty Seed",
      listingType: "sale",
      status: "published",
      publicationState: "published",
      compoundName: "Azure Coast",
      currency: "EGP",
      negotiable: true,
      createdOffsetDays: 35,
      updatedOffsetDays: 3,
      publishedOffsetDays: 8,
    },
    {
      key: "zayedVilla",
      organizationKey: "brokerOrg",
      createdByProfileKey: "brokerAgent",
      slug: "dev-seed-zayed-family-villa-exclusive",
      title: "Zayed Family Villa Exclusive",
      projectType: "standalone",
      location: "Sheikh Zayed City, Giza",
      description: "High-value broker draft held privately for collaboration and offer preparation testing.",
      shortDescription: "Draft broker-exclusive villa record with no public listing yet.",
      priceLabel: "EGP 15,600,000",
      startingPrice: "EGP 15,600,000",
      expectedUnits: 1,
      developerName: "Harbor Bridge Realty Seed",
      listingType: "sale",
      status: "draft",
      publicationState: "draft",
      compoundName: "West Heights",
      currency: "EGP",
      createdOffsetDays: 12,
      updatedOffsetDays: 1,
    },
  ];

  const units: SeedUnitFixture[] = [
    {
      key: "palmA01",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      createdByProfileKey: "developerOwner",
      label: "A-01 Garden Apartment",
      unitType: "apartment",
      listingType: "sale",
      floor: "Ground",
      bedrooms: 3,
      bathrooms: 3,
      area: "178 sqm",
      areaSqm: 178,
      price: 13850000,
      priceLabel: "EGP 13,850,000",
      finishingLevel: "fully_finished",
      paymentMethod: "cash_or_installments",
      downPayment: "15%",
      installmentYears: 8,
      deliveryDate: "2027-12",
      availability: "available",
      publicationState: "published",
      description: "Published family apartment with private permit coverage and strong matching metadata.",
      compoundName: "Palm Horizon",
      unitCode: "seed-palm-a01",
      direction: "North East",
      currency: "EGP",
      maintenanceFees: "EGP 320,000",
      monthlyInstallment: "EGP 118,000",
      reception: 2,
      negotiable: true,
      createdOffsetDays: 18,
      updatedOffsetDays: 2,
      publishedOffsetDays: 5,
    },
    {
      key: "palmB07",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      createdByProfileKey: "developerManager",
      label: "B-07 Duplex Reserve",
      unitType: "duplex",
      listingType: "sale",
      floor: "07",
      bedrooms: 4,
      bathrooms: 4,
      area: "246 sqm",
      areaSqm: 246,
      price: 17900000,
      priceLabel: "EGP 17,900,000",
      finishingLevel: "semi_finished",
      paymentMethod: "installments",
      downPayment: "10%",
      installmentYears: 9,
      deliveryDate: "2028-09",
      availability: "reserved",
      publicationState: "draft",
      description: "Reserved duplex held back from public listing to test availability and private workspace flows.",
      compoundName: "Palm Horizon",
      unitCode: "seed-palm-b07",
      direction: "South West",
      currency: "EGP",
      maintenanceFees: "EGP 410,000",
      monthlyInstallment: "EGP 149,000",
      reception: 3,
      negotiable: false,
      createdOffsetDays: 14,
      updatedOffsetDays: 1,
    },
    {
      key: "palmP02",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      createdByProfileKey: "developerManager",
      label: "P-02 Penthouse Preview",
      unitType: "penthouse",
      listingType: "sale",
      floor: "12",
      bedrooms: 4,
      bathrooms: 5,
      area: "315 sqm",
      areaSqm: 315,
      price: 23400000,
      priceLabel: "EGP 23,400,000",
      finishingLevel: "extra_super_lux",
      paymentMethod: "cash_or_installments",
      downPayment: "20%",
      installmentYears: 7,
      deliveryDate: "2028-03",
      availability: "available",
      publicationState: "draft",
      description: "Draft penthouse kept private for premium launch planning and matching edge-case coverage.",
      compoundName: "Palm Horizon",
      unitCode: "seed-palm-p02",
      direction: "North",
      currency: "EGP",
      maintenanceFees: "EGP 520,000",
      monthlyInstallment: "EGP 198,000",
      reception: 3,
      negotiable: true,
      createdOffsetDays: 10,
      updatedOffsetDays: 1,
    },
    {
      key: "coastVilla",
      organizationKey: "brokerOrg",
      projectKey: "northCoastHouse",
      createdByProfileKey: "brokerAgent",
      label: "Sea Villa 01",
      unitType: "chalet",
      listingType: "sale",
      floor: "Villa",
      bedrooms: 4,
      bathrooms: 4,
      area: "220 sqm",
      areaSqm: 220,
      price: 11200000,
      priceLabel: "EGP 11,200,000",
      finishingLevel: "furnished",
      paymentMethod: "cash_or_installments",
      downPayment: "20%",
      installmentYears: 5,
      deliveryDate: "Ready now",
      availability: "available",
      publicationState: "published",
      description: "Published coastal villa unit used to test broker handoff and buyer-intent coverage.",
      compoundName: "Azure Coast",
      unitCode: "seed-coast-v1",
      direction: "Sea Front",
      currency: "EGP",
      maintenanceFees: "EGP 260,000",
      monthlyInstallment: "EGP 175,000",
      reception: 2,
      negotiable: true,
      createdOffsetDays: 16,
      updatedOffsetDays: 2,
      publishedOffsetDays: 4,
    },
  ];

  const assets: SeedAssetFixture[] = [
    {
      key: "palmHero",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      kind: "image",
      visibility: "public",
      name: "palm-horizon-cover.jpg",
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      mime: "image/jpeg",
      size: 410_000,
      sortOrder: 0,
      createdOffsetDays: 30,
      updatedOffsetDays: 2,
    },
    {
      key: "palmGallery",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      kind: "image",
      visibility: "public",
      name: "palm-horizon-lobby.jpg",
      url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      mime: "image/jpeg",
      size: 398_000,
      sortOrder: 1,
      createdOffsetDays: 28,
      updatedOffsetDays: 2,
    },
    {
      key: "palmPermit",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      kind: "permit",
      visibility: "conversation_only",
      name: "palm-horizon-permit.pdf",
      url: "https://example.com/seed/palm-horizon-permit.pdf",
      mime: "application/pdf",
      size: 182_000,
      sortOrder: 0,
      createdOffsetDays: 27,
      updatedOffsetDays: 2,
    },
    {
      key: "cedarHero",
      organizationKey: "developerOrg",
      projectKey: "cedarBusinessPark",
      kind: "image",
      visibility: "public",
      name: "cedar-business-park.jpg",
      url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      mime: "image/jpeg",
      size: 401_000,
      sortOrder: 0,
      createdOffsetDays: 18,
      updatedOffsetDays: 4,
    },
    {
      key: "cedarPrivateDoc",
      organizationKey: "developerOrg",
      projectKey: "cedarBusinessPark",
      kind: "document",
      visibility: "organization",
      name: "cedar-business-park-internal-brief.pdf",
      url: "https://example.com/seed/cedar-internal-brief.pdf",
      mime: "application/pdf",
      size: 220_000,
      sortOrder: 0,
      createdOffsetDays: 18,
      updatedOffsetDays: 4,
    },
    {
      key: "coastHero",
      organizationKey: "brokerOrg",
      projectKey: "northCoastHouse",
      kind: "image",
      visibility: "public",
      name: "north-coast-house.jpg",
      url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
      mime: "image/jpeg",
      size: 388_000,
      sortOrder: 0,
      createdOffsetDays: 24,
      updatedOffsetDays: 3,
    },
    {
      key: "coastPermit",
      organizationKey: "brokerOrg",
      projectKey: "northCoastHouse",
      kind: "permit",
      visibility: "conversation_only",
      name: "north-coast-registration.pdf",
      url: "https://example.com/seed/north-coast-registration.pdf",
      mime: "application/pdf",
      size: 194_000,
      sortOrder: 0,
      createdOffsetDays: 24,
      updatedOffsetDays: 3,
    },
    {
      key: "palmUnitHero",
      organizationKey: "developerOrg",
      unitKey: "palmA01",
      projectKey: "palmHorizon",
      kind: "image",
      visibility: "public",
      name: "palm-a01-living.jpg",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      mime: "image/jpeg",
      size: 376_000,
      sortOrder: 0,
      createdOffsetDays: 12,
      updatedOffsetDays: 2,
    },
    {
      key: "palmDuplexHero",
      organizationKey: "developerOrg",
      unitKey: "palmB07",
      projectKey: "palmHorizon",
      kind: "image",
      visibility: "public",
      name: "palm-b07-duplex.jpg",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      mime: "image/jpeg",
      size: 365_000,
      sortOrder: 0,
      createdOffsetDays: 11,
      updatedOffsetDays: 1,
    },
    {
      key: "coastVillaHero",
      organizationKey: "brokerOrg",
      unitKey: "coastVilla",
      projectKey: "northCoastHouse",
      kind: "image",
      visibility: "public",
      name: "coast-villa-front.jpg",
      url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      mime: "image/jpeg",
      size: 402_000,
      sortOrder: 0,
      createdOffsetDays: 12,
      updatedOffsetDays: 2,
    },
  ];

  const projectCompliance: SeedComplianceFixture[] = [
    {
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      adLicenseNumber: "ALX-PALM-2026-001",
      registrationStatus: "registered",
      reviewStatus: "approved",
      privateNotes: "Seed permit approved for published residential launch.",
      createdOffsetDays: 22,
      updatedOffsetDays: 2,
    },
    {
      organizationKey: "developerOrg",
      projectKey: "cedarBusinessPark",
      registrationStatus: "pending",
      reviewStatus: "pending",
      privateNotes: "Seed draft missing final permit package for public release.",
      createdOffsetDays: 18,
      updatedOffsetDays: 4,
    },
    {
      organizationKey: "brokerOrg",
      projectKey: "northCoastHouse",
      adLicenseNumber: "HBR-COAST-2026-011",
      registrationStatus: "registered",
      reviewStatus: "approved",
      privateNotes: "Broker registration approved for coastal listing publication.",
      createdOffsetDays: 18,
      updatedOffsetDays: 3,
    },
    {
      organizationKey: "brokerOrg",
      projectKey: "zayedVilla",
      registrationStatus: "not_registered",
      reviewStatus: "missing",
      privateNotes: "Private seller brief only; no public registration yet.",
      createdOffsetDays: 8,
      updatedOffsetDays: 1,
    },
  ];

  const unitCompliance: SeedComplianceFixture[] = [
    {
      organizationKey: "developerOrg",
      unitKey: "palmA01",
      adLicenseNumber: "ALX-PALM-UNIT-A01",
      registrationStatus: "registered",
      reviewStatus: "approved",
      privateNotes: "Published seed unit fully cleared.",
      createdOffsetDays: 12,
      updatedOffsetDays: 2,
    },
    {
      organizationKey: "brokerOrg",
      unitKey: "coastVilla",
      adLicenseNumber: "HBR-COAST-V1",
      registrationStatus: "registered",
      reviewStatus: "approved",
      privateNotes: "Broker villa approved for buyer traffic tests.",
      createdOffsetDays: 11,
      updatedOffsetDays: 2,
    },
  ];

  const listings: SeedListingFixture[] = [
    {
      key: "palmProjectListing",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      heroAssetKey: "palmHero",
      title: "Palm Horizon Residences",
      summary: "Published residential development with strong installment plans and verified compliance.",
      location: "New Cairo, Cairo",
      price: 12400000,
      priceLabel: "EGP 12,400,000",
      listingType: "sale",
      searchParts: ["Palm Horizon Residences", "New Cairo", "apartments", "installments", "family"],
      matchScore: 92,
      matchReasons: ["Verified developer release", "Strong match for installment-led family buyers"],
      aiSummary: "Flagship developer listing for search, recommendation, and workspace visibility checks.",
      tags: ["apartments", "new cairo", "installments"],
      status: "active",
      createdOffsetDays: 6,
      updatedOffsetDays: 2,
      publishedOffsetDays: 6,
    },
    {
      key: "palmUnitListing",
      organizationKey: "developerOrg",
      projectKey: "palmHorizon",
      unitKey: "palmA01",
      heroAssetKey: "palmUnitHero",
      title: "Palm Horizon - A-01 Garden Apartment",
      summary: "Published garden apartment with cash-or-installments flexibility and verified unit readiness.",
      location: "New Cairo, Cairo",
      price: 13850000,
      priceLabel: "EGP 13,850,000",
      listingType: "sale",
      unitType: "apartment",
      bedrooms: 3,
      bathrooms: 3,
      areaSqm: 178,
      searchParts: ["Palm Horizon A-01", "garden apartment", "New Cairo", "3 bedroom", "installments"],
      matchScore: 95,
      matchReasons: ["Exact budget and location fit", "Published unit with private handoff context available"],
      aiSummary: "High-conviction published unit used for buyer intent and handoff tests.",
      tags: ["apartment", "garden", "new cairo", "published"],
      status: "active",
      createdOffsetDays: 5,
      updatedOffsetDays: 2,
      publishedOffsetDays: 5,
    },
    {
      key: "sheikhZayedCompoundListing",
      organizationKey: "developerOrg",
      projectKey: "cedarBusinessPark",
      heroAssetKey: "cedarHero",
      title: "Cedar Park - Zayed Compound Apartment",
      summary: "Gated Sheikh Zayed apartment near business parks, schools, and 6 October access routes.",
      location: "Sheikh Zayed City, Giza",
      price: 9200000,
      priceLabel: "EGP 9,200,000",
      listingType: "sale",
      unitType: "apartment",
      bedrooms: 3,
      bathrooms: 3,
      areaSqm: 165,
      searchParts: [
        "Sheikh Zayed",
        "Zayed City",
        "gated compound apartment",
        "6 October",
        "family apartment",
        "كمبوند الشيخ زايد",
      ],
      matchScore: 91,
      matchReasons: ["Exact Sheikh Zayed location coverage", "Useful for gated community search testing"],
      aiSummary: "Published seed listing for Sheikh Zayed quick-search and nearby 6 October fallback checks.",
      tags: ["sheikh zayed", "gated compound", "apartment", "family"],
      status: "active",
      createdOffsetDays: 7,
      updatedOffsetDays: 2,
      publishedOffsetDays: 7,
    },
    {
      key: "maadiVillaListing",
      organizationKey: "brokerOrg",
      title: "Leafy Maadi Garden Villa",
      summary: "Quiet Maadi villa with garden privacy, family living space, and quick Nile Corniche access.",
      location: "Maadi, Cairo",
      price: 18600000,
      priceLabel: "EGP 18,600,000",
      listingType: "sale",
      unitType: "villa",
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 310,
      heroAssetKey: "coastHero",
      searchParts: ["Maadi", "garden villa", "Nile views", "quiet suburb", "المعادي", "فيلا"],
      matchScore: 89,
      matchReasons: ["Covers Maadi quick-search", "Good villa and house candidate for family prompts"],
      aiSummary: "Published seed listing for Maadi villa/house prompts and leafy-suburb location testing.",
      tags: ["maadi", "villa", "garden", "quiet suburb"],
      status: "active",
      createdOffsetDays: 9,
      updatedOffsetDays: 2,
      publishedOffsetDays: 9,
    },
    {
      key: "newCapitalInvestmentListing",
      organizationKey: "developerOrg",
      title: "New Capital ROI Serviced Apartment",
      summary: "Investment-focused serviced apartment near the government district with rental yield positioning.",
      location: "New Capital / New Administrative Capital, Cairo",
      price: 7400000,
      priceLabel: "EGP 7,400,000",
      listingType: "sale",
      unitType: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 122,
      heroAssetKey: "palmGallery",
      searchParts: [
        "New Capital",
        "New Administrative Capital",
        "investment",
        "best ROI",
        "serviced apartment",
        "العاصمة الإدارية",
      ],
      matchScore: 90,
      matchReasons: ["Covers New Capital investment prompts", "Clear ROI-oriented listing metadata"],
      aiSummary: "Published seed listing for New Capital ROI and investment quick-search testing.",
      tags: ["new capital", "investment", "roi", "serviced apartment"],
      status: "active",
      createdOffsetDays: 6,
      updatedOffsetDays: 1,
      publishedOffsetDays: 6,
    },
    {
      key: "octoberFamilyListing",
      organizationKey: "brokerOrg",
      title: "6th October Family Compound Apartment",
      summary: "Affordable family apartment in 6th October with compound services and practical payment terms.",
      location: "6 October / 6th October City, Giza",
      price: 6200000,
      priceLabel: "EGP 6,200,000",
      listingType: "sale",
      unitType: "apartment",
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 150,
      heroAssetKey: "coastVillaHero",
      searchParts: [
        "6th October",
        "6 October",
        "October City",
        "family apartment",
        "affordable compound",
        "أكتوبر",
      ],
      matchScore: 88,
      matchReasons: ["Covers 6 October quick-search", "Useful affordable family fallback for Zayed/Giza prompts"],
      aiSummary: "Published seed listing for 6th October family and affordability testing.",
      tags: ["6 october", "family", "affordable", "compound"],
      status: "active",
      createdOffsetDays: 5,
      updatedOffsetDays: 1,
      publishedOffsetDays: 5,
    },
    {
      key: "northCoastProjectListing",
      organizationKey: "brokerOrg",
      projectKey: "northCoastHouse",
      heroAssetKey: "coastHero",
      title: "North Coast Beach House",
      summary: "Broker-published coastal property positioned for premium summer-home buyers.",
      location: "Ras El Hekma, North Coast",
      price: 9850000,
      priceLabel: "EGP 9,850,000",
      listingType: "sale",
      searchParts: ["North Coast Beach House", "Ras El Hekma", "coastal", "broker exclusive"],
      matchScore: 90,
      matchReasons: ["Strong coastal lifestyle fit", "Published broker inventory with follow-up context"],
      aiSummary: "Published broker listing for coastal matching and CRM handoff scenarios.",
      tags: ["north coast", "broker", "coastal"],
      status: "active",
      createdOffsetDays: 8,
      updatedOffsetDays: 3,
      publishedOffsetDays: 8,
    },
    {
      key: "northCoastVillaListing",
      organizationKey: "brokerOrg",
      projectKey: "northCoastHouse",
      unitKey: "coastVilla",
      heroAssetKey: "coastVillaHero",
      title: "North Coast - Sea Villa 01",
      summary: "Furnished sea-facing villa ready for broker-led buyer follow-up and scheduling.",
      location: "Ras El Hekma, North Coast",
      price: 11200000,
      priceLabel: "EGP 11,200,000",
      listingType: "sale",
      unitType: "chalet",
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 220,
      searchParts: ["Sea Villa 01", "Ras El Hekma", "furnished chalet", "summer home"],
      matchScore: 93,
      matchReasons: ["High fit for premium summer-home buyers", "Unit-level published inventory with clear next action"],
      aiSummary: "Published broker unit used to validate listing-level buyer intent and handoff flows.",
      tags: ["chalet", "furnished", "north coast", "published"],
      status: "active",
      createdOffsetDays: 4,
      updatedOffsetDays: 2,
      publishedOffsetDays: 4,
    },
  ];

  const buyerPreferences: SeedBuyerPreferenceFixture[] = [
    {
      profileKey: "buyerLead",
      minBudget: 8_000_000,
      maxBudget: 14_500_000,
      locations: ["New Cairo", "Ras El Hekma", "North Coast"],
      propertyTypes: ["Apartment", "Chalet", "Villa"],
      financingPreferences: ["installments", "cash_or_installments"],
      confidence: 0.83,
      updatedFrom: "dev-seed",
      createdOffsetDays: 9,
      updatedOffsetDays: 1,
    },
  ];

  const savedListings: SeedSavedListingFixture[] = [
    { profileKey: "buyerLead", listingKey: "palmUnitListing", savedOffsetDays: 2 },
    { profileKey: "buyerLead", listingKey: "northCoastVillaListing", savedOffsetDays: 1 },
  ];

  const buyerIntents: SeedBuyerIntentFixture[] = [
    {
      profileKey: "buyerLead",
      listingKey: "palmUnitListing",
      organizationKey: "developerOrg",
      intentType: "schedule_visit",
      status: "open",
      source: "dev-seed",
      threadId: threadId("palm-handoff"),
      prompt: "I want to book a visit for the Palm Horizon garden apartment this week.",
      createdOffsetDays: 2,
      updatedOffsetDays: 1,
    },
    {
      profileKey: "buyerLead",
      listingKey: "northCoastVillaListing",
      organizationKey: "brokerOrg",
      intentType: "offer_interest",
      status: "in_progress",
      source: "dev-seed",
      threadId: threadId("coast-handoff"),
      prompt: "Share final payment details and availability for Sea Villa 01.",
      createdOffsetDays: 3,
      updatedOffsetDays: 1,
    },
  ];

  const conversationHandoffs: SeedConversationHandoffFixture[] = [
    {
      profileKey: "buyerLead",
      organizationKey: "developerOrg",
      listingKey: "palmUnitListing",
      threadId: threadId("palm-handoff"),
      summary: "Buyer prefers New Cairo family inventory and is ready for a guided visit handoff.",
      sharedFields: ["budget", "preferred_location", "visit_window", "financing_preferences"],
      status: "shared",
      createdOffsetDays: 2,
      updatedOffsetDays: 1,
    },
    {
      profileKey: "buyerLead",
      organizationKey: "brokerOrg",
      listingKey: "northCoastVillaListing",
      threadId: threadId("coast-handoff"),
      summary: "Buyer wants a furnished North Coast option with clear pricing and fast follow-up.",
      sharedFields: ["budget", "preferred_location", "property_type", "summer_usage"],
      status: "accepted",
      createdOffsetDays: 3,
      updatedOffsetDays: 1,
    },
  ];

  const analyticsEvents: SeedAnalyticsEventFixture[] = [
    {
      authUserId: "dev-seed-buyer-lead",
      organizationKey: "developerOrg",
      threadId: threadId("palm-handoff"),
      route: "buyer_intent",
      eventName: "schedule_visit",
      source: "dev-seed",
      payload: { listingKey: "palmUnitListing", intentType: "schedule_visit" },
      createdOffsetDays: 2,
    },
    {
      authUserId: "dev-seed-buyer-lead",
      organizationKey: "brokerOrg",
      threadId: threadId("coast-handoff"),
      route: "buyer_intent",
      eventName: "contact_agent",
      source: "dev-seed",
      payload: { listingKey: "northCoastVillaListing", intentType: "offer_interest" },
      createdOffsetDays: 3,
    },
  ];

  return {
    profiles,
    organizations,
    memberships,
    projects: projects.map((project) => ({
      ...project,
      createdAt: atDay(baseNow, project.createdOffsetDays),
      updatedAt: atDay(baseNow, project.updatedOffsetDays),
      publishedAt: project.publishedOffsetDays === undefined ? undefined : atDay(baseNow, project.publishedOffsetDays),
    })),
    units: units.map((unit) => ({
      ...unit,
      createdAt: atDay(baseNow, unit.createdOffsetDays),
      updatedAt: atDay(baseNow, unit.updatedOffsetDays),
      publishedAt: unit.publishedOffsetDays === undefined ? undefined : atDay(baseNow, unit.publishedOffsetDays),
    })),
    assets: assets.map((asset) => ({
      ...asset,
      keyName: assetKey(asset.key),
      createdAt: atDay(baseNow, asset.createdOffsetDays),
      updatedAt: atDay(baseNow, asset.updatedOffsetDays),
    })),
    projectCompliance: projectCompliance.map((item) => ({
      ...item,
      createdAt: atDay(baseNow, item.createdOffsetDays),
      updatedAt: atDay(baseNow, item.updatedOffsetDays),
    })),
    unitCompliance: unitCompliance.map((item) => ({
      ...item,
      createdAt: atDay(baseNow, item.createdOffsetDays),
      updatedAt: atDay(baseNow, item.updatedOffsetDays),
    })),
    listings: listings.map((listing) => ({
      ...listing,
      searchText: buildSearchText(listing.searchParts),
      createdAt: atDay(baseNow, listing.createdOffsetDays),
      updatedAt: atDay(baseNow, listing.updatedOffsetDays),
      publishedAt: atDay(baseNow, listing.publishedOffsetDays),
    })),
    buyerPreferences: buyerPreferences.map((item) => ({
      ...item,
      createdAt: atDay(baseNow, item.createdOffsetDays),
      updatedAt: atDay(baseNow, item.updatedOffsetDays),
    })),
    savedListings: savedListings.map((item) => ({
      ...item,
      savedAt: atDay(baseNow, item.savedOffsetDays),
    })),
    buyerIntents: buyerIntents.map((item) => ({
      ...item,
      createdAt: atDay(baseNow, item.createdOffsetDays),
      updatedAt: atDay(baseNow, item.updatedOffsetDays),
    })),
    conversationHandoffs: conversationHandoffs.map((item) => ({
      ...item,
      createdAt: atDay(baseNow, item.createdOffsetDays),
      updatedAt: atDay(baseNow, item.updatedOffsetDays),
    })),
    analyticsEvents: analyticsEvents.map((item) => ({
      ...item,
      createdAt: atDay(baseNow, item.createdOffsetDays),
      payloadJson: JSON.stringify(item.payload),
    })),
  };
}
