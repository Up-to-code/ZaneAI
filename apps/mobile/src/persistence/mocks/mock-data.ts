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
    description: "An exceptional fully furnished property located precisely on the marina walk. The property boasts full glass panoramics, giving you pristine sunset views over the water. Custom Italian finishing throughout.",
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
    amenities: [
      { id: "a1", label: "Infinity Pool", iconName: "Waves", category: "Wellness" },
      { id: "a2", label: "Gymnasium", iconName: "Dumbbell", category: "Wellness" },
      { id: "a3", label: "Spa Services", iconName: "Sparkles", category: "Wellness" },
      { id: "a4", label: "15m to Airport", iconName: "Plane", category: "Location" },
      { id: "a5", label: "Concierge", iconName: "BellConcierge", category: "Services" },
      { id: "a6", label: "Security 24/7", iconName: "ShieldCheck", category: "Services" },
      { id: "a7", label: "Covered Parking", iconName: "Car", category: "Facilities" },
      { id: "a8", label: "Balcony", iconName: "Wind", category: "Facilities" },
      { id: "a9", label: "Smart Home", iconName: "Cpu", category: "Facilities" },
      { id: "a10", label: "Kids Play Area", iconName: "Gamepad2", category: "Facilities" },
    ],
    broker: {
      id: "brk-01",
      name: "Tariq Mansour",
      agency: "Zane-ai Elite Realty",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80",
      rating: 4.9,
      activeListingsCount: 14,
      phone: "+971 50 123 4567",
      description: "Tariq specializes in prime waterfront properties and luxury transactions, bringing 12 years of DIFC and Marina experience to his clients.",
    },
    priceAnalysis: {
      propertyAskPrice: 3450000,
      areaAveragePrice: 3100000,
      historicalData: [
        { month: "Oct", value: 3300000 },
        { month: "Nov", value: 3320000 },
        { month: "Dec", value: 3400000 },
        { month: "Jan", value: 3420000 },
        { month: "Feb", value: 3410000 },
        { month: "Mar", value: 3450000 },
      ]
    }
  },
  {
    id: "prop-business-bay-02",
    heroUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    title: "Business Bay corner unit with skyline study",
    description: "Ideal for the modern executive. Corner layout featuring a dedicated glass-enclosed study overlooking the Burj Khalifa. Walking distance to the canal and major corporate hubs.",
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
    amenities: [
      { id: "b1", label: "Fitness Center", iconName: "Dumbbell", category: "Wellness" },
      { id: "b2", label: "Meeting Rooms", iconName: "Briefcase", category: "Business" },
      { id: "b3", label: "5m to Metro", iconName: "Train", category: "Location" },
      { id: "b4", label: "Security 24/7", iconName: "ShieldCheck", category: "Services" },
      { id: "b5", label: "Covered Parking", iconName: "Car", category: "Facilities" },
      { id: "b6", label: "Burj View", iconName: "Eye", category: "Facilities" },
    ],
    broker: {
      id: "brk-02",
      name: "Sarah Jenkins",
      agency: "Downtown Properties",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
      rating: 4.7,
      activeListingsCount: 8,
      phone: "+971 50 987 6543",
      description: "Sarah is a Business Bay specialist focusing on high-ROI executive apartments.",
    },
    priceAnalysis: {
      propertyAskPrice: 2820000,
      areaAveragePrice: 2950000,
      historicalData: [
        { month: "Oct", value: 2750000 },
        { month: "Nov", value: 2790000 },
        { month: "Dec", value: 2800000 },
        { month: "Jan", value: 2800000 },
        { month: "Feb", value: 2810000 },
        { month: "Mar", value: 2820000 },
      ]
    }
  },
  {
    id: "prop-palm-03",
    heroUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    title: "Palm-facing serviced apartment with hotel amenities",
    description: "An absolute statement asset. Turnkey luxury serviced by a 5-star hotel brand. Features extensive wrap-around balconies directly facing the fronds of Palm Jumeirah and Atlantis.",
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
    amenities: [
      { id: "c1", label: "Private Beach", iconName: "Umbrella", category: "Wellness" },
      { id: "c2", label: "Valet Service", iconName: "Key", category: "Services" },
      { id: "c3", label: "Room Service", iconName: "Utensils", category: "Services" },
      { id: "c4", label: "Spa Services", iconName: "Sparkles", category: "Wellness" },
      { id: "c5", label: "Helipad Access", iconName: "Navigation", category: "Location" },
      { id: "c6", label: "Luxury Finishes", iconName: "Gem", category: "Facilities" },
      { id: "c7", label: "Smart Home", iconName: "Cpu", category: "Facilities" },
      { id: "c8", label: "Housekeeping", iconName: "SprayCan", category: "Services" },
      { id: "c9", label: "Sea View", iconName: "Waves", category: "Facilities" },
    ],
    broker: {
      id: "brk-01",
      name: "Tariq Mansour",
      agency: "Zane-ai Elite Realty",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80",
      rating: 4.9,
      activeListingsCount: 14,
      phone: "+971 50 123 4567",
      description: "Tariq specializes in prime waterfront properties and luxury transactions, bringing 12 years of DIFC and Marina experience to his clients.",
    },
    priceAnalysis: {
      propertyAskPrice: 4950000,
      areaAveragePrice: 5200000,
      historicalData: [
        { month: "Oct", value: 4800000 },
        { month: "Nov", value: 4850000 },
        { month: "Dec", value: 4900000 },
        { month: "Jan", value: 4950000 },
        { month: "Feb", value: 4950000 },
        { month: "Mar", value: 4950000 },
      ]
    }
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
