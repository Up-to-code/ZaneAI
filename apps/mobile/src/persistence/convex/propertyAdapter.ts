import type { PriceAnalysisVM, PropertyCardVM } from "@/types/domain";

const FALLBACK_PRICE_ANALYSIS: PriceAnalysisVM = {
  propertyAskPrice: 0,
  areaAveragePrice: 0,
  historicalData: [],
};

type ListingPropertyRow = {
  externalId?: string;
  _id?: string;
  heroUrl: string;
  title: string;
  description?: string;
  priceLabel: string;
  location?: string;
  locationLabel?: string;
  beds?: number;
  bedrooms?: number;
  baths?: number;
  bathrooms?: number;
  area?: number;
  areaSqm?: number;
  matchScore?: number;
  matchReasons?: string[];
  aiSummary?: string;
  summary?: string;
  tags?: string[];
  amenities?: PropertyCardVM["amenities"];
  broker?: PropertyCardVM["broker"];
  priceAnalysis?: PropertyCardVM["priceAnalysis"];
};

export function toPropertyCardVM(property: ListingPropertyRow): PropertyCardVM {
  const id = property.externalId ?? property._id ?? property.title;
  const summary = property.aiSummary ?? property.summary ?? property.description ?? "";
  return {
    id,
    heroUrl: property.heroUrl,
    title: property.title,
    description: property.description ?? summary,
    priceLabel: property.priceLabel,
    locationLabel: property.locationLabel ?? property.location ?? "",
    beds: property.beds ?? property.bedrooms ?? 0,
    baths: property.baths ?? property.bathrooms ?? 0,
    area: property.area ?? property.areaSqm ?? 0,
    matchScore: property.matchScore ?? 0,
    matchReasons: property.matchReasons ?? [],
    aiSummary: summary,
    tags: property.tags ?? [],
    amenities: property.amenities ?? [],
    broker: property.broker ?? {
      id: `broker-${id}`,
      name: "Zane-ai Advisor",
      agency: "Zane-ai",
      avatarUrl: property.heroUrl,
      rating: 4.8,
      activeListingsCount: 0,
      phone: "",
      description: "Broker profile will be available when listing enrichment is connected.",
    },
    priceAnalysis: property.priceAnalysis ?? FALLBACK_PRICE_ANALYSIS,
  };
}
