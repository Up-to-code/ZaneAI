import type { PropertyCompat } from "./catalog";

export type BudgetMode = "target" | "max" | "range" | "unknown";
export type RelaxationStage = "exact" | "exact_relaxed" | "nearby" | "nearby_relaxed" | "broad";

export type SmartPropertySearchArgs = {
  query?: string;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  targetPrice?: number;
  budgetMode?: BudgetMode;
  minBeds?: number;
  limit?: number;
};

export type RankedProperty = PropertyCompat & {
  recommendationScore: number;
  recommendationReasons: string[];
  relaxationStage: RelaxationStage;
  scoreBreakdown: {
    semanticFit: number;
    locationFit: number;
    budgetFit: number;
    availabilityFreshness: number;
    userPreferenceFit: number;
    qualitySignals: number;
    diversityNovelty: number;
  };
};

export type SmartPropertySearchResult = {
  results: RankedProperty[];
  generatedQuery: string;
  normalizedQuery: string;
  relaxedConstraints: string[];
  filters: SmartPropertySearchArgs;
};

const AREA_GRAPH: Record<string, string[]> = {
  "grand egyptian museum": ["giza", "pyramids", "sheikh zayed", "6 october", "dokki"],
  gem: ["giza", "pyramids", "sheikh zayed", "6 october", "dokki"],
  "egyptian museum": ["downtown cairo", "garden city", "zamalek", "dokki", "giza"],
  "new cairo": ["fifth settlement", "tagamoa", "madinaty", "rehab"],
  "sheikh zayed": ["6 october", "giza", "pyramids", "new giza"],
  "dubai marina": ["jbr", "jlt", "palm jumeirah", "business bay"],
  "business bay": ["downtown dubai", "difc", "dubai marina"],
  "palm jumeirah": ["dubai marina", "jbr", "al sufouh"],
};

