import type { AgentRunResult } from "@jackchen_me/open-multi-agent";

export function requireStructured<T>(result: AgentRunResult, agentName: string) {
  if (!result.success || !result.structured) {
    throw new Error(`${agentName} failed: ${result.output || "No structured output returned."}`);
  }
  return result.structured as T;
}

export function tokenUnits(...results: AgentRunResult[]) {
  return results.reduce((sum, result) => sum + result.tokenUsage.input_tokens + result.tokenUsage.output_tokens, 0);
}
