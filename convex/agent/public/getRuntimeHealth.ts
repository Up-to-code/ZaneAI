import { query } from "../../_generated/server";
import {
  AGENT_FEATURE_VERSION,
  getLlmProvider,
  hasLlmApiKey,
  getTavilyApiKey,
} from "../../shared/env";
import { buildAgentRuntimeHealth } from "../lib/runtimeHealth";

export const getRuntimeHealth = query({
  args: {},
  handler: async () => {
    const llmConfigured = hasLlmApiKey();
    const provider = getLlmProvider();
    const webSearchConfigured = Boolean(getTavilyApiKey());
    const runtimeHealth = buildAgentRuntimeHealth({
      featureVersion: AGENT_FEATURE_VERSION,
      llmConfigured,
      provider,
      webSearchConfigured,
    });

    return runtimeHealth.payload;
  },
});
