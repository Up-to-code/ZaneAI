import {
  assistantSurfaceCopySchema,
  type AssistantDirection,
  type AssistantSurfaceCopy,
  type AssistantUiLocale,
  type ThreadPresentation,
  resolveDirectionFromLanguageTag,
  resolveUiLocaleFromLanguageTag,
} from "@zayon/assistant-protocol";

export type StoredThreadPresentation = {
  threadId: string;
  languageTag: string;
  direction: AssistantDirection;
  uiLocale?: AssistantUiLocale | null;
  source: "detected" | "explicit";
  confidence: number;
  surfaceCopyJson?: string;
  createdAt: number;
  updatedAt: number;
};

const ARABIC_SWITCH_PATTERN =
  /(بالعربي|بالعربية|رد بالعربي|كلمني بالعربي|اكتب بالعربي|تكلم عربي|عربي|عربى|arabic)/i;
const ENGLISH_SWITCH_PATTERN =
  /(بالانجليزي|بالإنجليزي|بالانجليزية|بالإنجليزية|رد بالانجليزي|كلمني بالانجليزي|اكتب بالانجليزي|english|in english|speak english)/i;
const FRENCH_SWITCH_PATTERN =
  /(بالفرنسي|بالفرنسية|رد بالفرنسي|كلمني بالفرنسي|fran[cç]ais|fran[cç]aise|french|en fran[cç]ais|parle fran[cç]ais)/i;
const ARABIZI_SWITCH_PATTERN =
  /(arabizi|arabizy|arabyzi|franco|franko|arabic in english|arabic written in english|write arabic in english|فرانكو|فرانكو عربي|كلمني فرانكو|اكتب فرانكو|رد فرانكو|رد عليا فرانكو|عربي بحروف انجليزي|عربي بحروف إنجليزي|عربي بالانجليزي|عربي بالإنجليزي)/i;

const ARABIC_SCRIPT_PATTERN = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const FRENCH_SIGNAL_PATTERN = /\b(bonjour|salut|merci|appartement|quartier|budget|cherche|maison|avec|pour|dans|proche|fran[cç]ais)\b|[àâçéèêëîïôùûüÿœ]/i;
const ENGLISH_SIGNAL_PATTERN = /\b(the|and|with|near|budget|apartment|property|compare|search|looking|find|show|what|my|name)\b/i;
const ARABIZI_SIGNAL_PATTERN =
  /\b(ana|enta|enti|eh|eih|fein|fen|fain|msh|mesh|mafeesh|mafish|baheb|ayez|3ayez|عايز|3aiz|7aga|hag[a]?|sho?f|shof|keda|kda|dayman|tab|tayeb|el|wla|wala|fi|fih|bet|beit|sh2a|sha2a|she2a|taman|s3r|se3r|madina|moqattam|tagamo3|tgamo3|zayed|october|nasr city|masr el gdida|masr el gedida)\b/i;
const ARABIZI_NUMERAL_PATTERN = /(^|[^0-9])(2|3|5|6|7|8|9)($|[^0-9])/;

function normalizeLanguageTag(languageTag: string) {
  return languageTag.trim().toLowerCase();
}

export function parseSurfaceCopyJson(value: string | undefined): AssistantSurfaceCopy | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    const result = assistantSurfaceCopySchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function toThreadPresentation(row: StoredThreadPresentation | null | undefined): ThreadPresentation | null {
  if (!row) {
    return null;
  }

  return {
    languageTag: row.languageTag,
    direction: row.direction,
    uiLocale: row.uiLocale ?? null,
    source: row.source,
    confidence: row.confidence,
    surfaceCopy: parseSurfaceCopyJson(row.surfaceCopyJson) ?? undefined,
  };
}

