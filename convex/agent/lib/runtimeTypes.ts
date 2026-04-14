import type { AgentConfig } from "@jackchen_me/open-multi-agent";
import type { z } from "zod";

import type { ActionCtx } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";
import type { AgentRole } from "../../shared/types";

export type AgentRuntimeConfig = AgentConfig & { role: AgentRole };
export type TeamRuntimeConfig = {
  name: string;
  agents: AgentRuntimeConfig[];
  memoryPolicy: string;
  orchestrationRules: string[];
};

export type ToolRuntime = {
  ctx: ActionCtx;
  authUserId: string;
  threadId: string;
  runId: Id<"agentRuns">;
};

export type WebSource = { title: string; url: string; snippet: string };

export type StructuredResult<TSchema extends z.ZodTypeAny> = z.infer<TSchema>;

export type TeamTurnResult = {
  summary: string;
  rankingRationale: string;
  propertyIds: string[];
  sources: WebSource[];
  diagnostics: string[];
  tokenUnits: number;
};
