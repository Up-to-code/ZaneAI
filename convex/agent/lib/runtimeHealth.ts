import type { AgentReasonCode } from "./debugLog";

export const DEFAULT_BACKEND_LLM_MESSAGE = "AI unavailable. Add OPENROUTER_API_KEY or OPENAI_API_KEY to Convex runtime.";
export const DEFAULT_BACKEND_WORKER_MESSAGE = "AI worker offline. Start `npm run convex` so the agent worker can process runs.";

type BuildRuntimeHealthArgs = {
  featureVersion: string;
  llmConfigured: boolean;
  provider: "openrouter" | "openai" | null;
  webSearchConfigured: boolean;
  workerAvailable?: boolean;
  workerLastHeartbeatAt?: number | null;
  workerStaleAfterMs?: number;
};

export function buildAgentRuntimeHealth(args: BuildRuntimeHealthArgs) {
  const reasonCode: AgentReasonCode | undefined = !args.llmConfigured
    ? "missing_llm_key"
    : args.workerAvailable === false
      ? "worker_offline"
      : undefined;

  return {
    reasonCode,
    payload: {
      auth: {
        anonymousEnabled: true,
        emailPasswordEnabled: true,
      },
      llm: {
        configured: args.llmConfigured,
        provider: args.provider,
      },
      webSearch: {
        configured: args.webSearchConfigured,
      },
      featureVersion: args.featureVersion,
      capabilities: {
        sendMessage: true,
        threadMessages: true,
        stageFeed: true,
        runStatus: true,
        workflowRuns: true,
      },
      workflow: {
        configured: true,
        provider: "convex-orchestrator",
      },
      worker: {
        configured: args.llmConfigured,
        available: args.workerAvailable,
        lastHeartbeatAt: args.workerLastHeartbeatAt ?? undefined,
        staleAfterMs: args.workerStaleAfterMs,
      },
      message: !args.llmConfigured
        ? DEFAULT_BACKEND_LLM_MESSAGE
        : args.workerAvailable === false
          ? DEFAULT_BACKEND_WORKER_MESSAGE
          : undefined,
    },
  };
}
