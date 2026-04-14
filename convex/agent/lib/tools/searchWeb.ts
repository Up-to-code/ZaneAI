"use node";

import { defineTool } from "@jackchen_me/open-multi-agent";
import { z } from "zod";

import { getTavilyApiKey } from "../../../shared/env";
import { addToolEvent } from "./audit";
import { jsonToolResult } from "./result";
import type { ToolRuntime } from "../runtimeTypes";

export function searchWebTool(runtime: ToolRuntime) {
  return defineTool({
    name: "search_web",
    description: "Search the web with Tavily for market context and citations.",
    inputSchema: z.object({ query: z.string(), topic: z.string().optional(), limit: z.number().int().min(1).max(5).optional() }),
    execute: async ({ query, topic, limit }) => {
      const apiKey = getTavilyApiKey();
      if (!apiKey) return jsonToolResult({ status: "unavailable", results: [] });
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, query, topic, max_results: limit ?? 4, search_depth: "advanced" }),
      });
      const payload = await response.json();
      const results = (payload.results ?? []).map((item: any) => ({
        title: item.title ?? item.url,
        url: item.url,
        snippet: item.content ?? "",
      }));
      await addToolEvent(runtime, "tool:search_web", "Ran Tavily web search.", { count: results.length, query });
      return jsonToolResult({ status: response.ok ? "ok" : "error", results });
    },
  });
}
