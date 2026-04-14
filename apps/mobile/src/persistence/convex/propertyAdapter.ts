import type { Doc } from "@convex/_generated/dataModel";
import type { PriceAnalysisVM, PropertyCardVM } from "@/types/domain";

const FALLBACK_PRICE_ANALYSIS: PriceAnalysisVM = {
  propertyAskPrice: 0,
  areaAveragePrice: 0,
  historicalData: [],
};

export function toPropertyCardVM(property: Doc<"properties">): PropertyCardVM {
  return {
    id: property.externalId,
    heroUrl: property.heroUrl,
    title: property.title,
    description: property.description ?? property.aiSummary,
    priceLabel: property.priceLabel,
    locationLabel: property.location,
    beds: property.beds,
    baths: property.baths,
    area: property.area,
    matchScore: property.matchScore,
    matchReasons: property.matchReasons,
    aiSummary: property.aiSummary,
    tags: property.tags,
    amenities: property.amenities ?? [],
    broker: property.broker ?? {
      id: `broker-${property.externalId}`,
      name: "Zane-ai Advisory",
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
