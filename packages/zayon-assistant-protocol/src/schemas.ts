import { z } from "zod/v3";

import {
  BUYER_ACTION_NAMES,
  BUYER_CARD_TYPES,
  type BuyerAction,
  type BuyerAnalytics,
  type BuyerAssistantTurn,
  type BuyerCard,
  type BuyerSource,
  type BuyerStageEvent,
  BUYER_INTENTS,
  BUYER_STAGE_PHASES,
  BUYER_STAGE_STATUSES,
  BUYER_TURN_STATUSES,
  BUYER_TURN_VERSION,
} from "./types";

type SavePropertyAction = Extract<BuyerAction, { name: "save_property" }>;
type ComparePropertyAction = Extract<BuyerAction, { name: "compare_property" }>;
type OpenPropertyAction = Extract<BuyerAction, { name: "open_property" }>;
type ContactAgentAction = Extract<BuyerAction, { name: "contact_agent" }>;
type ScheduleVisitAction = Extract<BuyerAction, { name: "schedule_visit" }>;
type RefineSearchAction = Extract<BuyerAction, { name: "refine_search" }>;
type AskFollowupAction = Extract<BuyerAction, { name: "ask_followup" }>;
type ContinueThreadAction = Extract<BuyerAction, { name: "continue_thread" }>;

type BuyerShortlistCard = Extract<BuyerCard, { type: "shortlist" }>;
type BuyerRationaleCard = Extract<BuyerCard, { type: "rationale" }>;
type BuyerMarketSourcesCard = Extract<BuyerCard, { type: "market_sources" }>;
type BuyerFollowupCard = Extract<BuyerCard, { type: "followup" }>;
type BuyerComparisonCard = Extract<BuyerCard, { type: "comparison" }>;
type BuyerActionsCard = Extract<BuyerCard, { type: "actions" }>;
type BuyerEmptyCard = Extract<BuyerCard, { type: "empty" }>;

const buyerSourceSchema: z.ZodType<BuyerSource> = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  snippet: z.string().min(1),
});

const buyerAnalyticsSchema: z.ZodType<BuyerAnalytics> = z.object({
  source: z.literal("assistant"),
  threadId: z.string().optional(),
  runId: z.string().optional(),
  messageId: z.string().optional(),
  recommendationBatchId: z.string().optional(),
});

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
    propertyId: z.string().min(1),
    prompt: z.string().min(1).optional(),
  }),
});

const refineSearchActionSchema: z.ZodType<RefineSearchAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("refine_search"),
  payload: z.object({ prompt: z.string().min(1) }),
});

const askFollowupActionSchema: z.ZodType<AskFollowupAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("ask_followup"),
  payload: z.object({ prompt: z.string().min(1) }),
});

const continueThreadActionSchema: z.ZodType<ContinueThreadAction> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  name: z.literal("continue_thread"),
  payload: z.object({ prompt: z.string().min(1) }),
});

export const buyerActionSchema: z.ZodType<BuyerAction> = z.union([
  savePropertyActionSchema,
  comparePropertyActionSchema,
  openPropertyActionSchema,
  contactAgentActionSchema,
  scheduleVisitActionSchema,
  refineSearchActionSchema,
  askFollowupActionSchema,
  continueThreadActionSchema,
]);

export const buyerShortlistCardSchema: z.ZodType<BuyerShortlistCard> = z.object({
  type: z.literal("shortlist"),
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  propertyIds: z.array(z.string().min(1)).min(1).max(5),
});

export const buyerRationaleCardSchema: z.ZodType<BuyerRationaleCard> = z.object({
  type: z.literal("rationale"),
  id: z.string().min(1),
  title: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1).max(5),
});

export const buyerMarketSourcesCardSchema: z.ZodType<BuyerMarketSourcesCard> = z.object({
  type: z.literal("market_sources"),
  id: z.string().min(1),
  title: z.string().min(1),
  sources: z.array(buyerSourceSchema).max(5),
});

export const buyerFollowupCardSchema: z.ZodType<BuyerFollowupCard> = z.object({
  type: z.literal("followup"),
  id: z.string().min(1),
  title: z.string().min(1),
  prompt: z.string().min(1),
  suggestions: z.array(z.string().min(1)).max(4).optional(),
});

export const buyerComparisonCardSchema: z.ZodType<BuyerComparisonCard> = z.object({
  type: z.literal("comparison"),
  id: z.string().min(1),
  title: z.string().min(1),
  propertyIds: z.array(z.string().min(1)).min(2).max(4),
  points: z.array(z.string().min(1)).min(1).max(5),
});

export const buyerActionsCardSchema: z.ZodType<BuyerActionsCard> = z.object({
  type: z.literal("actions"),
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  actionIds: z.array(z.string().min(1)).min(1).max(8),
});

export const buyerEmptyCardSchema: z.ZodType<BuyerEmptyCard> = z.object({
  type: z.literal("empty"),
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  suggestions: z.array(z.string().min(1)).max(4).optional(),
});

export const buyerCardSchema: z.ZodType<BuyerCard> = z.union([
  buyerShortlistCardSchema,
  buyerRationaleCardSchema,
  buyerMarketSourcesCardSchema,
  buyerFollowupCardSchema,
  buyerComparisonCardSchema,
  buyerActionsCardSchema,
  buyerEmptyCardSchema,
]);

export const buyerAssistantTurnSchema: z.ZodType<BuyerAssistantTurn> = z.object({
  version: z.literal(BUYER_TURN_VERSION),
  intent: z.enum(BUYER_INTENTS),
  objective: z.string().min(1),
  status: z.enum(BUYER_TURN_STATUSES),
  assistantText: z.string().min(1),
  propertyIds: z.array(z.string().min(1)).max(5),
  rankingRationale: z.string().min(1),
  followupQuestion: z.string().optional(),
  cards: z.array(buyerCardSchema).min(1).max(8),
  actions: z.array(buyerActionSchema).max(8),
  analytics: buyerAnalyticsSchema.optional(),
});

export const buyerStageEventSchema: z.ZodType<BuyerStageEvent> = z.object({
  seq: z.number().int().nonnegative(),
  eventType: z.literal("stage"),
  phase: z.enum(BUYER_STAGE_PHASES),
  status: z.enum(BUYER_STAGE_STATUSES),
  teamId: z.string().optional(),
  agentName: z.string().optional(),
  message: z.string().min(1),
  timestamp: z.number(),
  details: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export function extractBuyerTurnPropertyIds(turn: BuyerAssistantTurn) {
  return [...new Set(turn.propertyIds)];
}

export function findBuyerAction(turn: BuyerAssistantTurn, actionId: string) {
  return turn.actions.find((action) => action.id === actionId) ?? null;
}

export function assertValidBuyerAssistantTurn(input: unknown) {
  return buyerAssistantTurnSchema.parse(input);
}
