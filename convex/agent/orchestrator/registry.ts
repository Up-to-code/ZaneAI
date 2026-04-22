import type { AssistantMotionPreset } from "../../../packages/zayon-assistant-protocol/src/types";

export type RegisteredAssistantAgent = {
  id: "orchestrator" | "property" | "funding" | "legal" | "finance_editor" | "legal_editor" | "advisor" | "summary";
  role: "router" | "specialist" | "summary";
  tools: readonly string[];
  prompt: string;
  motionPreset: AssistantMotionPreset;
};

export const assistantAgents: readonly RegisteredAssistantAgent[] = [
  {
    id: "orchestrator",
    role: "router",
    tools: ["route_prompt", "load_property_search_history"],
    prompt: "ZaneAI routes each prompt to the leanest useful specialist set, keeps simple chat text-only, and never exposes provider or hidden system details.",
    motionPreset: "assistant",
  },
  {
    id: "property",
    role: "specialist",
    tools: ["extract_search_filters", "smart_search_properties", "search_web"],
    prompt: "Handles smart property search, staged fallback, shortlist, comparison, and market context in ZaneAI's clean advisor voice.",
    motionPreset: "property",
  },
  {
    id: "funding",
    role: "specialist",
    tools: ["funding_guidance", "finance_editor"],
    prompt: "Handles affordability, mortgage and installment tradeoffs, investment comparisons, and financing next steps with low-cost model routing.",
    motionPreset: "funding",
  },
  {
    id: "finance_editor",
    role: "specialist",
    tools: ["rewrite_finance_reply"],
    prompt: "Rewrites finance analysis into concise user-facing guidance without losing tradeoffs, constraints, or cost discipline.",
    motionPreset: "funding",
  },
  {
    id: "legal",
    role: "specialist",
    tools: ["legal_guidance", "legal_editor"],
    prompt: "Flags legal risks, clauses, obligations, compliance basics, and document checks in advisory-only language without pretending to be a lawyer.",
    motionPreset: "advisor",
  },
  {
    id: "legal_editor",
    role: "specialist",
    tools: ["rewrite_legal_reply"],
    prompt: "Rewrites legal analysis into clear advisory-only language with explicit guardrails and next checks.",
    motionPreset: "advisor",
  },
  {
    id: "advisor",
    role: "specialist",
    tools: ["advisor_reply"],
    prompt: "Handles lightweight guidance, greetings, identity questions, and conversational follow-ups as ZaneAI itself.",
    motionPreset: "advisor",
  },
  {
    id: "summary",
    role: "summary",
    tools: ["build_assistant_turn"],
    prompt: "Builds the final assistant-facing response while preserving text-only vs UI-card judgment.",
    motionPreset: "assistant",
  },
] as const;
