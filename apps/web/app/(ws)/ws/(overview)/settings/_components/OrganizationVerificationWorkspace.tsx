"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import type {
  OrganizationSummary,
  OrganizationVerificationSummary,
} from "@/server/contracts/organizations";
import type { ComplianceRuleset } from "@/server/contracts/compliance";
import type { UploadedFileReference } from "@/server/contracts/files";
import {
  DocumentsCard,
  postVerificationRequest,
  RequirementsChecklist,
} from "../../../_components/OrganizationOnboarding/VerificationDocsStep.parts";
import { filterRequirements } from "../../../_components/OrganizationOnboarding/requirements";
import { formatLocaleDateTime, cn } from "@/lib/i18n";
import { formatWebCopy } from "@/lib/i18n";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";

type OrganizationVerificationWorkspaceProps = {
  organization: OrganizationSummary | null;
  verificationSummary?: OrganizationVerificationSummary;
  ruleset: ComplianceRuleset | null;
  canManage: boolean;
  membersCount: number;
};

const emptyVerificationSummary: OrganizationVerificationSummary = {
  isVerified: false,
  currentRequestId: null,
  currentRequestStatus: "not_submitted",
  lastSubmittedAt: null,
  lastReviewedAt: null,
  reviewerNotes: null,
  documentsCount: 0,
  publishingBlocked: false,
  attachedDocuments: [],
  requirements: [],
  sourceUrls: [],
};

function verificationStatusLabel(
  status: OrganizationVerificationSummary["currentRequestStatus"],
  dictionary: any,
) {
  const s = dictionary.settings;
  if (status === "approved") return s.verificationStatusApproved;
  if (status === "in_review") return s.verificationStatusInReview;
  if (status === "rejected") return s.verificationStatusRejected;
  if (status === "closed") return s.verificationStatusClosed;
  if (status === "new") return s.verificationStatusNew;
  return s.verificationStatusNotSubmitted;
}

function verificationStatusTone(status: OrganizationVerificationSummary["currentRequestStatus"]) {
  if (status === "approved") return "text-emerald-600 dark:text-emerald-400";
  if (status === "in_review") return "text-amber-600 dark:text-amber-400";
  if (status === "rejected") return "text-red-600 dark:text-red-400";
  if (status === "new") return "text-blue-600 dark:text-blue-400";
  return "text-[var(--zane-ai-text-muted)] opacity-60";
}

function buildLocalizedTimeline(summary: OrganizationVerificationSummary, dictionary: any) {
  const s = dictionary.settings;
  const copy = {
    submitted: s.verificationTimelineSubmitted,
    inReview: s.verificationTimelineInReview,
    approved: s.verificationTimelineApproved,
    closed: s.verificationTimelineClosed,
    rejected: s.verificationTimelineRejected,
    updated: s.verificationTimelineUpdated,
  };

  const items: Array<{ id: string; label: string; at: number; note?: string | null }> = [];
  if (summary.lastSubmittedAt) {
    items.push({ id: "submitted", label: copy.submitted, at: summary.lastSubmittedAt });
  }
  if (summary.currentRequestStatus === "in_review" && summary.lastSubmittedAt) {
    items.push({ id: "in_review", label: copy.inReview, at: summary.lastSubmittedAt });
  }
  if (summary.lastReviewedAt) {
    items.push({
      id: "reviewed",
      label:
        summary.currentRequestStatus === "approved"
          ? copy.approved
          : summary.currentRequestStatus === "closed"
            ? copy.closed
            : summary.currentRequestStatus === "rejected"
              ? copy.rejected
              : copy.updated,
      at: summary.lastReviewedAt,
      note: summary.reviewerNotes,
    });
  }
  return items.sort((left, right) => right.at - left.at);
}
async function uploadVerificationDocuments(args: {
  files: File[];
  startUpload: ReturnType<typeof useUploadThing>["startUpload"];
  setError: (value: string | null) => void;
  setDocs: React.Dispatch<React.SetStateAction<UploadedFileReference[]>>;
}) {
  if (args.files.length === 0) return;
  args.setError(null);
  try {
    const uploaded = await args.startUpload(args.files);
    const nextDocs = uploaded?.map((file) => file.serverData as UploadedFileReference) ?? [];
    args.setDocs((current) => [...current, ...nextDocs]);
  } catch (error) {
    args.setError(error instanceof Error ? error.message : "Upload failed.");
  }
}

/**
 * WHY:   Workspace settings need one organization-wide verification center instead of hiding verification inside onboarding only.
 * WHAT:  Renders the current organization verification status, evidence timeline, and manager-only resubmission form.
 * HOW:   Uses the shared verification checklist/upload widgets, keeps approval actions out of workspace, and mirrors local submission state after successful posts.
 */
