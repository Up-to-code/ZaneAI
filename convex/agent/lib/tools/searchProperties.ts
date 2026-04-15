"use node";

import { defineTool } from "@jackchen_me/open-multi-agent";
import { z } from "zod/v3";

import { internal } from "../../../_generated/api";
import { makeCacheScopeKey } from "../../../llm/cache/client";
import { hashText } from "../../../llm/cache/hash";
import { addToolEvent } from "./audit";
import { jsonToolResult } from "./result";
import type { ToolRuntime } from "../runtimeTypes";

export function searchPropertiesTool(runtime: ToolRuntime) {
  return defineTool({
    name: "search_properties",
    description: "Search the property inventory with bounded filters.",
    inputSchema: z.object({
      query: z.string().optional(),
      location: z.string().optional(),
      maxPrice: z.number().optional(),
      minBeds: z.number().optional(),
      limit: z.number().int().min(1).max(10).optional(),
    }),
    execute: async (input) => {
      const inputHash = await hashText(JSON.stringify(input));
      const cache = await runtime.ctx.runQuery(internal.llm.cache.internal.getCacheEntry, {
        scopeKey: makeCacheScopeKey(runtime.authUserId),
        kind: "property_search",
        model: "search_properties_v1",
        inputHash,
      });
      const rows = cache ? JSON.parse(cache.payload) : await runtime.ctx.runQuery(internal.property.internal.searchProperties.searchProperties, input);
      if (!cache) await runtime.ctx.runMutation(internal.llm.cache.internal.putCacheEntry, {
        scopeKey: makeCacheScopeKey(runtime.authUserId),
        kind: "property_search",
        model: "search_properties_v1",
        inputHash,
        payload: JSON.stringify(rows),
        version: 1,
        expiresAt: Date.now() + 30 * 60 * 1000,
      });
      await addToolEvent(runtime, "tool:search_properties", "Searched candidate properties.", { count: rows.length, input });
      return jsonToolResult({ results: rows, cached: Boolean(cache) });
    },
  });
}
