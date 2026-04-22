import { z } from "zod/v3";

import {
  ASSISTANT_ACTION_NAMES,
  ASSISTANT_BLOCK_TYPES,
  ASSISTANT_MOTION_PRESETS,
  ASSISTANT_ROUTES,
  ASSISTANT_STAGE_PHASES,
  ASSISTANT_STAGE_STATUSES,
  ASSISTANT_DIRECTIONS,
  ASSISTANT_UI_LOCALES,
  type AssistantAction,
  type AssistantAgentContext,
  type AssistantAnalytics,
  type AssistantBlock,
  type AssistantMotion,
  type AssistantPresentation,
  type AssistantSource,
  type AssistantStageEvent,
  type AssistantSurfaceCopy,
  type ThreadPresentation,
  type AssistantTurn,
  ASSISTANT_TURN_STATUSES,
  ASSISTANT_TURN_VERSION,
} from "./types";

type SavePropertyAction = Extract<AssistantAction, { name: "save_property" }>;
type ComparePropertyAction = Extract<AssistantAction, { name: "compare_property" }>;
type OpenPropertyAction = Extract<AssistantAction, { name: "open_property" }>;
type ContactAgentAction = Extract<AssistantAction, { name: "contact_agent" }>;
type ScheduleVisitAction = Extract<AssistantAction, { name: "schedule_visit" }>;
type ContinueThreadAction = Extract<AssistantAction, { name: "continue_thread" }>;
type OpenSearchAction = Extract<AssistantAction, { name: "open_search" }>;

type TextBlock = Extract<AssistantBlock, { type: "text" }>;
type PropertyListBlock = Extract<AssistantBlock, { type: "property_list" }>;
type ComparisonBlock = Extract<AssistantBlock, { type: "comparison" }>;
type SourcesBlock = Extract<AssistantBlock, { type: "sources" }>;
type FollowupBlock = Extract<AssistantBlock, { type: "followup" }>;
type FundingOptionsBlock = Extract<AssistantBlock, { type: "funding_options" }>;
type AdvisorNoteBlock = Extract<AssistantBlock, { type: "advisor_note" }>;
type ActionsBlock = Extract<AssistantBlock, { type: "actions" }>;
type EmptyBlock = Extract<AssistantBlock, { type: "empty" }>;

const assistantSourceSchema: z.ZodType<AssistantSource> = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  snippet: z.string().min(1),
});

const assistantAnalyticsSchema: z.ZodType<AssistantAnalytics> = z.object({
  source: z.literal("assistant"),
  threadId: z.string().optional(),
  runId: z.string().optional(),
  workflowId: z.string().optional(),
  messageId: z.string().optional(),
  route: z.enum(ASSISTANT_ROUTES).optional(),
});

const assistantAgentContextSchema: z.ZodType<AssistantAgentContext> = z.object({
  primaryAgent: z.string().min(1),
  participatingAgents: z.array(z.string().min(1)).min(1).max(6),
  handoffs: z.array(
    z.object({
      from: z.string().min(1),
      to: z.string().min(1),
      reason: z.string().min(1),
    }),
  ).max(6),
  confidence: z.number().min(0).max(1).optional(),
});

const assistantMotionSchema: z.ZodType<AssistantMotion> = z.object({
  preset: z.enum(ASSISTANT_MOTION_PRESETS),
  emphasis: z.enum(["low", "medium", "high"]).optional(),
  phaseHints: z.array(z.string().min(1)).max(6).optional(),
});

