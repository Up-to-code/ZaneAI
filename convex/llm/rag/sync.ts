"use node";

import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";
import { hasOpenAIKey } from "../../shared/env";
import { factText } from "../lib/factText";
import { rag } from "./client";

export async function syncFactRecord(ctx: any, fact: {
  _id: string;
  ownerKey: string;
  key: string;
  title: string;
  value: string;
  summary: string;
}) {
  const result = await rag.add(ctx, {
    namespace: fact.ownerKey,
    key: fact.key,
    text: factText(fact),
  });
  await ctx.runMutation(internal.llm.internal.facts.markKnowledgeFactSync, {
    factId: fact._id,
    syncStatus: result.status,
    ragEntryId: result.entryId,
  });
  return result.entryId;
}

export const syncFactToRag = internalAction({
  args: { factId: v.id("knowledgeFacts") },
  handler: async (ctx, args): Promise<string | null> => {
    const fact: {
      _id: string;
      ownerKey: string;
      key: string;
      title: string;
      value: string;
      summary: string;
    } | null = await ctx.runQuery(internal.llm.internal.facts.getFactById, args);
    if (!fact || !hasOpenAIKey()) {
      await ctx.runMutation(internal.llm.internal.facts.markKnowledgeFactSync, {
        factId: args.factId,
        syncStatus: fact ? "skipped" : "missing",
      });
      return null;
    }
    return await syncFactRecord(ctx, fact);
  },
});
