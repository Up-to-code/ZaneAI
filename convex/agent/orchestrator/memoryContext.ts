import type { AssistantRoute } from "../../../packages/zayon-assistant-protocol/src";
import type { BudgetMode } from "../../property/lib/recommendation";

export type MemoryContextKind =
  | "direct"
  | "context_lookup"
  | "property_history"
  | "preference_assisted_search"
  | "fresh_search"
  | "comparison";

export type MemoryContextSource =
  | "assistant_turns"
  | "thread_messages"
  | "cortex_memory"
  | "property_searches"
  | "buyer_preferences"
  | "tool_calls";

export type MemorySearchPolicy = "reuse" | "rerun" | "none";

export type MemoryContextPlan = {
  kind: MemoryContextKind;
  sources: MemoryContextSource[];
  searchPolicy: MemorySearchPolicy;
  contextBudget: {
    assistantTurns: number;
    threadMessages: number;
    cortexMemories: number;
    propertySearchSessions: number;
    resultIds: number;
    toolCalls: number;
  };
  loadAssistantTurns: boolean;
  loadThreadMessages: boolean;
  loadCortexMemory: boolean;
  loadPropertySearches: boolean;
  loadBuyerPreferences: boolean;
  loadToolCalls: boolean;
  reuseLastSearch: boolean;
  rerunSearch: boolean;
  summarizeContext: boolean;
  reason: string;
};

export type PreferencePromotionPatch = {
  minBudget?: number;
  maxBudget?: number;
  locations?: string[];
  propertyTypes?: string[];
  financingPreferences?: string[];
  confidence: number;
};

type PlanInput = {
  prompt: string;
  route: AssistantRoute;
};

type PromotionInput = {
  prompt: string;
  route: AssistantRoute;
  filters?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    targetPrice?: number;
    budgetMode?: BudgetMode;
    query?: string;
  };
};

const DEFAULT_CONTEXT_BUDGET = {
  assistantTurns: 0,
  threadMessages: 0,
  cortexMemories: 0,
  propertySearchSessions: 0,
  resultIds: 0,
  toolCalls: 0,
};

const PROPERTY_HISTORY_PATTERN =
  /\b(that|those|previous|before|again|show me more|more like|cheaper one|apartment i showed|one before|second one|third one|first one|open the search|get the phone|phone number|contact that|compare those|change budget|change the budget|change location)\b/i;

const ARABIC_PROPERTY_HISTORY_PATTERN =
  /(زي|زى|شبه|مثل|اعرض|هات|وريني|ورينى).*(التاني|الثاني|التالت|الثالث|الأول|الاول|ده|دا|دي|دى|دول|ديله)|(الأرخص|ارخص|الأغلى|اغلى).*(فيهم|منهم)|العقار اللي فات|العقار اللى فات|الشقة اللي فاتت|الشقة اللى فاتت|الاختيار اللي فات|الاختيار اللى فات|رقم.*(الشقة|العقار)|كلم.*(المالك|الوسيط)|غي?ر.*(الميزانية|السعر|المكان|المنطقة)/i;

const CONVERSATION_CONTEXT_PATTERN =
  /(ما بينهم|بينهم|الاتنين|الاختيارين|الاول والتاني|الأول والتاني|ده|دي|دول|دا|اللي فوق|قبل كده|those|between them|both options|first and second|what did i ask|summarize what we already)/i;

const PRICE_CONTEXT_FOLLOWUP_PATTERN =
  /(السعر|الأسعار|اسعار|مؤشرات السعر|فين أحسن|فين افضل|فين أفضل|pricing|price indicators|price there|market indicators)/i;

const PREFERENCE_CONTEXT_PATTERN =
  /\b(usual|usually|normally|my preference|my preferences|for me|suitable for me|like before|as before|what i like)\b/i;

const ARABIC_PREFERENCE_CONTEXT_PATTERN =
  /(المعتاد|عادتي|عادة|دايمًا|دايما|يناسبني|يناسبنى|زي قبل|زى قبل|اللي بحبه|اللى بحبه|اختياراتي|تفضيلاتي)/i;

const RERUN_SEARCH_PATTERN =
  /\b(change|instead|different|new search|fresh|current|live|today|tonight|tomorrow|budget|price|max|under|around|location|area|bedroom|bedrooms|rent|buy)\b/i;

