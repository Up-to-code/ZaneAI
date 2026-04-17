import test from "node:test";
import assert from "node:assert/strict";

import type { Id } from "../../_generated/dataModel";

import {
  hasLegacyAgentEventFields,
  mergeLegacyAgentEventDetails,
  normalizeLegacyAgentEvent,
  type LegacyAgentEventRecord,
} from "./legacyAgentEvents";

function makeEvent(overrides: Partial<LegacyAgentEventRecord> = {}): LegacyAgentEventRecord {
  return {
    runId: "run_123" as Id<"agentRuns">,
    seq: 2,
    eventType: "stage",
    phase: "intent_done",
    status: "completed",
    message: "Buyer intent resolved; launching search and preference work.",
    createdAt: 1776424890049,
    ...overrides,
  };
}

test("detects legacy teamId rows", () => {
  assert.equal(hasLegacyAgentEventFields(makeEvent({ teamId: "buyer-team" })), true);
});

test("detects legacy agentName rows", () => {
  assert.equal(hasLegacyAgentEventFields(makeEvent({ agentName: "search-agent" })), true);
});

test("merges both legacy fields into existing detailsJson object", () => {
  const detailsJson = mergeLegacyAgentEventDetails(
    makeEvent({
      teamId: "buyer-team",
      agentName: "search-agent",
      detailsJson: JSON.stringify({ source: "legacy", kept: true }),
    }),
  );

  assert.deepEqual(JSON.parse(detailsJson ?? "{}"), {
    source: "legacy",
    kept: true,
    legacyTeamId: "buyer-team",
    legacyAgentName: "search-agent",
  });
});

test("preserves invalid detailsJson as legacyRawDetailsJson", () => {
  const detailsJson = mergeLegacyAgentEventDetails(
    makeEvent({
      teamId: "buyer-team",
      detailsJson: "{bad json",
    }),
  );

  assert.deepEqual(JSON.parse(detailsJson ?? "{}"), {
    legacyRawDetailsJson: "{bad json",
    legacyTeamId: "buyer-team",
  });
});

test("normalizeLegacyAgentEvent removes legacy fields and preserves canonical ones", () => {
  const normalized = normalizeLegacyAgentEvent(
    makeEvent({
      teamId: "buyer-team",
      agentName: "search-agent",
      route: "advisor",
      specialist: "summary",
      motionPreset: "assistant",
      details: "legacy-details",
    }),
  ) as Record<string, unknown>;

  assert.equal("teamId" in normalized, false);
  assert.equal("agentName" in normalized, false);
  assert.equal(normalized.phase, "intent_done");
  assert.equal(normalized.route, "advisor");
  assert.equal(normalized.specialist, "summary");
  assert.equal(normalized.motionPreset, "assistant");
  assert.equal(normalized.details, "legacy-details");
  assert.deepEqual(JSON.parse(String(normalized.detailsJson)), {
    legacyTeamId: "buyer-team",
    legacyAgentName: "search-agent",
  });
});
