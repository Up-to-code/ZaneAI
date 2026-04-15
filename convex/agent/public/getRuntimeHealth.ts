import { query } from "../../_generated/server";
import {
  AGENT_FEATURE_VERSION,
  getLlmProvider,
  hasLlmApiKey,
  getTavilyApiKey,
} from "../../shared/env";

export const getRuntimeHealth = query({
  args: {},
  handler: async () => ({
    auth: {
      anonymousEnabled: true,
      emailPasswordEnabled: true,
    },
    llm: {
      configured: hasLlmApiKey(),
      provider: getLlmProvider(),
    },
    webSearch: {
      configured: Boolean(getTavilyApiKey()),
    },
    featureVersion: AGENT_FEATURE_VERSION,
    capabilities: {
      sendMessage: true,
      threadMessages: true,
      recommendationBatches: true,
      stageFeed: true,
      runStatus: true,
    },
  }),
});
