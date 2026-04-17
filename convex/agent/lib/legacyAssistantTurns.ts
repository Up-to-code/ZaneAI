import type { Id } from "../../_generated/dataModel";

type AssistantTurnRoute = "advisor" | "property" | "funding" | "mixed";

export type AssistantTurnReplacement = {
  authUserId: string;
  threadId: string;
  runId: Id<"agentRuns">;
  messageId: string;
  assistantText: string;
  turnVersion: string;
  route: AssistantTurnRoute;
  status: string;
  propertyIds: string[];
  turnJson: string;
  metaJson?: string;
  createdAt: number;
  updatedAt: number;
};

type LegacyAssistantTurnReplacement = Omit<AssistantTurnReplacement, "route"> & {
  route?: AssistantTurnRoute;
};

export type LegacyAssistantTurnRecord = LegacyAssistantTurnReplacement & Record<string, unknown>;

function readOptionalString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function parseMetaJson(metaJson: string | undefined): Record<string, unknown> {
  if (!metaJson) {
    return {};
  }

  try {
    const parsed = JSON.parse(metaJson) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { ...(parsed as Record<string, unknown>) };
    }
  } catch {
    return { legacyRawMetaJson: metaJson };
  }

  return { legacyRawMetaJson: metaJson };
}

function isAssistantTurnRoute(value: string | undefined): value is AssistantTurnRoute {
  return value === "advisor" || value === "property" || value === "funding" || value === "mixed";
}

export function hasLegacyAssistantTurnFields(record: Record<string, unknown>) {
  return !isAssistantTurnRoute(readOptionalString(record, "route"))
    || readOptionalString(record, "intent") !== undefined
    || readOptionalString(record, "rankingRationale") !== undefined
    || readOptionalString(record, "recommendationBatchId") !== undefined;
}

export function inferAssistantTurnRoute(record: Record<string, unknown>): AssistantTurnRoute {
  const route = readOptionalString(record, "route");
  return isAssistantTurnRoute(route) ? route : "property";
}

export function mergeLegacyAssistantTurnMeta(record: LegacyAssistantTurnRecord) {
  const legacyIntent = readOptionalString(record, "intent");
  const legacyRankingRationale = readOptionalString(record, "rankingRationale");
  const legacyRecommendationBatchId = readOptionalString(record, "recommendationBatchId");
  const meta = parseMetaJson(record.metaJson);

  if (legacyIntent !== undefined) {
    meta.legacyIntent = legacyIntent;
  }
  if (legacyRankingRationale !== undefined) {
    meta.legacyRankingRationale = legacyRankingRationale;
  }
  if (legacyRecommendationBatchId !== undefined) {
    meta.legacyRecommendationBatchId = legacyRecommendationBatchId;
  }

  return Object.keys(meta).length > 0 ? JSON.stringify(meta) : undefined;
}

export function normalizeLegacyAssistantTurn(record: LegacyAssistantTurnRecord): AssistantTurnReplacement {
  return {
    authUserId: record.authUserId,
    threadId: record.threadId,
    runId: record.runId,
    messageId: record.messageId,
    assistantText: record.assistantText,
    turnVersion: record.turnVersion,
    route: inferAssistantTurnRoute(record),
    status: record.status,
    propertyIds: record.propertyIds,
    turnJson: record.turnJson,
    metaJson: mergeLegacyAssistantTurnMeta(record),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
