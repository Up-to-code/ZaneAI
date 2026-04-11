export const seededUsers = [
  {
    externalId: "demo-user",
    name: "Ahmed",
    premiumTier: "founding",
  },
];

export const seededProperties = [
  {
    externalId: "prop-dubai-marina-01",
    title: "Marina glass residence with sunset terrace",
    price: 3450000,
    priceLabel: "AED 3.45M",
    location: "Dubai Marina",
    beds: 2,
    baths: 2,
    area: 1480,
    heroUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    matchScore: 96,
    matchReasons: ["Strong rental moat", "Walkable waterfront", "Low-friction move-in"],
    aiSummary:
      "High-conviction option for a buyer who wants prestige, liquidity, and evening lifestyle in one address.",
    tags: ["High conviction", "Waterfront", "Turnkey"],
  },
  {
    externalId: "prop-business-bay-02",
    title: "Business Bay corner unit with skyline study",
    price: 2820000,
    priceLabel: "AED 2.82M",
    location: "Business Bay",
    beds: 2,
    baths: 3,
    area: 1560,
    heroUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    matchScore: 91,
    matchReasons: ["Flexible work-from-home layout", "Fast downtown access", "Strong resale story"],
    aiSummary:
      "Balanced pick for mixed lifestyle plus productivity, with enough separation to support hybrid work.",
    tags: ["Flexible layout", "Resale", "Downtown"],
  },
  {
    externalId: "prop-palm-03",
    title: "Palm-facing serviced apartment with hotel amenities",
    price: 4950000,
    priceLabel: "AED 4.95M",
    location: "Palm Jumeirah",
    beds: 3,
    baths: 3,
    area: 2010,
    heroUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    matchScore: 88,
    matchReasons: ["Premium hospitality stack", "Best for entertaining", "Scarcity appeal"],
    aiSummary:
      "The premium-choice branch: higher price, stronger statement value, and better guest experience.",
    tags: ["Luxury", "Statement asset", "Hospitality"],
  },
];

export const seededPreferenceProfile = {
  budgetRange: [2500000, 5000000],
  locations: ["Dubai Marina", "Business Bay", "Palm Jumeirah"],
  bedrooms: [2, 3],
  propertyTypes: ["Apartment", "Serviced apartment"],
  commutePrefs: ["Walkable lifestyle", "Fast downtown access"],
  confidence: 0.73,
  updatedFrom: "seed",
};

export const seededInsights = [
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
