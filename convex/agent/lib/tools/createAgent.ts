"use node";

import { Agent, ToolExecutor, ToolRegistry } from "@jackchen_me/open-multi-agent";
import type { ToolDefinition } from "@jackchen_me/open-multi-agent";

import type { AgentRuntimeConfig } from "../runtimeTypes";

export function createAgent(config: AgentRuntimeConfig, tools: ToolDefinition<any>[]) {
  const registry = new ToolRegistry();
  const executor = new ToolExecutor(registry);
  const agent = new Agent(config, registry, executor);
  tools.forEach((tool) => agent.addTool(tool));
  return agent;
}
