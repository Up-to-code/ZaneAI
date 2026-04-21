import type { PropertyCompat } from "./catalog";

export type TypesenseSearchConfig = {
  host?: string;
  apiKey?: string;
  collection?: string;
  protocol?: string;
  port?: string;
};

export function getTypesenseConfig(): TypesenseSearchConfig {
  return {
    host: process.env.TYPESENSE_HOST,
    apiKey: process.env.TYPESENSE_API_KEY,
    collection: process.env.TYPESENSE_COLLECTION ?? "zaneai_properties",
    protocol: process.env.TYPESENSE_PROTOCOL ?? "https",
    port: process.env.TYPESENSE_PORT,
  };
}

export function isTypesenseConfigured(config = getTypesenseConfig()) {
  return Boolean(config.host && config.apiKey && config.collection);
}

export async function searchTypesensePropertyIds(args: {
  query: string;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  minBeds?: number;
  limit?: number;
}, config = getTypesenseConfig()): Promise<string[]> {
  if (!isTypesenseConfigured(config)) {
    return [];
  }

  const port = config.port ? `:${config.port}` : "";
  const url = new URL(`${config.protocol}://${config.host}${port}/collections/${config.collection}/documents/search`);
  url.searchParams.set("q", args.query || "*");
  url.searchParams.set("query_by", "title,summary,aiSummary,location,normalizedArea,tags,amenities");
  url.searchParams.set("per_page", String(Math.min(args.limit ?? 30, 50)));

  const filters = ["status:=active"];
  if (args.location) {
    filters.push(`location:=[${args.location}]`);
  }
  if (args.maxPrice) {
    filters.push(`price:<=${args.maxPrice}`);
  }
  if (args.minPrice) {
    filters.push(`price:>=${args.minPrice}`);
  }
  if (args.minBeds) {
    filters.push(`bedrooms:>=${args.minBeds}`);
  }
  url.searchParams.set("filter_by", filters.join(" && "));

  const response = await fetch(url, {
    headers: { "x-typesense-api-key": config.apiKey! },
  });
  if (!response.ok) {
    return [];
  }

  const payload = await response.json() as {
    hits?: Array<{ document?: { id?: string; externalId?: string; _id?: string } }>;
  };
  return (payload.hits ?? [])
    .map((hit) => hit.document?.externalId ?? hit.document?.id ?? hit.document?._id)
    .filter((id): id is string => Boolean(id));
}

export function orderRowsByTypesenseIds(rows: PropertyCompat[], orderedIds: string[]) {
  if (orderedIds.length === 0) {
    return rows;
  }
  const rank = new Map(orderedIds.map((id, index) => [id, index]));
  return [...rows].sort((a, b) => (rank.get(a.externalId) ?? rows.length) - (rank.get(b.externalId) ?? rows.length));
}