export function detectExplicitThreadPresentation(prompt: string): ThreadPresentation | null {
  if (ARABIZI_SWITCH_PATTERN.test(prompt)) {
    return {
      languageTag: "ar-Latn",
      direction: "ltr",
      uiLocale: null,
      source: "explicit",
      confidence: 0.99,
    };
  }

  if (ARABIC_SWITCH_PATTERN.test(prompt)) {
    return {
      languageTag: "ar",
      direction: "rtl",
      uiLocale: "ar",
      source: "explicit",
      confidence: 0.99,
    };
  }

  if (ENGLISH_SWITCH_PATTERN.test(prompt)) {
    return {
      languageTag: "en",
      direction: "ltr",
      uiLocale: "en",
      source: "explicit",
      confidence: 0.99,
    };
  }

  if (FRENCH_SWITCH_PATTERN.test(prompt)) {
    return {
      languageTag: "fr",
      direction: "ltr",
      uiLocale: "fr",
      source: "explicit",
      confidence: 0.99,
    };
  }

  return null;
}

export function detectThreadPresentationHeuristically(prompt: string): ThreadPresentation | null {
  const normalized = prompt.trim();
  if (!normalized) {
    return null;
  }

  if (ARABIC_SCRIPT_PATTERN.test(normalized)) {
    return {
      languageTag: "ar",
      direction: "rtl",
      uiLocale: "ar",
      source: "detected",
      confidence: 0.98,
    };
  }

  const arabiziSignals = normalized.match(ARABIZI_SIGNAL_PATTERN)?.length ?? 0;
  const hasArabiziNumerals = ARABIZI_NUMERAL_PATTERN.test(normalized);
  if (arabiziSignals >= 2 || (arabiziSignals >= 1 && hasArabiziNumerals)) {
    return {
      languageTag: "ar-Latn",
      direction: "ltr",
      uiLocale: null,
      source: "detected",
      confidence: hasArabiziNumerals ? 0.94 : 0.88,
    };
  }

  if (FRENCH_SIGNAL_PATTERN.test(normalized)) {
    return {
      languageTag: "fr",
      direction: "ltr",
      uiLocale: "fr",
      source: "detected",
      confidence: 0.87,
    };
  }

  if (ENGLISH_SIGNAL_PATTERN.test(normalized)) {
    return {
      languageTag: "en",
      direction: "ltr",
      uiLocale: "en",
      source: "detected",
      confidence: 0.8,
    };
  }

  return null;
}

export function shouldJudgeThreadPresentationWithModel(args: {
  prompt: string;
  existing: ThreadPresentation | null;
}) {
  const normalized = args.prompt.trim();
  if (normalized.length < 8) {
    return false;
  }

  if (detectExplicitThreadPresentation(normalized) || detectThreadPresentationHeuristically(normalized)) {
    return false;
  }

  return !args.existing;
}

export function coerceDetectedThreadPresentation(input: {
  languageTag: string;
  direction?: AssistantDirection | null;
  uiLocale?: AssistantUiLocale | null;
  source?: "detected" | "explicit";
  confidence?: number;
}): ThreadPresentation {
  const languageTag = normalizeLanguageTag(input.languageTag || "en");
  return {
    languageTag,
    direction: input.direction ?? resolveDirectionFromLanguageTag(languageTag),
    uiLocale: input.uiLocale ?? resolveUiLocaleFromLanguageTag(languageTag),
    source: input.source ?? "detected",
    confidence: Math.max(0, Math.min(1, input.confidence ?? 0.7)),
  };
}

export function mergeThreadPresentation(current: ThreadPresentation | null, detected: ThreadPresentation | null): ThreadPresentation | null {
  if (!current) {
    return detected;
  }

  if (!detected) {
    return current;
  }

  if (detected.source === "explicit") {
    return detected;
  }

  if (current.source === "explicit" && current.confidence >= detected.confidence) {
    return current;
  }

  if (current.languageTag === detected.languageTag) {
    return {
      ...current,
      confidence: Math.max(current.confidence, detected.confidence),
    };
  }

  if (detected.confidence >= 0.95) {
    return detected;
  }

  return current;
}
