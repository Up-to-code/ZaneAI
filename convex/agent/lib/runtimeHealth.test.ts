import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_BACKEND_LLM_MESSAGE,
  DEFAULT_BACKEND_WORKER_MESSAGE,
  buildAgentRuntimeHealth,
} from "./runtimeHealth";

test("buildAgentRuntimeHealth keeps healthy payload message undefined when web search is disabled", () => {
  const result = buildAgentRuntimeHealth({
    featureVersion: "guest-ready-v1",
    llmConfigured: true,
    provider: "openrouter",
    webSearchConfigured: false,
    workerAvailable: true,
    workerLastHeartbeatAt: 123,
    workerStaleAfterMs: 456,
  });

  assert.equal(result.reasonCode, undefined);
  assert.equal(result.payload.message, undefined);
  assert.equal(result.payload.webSearch.configured, false);
});

test("buildAgentRuntimeHealth returns missing LLM message when model key absent", () => {
  const result = buildAgentRuntimeHealth({
    featureVersion: "guest-ready-v1",
    llmConfigured: false,
    provider: null,
    webSearchConfigured: false,
    workerAvailable: false,
    workerLastHeartbeatAt: null,
    workerStaleAfterMs: 456,
  });

  assert.equal(result.reasonCode, "missing_llm_key");
  assert.equal(result.payload.message, DEFAULT_BACKEND_LLM_MESSAGE);
});

test("buildAgentRuntimeHealth returns worker offline message when worker unavailable", () => {
  const result = buildAgentRuntimeHealth({
    featureVersion: "guest-ready-v1",
    llmConfigured: true,
    provider: "openrouter",
    webSearchConfigured: true,
    workerAvailable: false,
    workerLastHeartbeatAt: null,
    workerStaleAfterMs: 456,
  });

  assert.equal(result.reasonCode, "worker_offline");
  assert.equal(result.payload.message, DEFAULT_BACKEND_WORKER_MESSAGE);
});
