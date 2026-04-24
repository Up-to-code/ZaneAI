import type { UploadedFileReference } from "@/server/contracts/files";
import type { OfferAllowedAudience, OfferCaseType } from "@/server/contracts/offers";
import type { OrganizationSummary } from "@/server/contracts/organizations";
import type { WorkspaceAudience } from "@/server/contracts/workspace";
import type { OfferPropertyOption } from "../../types/offerTypes";

export type OfferFormState = {
  propertyId: string;
  mode: OfferCaseType;
  title: string;
  description: string;
  price: string;
  allowedAudience: OfferAllowedAudience;
  commissionText: string;
  permitStatus: string;
  productStatus: string;
  recipientEmail: string;
  recipientPhone: string;
  clientName: string;
  clientPhone: string;
  clientBudget: string;
  clientBudgetMin: string;
  clientBudgetMax: string;
  clientLocation: string;
  clientArea: string;
  clientBedsMin: string;
  clientBathsMin: string;
  clientSqftMin: string;
  clientSqftMax: string;
  clientNeed: string;
};

export type OfferSubmitPayload = {
  propertyId?: string;
  mode: OfferCaseType;
  title: string;
  description: string;
  price: string;
  allowedAudience: OfferAllowedAudience;
  commissionText?: string;
  permitStatus?: string;
  productStatus?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  clientContext?: {
    clientName: string;
    clientPhone?: string;
    clientBudget?: string;
    clientNeed: string;
    budgetMin?: number;
    budgetMax?: number;
    location?: string;
    area?: string;
    bedsMin?: number;
    bathsMin?: number;
    sqftMin?: number;
    sqftMax?: number;
  };
  attachments: UploadedFileReference[];
};

export type CreateOfferFormProps = {
  properties: OfferPropertyOption[];
  audience: WorkspaceAudience;
  organization?: OrganizationSummary | null;
  simplifiedFieldsOnly?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  submitLabel?: string;
  backHref?: string;
  settingsHref?: string;
  initialData?: Partial<OfferFormState> & {
    attachments?: UploadedFileReference[];
  };
  onSubmit: (data: OfferSubmitPayload) => Promise<{ redirectTo: string }>;
  onArchive?: () => Promise<{ redirectTo: string }>;
};

function parseOptionalNumberInput(value: string) {
  const normalized = value.trim().replace(/[^\d.]/g, "");
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function buildInitialState(
  properties: OfferPropertyOption[],
  initialData?: CreateOfferFormProps["initialData"],
): OfferFormState {
  const isClientRequestDraft = initialData?.mode === "collaboration_case";
  const defaultProperty = isClientRequestDraft
    ? (initialData?.propertyId ?? "")
    : (initialData?.propertyId ?? properties[0]?.id ?? "");
  const property = properties.find((item) => item.id === defaultProperty);

  return {
    propertyId: defaultProperty,
    mode: initialData?.mode === "collaboration_case" ? "collaboration_case" : "open_offer",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? property?.expectedPrice ?? "",
    allowedAudience: "brokers",
    commissionText: initialData?.commissionText ?? "",
    permitStatus: initialData?.permitStatus ?? "",
    productStatus: initialData?.productStatus ?? "",
    recipientEmail: initialData?.recipientEmail ?? "",
    recipientPhone: initialData?.recipientPhone ?? "",
    clientName: initialData?.clientName ?? "",
    clientPhone: initialData?.clientPhone ?? "",
    clientBudget: initialData?.clientBudget ?? "",
    clientBudgetMin: initialData?.clientBudgetMin ?? "",
    clientBudgetMax: initialData?.clientBudgetMax ?? "",
    clientLocation: initialData?.clientLocation ?? "",
    clientArea: initialData?.clientArea ?? "",
    clientBedsMin: initialData?.clientBedsMin ?? "",
    clientBathsMin: initialData?.clientBathsMin ?? "",
    clientSqftMin: initialData?.clientSqftMin ?? "",
    clientSqftMax: initialData?.clientSqftMax ?? "",
    clientNeed: initialData?.clientNeed ?? "",
  };
}

export function buildSubmitPayload(
  form: OfferFormState,
  attachments: UploadedFileReference[],
  options?: { simplifiedFieldsOnly?: boolean; properties?: OfferPropertyOption[] },
): OfferSubmitPayload {
  const selectedProperty = options?.properties?.find((item) => item.id === form.propertyId) ?? null;
  const isSimplified = options?.simplifiedFieldsOnly === true;
  const effectiveMode: OfferCaseType = isSimplified
    ? form.mode === "collaboration_case"
      ? "collaboration_case"
      : "open_offer"
    : form.mode;
  const isClientRequirement = effectiveMode === "collaboration_case";
  const isTargetedBrokerShare = effectiveMode === "open_offer";
  const trimmedDescription = form.description.trim();
  const trimmedLocation = form.clientLocation.trim();
  const combinedClientNeed =
    trimmedLocation.length > 0 ? `${trimmedDescription}\nالموقع المطلوب: ${trimmedLocation}` : trimmedDescription;
  const budgetMin = parseOptionalNumberInput(form.clientBudgetMin);
  const budgetMax =
    parseOptionalNumberInput(form.clientBudgetMax) ??
    (isClientRequirement ? parseOptionalNumberInput(form.price) : undefined);
  const bedsMin = parseOptionalNumberInput(form.clientBedsMin);
  const bathsMin = parseOptionalNumberInput(form.clientBathsMin);
  const sqftMin = parseOptionalNumberInput(form.clientSqftMin);
  const sqftMax = parseOptionalNumberInput(form.clientSqftMax);
  const area = form.clientArea.trim() || undefined;

  return {
    propertyId: effectiveMode === "collaboration_case" ? undefined : form.propertyId || undefined,
    mode: effectiveMode,
    title: isSimplified ? selectedProperty?.title ?? form.title.trim() : form.title.trim(),
    description: form.description.trim(),
    price: form.price,
    allowedAudience: "brokers",
    commissionText: isClientRequirement || isSimplified ? undefined : form.commissionText.trim() || undefined,
    permitStatus: isClientRequirement || isSimplified ? undefined : form.permitStatus.trim() || undefined,
    productStatus: isClientRequirement || isSimplified ? undefined : form.productStatus.trim() || undefined,
    recipientEmail: isTargetedBrokerShare && !isSimplified ? form.recipientEmail.trim() || undefined : undefined,
    recipientPhone: isTargetedBrokerShare && !isSimplified ? form.recipientPhone.trim() || undefined : undefined,
    clientContext:
      effectiveMode === "collaboration_case"
        ? {
            clientName: isSimplified ? form.title.trim() : form.clientName.trim(),
            clientPhone: form.clientPhone.trim() || undefined,
            clientBudget: isSimplified ? form.price.trim() || undefined : form.clientBudget.trim() || undefined,
            clientNeed: isSimplified ? combinedClientNeed : form.clientNeed.trim(),
            budgetMin,
            budgetMax,
            location: trimmedLocation || undefined,
            area,
            bedsMin,
            bathsMin,
            sqftMin,
            sqftMax,
          }
        : undefined,
    attachments,
  };
}
