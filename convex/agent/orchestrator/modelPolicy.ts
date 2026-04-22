import { getAgentModel } from "../../shared/env";

export type WorkerModelStep =
  | "orchestrator"
  | "language_planner"
  | "surface_copy_localizer"
  | "search_planner"
  | "recommendation_ranker"
  | "advisor"
  | "funding"
  | "finance_editor"
  | "legal"
  | "legal_editor";

type ModelRole =
  | "orchestrator"
  | "finance"
  | "financeEditor"
  | "legal"
  | "legalEditor"
  | "search"
  | "ranking"
  | "summary";

type CostTier = "lowest" | "low" | "medium";
type StepDomain = "orchestration" | "property" | "finance" | "legal" | "advisor" | "presentation";

type StepPolicyTemplate = {
  modelRole: ModelRole;
  maxOutputTokens: number;
  disableReasoning: boolean;
  expectedCostTier: CostTier;
  domain: StepDomain;
  editorUsed: boolean;
};

export type WorkerModelPolicy = StepPolicyTemplate & {
  step: WorkerModelStep;
  modelId: string;
  provider: "openrouter";
};

type ModelPricing = {
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
};

const MODEL_PRICING: Record<string, ModelPricing> = {
  "google/gemini-2.5-flash-lite": {
    inputUsdPerMillion: 0.1,
    outputUsdPerMillion: 0.4,
  },
  "qwen/qwen3.5-flash-02-23": {
    inputUsdPerMillion: 0.1,
    outputUsdPerMillion: 0.4,
  },
  "google/gemma-4-26b-a4b-it": {
    inputUsdPerMillion: 0.08,
    outputUsdPerMillion: 0.35,
  },
};

const STEP_POLICIES: Record<WorkerModelStep, StepPolicyTemplate> = {
  orchestrator: {
    modelRole: "orchestrator",
    maxOutputTokens: 220,
    disableReasoning: true,
    expectedCostTier: "lowest",
    domain: "orchestration",
    editorUsed: false,
  },
  language_planner: {
    modelRole: "orchestrator",
    maxOutputTokens: 140,
    disableReasoning: true,
    expectedCostTier: "lowest",
    domain: "orchestration",
    editorUsed: false,
  },
  surface_copy_localizer: {
    modelRole: "summary",
    maxOutputTokens: 900,
    disableReasoning: true,
    expectedCostTier: "low",
    domain: "presentation",
    editorUsed: false,
  },
  search_planner: {
    modelRole: "search",
    maxOutputTokens: 220,
    disableReasoning: true,
    expectedCostTier: "lowest",
    domain: "property",
    editorUsed: false,
  },
  recommendation_ranker: {
    modelRole: "ranking",
    maxOutputTokens: 520,
    disableReasoning: true,
    expectedCostTier: "low",
    domain: "property",
    editorUsed: false,
  },
  advisor: {
    modelRole: "orchestrator",
    maxOutputTokens: 320,
    disableReasoning: true,
    expectedCostTier: "lowest",
    domain: "advisor",
    editorUsed: false,
  },
  funding: {
    modelRole: "finance",
    maxOutputTokens: 520,
    disableReasoning: true,
    expectedCostTier: "low",
    domain: "finance",
    editorUsed: false,
  },
  finance_editor: {
    modelRole: "financeEditor",
    maxOutputTokens: 280,
    disableReasoning: true,
    expectedCostTier: "lowest",
    domain: "finance",
    editorUsed: true,
  },
  legal: {
    modelRole: "legal",
    maxOutputTokens: 560,
    disableReasoning: true,
    expectedCostTier: "low",
    domain: "legal",
    editorUsed: false,
  },
  legal_editor: {
    modelRole: "legalEditor",
    maxOutputTokens: 320,
    disableReasoning: true,
    expectedCostTier: "lowest",
    domain: "legal",
    editorUsed: true,
  },
};

export function getWorkerModelPolicy(step: WorkerModelStep): WorkerModelPolicy {
  const template = STEP_POLICIES[step];
  return {
    ...template,
    step,
    modelId: getAgentModel(template.modelRole),
    provider: "openrouter",
  };
}

export function estimateUsageCostUsd(args: {
  modelId: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}) {
  const pricing = MODEL_PRICING[args.modelId];
  if (!pricing) {
    return null;
  }

  const inputTokens = Math.max(0, args.inputTokens ?? 0);
  const outputTokens = Math.max(0, args.outputTokens ?? 0);
  if (inputTokens > 0 || outputTokens > 0) {
    return Number(
      (
        (inputTokens / 1_000_000) * pricing.inputUsdPerMillion
        + (outputTokens / 1_000_000) * pricing.outputUsdPerMillion
      ).toFixed(6),
    );
  }

  const totalTokens = Math.max(0, args.totalTokens ?? 0);
  if (totalTokens === 0) {
    return 0;
  }

  const blendedUsdPerMillion = (pricing.inputUsdPerMillion + pricing.outputUsdPerMillion) / 2;
  return Number(((totalTokens / 1_000_000) * blendedUsdPerMillion).toFixed(6));
}

export function estimateUsdPerMillionTokens(totalTokens: number, totalCostUsd: number) {
  if (!Number.isFinite(totalTokens) || totalTokens <= 0 || !Number.isFinite(totalCostUsd) || totalCostUsd <= 0) {
    return 0;
  }

  return Number(((totalCostUsd / totalTokens) * 1_000_000).toFixed(4));
}
