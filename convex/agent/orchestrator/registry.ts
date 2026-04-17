import type { AssistantMotionPreset } from "../../../packages/zayon-assistant-protocol/src/types";

export type RegisteredAssistantAgent = {
  id: "orchestrator" | "property" | "funding" | "advisor" | "summary";
  role: "router" | "specialist" | "summary";
  tools: readonly string[];
  prompt: string;
  motionPreset: AssistantMotionPreset;
};

export const assistantAgents: readonly RegisteredAssistantAgent[] = [
  {
    id: "orchestrator",
    role: "router",
    tools: ["route_prompt"],
    prompt: "Routes each prompt to the leanest useful specialist set.",
    motionPreset: "assistant",
  },
  {
    id: "property",
    role: "specialist",
    tools: ["extract_search_filters", "search_properties", "search_web"],
    prompt: "Handles property search, shortlist, comparison, and market context.",
    motionPreset: "property",
  },
  {
    id: "funding",
    role: "specialist",
    tools: ["funding_guidance"],
    prompt: "Explains affordability, financing tradeoffs, and funding next steps.",
    motionPreset: "funding",
  },
  {
    id: "advisor",
    role: "specialist",
    tools: ["advisor_reply"],
    prompt: "Handles lightweight guidance, greetings, and conversational follow-ups.",
    motionPreset: "advisor",
  },
  {
    id: "summary",
    role: "summary",
    tools: ["build_assistant_turn"],
    prompt: "Builds the final assistant-facing JSON contract and messaging.",
    motionPreset: "assistant",
  },
] as const;
