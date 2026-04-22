import type { Doc, Id } from "../../_generated/dataModel";

type AgentEventStatus = "running" | "completed" | "failed" | "cancelled";
type AgentEventType = "stage" | "tool" | "lifecycle";
type AgentEventRoute = "advisor" | "property" | "funding" | "legal" | "mixed";
type AgentMotionPreset = "assistant" | "advisor" | "property" | "funding";

export type AgentEventReplacement = {
  runId: Id<"agentRuns">;
  seq?: number;
  eventType?: AgentEventType;
  phase?: string;
  status?: AgentEventStatus;
  message: string;
  route?: AgentEventRoute;
  specialist?: string;
  motionPreset?: AgentMotionPreset;
  handoffFrom?: string;
  handoffTo?: string;
  details?: string;
  detailsJson?: string;
  createdAt: number;
};

export type LegacyAgentEventRecord = AgentEventReplacement & Record<string, unknown>;

function readOptionalString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function parseDetailsJson(detailsJson: string | undefined): Record<string, unknown> {
  if (!detailsJson) {
    return {};
  }

  try {
    const parsed = JSON.parse(detailsJson) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { ...(parsed as Record<string, unknown>) };
    }
  } catch {
    return { legacyRawDetailsJson: detailsJson };
  }

  return { legacyRawDetailsJson: detailsJson };
}

export function hasLegacyAgentEventFields(record: Record<string, unknown>) {
  return readOptionalString(record, "teamId") !== undefined || readOptionalString(record, "agentName") !== undefined;
}

export function mergeLegacyAgentEventDetails(record: LegacyAgentEventRecord) {
  const legacyTeamId = readOptionalString(record, "teamId");
  const legacyAgentName = readOptionalString(record, "agentName");
  const details = parseDetailsJson(record.detailsJson);

  if (legacyTeamId !== undefined) {
    details.legacyTeamId = legacyTeamId;
  }
  if (legacyAgentName !== undefined) {
    details.legacyAgentName = legacyAgentName;
  }

  return Object.keys(details).length > 0 ? JSON.stringify(details) : undefined;
}

export function normalizeLegacyAgentEvent(record: LegacyAgentEventRecord): AgentEventReplacement {
  return {
    runId: record.runId,
    seq: record.seq,
    eventType: record.eventType,
    phase: record.phase,
    status: record.status,
    message: record.message,
    route: record.route,
    specialist: record.specialist,
    motionPreset: record.motionPreset,
    handoffFrom: record.handoffFrom,
    handoffTo: record.handoffTo,
    details: record.details,
    detailsJson: mergeLegacyAgentEventDetails(record),
    createdAt: record.createdAt,
  };
}

export function asLegacyAgentEventRecord(record: Doc<"agentEvents">): LegacyAgentEventRecord {
  return record as unknown as LegacyAgentEventRecord;
}
