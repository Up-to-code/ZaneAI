"use node";

import { defineTool } from "@jackchen_me/open-multi-agent";
import { z } from "zod/v3";

import { internal } from "../../../_generated/api";
import { addToolEvent } from "./audit";
import { jsonToolResult } from "./result";
import type { ToolRuntime } from "../runtimeTypes";

export function listSavedPropertiesTool(runtime: ToolRuntime) {
  return defineTool({
    name: "list_saved_properties",
    description: "List the user's saved properties for preference context.",
    inputSchema: z.object({}),
    execute: async () => {
      const rows = await runtime.ctx.runQuery(internal.property.internal.listSavedProperties.listSavedProperties, {
        authUserId: runtime.authUserId,
      });
      await addToolEvent(runtime, "tool:list_saved_properties", "Loaded saved properties.", { count: rows.length });
      return jsonToolResult({ results: rows });
    },
  });
}
