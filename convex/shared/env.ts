const DEFAULT_CHAT_MODEL = "gpt-4o-mini";
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const AGENT_MODEL_ENV = {
  search: "OPENROUTER_SEARCH_MODEL",
  decision: "OPENROUTER_DECISION_MODEL",
  memory: "OPENROUTER_MEMORY_MODEL",
} as const;

export function getChatModel() {
  return process.env.OPENROUTER_MODEL ?? process.env.OPENAI_MODEL ?? DEFAULT_CHAT_MODEL;
}

export function getAgentModel(role: keyof typeof AGENT_MODEL_ENV) {
  return process.env[AGENT_MODEL_ENV[role]] ?? getChatModel();
}

export function getEmbeddingModel() {
  return process.env.OPENAI_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL;
}

export function getOpenRouterBaseUrl() {
  return process.env.OPENROUTER_BASE_URL ?? DEFAULT_BASE_URL;
}

export function getLlmApiKey() {
  return process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY ?? null;
}

export function getTavilyApiKey() {
  return process.env.TAVILY_API_KEY ?? null;
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}
