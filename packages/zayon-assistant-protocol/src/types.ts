export const ASSISTANT_TURN_VERSION = "assistant_turn.v1" as const;

export const ASSISTANT_ROUTES = [
  "advisor",
  "property",
  "funding",
  "legal",
  "mixed",
] as const;

export const ASSISTANT_TURN_STATUSES = [
  "completed",
  "needs_input",
  "no_match",
] as const;

export const ASSISTANT_BLOCK_TYPES = [
  "text",
  "property_list",
  "comparison",
  "sources",
  "followup",
  "funding_options",
  "advisor_note",
  "actions",
  "empty",
] as const;

export const ASSISTANT_ACTION_NAMES = [
  "save_property",
  "compare_property",
  "open_property",
  "contact_agent",
  "schedule_visit",
  "continue_thread",
  "open_search",
] as const;

export const ASSISTANT_STAGE_PHASES = [
  "classify_started",
  "classify_done",
  "specialist_started",
  "specialist_done",
  "summary_started",
  "summary_done",
  "persist_started",
  "persist_done",
] as const;

export const ASSISTANT_STAGE_STATUSES = [
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;

export const ASSISTANT_DIRECTIONS = [
  "rtl",
  "ltr",
] as const;

export const ASSISTANT_UI_LOCALES = [
  "ar",
  "en",
  "fr",
] as const;

export const THREAD_PRESENTATION_SOURCES = [
  "detected",
  "explicit",
] as const;

export const ASSISTANT_MOTION_PRESETS = [
  "assistant",
  "advisor",
  "property",
  "funding",
] as const;

export type AssistantRoute = typeof ASSISTANT_ROUTES[number];
export type AssistantTurnStatus = typeof ASSISTANT_TURN_STATUSES[number];
export type AssistantBlockType = typeof ASSISTANT_BLOCK_TYPES[number];
export type AssistantActionName = typeof ASSISTANT_ACTION_NAMES[number];
export type AssistantStagePhase = typeof ASSISTANT_STAGE_PHASES[number];
export type AssistantStageStatus = typeof ASSISTANT_STAGE_STATUSES[number];
export type AssistantMotionPreset = typeof ASSISTANT_MOTION_PRESETS[number];
export type AssistantDirection = typeof ASSISTANT_DIRECTIONS[number];
export type AssistantUiLocale = typeof ASSISTANT_UI_LOCALES[number];
export type ThreadPresentationSource = typeof THREAD_PRESENTATION_SOURCES[number];

export type AssistantSource = {
  title: string;
  url: string;
  snippet: string;
};

export type AssistantAnalytics = {
  source: "assistant";
  threadId?: string;
  runId?: string;
  workflowId?: string;
  messageId?: string;
  route?: AssistantRoute;
};

export type AssistantAgentContext = {
  primaryAgent: string;
  participatingAgents: string[];
  handoffs: Array<{
    from: string;
    to: string;
    reason: string;
  }>;
  confidence?: number;
};

export type AssistantMotion = {
  preset: AssistantMotionPreset;
  emphasis?: "low" | "medium" | "high";
  phaseHints?: string[];
};

export type AssistantSurfaceCopy = {
  brandTagline: string;
  greeting: string;
  composerPlaceholder: string;
  composerDisabledPlaceholder: string;
  upgradeAction: string;
  aiUnavailableTitle: string;
  aiUnavailableBody: string;
  runFailedTitle: string;
  runtimeChecking: string;
  runtimeWorkerOffline: string;
  runtimeMissingLlm: string;
  runtimeThreadSync: string;
  runtimeRestoringGuest: string;
  runtimeSignInRequired: string;
  runtimeAssistantTimeout: string;
  runtimeCompletedWithoutResponse: string;
  routeAdvisor: string;
  routeProperty: string;
  routeFunding: string;
  routeLegal: string;
  routeMixed: string;
  stageClassifyStarted: string;
  stageClassifyDone: string;
  stageSpecialistStarted: string;
  stageSpecialistDone: string;
  stageSummaryStarted: string;
  stageSummaryDone: string;
  stagePersistStarted: string;
  stagePersistDone: string;
  bestPropertyMatches: string;
  propertiesThatFitBrief: string;
  noStrongPropertyMatchYet: string;
  needOneMoreSearchSignal: string;
  whatSeparatesTopOptions: string;
  whatStandsOut: string;
  fundingAngle: string;
  liveMarketSources: string;
  nextUsefulStep: string;
  actions: string;
  previousSearchUnavailableAssistant: string;
  previousSearchUnavailableHighlight: string;
  previousSearchUnavailableFollowup: string;
  noStrongMatchAssistant: string;
  noStrongMatchHighlight: string;
  noStrongMatchFollowup: string;
  propertyReviewedFallback: string;
  advisorFallbackBody: string;
  openProperty: string;
  saveTopMatch: string;
  compareTopPicks: string;
  refineThisSearch: string;
  openSearch: string;
  continueFundingPlanning: string;
  fundingPlan: string;
  fundingContinuePrompt: string;
  continueLegalReview: string;
  legalReview: string;
  legalContinuePrompt: string;
  refineSearchPrompt: string;
};

export type AssistantPresentation = {
  languageTag: string;
  direction: AssistantDirection;
  uiLocale?: AssistantUiLocale | null;
};

export type ThreadPresentation = AssistantPresentation & {
  source: ThreadPresentationSource;
  confidence: number;
  surfaceCopy?: AssistantSurfaceCopy | null;
};

export type AssistantAction =
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
      propertyId?: string;
      prompt?: string;
    };
  }
  | {
    id: string;
    title: string;
    name: "continue_thread";
    payload: { prompt: string };
  }
  | {
    id: string;
    title: string;
    name: "open_search";
    payload: {
      query?: string;
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      minBeds?: number;
      budgetMode?: "target" | "max" | "range" | "unknown";
      relaxedConstraints?: string[];
      sourceSearchSessionId?: string;
    };
  };

export type AssistantBlock =
  | {
    type: "text";
    id: string;
    title?: string;
    body: string;
  }
  | {
    type: "property_list";
    id: string;
    title: string;
    subtitle?: string;
    propertyIds: string[];
    querySummary?: string;
    searchQuery?: string;
    matchReasons?: string[];
    relaxationsApplied?: string[];
    resultSetId?: string;
  }
  | {
    type: "comparison";
    id: string;
    title: string;
    propertyIds: string[];
    points: string[];
  }
  | {
    type: "sources";
    id: string;
    title: string;
    sources: AssistantSource[];
  }
  | {
    type: "followup";
    id: string;
    title: string;
    prompt: string;
    suggestions?: string[];
  }
  | {
    type: "funding_options";
    id: string;
    title: string;
    summary: string;
    options: string[];
    disclaimers?: string[];
  }
  | {
    type: "advisor_note";
    id: string;
    title: string;
    body: string;
    bullets?: string[];
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

export type AssistantTurn = {
  version: typeof ASSISTANT_TURN_VERSION;
  route: AssistantRoute;
  status: AssistantTurnStatus;
  assistantText: string;
  blocks: AssistantBlock[];
  actions: AssistantAction[];
  agent: AssistantAgentContext;
  motion: AssistantMotion;
  presentation?: AssistantPresentation;
  analytics?: AssistantAnalytics;
};

export type AssistantStageEvent = {
  seq: number;
  eventType: "stage";
  phase: AssistantStagePhase;
  status: AssistantStageStatus;
  message: string;
  timestamp: number;
  route?: AssistantRoute;
  specialist?: string;
  motionPreset?: AssistantMotionPreset;
  handoffFrom?: string;
  handoffTo?: string;
};
