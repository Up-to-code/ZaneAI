"use client";

import { useState } from "react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";
import type { OrganizationSummary } from "@/server/contracts/organizations";

function resolveOrganizationStatusLabel(
  status: OrganizationSummary["status"],
  dictionary: any
) {
  if (status === "active") return dictionary.settings.organizationStatusActive;
  if (status === "pending") return dictionary.settings.organizationStatusPending;
  return dictionary.settings.organizationStatusUnavailable;
}

/**
 * WHY:   Organization settings need one focused client controller for the current organization profile.
 * WHAT:  Renders identity metadata plus an editable form for organization details.
 * HOW:   Keeps localized UI state on the client while delegating persistence to the provided server action.
 */
export default function OrganizationSettingsWorkspace({
  organization,
  canManage,
  onSave,
}: {
  organization: OrganizationSummary | null;
  canManage: boolean;
  onSave: (input: {
    name: string;
    description?: string;
    website?: string;
    contactEmail?: string;
    phone?: string;
  }) => Promise<{ ok: true; message: string } | { ok: false; message: string }>;
}) {
  const { locale, dictionary, direction, isRtl } = useWebLocale();
  const [name, setName] = useState(organization?.name ?? "");
  const [description, setDescription] = useState(organization?.description ?? "");
  const [website, setWebsite] = useState(organization?.website ?? "");
  const [contactEmail, setContactEmail] = useState(organization?.contactEmail ?? "");
  const [phone, setPhone] = useState(organization?.phone ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!organization) {
    return (
      <section className="px-1" dir={direction}>
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-2xl">
          {dictionary.settings.organizationSettingsTitle}
        </h2>
        <p className="mt-4 text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
          {dictionary.settings.organizationNoOrganization}
        </p>
      </section>
    );
  }

  const summaryItems = [
    { label: dictionary.settings.organizationSlug, value: organization.slug, valueDir: "ltr" as const },
    { label: dictionary.settings.organizationStatus, value: resolveOrganizationStatusLabel(organization.status, dictionary) },
    {
      label: dictionary.settings.organizationType,
      value: organization.type === "red" ? dictionary.settings.organizationTypeDeveloper : dictionary.settings.organizationTypeBroker,
    },
    {
      label: dictionary.settings.organizationVerified,
      value: organization.isVerified ? dictionary.settings.organizationVerifiedYes : dictionary.settings.organizationVerifiedNo,
    },
  ];

  return (
    <section className="space-y-10 pb-12" dir={direction}>
      <div className={cn("space-y-4 px-1", isRtl ? "text-right" : "text-left")}>
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-2xl">
          {dictionary.settings.organizationSettingsTitle}
        </h2>
        <p className="max-w-2xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
          {dictionary.settings.organizationSettingsDescription}
        </p>
      </div>

      {/* Technical Metadata Strip */}
      <div className="grid grid-cols-2 gap-px border-y border-[color:var(--workspace-border)] bg-[var(--workspace-border)] sm:grid-cols-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="bg-[var(--workspace-shell)]/30 px-6 py-4 backdrop-blur-sm transition-colors hover:bg-[var(--workspace-shell)]/50">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-70">
              {item.label}
            </div>
            <div className="mt-1 text-[13px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white" dir={item.valueDir ?? direction}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <form
        className="space-y-12 px-1"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!canManage) {
            setStatus(dictionary.settings.organizationManagerRequired);
            return;
          }

          setIsSaving(true);
          const result = await onSave({
            name,
            description: description.trim().length > 0 ? description : undefined,
            website: website.trim().length > 0 ? website : undefined,
            contactEmail: contactEmail.trim().length > 0 ? contactEmail : undefined,
            phone: phone.trim().length > 0 ? phone : undefined,
          });
          setStatus(result.message);
          setIsSaving(false);
        }}
      >
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {/* Organization Name */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-80">
              {dictionary.settings.organizationNameLabel}
            </label>
            <input
              type="text"
              name="organizationName"
              autoComplete="organization"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!canManage || isSaving}
              placeholder={dictionary.settings.organizationNamePlaceholder}
              className="w-full border-b border-[color:var(--workspace-border)] bg-transparent py-2.5 text-[14px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] transition-all placeholder:opacity-30 focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white disabled:opacity-40"
            />
          </div>

          {/* Description */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-80">
              {dictionary.settings.organizationDescriptionLabel}
            </label>
            <textarea
              name="organizationDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={!canManage || isSaving}
              rows={3}
              placeholder={dictionary.settings.organizationDescriptionPlaceholder}
              className="w-full border-b border-[color:var(--workspace-border)] bg-transparent py-2.5 text-[14px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] transition-all placeholder:opacity-30 focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white disabled:opacity-40 resize-none"
            />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--zane-ai-text-muted)] opacity-50">
              {dictionary.settings.organizationDescriptionHint}
            </p>
          </div>

          {/* Website */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-80">
              {dictionary.settings.organizationWebsiteLabel}
            </label>
            <input
              type="url"
              name="organizationWebsite"
              autoComplete="url"
              spellCheck={false}
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              disabled={!canManage || isSaving}
              placeholder={dictionary.settings.organizationWebsitePlaceholder}
              dir="ltr"
              className="w-full border-b border-[color:var(--workspace-border)] bg-transparent py-2.5 text-[14px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] transition-all placeholder:opacity-30 focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white disabled:opacity-40"
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-80">
              {dictionary.settings.organizationEmailLabel}
            </label>
            <input
              type="email"
              name="organizationEmail"
              autoComplete="email"
              spellCheck={false}
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              disabled={!canManage || isSaving}
              placeholder={dictionary.settings.organizationEmailPlaceholder}
              dir="ltr"
              className="w-full border-b border-[color:var(--workspace-border)] bg-transparent py-2.5 text-[14px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] transition-all placeholder:opacity-30 focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white disabled:opacity-40"
            />
          </div>

          {/* Phone */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-80">
              {dictionary.settings.organizationPhoneLabel}
            </label>
            <input
              type="tel"
              name="organizationPhone"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={!canManage || isSaving}
              placeholder={dictionary.settings.organizationPhonePlaceholder}
              dir="ltr"
              className="w-full border-b border-[color:var(--workspace-border)] bg-transparent py-2.5 text-[14px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] transition-all placeholder:opacity-30 focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white disabled:opacity-40"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-10 pt-10 border-t border-[color:var(--workspace-border)]">
          <div aria-live="polite" className="min-h-[20px] text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-accent)]">
            {status}
          </div>
          <button
            type="submit"
            disabled={!canManage || isSaving}
            className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-[var(--zane-ai-deep)] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
          >
            <span className="relative z-10">
              {isSaving ? dictionary.settings.organizationSaving : dictionary.settings.organizationSave}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}
