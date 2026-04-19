"use client";

import { useState } from "react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";
import type { OrganizationSummary } from "@/server/contracts/organizations";

function resolveOrganizationStatusLabel(
  status: OrganizationSummary["status"],
  locale: "ar" | "en" | "fr",
) {
  if (status === "active") {
    return locale === "fr" ? "Actif" : locale === "en" ? "Active" : "نشط";
  }
  if (status === "pending") {
    return locale === "fr" ? "En attente" : locale === "en" ? "Pending" : "قيد الانتظار";
  }
  return locale === "fr" ? "Indisponible" : locale === "en" ? "Unavailable" : "غير متوفر";
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
      <section className="rounded-3xl bg-[var(--workspace-panel)] p-8 border border-[color:var(--workspace-border)]" dir={direction}>
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
          {dictionary.settings.organizationSettingsTitle}
        </h2>
        <p className="mt-3 text-[13px] font-medium text-[var(--zane-ai-text-muted)]">
          {dictionary.settings.organizationNoOrganization}
        </p>
      </section>
    );
  }

  const summaryItems = [
    { label: dictionary.settings.organizationSlug, value: organization.slug, valueDir: "ltr" as const },
    { label: dictionary.settings.organizationStatus, value: resolveOrganizationStatusLabel(organization.status, locale) },
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
    <section className="space-y-8 pb-12" dir={direction}>
      <div className="rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-8 shadow-sm shadow-black/5">
        <div className={cn("space-y-4", isRtl ? "text-right" : "text-left")}>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-4xl">
            {dictionary.settings.organizationSettingsTitle}
          </h2>
          <p className="max-w-2xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
            {dictionary.settings.organizationSettingsDescription}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/40 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-50">
                {item.label}
              </div>
              <div className="mt-2 text-[14px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white" dir={item.valueDir ?? direction}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <form
          className="mt-10 space-y-8"
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
          <div className="grid gap-6 md:grid-cols-2">
            {/* Organization Name */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-60">
                {dictionary.settings.organizationNameLabel}
              </label>
              <input
                type="text"
                name="organizationName"
                autoComplete="organization"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={!canManage || isSaving}
                placeholder="Institutional Brand Name"
                className="w-full rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-4 text-[14px] font-bold text-[var(--zane-ai-deep)] transition-all focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/10 dark:text-white disabled:opacity-40"
              />
            </div>

            {/* Description */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-60">
                {dictionary.settings.organizationDescriptionLabel}
              </label>
              <textarea
                name="organizationDescription"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={!canManage || isSaving}
                rows={5}
                placeholder="Technical mission and operational scope..."
                className="w-full rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-4 text-[14px] font-bold text-[var(--zane-ai-deep)] transition-all focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/10 dark:text-white disabled:opacity-40"
              />
              <p className="text-[11px] font-medium text-[var(--zane-ai-text-muted)] opacity-60">
                {dictionary.settings.organizationDescriptionHint}
              </p>
            </div>

            {/* Website */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-60">
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
                placeholder="https://institutional.brand"
                dir="ltr"
                className="w-full rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-4 text-[14px] font-bold text-[var(--zane-ai-deep)] transition-all focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/10 dark:text-white disabled:opacity-40"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-60">
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
                placeholder="infrastructure@brand.domain"
                dir="ltr"
                className="w-full rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-4 text-[14px] font-bold text-[var(--zane-ai-deep)] transition-all focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/10 dark:text-white disabled:opacity-40"
              />
            </div>

            {/* Phone */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-60">
                {dictionary.settings.organizationPhoneLabel}
              </label>
              <input
                type="tel"
                name="organizationPhone"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={!canManage || isSaving}
                placeholder="+966 00 000 0000"
                dir="ltr"
                className="w-full rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-4 text-[14px] font-bold text-[var(--zane-ai-deep)] transition-all focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/10 dark:text-white disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-2 border-t border-[color:var(--workspace-border)] pt-8">
            <div aria-live="polite" className="min-h-[20px] text-[13px] font-black uppercase tracking-tight text-[var(--zane-ai-text-muted)]">
              {status}
            </div>
            <button
              type="submit"
              disabled={!canManage || isSaving}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--zane-ai-deep)] px-8 text-[12px] font-black uppercase tracking-[0.15em] text-white transition hover:opacity-95 dark:bg-white dark:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zane-ai-accent)]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? dictionary.settings.organizationSaving : dictionary.settings.organizationSave}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

