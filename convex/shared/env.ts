const DEFAULT_CHAT_MODEL = "google/gemini-2.5-flash-lite";
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
export const AGENT_FEATURE_VERSION = "guest-ready-v1";
const AGENT_MODEL_ENV = {
  orchestrator: "OPENROUTER_ORCHESTRATOR_MODEL",
  finance: "OPENROUTER_FINANCE_MODEL",
  financeEditor: "OPENROUTER_FINANCE_EDITOR_MODEL",
  legal: "OPENROUTER_LEGAL_MODEL",
  legalEditor: "OPENROUTER_LEGAL_EDITOR_MODEL",
  search: "OPENROUTER_SEARCH_MODEL",
  analysis: "OPENROUTER_ANALYSIS_MODEL",
  ranking: "OPENROUTER_RANKING_MODEL",
  preference: "OPENROUTER_PREFERENCE_MODEL",
  summary: "OPENROUTER_SUMMARY_MODEL",
  decision: "OPENROUTER_DECISION_MODEL",
  memory: "OPENROUTER_MEMORY_MODEL",
} as const;

const DEFAULT_AGENT_MODELS = {
  orchestrator: "google/gemini-2.5-flash-lite",
  finance: "qwen/qwen3.5-flash-02-23",
  financeEditor: "qwen/qwen3.5-flash-02-23",
  legal: "google/gemma-4-26b-a4b-it",
  legalEditor: "google/gemma-4-26b-a4b-it",
  search: "google/gemini-2.5-flash-lite",
  analysis: "google/gemini-2.5-flash-lite",
  ranking: "google/gemini-2.5-flash-lite",
  preference: "google/gemini-2.5-flash-lite",
  summary: "google/gemini-2.5-flash-lite",
  decision: "google/gemini-2.5-flash-lite",
  memory: "google/gemini-2.5-flash-lite",
} satisfies Record<keyof typeof AGENT_MODEL_ENV, string>;

export function getChatModel() {
  return process.env.OPENROUTER_ORCHESTRATOR_MODEL
    ?? process.env.OPENROUTER_MODEL
    ?? process.env.OPENAI_MODEL
    ?? DEFAULT_CHAT_MODEL;
}

export function getLlmProvider() {
  if (process.env.OPENROUTER_API_KEY) {
    return "openrouter" as const;
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai" as const;
  }

  return null;
}

export function getAgentModel(role: keyof typeof AGENT_MODEL_ENV) {
  return process.env[AGENT_MODEL_ENV[role]] ?? DEFAULT_AGENT_MODELS[role] ?? getChatModel();
}

export function getEmbeddingModel() {
  return process.env.OPENAI_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL;
}

export function getOpenAiCompatibleBaseUrl() {
  if (process.env.OPENROUTER_BASE_URL) {
    return process.env.OPENROUTER_BASE_URL;
  }

  if (process.env.OPENROUTER_API_KEY) {
    return DEFAULT_BASE_URL;
  }

  return undefined;
}

export function getLlmApiKey() {
  return process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY ?? null;
}

export function hasLlmApiKey() {
  return Boolean(getLlmApiKey());
}

export function getTavilyApiKey() {
  return process.env.TAVILY_API_KEY ?? null;
}

export function hasTypesenseConfig() {
  return Boolean(process.env.TYPESENSE_HOST && process.env.TYPESENSE_API_KEY);
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}
