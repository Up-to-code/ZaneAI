export type AnalyticsEventName =
  | "app_open"
  | "screen_view"
  | "ai_prompt_sent"
  | "ai_response_stream_start"
  | "ai_response_stream_end"
  | "voice_input_started"
  | "voice_input_completed"
  | "property_impression"
  | "property_click"
  | "property_save"
  | "property_compare"
  | "ai_suggestion_clicked"
  | "contact_agent"
  | "schedule_visit";

export type ConversationRole = "user" | "assistant";
export type ConversationKind = "text" | "property_bundle" | "summary_card";
export type StreamState = "idle" | "streaming" | "complete" | "stopped";
export type VoiceMode = "idle" | "requesting_permission" | "listening" | "transcribing" | "failed";

export type ConversationMessage = {
  id: string;
  sessionId: string;
  role: ConversationRole;
  kind: ConversationKind;
  text: string;
  streamState: StreamState;
  relatedPropertyIds: string[];
  createdAt: number;
};

export type PropertyCardVM = {
  id: string;
  heroUrl: string;
  title: string;
  priceLabel: string;
  locationLabel: string;
  beds: number;
  baths: number;
  area: number;
  matchScore: number;
  matchReasons: string[];
  aiSummary: string;
  tags: string[];
};

export type RecommendationBatch = {
  id: string;
  userId: string;
  requestContext: string;
  propertyIds: string[];
  rankingRationale: string;
  createdAt: number;
};

export type PreferenceProfile = {
  budgetRange: [number, number];
  locations: string[];
  bedrooms: number[];
  propertyTypes: string[];
  commutePrefs: string[];
  confidence: number;
  updatedFrom: string;
};

export type AgentRunResult = {
  summary: string;
  rankedProperties: PropertyCardVM[];
  preferenceUpdates: Partial<PreferenceProfile>;
  diagnostics: string[];
};

export type InsightCard = {
  id: string;
  title: string;
  body: string;
  tone: "signal" | "neutral";
};
