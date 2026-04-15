"use node";

import { defineTool } from "@jackchen_me/open-multi-agent";
import { z } from "zod/v3";

import { internal } from "../../../_generated/api";
import { rag } from "../../../llm/rag/client";
import { hasOpenAIKey } from "../../../shared/env";
import { profileOwnerKey } from "../../../shared/namespaces";
import { addToolEvent } from "./audit";
import { jsonToolResult } from "./result";
import type { ToolRuntime } from "../runtimeTypes";

export function searchProfileMemoryTool(runtime: ToolRuntime) {
  return defineTool({
    name: "search_profile_memory",
    description: "Retrieve promoted profile facts for the current authenticated user.",
    inputSchema: z.object({ query: z.string(), limit: z.number().int().min(1).max(6).optional() }),
    execute: async ({ query, limit }) => {
      const ownerKey = profileOwnerKey(runtime.authUserId);
      if (hasOpenAIKey()) {
        const result = await rag.search(runtime.ctx, { namespace: ownerKey, query, limit: limit ?? 5 });
        const matches = result.entries.map((entry) => ({ key: entry.key ?? "unknown", text: entry.text }));
        await addToolEvent(runtime, "tool:search_profile_memory", "Searched profile memory via RAG.", { count: matches.length });
        return jsonToolResult({ mode: "rag", matches });
      }
      const facts = await runtime.ctx.runQuery(internal.llm.internal.facts.listFactsByOwner, { ownerKey });
      const matches = facts.filter((fact: { title: string; value: string; summary: string }) =>
        `${fact.title} ${fact.value} ${fact.summary}`.toLowerCase().includes(query.toLowerCase()));
      await addToolEvent(runtime, "tool:search_profile_memory", "Searched profile memory via fact fallback.", { count: matches.length });
      return jsonToolResult({ mode: "facts", matches: matches.slice(0, limit ?? 5) });
    },
  });
}
