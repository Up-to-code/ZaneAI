"use node";

import { defineTool } from "@jackchen_me/open-multi-agent";
import { z } from "zod/v3";

import { internal } from "../../../_generated/api";
import { profileOwnerKey } from "../../../shared/namespaces";
import { addToolEvent } from "./audit";
import { jsonToolResult } from "./result";
import type { ToolRuntime } from "../runtimeTypes";

export function updateProfileFactTool(runtime: ToolRuntime) {
  return defineTool({
    name: "update_profile_fact",
    description: "Update an existing promoted profile fact by key.",
    inputSchema: z.object({
      key: z.string(),
      title: z.string().optional(),
      value: z.string().optional(),
      summary: z.string().optional(),
      importance: z.number().min(0).max(1).optional(),
    }),
    execute: async ({ key, ...patch }) => {
      const facts = await runtime.ctx.runQuery(internal.llm.internal.facts.listFactsByOwner, {
        ownerKey: profileOwnerKey(runtime.authUserId),
      });
      const fact = facts.find((item: { _id: string; key: string }) => item.key === key);
      if (!fact) return jsonToolResult({ key, status: "not_found" });
      await runtime.ctx.runMutation(internal.llm.internal.facts.patchKnowledgeFact, { factId: fact._id, ...patch });
      await runtime.ctx.runAction(internal.llm.rag.sync.syncFactToRag, { factId: fact._id });
      await addToolEvent(runtime, "tool:update_profile_fact", "Updated a profile fact.", { key });
      return jsonToolResult({ factId: fact._id, key, status: "updated" });
    },
  });
}