function normalize(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function tokenize(value: string | undefined) {
  return normalize(value)
    .split(/[^a-z0-9\u0600-\u06FF]+/i)
    .filter((part) => part.length > 2);
}

export function inferBudgetMode(query: string | undefined, explicit?: BudgetMode): BudgetMode {
  if (explicit && explicit !== "unknown") {
    return explicit;
  }
  const normalized = normalize(query);
  if (/\b(max|maximum|under|below|less than|not more than|up to)\b/i.test(normalized)) {
    return "max";
  }
  if (/\b(around|about|average|near|roughly|approximately)\b/i.test(normalized)) {
    return "target";
  }
  return "unknown";
}

export function nearbyAreas(location: string | undefined) {
  const normalized = normalize(location);
  if (!normalized) {
    return [];
  }

  const direct = AREA_GRAPH[normalized] ?? [];
  const partial = Object.entries(AREA_GRAPH)
    .filter(([area]) => normalized.includes(area) || area.includes(normalized))
    .flatMap(([, neighbors]) => neighbors);

  return [...new Set([...direct, ...partial])];
}

function listingText(row: PropertyCompat) {
  return `${row.title} ${row.location} ${row.tags.join(" ")} ${row.description ?? ""} ${row.aiSummary}`.toLowerCase();
}

function semanticFit(row: PropertyCompat, args: SmartPropertySearchArgs) {
  const tokens = tokenize(args.query);
  if (tokens.length === 0) {
    return 0.68;
  }
  const haystack = listingText(row);
  const hits = tokens.filter((token) => haystack.includes(token)).length;
  return Math.min(1, 0.35 + hits / Math.max(tokens.length, 1));
}

function locationFit(row: PropertyCompat, args: SmartPropertySearchArgs, stage: RelaxationStage) {
  const location = normalize(args.location);
  if (!location) {
    return 0.72;
  }
  const rowLocation = normalize(row.location);
  if (rowLocation.includes(location) || location.includes(rowLocation)) {
    return 1;
  }
  const nearby = nearbyAreas(location);
  if (nearby.some((area) => rowLocation.includes(area))) {
    return stage.includes("relaxed") ? 0.76 : 0.84;
  }
  return stage === "broad" ? 0.45 : 0.25;
}

function budgetFit(row: PropertyCompat, args: SmartPropertySearchArgs, mode: BudgetMode, stage: RelaxationStage) {
  if (!row.price) {
    return 0.45;
  }
  const target = args.targetPrice ?? args.maxPrice;
  if (!target && !args.minPrice) {
    return 0.72;
  }
  if (mode === "max" && args.maxPrice) {
    if (row.price <= args.maxPrice) {
      return 1;
    }
    const overage = (row.price - args.maxPrice) / args.maxPrice;
    return stage.includes("relaxed") || stage === "broad" ? Math.max(0.15, 0.7 - overage) : 0;
  }
  if (target) {
    const diff = Math.abs(row.price - target) / target;
    return Math.max(0, 1 - diff * 1.8);
  }
  if (args.minPrice && row.price < args.minPrice) {
    return 0.35;
  }
  return 0.75;
}

function qualitySignals(row: PropertyCompat) {
  let score = 0.35;
  if (row.heroUrl) score += 0.15;
  if (row.description || row.aiSummary) score += 0.2;
  if (row.matchReasons.length > 0) score += 0.15;
  if (row.tags.length > 0) score += 0.15;
  return Math.min(score, 1);
}

function passesStage(row: PropertyCompat, args: SmartPropertySearchArgs, stage: RelaxationStage, mode: BudgetMode) {
  const rowLocation = normalize(row.location);
  const requestedLocation = normalize(args.location);
  const nearby = nearbyAreas(requestedLocation);
  const exactLocation = !requestedLocation || rowLocation.includes(requestedLocation) || requestedLocation.includes(rowLocation);
  const nearbyLocation = exactLocation || nearby.some((area) => rowLocation.includes(area));
  const bedsOk = !args.minBeds || row.beds >= args.minBeds || stage.includes("relaxed") || stage === "broad";

  const priceOk = (() => {
    if (!args.maxPrice || !row.price) return true;
    if (mode === "max") {
      return row.price <= args.maxPrice || stage.includes("relaxed") || stage === "broad";
    }
    const tolerance = stage.includes("relaxed") || stage === "broad" ? 0.35 : 0.2;
    return row.price <= args.maxPrice * (1 + tolerance);
  })();

  if (!bedsOk || !priceOk) {
    return false;
  }
  if (stage === "exact" || stage === "exact_relaxed") {
    return exactLocation;
  }
  if (stage === "nearby" || stage === "nearby_relaxed") {
    return nearbyLocation;
  }
  return true;
}

function rankRow(row: PropertyCompat, args: SmartPropertySearchArgs, stage: RelaxationStage, mode: BudgetMode, index: number): RankedProperty {
  const breakdown = {
    semanticFit: semanticFit(row, args),
    locationFit: locationFit(row, args, stage),
    budgetFit: budgetFit(row, args, mode, stage),
    availabilityFreshness: row._creationTime > 0 ? 0.82 : 0.62,
    userPreferenceFit: 0.55,
    qualitySignals: qualitySignals(row),
    diversityNovelty: Math.max(0.45, 1 - index * 0.03),
  };

  const recommendationScore =
    breakdown.semanticFit * 0.24
    + breakdown.locationFit * 0.20
    + breakdown.budgetFit * 0.18
    + breakdown.availabilityFreshness * 0.12
    + breakdown.userPreferenceFit * 0.12
    + breakdown.qualitySignals * 0.08
    + breakdown.diversityNovelty * 0.06;

  const recommendationReasons = [
    breakdown.locationFit >= 0.8 ? `Strong location fit for ${args.location ?? row.location}.` : null,
    breakdown.budgetFit >= 0.8 ? "Fits the requested budget shape." : null,
    breakdown.semanticFit >= 0.75 ? "Description and tags match the intent." : null,
    stage !== "exact" ? `Included through ${stage.replace("_", " ")} fallback.` : null,
  ].filter((reason): reason is string => Boolean(reason));

  return {
    ...row,
    recommendationScore,
    recommendationReasons,
    relaxationStage: stage,
    scoreBreakdown: breakdown,
  };
}

export function buildGeneratedSearchQuery(args: SmartPropertySearchArgs) {
  return [
    args.query,
    args.location ? `near ${args.location}` : null,
    args.targetPrice ? `around ${args.targetPrice}` : null,
    !args.targetPrice && args.maxPrice ? `max ${args.maxPrice}` : null,
    args.minBeds ? `${args.minBeds}+ beds` : null,
  ].filter(Boolean).join(" ");
}

export function recommendProperties(rows: PropertyCompat[], rawArgs: SmartPropertySearchArgs): SmartPropertySearchResult {
  const mode = inferBudgetMode(rawArgs.query, rawArgs.budgetMode);
  const args = { ...rawArgs, budgetMode: mode };
  const limit = Math.min(args.limit ?? 6, 12);
  const stages: RelaxationStage[] = ["exact", "exact_relaxed", "nearby", "nearby_relaxed", "broad"];
  const ranked = new Map<string, RankedProperty>();
  const relaxedConstraints: string[] = [];

  for (const stage of stages) {
    const stageRows = rows
      .filter((row) => passesStage(row, args, stage, mode))
      .map((row, index) => rankRow(row, args, stage, mode, index))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    if (stageRows.length > 0 && stage !== "exact") {
      relaxedConstraints.push(stage.replace("_", " "));
    }

    for (const row of stageRows) {
      const existing = ranked.get(row.externalId);
      if (!existing || row.recommendationScore > existing.recommendationScore) {
        ranked.set(row.externalId, row);
      }
    }

    if (ranked.size >= limit) {
      break;
    }
  }

  const results = [...ranked.values()]
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);

  const generatedQuery = buildGeneratedSearchQuery(args) || args.location || args.query || "properties";
  return {
    results,
    generatedQuery,
    normalizedQuery: normalize(generatedQuery),
    relaxedConstraints: [...new Set(relaxedConstraints)],
    filters: args,
  };
}
