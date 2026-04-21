import { getWorkspaceMarketSnapshot } from "@/server/market";
import { mapMarketSnapshotToPageModel } from "./marketViewModel";
import type { WorkspaceMarketPageModel } from "../../types/marketTypes";

type MarketSearchParams = {
  city?: string | string[];
  area?: string | string[];
  query?: string | string[];
  dateFrom?: string | string[];
  dateTo?: string | string[];
  windowDays?: string | string[];
};

function pickString(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseWindowDays(value?: string): 30 | 90 | 180 | undefined {
  if (value === "30" || value === "90" || value === "180") {
    return Number(value) as 30 | 90 | 180;
  }
  return undefined;
}

function parseMarketDate(value?: string): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10) === value ? value : undefined;
}

/**
 * WHY:   All market analysis routes should load the same server snapshot logic instead of duplicating search-param parsing.
 * WHAT:  Resolves the current market page model from route search params.
 * HOW:   Parses the shared market filters once, calls the market service, then maps the snapshot into the UI model.
 */
export async function loadMarketPageModel(searchParams: Promise<MarketSearchParams>): Promise<WorkspaceMarketPageModel> {
  const resolvedSearchParams = await searchParams;
  const dateFrom = parseMarketDate(pickString(resolvedSearchParams.dateFrom));
  const dateTo = parseMarketDate(pickString(resolvedSearchParams.dateTo));
  const snapshot = await getWorkspaceMarketSnapshot({
    city: pickString(resolvedSearchParams.city),
    area: pickString(resolvedSearchParams.area),
    query: pickString(resolvedSearchParams.query),
    dateFrom: dateFrom && dateTo ? dateFrom : undefined,
    dateTo: dateFrom && dateTo ? dateTo : undefined,
    windowDays: parseWindowDays(pickString(resolvedSearchParams.windowDays)),
  });

  return mapMarketSnapshotToPageModel(snapshot);
}
