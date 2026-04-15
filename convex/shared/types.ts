export const THREAD_SCOPES = ["personal", "organization", "public"] as const;
export const KNOWLEDGE_SCOPES = THREAD_SCOPES;
export const AGENT_ROLES = ["search", "analysis", "ranking", "preference", "summary"] as const;
export const RUN_STATUSES = [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;
export const FACT_SOURCES = ["manual", "message", "agent"] as const;
export const CACHE_KINDS = [
  "property_search",
  "web_search",
  "fact_extraction",
  "rag_search",
] as const;
export const QUOTA_KEYS = [
  "message_requests",
  "message_tokens",
  "global_tokens",
] as const;

export type ThreadScope = (typeof THREAD_SCOPES)[number];
export type KnowledgeScope = (typeof KNOWLEDGE_SCOPES)[number];
export type AgentRole = (typeof AGENT_ROLES)[number];
export type RunStatus = (typeof RUN_STATUSES)[number];
export type FactSource = (typeof FACT_SOURCES)[number];
export type CacheKind = (typeof CACHE_KINDS)[number];
export type QuotaKey = (typeof QUOTA_KEYS)[number];
