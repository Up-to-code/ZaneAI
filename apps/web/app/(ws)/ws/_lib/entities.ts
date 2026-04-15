/**
 * WHY:   The workspace now needs one shared UI model for people, projects, units, market insights, and threaded offer activity.
 * WHAT:  Exports serializable frontend-facing entity types used across projects, offers, CRM, AI, and organization settings.
 * HOW:   Keeps the models UI-oriented so pages can share card components without leaking backend table details.
 */

export type UnitType = "apartment" | "villa" | "duplex" | "studio" | "penthouse" | "townhouse" | "chalet" | "commercial";
export type ListingType = "sale" | "rent";
export type UnitStatus = "available" | "reserved" | "sold";

export type UnitReference = {
  id: string;
  projectId?: string;
  label: string;
  unitType: UnitType;
  floor?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  priceLabel?: string;
  status: UnitStatus;
  description?: string;
  image?: string;
  listingType?: ListingType;
  finishingLevel?: "core_shell" | "semi_finished" | "fully_finished" | "extra_super_lux" | "furnished";
  paymentMethod?: "cash" | "installments" | "cash_or_installments";
  downPayment?: string;
  installmentYears?: number;
  deliveryDate?: string;
  parking?: number;
  unitAmenities?: string[];
  nearbyPlaces?: { name: string; distance: string }[];
  adLicenseNumber?: string;
  registrationStatus?: "registered" | "not_registered" | "pending";
  createdAt: number;
  updatedAt: number;
};

export type ProjectReference = {
  id: string;
  title: string;
  location: string;
  image?: string;
  summary?: string;
};

export type PersonCardType = "broker" | "client";
export type PersonBadge = "verified" | "vip";

export type PersonRelation = {
  project: ProjectReference | null;
  unit: UnitReference | null;
  stageLabel?: string;
  summary?: string;
};

export type OfferThreadItem = {
  id: string;
  subject: string;
  status: "new" | "awaiting-response" | "approved" | "completed";
  sender: {
    name: string;
    type: PersonCardType | "developer";
  };
  recipient: {
    name: string;
    type: PersonCardType | "developer";
  };
  relation: PersonRelation;
  lastUpdate: string;
  nextAction: string;
  summary: string;
};

export type { AgUiActionDefinition, AgUiDraftState, AgUiExecutionState } from "@anan/ag-ui";

export type MarketAreaInsight = {
  city: string;
  area: string;
  demandLevel: "hot" | "warm" | "cold";
  averagePriceLabel: string;
  topConfiguration: string;
  speedToSell: string;
  recommendation: string;
};

export type OrganizationMemberDisplay = {
  id: string;
  authUserId: string;
  membershipId: string;
  name: string;
  email: string;
  username?: string;
  role: "manager" | "member" | "viewer";
  statusLabel: string;
};

export type OrganizationInviteDisplay = {
  id: string;
  email: string;
  role: "manager" | "member" | "viewer";
  status: "pending" | "accepted" | "canceled";
  expiresLabel: string;
};