const ARABIC_RERUN_SEARCH_PATTERN =
  /(غير|غيّر|بدل|ميزانية|السعر|مكان|منطقة|أوض|غرف|ايجار|إيجار|شراء|النهارده|الليلة|ليلة|جديد|متاح دلوقتي)/i;

const TOOL_HISTORY_PATTERN =
  /\b(what did you search|did you search|which tool|tool history|search history)\b/i;

export function isShortAreaComparisonFragment(prompt: string) {
  const normalized = prompt.trim();
  return normalized.length <= 90
    && (
      /(بين|ما بين)\s+[\u0600-\u06FFa-zA-Z0-9\s]+?\s+و[\u0600-\u06FFa-zA-Z0-9\s]+/i.test(normalized)
      || /\bbetween\s+.{2,40}\s+and\s+.{2,40}\b/i.test(normalized)
    );
}

export function needsPropertyHistoryLookup(prompt: string) {
  return PROPERTY_HISTORY_PATTERN.test(prompt) || ARABIC_PROPERTY_HISTORY_PATTERN.test(prompt);
}

export function needsConversationContextLookup(prompt: string) {
  return needsPropertyHistoryLookup(prompt)
    || CONVERSATION_CONTEXT_PATTERN.test(prompt)
    || isShortAreaComparisonFragment(prompt)
    || PRICE_CONTEXT_FOLLOWUP_PATTERN.test(prompt);
}

export function needsBuyerPreferenceContext(prompt: string) {
  return PREFERENCE_CONTEXT_PATTERN.test(prompt) || ARABIC_PREFERENCE_CONTEXT_PATTERN.test(prompt);
}

export function hasRerunSearchSignal(prompt: string) {
  return RERUN_SEARCH_PATTERN.test(prompt) || ARABIC_RERUN_SEARCH_PATTERN.test(prompt);
}

function isGreetingPrompt(prompt: string) {
  return /^(hi|hello|hey|good morning|good evening|salam|مرحبا|اهلا|أهلا)(\s+zane(ai)?|\s+zane)?[!. ]*$/i.test(prompt.trim());
}

