import { query } from "../../_generated/server";
import {
  AGENT_FEATURE_VERSION,
  getLlmProvider,
  hasLlmApiKey,
  getTavilyApiKey,
} from "../../shared/env";
import { buildAgentRuntimeHealth } from "../lib/runtimeHealth";
import { AGENT_WORKER_STALE_AFTER_MS, getLatestWorkerHeartbeat, isWorkerAvailable } from "../lib/workerHealth";
import { logAgentEvent } from "../lib/debugLog";

export const getRuntimeHealth = query({
  args: {},
  handler: async (ctx) => {
    const llmConfigured = hasLlmApiKey();
    const latestWorker = await getLatestWorkerHeartbeat(ctx);
    const workerAvailable = isWorkerAvailable(latestWorker);
    const provider = getLlmProvider();
    const webSearchConfigured = Boolean(getTavilyApiKey());
    const runtimeHealth = buildAgentRuntimeHealth({
      featureVersion: AGENT_FEATURE_VERSION,
      llmConfigured,
      provider,
      webSearchConfigured,
      workerAvailable,
      workerLastHeartbeatAt: latestWorker?.lastHeartbeatAt ?? null,
      workerStaleAfterMs: AGENT_WORKER_STALE_AFTER_MS,
    });
    const reasonCode = runtimeHealth.reasonCode;
    logAgentEvent(reasonCode ? "warn" : "info", {
      scope: "runtime_health",
      event: "runtime_health_checked",
      reasonCode,
      llmConfigured,
      workerAvailable,
      workerLastHeartbeatAt: latestWorker?.lastHeartbeatAt ?? null,
      workerStaleAfterMs: AGENT_WORKER_STALE_AFTER_MS,
      provider,
      webSearchConfigured,
      featureVersion: AGENT_FEATURE_VERSION,
    });

    return runtimeHealth.payload;
  },
});
