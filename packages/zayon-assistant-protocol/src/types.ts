export const BUYER_TURN_VERSION = "buyer_turn.v1" as const;

export const BUYER_INTENTS = [
  "property_search",
  "compare_properties",
  "market_context",
  "refine_search",
  "follow_up",
  "no_match",
] as const;

export const BUYER_TURN_STATUSES = [
  "completed",
  "needs_input",
  "no_match",
] as const;

export const BUYER_CARD_TYPES = [
  "shortlist",
  "rationale",
  "market_sources",
  "followup",
  "comparison",
  "actions",
  "empty",
] as const;

export const BUYER_ACTION_NAMES = [
  "save_property",
  "compare_property",
  "open_property",
  "contact_agent",
  "schedule_visit",
  "refine_search",
  "ask_followup",
  "continue_thread",
] as const;

export const BUYER_STAGE_PHASES = [
  "intent_started",
  "intent_done",
  "team_started",
  "team_done",
  "merge_started",
  "merge_done",
  "action_started",
  "action_done",
  "persist_started",
  "persist_done",
] as const;

export const BUYER_STAGE_STATUSES = [
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;

export type BuyerIntent = typeof BUYER_INTENTS[number];
export type BuyerTurnStatus = typeof BUYER_TURN_STATUSES[number];
export type BuyerCardType = typeof BUYER_CARD_TYPES[number];
export type BuyerActionName = typeof BUYER_ACTION_NAMES[number];
export type BuyerStagePhase = typeof BUYER_STAGE_PHASES[number];
export type BuyerStageStatus = typeof BUYER_STAGE_STATUSES[number];

export type BuyerSource = {
  title: string;
  url: string;
  snippet: string;
};

export type BuyerAnalytics = {
  source: "assistant";
  threadId?: string;
  runId?: string;
  messageId?: string;
  recommendationBatchId?: string;
};

export type BuyerAction =
  | {
    id: string;
    title: string;
    name: "save_property";
    payload: { propertyId: string };
  }
  | {
    id: string;
    title: string;
    name: "compare_property";
    payload: { propertyId: string };
  }
  | {
    id: string;
    title: string;
    name: "open_property";
    payload: { propertyId: string };
  }
  | {
    id: string;
    title: string;
    name: "contact_agent";
    payload: {
      propertyId?: string;
      brokerId?: string;
      prompt?: string;
    };
  }
  | {
    id: string;
    title: string;
    name: "schedule_visit";
    payload: {
      propertyId: string;
      prompt?: string;
    };
  }
  | {
    id: string;
    title: string;
    name: "refine_search";
    payload: { prompt: string };
  }
  | {
    id: string;
    title: string;
    name: "ask_followup";
    payload: { prompt: string };
  }
  | {
    id: string;
    title: string;
    name: "continue_thread";
    payload: { prompt: string };
  };

export type BuyerCard =
  | {
    type: "shortlist";
    id: string;
    title: string;
    subtitle?: string;
    propertyIds: string[];
  }
  | {
    type: "rationale";
    id: string;
    title: string;
    bullets: string[];
  }
  | {
    type: "market_sources";
    id: string;
    title: string;
    sources: BuyerSource[];
  }
  | {
    type: "followup";
    id: string;
    title: string;
    prompt: string;
    suggestions?: string[];
  }
  | {
    type: "comparison";
    id: string;
    title: string;
    propertyIds: string[];
    points: string[];
  }
  | {
    type: "actions";
    id: string;
    title?: string;
    actionIds: string[];
  }
  | {
    type: "empty";
    id: string;
    title: string;
    body: string;
    suggestions?: string[];
  };

export type BuyerAssistantTurn = {
  version: typeof BUYER_TURN_VERSION;
  intent: BuyerIntent;
  objective: string;
  status: BuyerTurnStatus;
  assistantText: string;
  propertyIds: string[];
  rankingRationale: string;
  followupQuestion?: string;
  cards: BuyerCard[];
  actions: BuyerAction[];
  analytics?: BuyerAnalytics;
};

export type BuyerStageEvent = {
  seq: number;
  eventType: "stage";
  phase: BuyerStagePhase;
  status: BuyerStageStatus;
  teamId?: string;
  agentName?: string;
  message: string;
  timestamp: number;
  details?: Record<string, string | number | boolean | null>;
};
