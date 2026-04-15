import { mockProperties } from "@/persistence/mocks/mock-data";
import type { ConversationKind, ConversationMessage, PropertyCardVM } from "@/types/domain";

export type E2ESource = NonNullable<ConversationMessage["sourceMetadata"]>[number];

export type E2EFixtureUser = {
  id: string;
  name: string;
  email: string;
};

export type E2ERecommendationBatch = {
  _id: string;
  threadId: string;
  runId: string;
  rankingRationale: string;
  properties: PropertyCardVM[];
  sources: E2ESource[];
  createdAt: number;
  kind?: ConversationKind;
};

export type E2EFixtureThread = {
  _id: string;
  _creationTime: number;
  title: string;
  summary: string;
  messages: ConversationMessage[];
  recommendationBatches: E2ERecommendationBatch[];
};

export const E2E_QA_USER: E2EFixtureUser = {
  id: "e2e-qa-user",
  name: "QA Zane-AI",
  email: "qa@zaneai.ai",
};
export const E2E_QA_PASSWORD = "qa-password";

export const E2E_PROMPT_PROPERTY_SEARCH =
  "Find me premium waterfront properties with strong rental moat";
export const E2E_PROMPT_MARKET_CONTEXT =
  "Compare pricing and market context for the top waterfront options";

const SEARCH_PROPERTIES = [mockProperties[0], mockProperties[1], mockProperties[2]];
const CONTEXT_PROPERTIES = [mockProperties[0], mockProperties[1]];

const CONTEXT_SOURCES: E2ESource[] = [
  {
    title: "Dubai Marina pricing pulse",
    url: "https://example.com/market/dubai-marina-pricing",
    snippet: "Marina pricing remains firm for waterfront two-bedroom layouts with premium finishes.",
  },
  {
    title: "Business Bay demand brief",
    url: "https://example.com/market/business-bay-demand",
    snippet: "Downtown-adjacent layouts continue to attract mixed end-user and investor demand.",
  },
];

type PromptScenario = {
  title: string;
  summary: string;
  assistantText: string;
  properties: PropertyCardVM[];
  sources: E2ESource[];
  kind?: ConversationKind;
};

export function resolveE2EPromptScenario(prompt: string): PromptScenario {
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedPrompt.includes("market context")
    || normalizedPrompt.includes("pricing")
    || normalizedPrompt.includes("compare")
  ) {
    return {
      title: "Pricing context comparison",
      summary: "Compared pricing context and surfaced market-backed recommendation cards.",
      assistantText:
        "I checked recent pricing context and paired it with two strong waterfront options for comparison.",
      properties: CONTEXT_PROPERTIES,
      sources: CONTEXT_SOURCES,
      kind: "web_search",
    };
  }

  return {
    title: "Premium waterfront search",
    summary: "Generated a high-conviction shortlist of premium waterfront homes.",
    assistantText:
      "I found three premium waterfront options that balance statement value, rental moat, and day-to-day livability.",
    properties: SEARCH_PROPERTIES,
    sources: [],
    kind: "property_bundle",
  };
}
