import test from "node:test";
import assert from "node:assert/strict";

import { buyerAssistantTurnSchema } from "./schemas";

test("accepts a valid buyer assistant turn", () => {
  const parsed = buyerAssistantTurnSchema.parse({
    version: "buyer_turn.v1",
    intent: "property_search",
    objective: "Find premium waterfront options",
    status: "completed",
    assistantText: "I found strong waterfront matches for your brief.",
    propertyIds: ["prop-1", "prop-2"],
    rankingRationale: "These options balance prestige and rental resilience.",
    cards: [
      {
        type: "shortlist",
        id: "shortlist-1",
        title: "Top matches",
        propertyIds: ["prop-1", "prop-2"],
      },
    ],
    actions: [
      {
        id: "open-1",
        title: "Open property",
        name: "open_property",
        payload: { propertyId: "prop-1" },
      },
    ],
  });

  assert.equal(parsed.intent, "property_search");
});

test("rejects an invalid buyer assistant turn", () => {
  assert.throws(() =>
    buyerAssistantTurnSchema.parse({
      version: "buyer_turn.v1",
      intent: "property_search",
      objective: "Broken",
      status: "completed",
      assistantText: "Broken",
      propertyIds: [],
      rankingRationale: "Missing cards",
      cards: [],
      actions: [],
    }));
});