export default function OrganizationVerificationWorkspace({
  organization,
  verificationSummary = emptyVerificationSummary,
  ruleset,
  canManage,
  membersCount,
}: OrganizationVerificationWorkspaceProps) {
  const { locale, dictionary, direction } = useWebLocale();
  const [summary, setSummary] = useState(verificationSummary);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(verificationSummary.requirements.map((entry) => [entry, true])),
  );
  const [requiredDocs, setRequiredDocs] = useState<UploadedFileReference[]>([]);
  const [proofDocs, setProofDocs] = useState<UploadedFileReference[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requiredInputRef = useRef<HTMLInputElement | null>(null);
  const proofInputRef = useRef<HTMLInputElement | null>(null);
  const { startUpload, isUploading } = useUploadThing("verificationDocuments");

  const filteredRequirements = useMemo(
    () => filterRequirements(ruleset?.requirements ?? [], query),
    [query, ruleset?.requirements],
  );
  const timeline = buildLocalizedTimeline(summary, dictionary);
  const organizationTypeLabel =
    organization?.type === "red"
      ? dictionary.settings.organizationTypeDeveloper
      : dictionary.settings.organizationTypeBroker;
  const formatDateLabel = (value: number | null) =>
    value ? formatLocaleDateTime(locale, value, { dateStyle: "medium", timeStyle: "short" }) : dictionary.settings.unavailable;

  if (!organization) {
    return (
      <section className="px-1" dir={direction}>
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-2xl">
          {dictionary.settings.organizationSettingsTitle}
        </h2>
        <p className="mt-4 text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
          {dictionary.settings.verificationEmptyOrganization}
        </p>
      </section>
    );
  }

  const summaryItems = [
    { label: dictionary.settings.publishingStatus, value: summary.publishingBlocked ? dictionary.settings.publishingBlocked : dictionary.settings.publishingAllowed },
    { label: dictionary.settings.lastSubmission, value: formatDateLabel(summary.lastSubmittedAt) },
    { label: dictionary.settings.filesCount, value: String(summary.documentsCount) },
    { label: dictionary.settings.membersCountLabel, value: String(membersCount) },
  ];

  return (
    <section className="space-y-8 pb-12" dir={direction}>
      <div className="flex flex-wrap items-start justify-between gap-10 px-1">
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-accent)]">
            {dictionary.settings.verificationCurrentStatus}
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-2xl">
            {dictionary.settings.verificationTitle}
          </h2>
          <p className="max-w-2xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
            {formatWebCopy(dictionary.settings.verificationSubmitDescription, { organizationType: organizationTypeLabel })}
          </p>
        </div>
        <div className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-current", verificationStatusTone(summary.currentRequestStatus))}>
          {verificationStatusLabel(summary.currentRequestStatus, dictionary)}
        </div>
      </div>

      {/* Technical Metadata Strip */}
      <div className="grid grid-cols-2 gap-px border-y border-[color:var(--workspace-border)] bg-[var(--workspace-border)] sm:grid-cols-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="bg-[var(--workspace-shell)]/30 px-5 py-3 backdrop-blur-sm transition-colors hover:bg-[var(--workspace-shell)]/50">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-70">
              {item.label}
            </div>
            <div className="mt-1 text-[13px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {summary.reviewerNotes ? (
        <div className="px-1">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-6 transition-colors hover:bg-red-500/10">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 opacity-80">
              {dictionary.settings.reviewNotes}
            </div>
            <p className="mt-2.5 text-[14px] font-bold leading-relaxed text-red-700 dark:text-red-300">
              {summary.reviewerNotes}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-px border-y border-[color:var(--workspace-border)] bg-[var(--workspace-border)] xl:grid-cols-2">
        {/* Timeline */}
        <div className="bg-[var(--workspace-shell)]/10 px-6 py-8 transition-colors hover:bg-[var(--workspace-shell)]/20">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] opacity-70">
            {dictionary.settings.verificationTimeline}
          </h3>
          <div className="mt-8 space-y-8">
            {timeline.length > 0 ? (
              timeline.map((item) => (
                <div key={item.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--zane-ai-accent)]">
                  <div className="text-[14px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
                    {item.label}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--zane-ai-text-muted)] opacity-50">
                    {formatDateLabel(item.at)}
                  </div>
                  {item.note ? (
                    <p className="mt-3 text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/60">
                      {item.note}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="text-[13px] font-medium text-[var(--zane-ai-text-muted)] opacity-50 italic">
                {dictionary.settings.verificationNoTimeline}
              </div>
            )}
          </div>
        </div>

        {/* Latest Documents */}
        <div className="bg-[var(--workspace-shell)]/10 px-6 py-8 transition-colors hover:bg-[var(--workspace-shell)]/20 border-l border-[color:var(--workspace-border)]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] opacity-70">
            {dictionary.settings.latestDocuments}
          </h3>
          <div className="mt-8 grid gap-4">
            {summary.attachedDocuments.length > 0 ? (
              summary.attachedDocuments.map((document) => (
                <a
                  key={document.key}
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col border-b border-[color:var(--workspace-border)]/50 pb-4 transition-all hover:border-[var(--zane-ai-accent)]"
                >
                  <div className="text-[13px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white group-hover:text-[var(--zane-ai-accent)]">
                    {document.name}
                  </div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[var(--zane-ai-text-muted)] opacity-50">
                    {document.mime ?? dictionary.settings.unknownDocumentType}{document.size ? ` • ${Math.ceil(document.size / 1024)} KB` : ""}
                  </div>
                </a>
              ))
            ) : (
              <div className="text-[13px] font-medium text-[var(--zane-ai-text-muted)] opacity-50 italic">
                {dictionary.settings.verificationNoTimeline}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-10 px-1">
        <div className="space-y-3">
          <h3 className="text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-2xl">
            {dictionary.settings.verificationSubmitTitle}
          </h3>
          <p className="max-w-2xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
            {formatWebCopy(dictionary.settings.verificationSubmitDescription, { organizationType: organizationTypeLabel })}
          </p>
        </div>

        <RequirementsChecklist
          countryLabel={ruleset?.countryLabel ?? null}
          typeLabel={organizationTypeLabel}
          query={query}
          onQueryChange={setQuery}
          selected={selected}
          filteredRequirements={filteredRequirements}
          onToggleRequirement={(id) => setSelected((current) => ({ ...current, [id]: !current[id] }))}
          sources={ruleset?.sources ?? []}
        />

        <div className="grid gap-20 xl:grid-cols-2">
          <DocumentsCard
            title={dictionary.settings.requiredDocsTitle}
            subtitle={dictionary.settings.requiredDocsSubtitle}
            uploadingLabel={dictionary.settings.uploadingFiles}
            idleLabel={dictionary.settings.uploadFilesIdle}
            docs={requiredDocs}
            isUploading={isUploading}
            onRemoveDoc={(docKey) => setRequiredDocs((current) => current.filter((item) => item.key !== docKey))}
            inputRef={requiredInputRef}
            onFilesChange={async (event) => {
              await uploadVerificationDocuments({
                files: Array.from(event.target.files ?? []),
                startUpload,
                setError: setErrorMessage,
                setDocs: setRequiredDocs,
              });
              event.target.value = "";
            }}
          />
          <DocumentsCard
            title={dictionary.settings.proofDocsTitle}
            subtitle={dictionary.settings.proofDocsSubtitle}
            uploadingLabel={dictionary.settings.uploadingFiles}
            idleLabel={dictionary.settings.uploadProofIdle}
            docs={proofDocs}
            isUploading={isUploading}
            onRemoveDoc={(docKey) => setProofDocs((current) => current.filter((item) => item.key !== docKey))}
            inputRef={proofInputRef}
            onFilesChange={async (event) => {
              await uploadVerificationDocuments({
                files: Array.from(event.target.files ?? []),
                startUpload,
                setError: setErrorMessage,
                setDocs: setProofDocs,
              });
              event.target.value = "";
            }}
          />
        </div>

        {errorMessage ? (
          <div className="border-l-4 border-red-500 bg-red-500/5 p-6 text-[13px] font-black uppercase tracking-tight text-red-700 dark:text-red-400">
            {errorMessage}
          </div>
        ) : null}
        {statusMessage ? (
          <div className="border-l-4 border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 p-6 text-[13px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
            {statusMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-10 pt-10 border-t border-[color:var(--workspace-border)]">
          <p className="max-w-md text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-50">
            {canManage
              ? dictionary.settings.managerOnlySubmissionHint
              : dictionary.settings.viewerSubmissionHint}
          </p>
          <button
            type="button"
            disabled={!canManage || isSubmitting || isUploading}
            onClick={async () => {
              if (requiredDocs.length === 0) {
                setErrorMessage(dictionary.settings.verificationRequiredDocsError);
                return;
              }
              setErrorMessage(null);
              setStatusMessage(dictionary.settings.verificationSubmitting);
              setIsSubmitting(true);
              try {
                await postVerificationRequest({
                  requiredDocs,
                  proofDocs,
                  selected,
                  sources: ruleset?.sources ?? [],
                  organizationType: organization.type,
                });
                const now = Date.now();
                const allDocs = [...requiredDocs, ...proofDocs];
                setSummary({
                  isVerified: false,
                  currentRequestId: summary.currentRequestId,
                  currentRequestStatus: "new",
                  lastSubmittedAt: now,
                  lastReviewedAt: null,
                  reviewerNotes: null,
                  documentsCount: allDocs.length,
                  publishingBlocked: true,
                  attachedDocuments: allDocs,
                  requirements: Object.keys(selected).filter((key) => selected[key]),
                  sourceUrls: (ruleset?.sources ?? []).map((source) => source.url),
                });
                setStatusMessage(dictionary.settings.verificationSubmitted);
                setRequiredDocs([]);
                setProofDocs([]);
              } catch (error) {
                setStatusMessage(null);
                setErrorMessage(error instanceof Error ? error.message : dictionary.settings.verificationSubmitFailed);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-[var(--zane-ai-deep)] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
          >
            <span className="relative z-10">
              {isSubmitting
                ? dictionary.settings.verificationSubmitting
                : summary.currentRequestStatus === "not_submitted"
                  ? dictionary.settings.verificationSubmit
                  : dictionary.settings.verificationResubmit}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
