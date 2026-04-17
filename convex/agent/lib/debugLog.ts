export type AgentLogScope =
  | "agent_ingress"
  | "agent_worker"
  | "runtime_health"
  | "message_assembly"
  | "run_status"
  | "stage_feed"
  | "orchestrator_runtime";

export type AgentReasonCode =
  | "missing_llm_key"
  | "worker_offline"
  | "thread_not_found"
  | "thread_recovered"
  | "auth_required"
  | "rate_limited"
  | "timeout"
  | "json_parse_failed"
  | "turn_link_missing"
  | "run_not_found"
  | "run_access_mismatch"
  | "workflow_failed"
  | "workflow_cancelled";

type AgentLogLevel = "info" | "warn" | "error";

type AgentLogPayload = {
  scope: AgentLogScope;
  event: string;
  reasonCode?: AgentReasonCode;
  runId?: string;
  threadId?: string;
  authUserId?: string;
  [key: string]: unknown;
};

export function logAgentEvent(level: AgentLogLevel, payload: AgentLogPayload) {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    ...payload,
  });
  if (level === "warn") {
    console.warn(line);
    return;
  }
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}