export const assistantSurfaceCopySchema: z.ZodType<AssistantSurfaceCopy> = z.object({
  brandTagline: z.string().min(1),
  greeting: z.string().min(1),
  composerPlaceholder: z.string().min(1),
  composerDisabledPlaceholder: z.string().min(1),
  upgradeAction: z.string().min(1),
  aiUnavailableTitle: z.string().min(1),
  aiUnavailableBody: z.string().min(1),
  runFailedTitle: z.string().min(1),
  runtimeChecking: z.string().min(1),
  runtimeWorkerOffline: z.string().min(1),
  runtimeMissingLlm: z.string().min(1),
  runtimeThreadSync: z.string().min(1),
  runtimeRestoringGuest: z.string().min(1),
  runtimeSignInRequired: z.string().min(1),
  runtimeAssistantTimeout: z.string().min(1),
  runtimeCompletedWithoutResponse: z.string().min(1),
  routeAdvisor: z.string().min(1),
  routeProperty: z.string().min(1),
  routeFunding: z.string().min(1),
  routeLegal: z.string().min(1),
  routeMixed: z.string().min(1),
  stageClassifyStarted: z.string().min(1),
  stageClassifyDone: z.string().min(1),
  stageSpecialistStarted: z.string().min(1),
  stageSpecialistDone: z.string().min(1),
  stageSummaryStarted: z.string().min(1),
  stageSummaryDone: z.string().min(1),
  stagePersistStarted: z.string().min(1),
  stagePersistDone: z.string().min(1),
  bestPropertyMatches: z.string().min(1),
  propertiesThatFitBrief: z.string().min(1),
  noStrongPropertyMatchYet: z.string().min(1),
  needOneMoreSearchSignal: z.string().min(1),
  whatSeparatesTopOptions: z.string().min(1),
  whatStandsOut: z.string().min(1),
  fundingAngle: z.string().min(1),
  liveMarketSources: z.string().min(1),
  nextUsefulStep: z.string().min(1),
  actions: z.string().min(1),
  previousSearchUnavailableAssistant: z.string().min(1),
  previousSearchUnavailableHighlight: z.string().min(1),
  previousSearchUnavailableFollowup: z.string().min(1),
  noStrongMatchAssistant: z.string().min(1),
  noStrongMatchHighlight: z.string().min(1),
  noStrongMatchFollowup: z.string().min(1),
  propertyReviewedFallback: z.string().min(1),
  advisorFallbackBody: z.string().min(1),
  openProperty: z.string().min(1),
  saveTopMatch: z.string().min(1),
  compareTopPicks: z.string().min(1),
  refineThisSearch: z.string().min(1),
  openSearch: z.string().min(1),
  continueFundingPlanning: z.string().min(1),
  fundingPlan: z.string().min(1),
  fundingContinuePrompt: z.string().min(1),
  continueLegalReview: z.string().min(1),
  legalReview: z.string().min(1),
  legalContinuePrompt: z.string().min(1),
  refineSearchPrompt: z.string().min(1),
});

export const assistantPresentationSchema = z.object({
  languageTag: z.string().min(1),
  direction: z.enum(ASSISTANT_DIRECTIONS),
  uiLocale: z.enum(ASSISTANT_UI_LOCALES).nullable().optional(),
}) satisfies z.ZodType<AssistantPresentation>;

export const threadPresentationSchema = assistantPresentationSchema.extend({
  source: z.enum(["detected", "explicit"]),
  confidence: z.number().min(0).max(1),
  surfaceCopy: assistantSurfaceCopySchema.nullable().optional(),
}) satisfies z.ZodType<ThreadPresentation>;

const savePropertyActionSchema: z.ZodType<SavePropertyAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("save_property"),
  payload: z.object({ propertyId: z.string().min(1) }),
});

const comparePropertyActionSchema: z.ZodType<ComparePropertyAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("compare_property"),
  payload: z.object({ propertyId: z.string().min(1) }),
});

const openPropertyActionSchema: z.ZodType<OpenPropertyAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("open_property"),
  payload: z.object({ propertyId: z.string().min(1) }),
});

const contactAgentActionSchema: z.ZodType<ContactAgentAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("contact_agent"),
  payload: z.object({
    propertyId: z.string().min(1).optional(),
    brokerId: z.string().min(1).optional(),
    prompt: z.string().min(1).optional(),
  }),
});

const scheduleVisitActionSchema: z.ZodType<ScheduleVisitAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("schedule_visit"),
  payload: z.object({
    propertyId: z.string().min(1).optional(),
    prompt: z.string().min(1).optional(),
  }),
});

const continueThreadActionSchema: z.ZodType<ContinueThreadAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("continue_thread"),
  payload: z.object({
    prompt: z.string().min(1),
  }),
});

const openSearchActionSchema: z.ZodType<OpenSearchAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("open_search"),
  payload: z.object({
    query: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    minBeds: z.number().optional(),
    budgetMode: z.enum(["target", "max", "range", "unknown"]).optional(),
    relaxedConstraints: z.array(z.string().min(1)).max(6).optional(),
    sourceSearchSessionId: z.string().min(1).optional(),
  }),
});

export const assistantActionSchema: z.ZodType<AssistantAction> = z.union([
  savePropertyActionSchema,
  comparePropertyActionSchema,
  openPropertyActionSchema,
  contactAgentActionSchema,
  scheduleVisitActionSchema,
  continueThreadActionSchema,
  openSearchActionSchema,
]);

const textBlockSchema: z.ZodType<TextBlock> = z.object({
  type: z.literal("text"),
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  body: z.string().min(1),
});

