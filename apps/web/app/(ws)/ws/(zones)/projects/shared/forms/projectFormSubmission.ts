import { z } from "zod";
import type { ProjectFormData } from "@/app/(ws)/ws/public";
import { normalizeDomainError } from "@/server/contracts/errors";

export type ProjectFormFieldName = "name" | "location" | "description" | "projectType" | "expectedUnits" | "developerName" | "startingPrice" | "installmentYears" | "compoundAmenities" | "masterPlanImageKey";

export type ProjectFormFieldErrors = Partial<Record<ProjectFormFieldName, string>>;

export type ProjectFormSubmissionFeedback = {
  message: string;
  fieldErrors: ProjectFormFieldErrors;
};

export type ProjectFormActionResult =
  | { ok: true; redirectTo: string }
  | { ok: false; feedback: ProjectFormSubmissionFeedback };

export type ProjectFormSaveResult =
  | { ok: true }
  | { ok: false; feedback: ProjectFormSubmissionFeedback };

const projectFormSchema = z.object({
  name: z.string().trim().min(1, "اسم المشروع مطلوب.").max(200, "اسم المشروع طويل أكثر من اللازم."),
  location: z.string().trim().min(1, "الموقع مطلوب.").max(200, "الموقع طويل أكثر من اللازم."),
  description: z.string().trim().min(1, "الوصف مطلوب."),
  projectType: z.enum(["villas", "apartments", "land_plots", "mixed", "custom"]),
  expectedUnits: z.string().optional(),
  developerName: z.string().optional(),
  startingPrice: z.string().optional(),
  installmentYears: z.string().optional(),
  compoundAmenities: z.array(z.string()).optional(),
  masterPlanImageKey: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.expectedUnits) {
    const units = Number(data.expectedUnits);
    if (!Number.isFinite(units) || units <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expectedUnits"],
        message: "أدخل عدد وحدات صحيح.",
      });
    }
  }
  if (data.installmentYears) {
    const years = Number(data.installmentYears);
    if (!Number.isFinite(years) || years <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["installmentYears"],
        message: "أدخل عدد سنوات صحيح.",
      });
    }
  }
});

function buildFieldErrors(error: z.ZodError): ProjectFormFieldErrors {
  const fieldErrors: ProjectFormFieldErrors = {};

  for (const issue of error.issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName !== "string" || fieldName in fieldErrors) {
      continue;
    }

    fieldErrors[fieldName as ProjectFormFieldName] = issue.message;
  }

  return fieldErrors;
}

function buildFeedback(message: string, fieldErrors: ProjectFormFieldErrors = {}): ProjectFormSubmissionFeedback {
  return {
    message,
    fieldErrors,
  };
}

export function validateProjectFormSubmission(data: ProjectFormData): ProjectFormSubmissionFeedback | null {
  const parsed = projectFormSchema.safeParse(data);
  if (parsed.success) {
    return null;
  }

  return buildFeedback("راجع الحقول المطلوبة ثم حاول الحفظ مرة أخرى.", buildFieldErrors(parsed.error));
}

export function toProjectFormActionFailure(error: unknown): ProjectFormActionResult {
  const domainError = normalizeDomainError(error);
  return {
    ok: false,
    feedback: buildFeedback(domainError.message),
  };
}
