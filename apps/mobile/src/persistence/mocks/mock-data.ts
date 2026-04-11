import type {
  ConversationMessage,
  InsightCard,
  PreferenceProfile,
  PropertyCardVM,
} from "@/types/domain";

export const mockProperties: PropertyCardVM[] = [
  {
    id: "prop-dubai-marina-01",
    heroUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    title: "Marina glass residence with sunset terrace",
    priceLabel: "AED 3.45M",
    locationLabel: "Dubai Marina",
    beds: 2,
    baths: 2,
    area: 1480,
    matchScore: 96,
    matchReasons: ["Strong rental moat", "Walkable waterfront", "Low-friction move-in"],
    aiSummary:
      "High-conviction option for a buyer who wants prestige, liquidity, and evening lifestyle in one address.",
    tags: ["High conviction", "Waterfront", "Turnkey"],
  },
  {
    id: "prop-business-bay-02",
    heroUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    title: "Business Bay corner unit with skyline study",
    priceLabel: "AED 2.82M",
    locationLabel: "Business Bay",
    beds: 2,
    baths: 3,
    area: 1560,
    matchScore: 91,
    matchReasons: ["Flexible work-from-home layout", "Fast downtown access", "Strong resale story"],
    aiSummary:
      "Balanced pick for mixed lifestyle plus productivity, with enough separation to support hybrid work.",
    tags: ["Flexible layout", "Resale", "Downtown"],
  },
  {
    id: "prop-palm-03",
    heroUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    title: "Palm-facing serviced apartment with hotel amenities",
    priceLabel: "AED 4.95M",
    locationLabel: "Palm Jumeirah",
    beds: 3,
    baths: 3,
    area: 2010,
    matchScore: 88,
    matchReasons: ["Premium hospitality stack", "Best for entertaining", "Scarcity appeal"],
    aiSummary:
      "The premium-choice branch: higher price, stronger statement value, and better guest experience.",
    tags: ["Luxury", "Statement asset", "Hospitality"],
  },
];

export const mockInsightCards: InsightCard[] = [
  {
    id: "insight-01",
    title: "Today’s edge",
    body: "Marina inventory under AED 3.5M tightened again. Strong options will move on confidence, not volume.",
    tone: "signal",
  },
  {
    id: "insight-02",
    title: "Preference read",
    body: "You keep favoring waterfront and move-in-ready homes over speculative upside.",
    tone: "neutral",
  },
];

export const mockPreferenceProfile: PreferenceProfile = {
  budgetRange: [2500000, 5000000],
  locations: ["Dubai Marina", "Business Bay", "Palm Jumeirah"],
  bedrooms: [2, 3],
  propertyTypes: ["Apartment", "Serviced apartment"],
  commutePrefs: ["Walkable lifestyle", "Fast downtown access"],
  confidence: 0.73,
  updatedFrom: "seed",
};

export const initialMessages = (_sessionId: string): ConversationMessage[] => [];