const propertyListBlockSchema: z.ZodType<PropertyListBlock> = z.object({
  type: z.literal("property_list"),
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1).optional(),
  propertyIds: z.array(z.string().min(1)).min(1).max(6),
  querySummary: z.string().min(1).optional(),
  searchQuery: z.string().min(1).optional(),
  matchReasons: z.array(z.string().min(1)).max(6).optional(),
  relaxationsApplied: z.array(z.string().min(1)).max(6).optional(),
  resultSetId: z.string().min(1).optional(),
});

const comparisonBlockSchema: z.ZodType<ComparisonBlock> = z.object({
  type: z.literal("comparison"),
  id: z.string().min(1),
  title: z.string().min(1),
  propertyIds: z.array(z.string().min(1)).min(2).max(4),
  points: z.array(z.string().min(1)).min(1).max(6),
});

const sourcesBlockSchema: z.ZodType<SourcesBlock> = z.object({
  type: z.literal("sources"),
  id: z.string().min(1),
  title: z.string().min(1),
  sources: z.array(assistantSourceSchema).max(6),
});

const followupBlockSchema: z.ZodType<FollowupBlock> = z.object({
  type: z.literal("followup"),
  id: z.string().min(1),
  title: z.string().min(1),
  prompt: z.string().min(1),
  suggestions: z.array(z.string().min(1)).max(4).optional(),
});

const fundingOptionsBlockSchema: z.ZodType<FundingOptionsBlock> = z.object({
  type: z.literal("funding_options"),
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  options: z.array(z.string().min(1)).min(1).max(6),
  disclaimers: z.array(z.string().min(1)).max(4).optional(),
});

const advisorNoteBlockSchema: z.ZodType<AdvisorNoteBlock> = z.object({
  type: z.literal("advisor_note"),
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  bullets: z.array(z.string().min(1)).max(5).optional(),
});

const actionsBlockSchema: z.ZodType<ActionsBlock> = z.object({
  type: z.literal("actions"),
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  actionIds: z.array(z.string().min(1)).min(1).max(8),
});

const emptyBlockSchema: z.ZodType<EmptyBlock> = z.object({
  type: z.literal("empty"),
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  suggestions: z.array(z.string().min(1)).max(4).optional(),
});

export const assistantBlockSchema: z.ZodType<AssistantBlock> = z.union([
  textBlockSchema,
  propertyListBlockSchema,
  comparisonBlockSchema,
  sourcesBlockSchema,
  followupBlockSchema,
  fundingOptionsBlockSchema,
  advisorNoteBlockSchema,
  actionsBlockSchema,
  emptyBlockSchema,
]);

export const assistantTurnSchema: z.ZodType<AssistantTurn> = z.object({
  version: z.literal(ASSISTANT_TURN_VERSION),
  route: z.enum(ASSISTANT_ROUTES),
  status: z.enum(ASSISTANT_TURN_STATUSES),
  assistantText: z.string().min(1),
  blocks: z.array(assistantBlockSchema).min(1).max(10),
  actions: z.array(assistantActionSchema).max(8),
  agent: assistantAgentContextSchema,
  motion: assistantMotionSchema,
  presentation: assistantPresentationSchema.optional(),
  analytics: assistantAnalyticsSchema.optional(),
});

export const assistantStageEventSchema: z.ZodType<AssistantStageEvent> = z.object({
  seq: z.number().int().nonnegative(),
  eventType: z.literal("stage"),
  phase: z.enum(ASSISTANT_STAGE_PHASES),
  status: z.enum(ASSISTANT_STAGE_STATUSES),
  message: z.string().min(1),
  timestamp: z.number(),
  route: z.enum(ASSISTANT_ROUTES).optional(),
  specialist: z.string().min(1).optional(),
  motionPreset: z.enum(ASSISTANT_MOTION_PRESETS).optional(),
  handoffFrom: z.string().min(1).optional(),
  handoffTo: z.string().min(1).optional(),
});

export function extractTurnPropertyIds(turn: AssistantTurn) {
  const blocks = Array.isArray(turn.blocks) ? turn.blocks : [];
  const propertyIds = blocks.flatMap((block) => {
    if (block.type === "property_list" || block.type === "comparison") {
      return block.propertyIds;
    }

    return [];
  });

  return [...new Set(propertyIds)];
}

export function extractTurnSources(turn: AssistantTurn) {
  const blocks = Array.isArray(turn.blocks) ? turn.blocks : [];
  return blocks.flatMap((block) => (block.type === "sources" ? block.sources : []));
}

export function findAssistantAction(turn: AssistantTurn, actionId: string) {
  const actions = Array.isArray(turn.actions) ? turn.actions : [];
  return actions.find((action) => action.id === actionId) ?? null;
}

export function assertValidAssistantTurn(input: unknown) {
  return assistantTurnSchema.parse(input);
}