function asksForRememberedContext(prompt: string) {
  return /\b(what's my name|what is my name|who am i|do you remember me|remember my name|what did i say|what did i tell you)\b/i.test(prompt)
    || /(اسمي ايه|اسمى ايه|فاكر اسمي|فاكر اسمى|تفتكر اسمي|تفتكر اسمى|انا مين|أنا مين|قلتلك ايه|قلت لك ايه)/i.test(prompt);
}

function hasBudgetSignal(prompt: string) {
  return /\b(max|under|around|budget|price|egp|aed|usd|\d{3,})\b/i.test(prompt)
    || /(ميزانية|سعر|جنيه|درهم|دولار|\d{3,})/i.test(prompt);
}

function hasLocationSignal(prompt: string) {
  return /\b(near|in |at |zayed|new cairo|cairo|giza|dubai|marina|business bay|gem|museum|area|location)\b/i.test(prompt)
    || /(زايد|التجمع|القاهرة|الجيزة|دبي|مارينا|متحف|منطقة|مكان|قريب)/i.test(prompt);
}

function isUnderspecifiedPropertySearch(prompt: string) {
  return !hasBudgetSignal(prompt) || !hasLocationSignal(prompt);
}

function uniqueSources(sources: MemoryContextSource[]) {
  return sources.filter((source, index, list) => list.indexOf(source) === index);
}

function buildPlan(args: {
  kind: MemoryContextKind;
  sources?: MemoryContextSource[];
  searchPolicy?: MemorySearchPolicy;
  budget?: Partial<MemoryContextPlan["contextBudget"]>;
  reason: string;
}): MemoryContextPlan {
  const sources = uniqueSources(args.sources ?? []);
  const contextBudget = { ...DEFAULT_CONTEXT_BUDGET, ...(args.budget ?? {}) };
  return {
    kind: args.kind,
    sources,
    searchPolicy: args.searchPolicy ?? "none",
    contextBudget,
    loadAssistantTurns: sources.includes("assistant_turns"),
    loadThreadMessages: sources.includes("thread_messages"),
    loadCortexMemory: sources.includes("cortex_memory"),
    loadPropertySearches: sources.includes("property_searches"),
    loadBuyerPreferences: sources.includes("buyer_preferences"),
    loadToolCalls: sources.includes("tool_calls"),
    reuseLastSearch: args.searchPolicy === "reuse",
    rerunSearch: args.searchPolicy === "rerun",
    summarizeContext: contextBudget.assistantTurns > 4 || contextBudget.propertySearchSessions > 3,
    reason: args.reason,
  };
}

export function buildMemoryContextPlan(input: PlanInput): MemoryContextPlan {
  const prompt = input.prompt.trim();
  const isPropertyRoute = input.route === "property" || input.route === "mixed";
  const propertyHistory = needsPropertyHistoryLookup(prompt);
  const conversationContext = needsConversationContextLookup(prompt) || asksForRememberedContext(prompt);
  const preferenceContext = needsBuyerPreferenceContext(prompt);
  const rerunSearch = hasRerunSearchSignal(prompt);
  const toolHistory = TOOL_HISTORY_PATTERN.test(prompt);

  if (isPropertyRoute && propertyHistory) {
    return buildPlan({
      kind: /\b(compare|comparison)\b/i.test(prompt) || /قارن|مقارنة/i.test(prompt) ? "comparison" : "property_history",
      sources: ["property_searches", ...(preferenceContext ? ["buyer_preferences" as const] : [])],
      searchPolicy: rerunSearch ? "rerun" : "reuse",
      budget: { propertySearchSessions: 3, resultIds: 12 },
      reason: rerunSearch ? "property_reference_with_changed_constraints" : "property_reference_reuse_previous_search",
    });
  }

  if (!isGreetingPrompt(prompt) && (conversationContext || input.route === "advisor" || input.route === "funding" || input.route === "legal")) {
    return buildPlan({
      kind: "context_lookup",
      sources: [
        "thread_messages",
        "cortex_memory",
        ...(toolHistory ? ["tool_calls" as const] : []),
      ],
      searchPolicy: "none",
      budget: { threadMessages: 6, cortexMemories: 3, toolCalls: toolHistory ? 4 : 0 },
      reason: asksForRememberedContext(prompt)
        ? "personal_or_thread_memory_lookup"
        : isShortAreaComparisonFragment(prompt)
          ? "short_followup_needs_recent_or_cortex_context"
          : input.route === "advisor" || input.route === "funding" || input.route === "legal"
            ? "advisor_funding_or_legal_turn_loads_recent_and_cortex_context"
            : "conversation_reference_needs_recent_or_cortex_context",
    });
  }

  if (isPropertyRoute && (preferenceContext || isUnderspecifiedPropertySearch(prompt))) {
    return buildPlan({
      kind: "preference_assisted_search",
      sources: ["buyer_preferences"],
      searchPolicy: "rerun",
      budget: { resultIds: 8 },
      reason: preferenceContext ? "user_requested_preference_assisted_search" : "property_search_missing_budget_or_location",
    });
  }

  if (isPropertyRoute) {
    return buildPlan({
      kind: "fresh_search",
      searchPolicy: "rerun",
      reason: "fresh_property_search_has_current_constraints",
    });
  }

  if (toolHistory) {
    return buildPlan({
      kind: "context_lookup",
      sources: ["tool_calls"],
      searchPolicy: "none",
      budget: { toolCalls: 4 },
      reason: "tool_history_question",
    });
  }

  return buildPlan({
    kind: "direct",
    searchPolicy: "none",
    reason: "current_message_is_sufficient",
  });
}

function normalizeList(values: Array<string | undefined>) {
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value, index, list) => list.findIndex((candidate) => candidate.toLowerCase() === value.toLowerCase()) === index);
}

