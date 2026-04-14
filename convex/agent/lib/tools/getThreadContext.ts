"use node";

import { defineTool } from "@jackchen_me/open-multi-agent";
import { listMessages } from "@convex-dev/agent";
import { z } from "zod";

import { agentComponent } from "../component";
import { addToolEvent } from "./audit";
import { jsonToolResult } from "./result";
import type { ToolRuntime } from "../runtimeTypes";

export function getThreadContextTool(runtime: ToolRuntime) {
  return defineTool({
    name: "get_thread_context",
    description: "Read recent messages from the active thread only.",
    inputSchema: z.object({ limit: z.number().int().min(1).max(12).optional() }),
    execute: async ({ limit }) => {
      const result = await listMessages(runtime.ctx, agentComponent, {
        threadId: runtime.threadId,
        paginationOpts: { cursor: null, numItems: limit ?? 8 },
      });
      const messages = result.page.reverse().map((item) => ({ role: item.message?.role, text: item.text ?? "" }));
      await addToolEvent(runtime, "tool:get_thread_context", "Loaded active thread context.", { count: messages.length });
      return jsonToolResult({ threadId: runtime.threadId, messages });
    },
  });
}
