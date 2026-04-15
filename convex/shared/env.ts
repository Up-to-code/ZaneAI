const DEFAULT_CHAT_MODEL = "gpt-4o-mini";
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
export const AGENT_FEATURE_VERSION = "guest-ready-v1";
const AGENT_MODEL_ENV = {
  search: "OPENROUTER_SEARCH_MODEL",
  analysis: "OPENROUTER_ANALYSIS_MODEL",
  ranking: "OPENROUTER_RANKING_MODEL",
  preference: "OPENROUTER_PREFERENCE_MODEL",
  summary: "OPENROUTER_SUMMARY_MODEL",
} as const;

export function getChatModel() {
  return process.env.OPENROUTER_MODEL ?? process.env.OPENAI_MODEL ?? DEFAULT_CHAT_MODEL;
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
  return process.env[AGENT_MODEL_ENV[role]] ?? getChatModel();
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

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}
