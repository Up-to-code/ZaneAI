"use node";

import { defineTool } from "@jackchen_me/open-multi-agent";
import { z } from "zod/v3";

import { internal } from "../../../_generated/api";
import { profileOwnerKey } from "../../../shared/namespaces";
import { addToolEvent } from "./audit";
import { jsonToolResult } from "./result";
import type { ToolRuntime } from "../runtimeTypes";

export function promoteProfileFactTool(runtime: ToolRuntime) {
  return defineTool({
    name: "promote_profile_fact",
    description: "Save a durable user fact into personal profile memory.",
    inputSchema: z.object({
      key: z.string(),
      title: z.string(),
      value: z.string(),
      summary: z.string(),
      importance: z.number().min(0).max(1).optional(),
    }),
    execute: async (input) => {
      const factId = await runtime.ctx.runMutation(internal.llm.internal.facts.upsertKnowledgeFact, {
        ...input,
        ownerKey: profileOwnerKey(runtime.authUserId),
        authUserId: runtime.authUserId,
        scope: "personal",
        source: "agent",
        importance: input.importance ?? 0.9,
      });
      await runtime.ctx.runAction(internal.llm.rag.sync.syncFactToRag, { factId });
      await addToolEvent(runtime, "tool:promote_profile_fact", "Promoted a profile fact.", { key: input.key });
      return jsonToolResult({ factId, key: input.key, status: "saved" });
    },
  });
}
