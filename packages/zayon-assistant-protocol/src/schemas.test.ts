import test from "node:test";
import assert from "node:assert/strict";

import { assistantTurnSchema, extractTurnPropertyIds } from "./schemas";

test("assistant turn schema accepts a property shortlist response", () => {
  const parsed = assistantTurnSchema.parse({
    version: "assistant_turn.v1",
    route: "property",
    status: "completed",
    assistantText: "I found the strongest matches for your brief.",
    blocks: [
      {
        type: "property_list",
        id: "shortlist",
        title: "Top matches",
        propertyIds: ["prop-1", "prop-2"],
      },
      {
        type: "actions",
        id: "actions",
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
    agent: {
      primaryAgent: "property",
      participatingAgents: ["orchestrator", "property", "summary"],
      handoffs: [],
      confidence: 0.91,
    },
    motion: {
      preset: "property",
      emphasis: "medium",
    },
  });

  assert.deepEqual(extractTurnPropertyIds(parsed), ["prop-1", "prop-2"]);
});

test("assistant turn schema rejects invalid action payloads", () => {
  assert.throws(() =>
    assistantTurnSchema.parse({
      version: "assistant_turn.v1",
      route: "property",
      status: "completed",
      assistantText: "Broken",
      blocks: [
        {
          type: "actions",
          id: "actions",
          actionIds: ["bad-1"],
        },
      ],
      actions: [
        {
          id: "bad-1",
          title: "Broken",
          name: "open_property",
          payload: { brokerId: "broker-1" },
        },
      ],
      agent: {
        primaryAgent: "property",
        participatingAgents: ["property"],
        handoffs: [],
      },
      motion: {
        preset: "property",
      },
    }));
});
