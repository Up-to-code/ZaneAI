import type { QueryCtx } from "../../_generated/server";
import type { Doc } from "../../_generated/dataModel";
import { demoProperties } from "../../shared/demoProperties";

export type PropertyDoc = Doc<"properties">;

function mapDemoProperty(row: (typeof demoProperties)[number]): PropertyDoc {
  return {
    _id: `demo:${row.externalId}` as PropertyDoc["_id"],
    _creationTime: 0,
    externalId: row.externalId,
    sourceId: row.externalId,
    sourceUrl: undefined,
    organizationId: undefined,
    title: row.title,
    description: row.aiSummary,
    price: row.price,
    priceLabel: row.priceLabel,
    location: row.location,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    heroUrl: row.heroUrl,
    matchScore: row.matchScore,
    matchReasons: row.matchReasons,
    aiSummary: row.aiSummary,
    tags: row.tags,
    amenities: [],
    broker: undefined,
    priceAnalysis: undefined,
    createdAt: 0,
    updatedAt: 0,
  };
}

export function isDemoCatalogEnabled() {
  return process.env.NODE_ENV !== "production";
}

export async function listCatalogProperties(ctx: QueryCtx, limit: number) {
  const rows = await ctx.db.query("properties").take(limit);
  if (rows.length > 0 || !isDemoCatalogEnabled()) {
    return rows;
  }
  return demoProperties.slice(0, limit).map(mapDemoProperty);
}

export async function getCatalogPropertyByExternalId(ctx: QueryCtx, externalId: string) {
  const property = await ctx.db
    .query("properties")
    .withIndex("by_externalId", (q) => q.eq("externalId", externalId))
    .unique();
  if (property || !isDemoCatalogEnabled()) {
    return property;
  }
  const demo = demoProperties.find((item) => item.externalId === externalId);
  return demo ? mapDemoProperty(demo) : null;
}
