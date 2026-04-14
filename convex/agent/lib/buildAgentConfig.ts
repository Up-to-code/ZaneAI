import type { z } from "zod";

import { getAgentModel, getLlmApiKey, getOpenRouterBaseUrl } from "../../shared/env";
import type { AgentRuntimeConfig } from "./runtimeTypes";

export function buildAgentConfig(args: {
  role: AgentRuntimeConfig["role"];
  name: string;
  systemPrompt: string;
  outputSchema: z.ZodTypeAny;
  tools: readonly string[];
}): AgentRuntimeConfig {
  return {
    role: args.role,
    name: args.name,
    provider: "openai",
    apiKey: getLlmApiKey() ?? undefined,
    baseURL: getOpenRouterBaseUrl(),
    model: getAgentModel(args.role),
    systemPrompt: args.systemPrompt,
    tools: args.tools,
    outputSchema: args.outputSchema,
    temperature: 0.2,
    maxTurns: 6,
    timeoutMs: 45_000,
  };
}
