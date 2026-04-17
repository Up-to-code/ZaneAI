import { Migrations } from "@convex-dev/migrations";

import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { internalMutation, internalQuery } from "./_generated/server";
import {
  asLegacyAgentEventRecord,
  hasLegacyAgentEventFields,
  normalizeLegacyAgentEvent,
} from "./agent/lib/legacyAgentEvents";
import {
  hasLegacyAssistantTurnFields,
  normalizeLegacyAssistantTurn,
  type LegacyAssistantTurnRecord,
} from "./agent/lib/legacyAssistantTurns";

export const migrations = new Migrations<DataModel>(components.migrations, {
  internalMutation,
});

export const migrateLegacyAgentEvents = migrations.define({
  table: "agentEvents",
  migrateOne: async (ctx, doc) => {
    const record = asLegacyAgentEventRecord(doc);
    if (!hasLegacyAgentEventFields(record)) {
      return;
    }

    await ctx.db.replace(doc._id, normalizeLegacyAgentEvent(record));
  },
});

export const migrateLegacyAssistantTurns = migrations.define({
  table: "assistantTurns",
  migrateOne: async (ctx, doc) => {
    const record = doc as unknown as LegacyAssistantTurnRecord;
    if (!hasLegacyAssistantTurnFields(record)) {
      return;
    }

    await ctx.db.replace(doc._id, normalizeLegacyAssistantTurn(record));
  },
});

export const run = migrations.runner();

export const runMigrateLegacyAgentEvents = migrations.runner(
  internal.migrations.migrateLegacyAgentEvents,
);

export const runMigrateLegacyAssistantTurns = migrations.runner(
  internal.migrations.migrateLegacyAssistantTurns,
);

export const countLegacyMigrationRecords = internalQuery({
  args: {},
  handler: async (ctx) => {
    let agentEvents = 0;
    let assistantTurns = 0;

    for await (const row of ctx.db.query("agentEvents")) {
      if (hasLegacyAgentEventFields(row as Record<string, unknown>)) {
        agentEvents += 1;
      }
    }

    for await (const row of ctx.db.query("assistantTurns")) {
      if (hasLegacyAssistantTurnFields(row as Record<string, unknown>)) {
        assistantTurns += 1;
      }
    }

    return { agentEvents, assistantTurns };
  },
});
