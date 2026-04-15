import test from "node:test";
import assert from "node:assert/strict";

import {
  buyerAssistantTurnSchema,
  extractBuyerTurnPropertyIds,
} from "../../../../packages/zayon-assistant-protocol/src";

test("buyer assistant turn schema accepts a shortlist response", () => {
  const turn = buyerAssistantTurnSchema.parse({
    version: "buyer_turn.v1",
    intent: "property_search",
    objective: "Find premium waterfront homes",
    status: "completed",
    assistantText: "I shortlisted the strongest waterfront matches for you.",
    propertyIds: ["prop-1", "prop-2"],
    rankingRationale: "These options balance prestige, livability, and resale confidence.",
    cards: [
      {
        type: "shortlist",
        id: "shortlist-1",
        title: "Best matches",
        propertyIds: ["prop-1", "prop-2"],
      },
      {
        type: "actions",
        id: "actions-1",
        actionIds: ["open-1"],
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

  assert.deepEqual(extractBuyerTurnPropertyIds(turn), ["prop-1", "prop-2"]);
});

test("buyer assistant turn schema rejects invalid action payloads", () => {
  assert.throws(() =>
    buyerAssistantTurnSchema.parse({
      version: "buyer_turn.v1",
      intent: "property_search",
      objective: "Broken payload",
      status: "completed",
      assistantText: "Broken",
      propertyIds: ["prop-1"],
      rankingRationale: "Broken",
      cards: [
        {
          type: "actions",
          id: "actions-1",
          actionIds: ["bad-1"],
        },
      ],
      actions: [
        {
          id: "bad-1",
          title: "Bad action",
          name: "open_property",
          payload: { brokerId: "broker-1" },
        },
      ],
    }));
});
