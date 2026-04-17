import test from "node:test";
import assert from "node:assert/strict";

import type { Id } from "../../_generated/dataModel";

import {
  hasLegacyAssistantTurnFields,
  mergeLegacyAssistantTurnMeta,
  normalizeLegacyAssistantTurn,
  type LegacyAssistantTurnRecord,
} from "./legacyAssistantTurns";

function makeTurn(overrides: Partial<LegacyAssistantTurnRecord> = {}): LegacyAssistantTurnRecord {
  return {
    authUserId: "user_123",
    threadId: "thread_123",
    runId: "run_123" as Id<"agentRuns">,
    messageId: "message_123",
    assistantText: "Legacy buyer turn",
    turnVersion: "buyer_turn.v1",
    status: "no_match",
    propertyIds: [],
    turnJson: "{\"version\":\"buyer_turn.v1\"}",
    createdAt: 1776378184471,
    updatedAt: 1776378184471,
    ...overrides,
  };
}

test("detects legacy assistant turns missing route", () => {
  assert.equal(hasLegacyAssistantTurnFields(makeTurn()), true);
});

test("detects legacy assistant turns with removed fields", () => {
  assert.equal(
    hasLegacyAssistantTurnFields(
      makeTurn({ route: "property", recommendationBatchId: "batch_123" }),
    ),
    true,
  );
});

test("merges legacy assistant metadata into metaJson", () => {
  const metaJson = mergeLegacyAssistantTurnMeta(
    makeTurn({
      intent: "no_match",
      rankingRationale: "No properties to rank.",
      recommendationBatchId: "batch_123",
      metaJson: JSON.stringify({ diagnostics: ["legacy"], kept: true }),
    }),
  );

  assert.deepEqual(JSON.parse(metaJson ?? "{}"), {
    diagnostics: ["legacy"],
    kept: true,
    legacyIntent: "no_match",
    legacyRankingRationale: "No properties to rank.",
    legacyRecommendationBatchId: "batch_123",
  });
});

test("preserves invalid metaJson as legacyRawMetaJson", () => {
  const metaJson = mergeLegacyAssistantTurnMeta(
    makeTurn({
      intent: "no_match",
      metaJson: "{bad json",
    }),
  );

  assert.deepEqual(JSON.parse(metaJson ?? "{}"), {
    legacyRawMetaJson: "{bad json",
    legacyIntent: "no_match",
  });
});

test("normalizeLegacyAssistantTurn backfills route and drops legacy fields", () => {
  const normalized = normalizeLegacyAssistantTurn(
    makeTurn({
      intent: "no_match",
      rankingRationale: "No properties to rank.",
      recommendationBatchId: "batch_123",
    }),
  ) as Record<string, unknown>;

  assert.equal(normalized.route, "property");
  assert.equal("intent" in normalized, false);
  assert.equal("rankingRationale" in normalized, false);
  assert.equal("recommendationBatchId" in normalized, false);
  assert.deepEqual(JSON.parse(String(normalized.metaJson)), {
    legacyIntent: "no_match",
    legacyRankingRationale: "No properties to rank.",
    legacyRecommendationBatchId: "batch_123",
  });
});