function extractBudget(prompt: string, filters?: PromotionInput["filters"]): { minBudget?: number; maxBudget?: number } {
  const numberMatch = prompt.match(/(?:egp|aed|usd|جنيه|درهم|دولار)?\s*(\d[\d,\.]*)/i);
  const parsed = numberMatch ? Number(numberMatch[1].replace(/[,.]/g, "")) : undefined;
  const budget = Number.isFinite(parsed) && parsed ? parsed : undefined;
  const maxCue = /\b(max|under|up to|less than|budget)\b/i.test(prompt) || /(حد أقصى|اقل من|أقل من|ميزانيتي|ميزانية)/i.test(prompt);
  const aroundCue = /\b(around|about|roughly|average)\b/i.test(prompt) || /(حوالي|تقريبا|تقريبًا)/i.test(prompt);

  if (filters?.maxPrice) return { maxBudget: filters.maxPrice };
  if (filters?.targetPrice && (aroundCue || !maxCue)) return { maxBudget: Math.round(filters.targetPrice * 1.15) };
  if (!budget) return {};
  return maxCue || aroundCue ? { maxBudget: budget } : {};
}

function extractLocations(prompt: string, filters?: PromotionInput["filters"]) {
  const locations = [
    filters?.location,
    /\b(sheikh zayed|zayed)\b/i.test(prompt) || /زايد/i.test(prompt) ? "Sheikh Zayed" : undefined,
    /\b(new cairo|tagamoa|fifth settlement)\b/i.test(prompt) || /(التجمع|القاهرة الجديدة)/i.test(prompt) ? "New Cairo" : undefined,
    /\b(grand egyptian museum|gem)\b/i.test(prompt) || /(المتحف المصري الكبير|المتحف)/i.test(prompt) ? "Grand Egyptian Museum" : undefined,
    /\b(dubai marina)\b/i.test(prompt) || /دبي مارينا/i.test(prompt) ? "Dubai Marina" : undefined,
    /\b(business bay)\b/i.test(prompt) || /بيزنس باي/i.test(prompt) ? "Business Bay" : undefined,
    /\b(6 october|october)\b/i.test(prompt) || /(أكتوبر|اكتوبر)/i.test(prompt) ? "6 October" : undefined,
  ];
  return normalizeList(locations);
}

function extractPropertyTypes(prompt: string, filters?: PromotionInput["filters"]) {
  return normalizeList([
    /\b(apartment|apartments|flat|flats)\b/i.test(prompt) || /(شقة|شقه)/i.test(prompt) ? "apartment" : undefined,
    /\b(villa|villas)\b/i.test(prompt) || /فيلا/i.test(prompt) ? "villa" : undefined,
    /\b(studio|studios)\b/i.test(prompt) || /ستوديو/i.test(prompt) ? "studio" : undefined,
    filters?.query?.match(/\b(apartment|villa|studio)\b/i)?.[1]?.toLowerCase(),
  ]);
}

function extractFinancingPreferences(prompt: string) {
  return normalizeList([
    /\b(mortgage|loan)\b/i.test(prompt) || /(تمويل|قرض|رهن)/i.test(prompt) ? "mortgage" : undefined,
    /\b(installment|installments)\b/i.test(prompt) || /(تقسيط|قسط|أقساط|اقساط)/i.test(prompt) ? "installments" : undefined,
    /\b(cash)\b/i.test(prompt) || /كاش/i.test(prompt) ? "cash" : undefined,
  ]);
}

export function extractPreferencePromotion(input: PromotionInput): PreferencePromotionPatch | null {
  if (input.route !== "property" && input.route !== "mixed" && input.route !== "funding") {
    return null;
  }

  const stableCue = /\b(usually|always|normally|prefer|my budget|my usual|i like|i want to keep)\b/i.test(input.prompt)
    || /(عادة|دايمًا|دايما|بفضل|أفضل|بحب|ميزانيتي|اختياراتي|تفضيلاتي|المعتاد)/i.test(input.prompt);
  if (!stableCue) {
    return null;
  }

  const locations = extractLocations(input.prompt, input.filters);
  const propertyTypes = extractPropertyTypes(input.prompt, input.filters);
  const financingPreferences = extractFinancingPreferences(input.prompt);
  const budget = extractBudget(input.prompt, input.filters);
  const hasPreference = locations.length > 0
    || propertyTypes.length > 0
    || financingPreferences.length > 0
    || budget.minBudget !== undefined
    || budget.maxBudget !== undefined;

  if (!hasPreference) {
    return null;
  }

  return {
    ...budget,
    ...(locations.length ? { locations } : {}),
    ...(propertyTypes.length ? { propertyTypes } : {}),
    ...(financingPreferences.length ? { financingPreferences } : {}),
    confidence: 0.88,
  };
}
