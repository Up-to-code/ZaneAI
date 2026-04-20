"use client";

import { useState, useTransition } from "react";
import { Clock3, PlugZap, ShieldBan } from "lucide-react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn, formatLocaleDateTime } from "@/lib/i18n";
import type { OAuthAuthorizedAppSummary } from "@/server/contracts/oauth";

type OrganizationAppsWorkspaceProps = {
  initialApps: OAuthAuthorizedAppSummary[];
  canManage: boolean;
  hasOrganization: boolean;
  showLegacyNotice: boolean;
  onRevokeApp: (clientId: string) => Promise<{ ok: true; message: string } | { ok: false; message: string }>;
};

export default function OrganizationAppsWorkspace({
  initialApps,
  canManage,
  hasOrganization,
  showLegacyNotice,
  onRevokeApp,
}: OrganizationAppsWorkspaceProps) {
  const { dictionary, locale, direction, isRtl } = useWebLocale();
  const [apps, setApps] = useState(initialApps);
  const [status, setStatus] = useState<string | null>(null);
  const [revokingClientId, setRevokingClientId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!hasOrganization) {
    return (
      <section className="px-1" dir={direction}>
        <div className="border-l-4 border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 px-6 py-4 text-[13px] font-bold text-[var(--zane-ai-text-muted)]">
          {dictionary.settings.organizationNoOrganization}
        </div>
      </section>
    );
  }

  async function handleRevoke(clientId: string) {
    const confirmed = window.confirm(dictionary.settings.connectedAppsRevokeConfirm);
    if (!confirmed) return;

    setRevokingClientId(clientId);
    setStatus(dictionary.settings.connectedAppsRevoking);
    startTransition(async () => {
      const result = await onRevokeApp(clientId);
      setStatus(result.message);
      setRevokingClientId(null);
      if (result.ok) {
        setApps((current) => current.filter((app) => app.clientId !== clientId));
      }
    });
  }

  return (
    <div className="space-y-8 pb-12" dir={direction}>
      <div className="space-y-3 px-1">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-3xl">
          {dictionary.settings.connectedAppsPageTitle}
        </h2>
        <p className="max-w-2xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
          {dictionary.settings.connectedAppsPageDescription}
        </p>
      </div>

      {showLegacyNotice ? (
        <div className="px-1">
          <div className="border-l-2 border-amber-500 bg-amber-500/5 px-6 py-3 text-[13px] font-bold text-amber-700 dark:text-amber-300">
            {dictionary.settings.connectedAppsLegacyNotice}
          </div>
        </div>
      ) : null}

      {!canManage ? (
        <div className="px-1">
          <div className="border-l-2 border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 px-6 py-3 text-[13px] font-bold text-[var(--zane-ai-text-muted)]">
            {dictionary.settings.connectedAppsReadonlyNotice}
          </div>
        </div>
      ) : null}

      {status ? (
        <div className="px-1">
          <div className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-accent)]">
            {status}
          </div>
        </div>
      ) : null}

      {apps.length === 0 ? (
        <section className="px-1 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 text-[var(--zane-ai-accent)]">
            <PlugZap className="h-6 w-6" />
          </div>
          <h3 className="mt-8 text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
            {dictionary.settings.connectedAppsEmptyTitle}
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
            {dictionary.settings.connectedAppsEmptyDescription}
          </p>
        </section>
      ) : (
        <div className="flex flex-col border-t border-[color:var(--workspace-border)]">
          {apps.map((app) => {
            const isRevoking = isPending && revokingClientId === app.clientId;
            return (
              <section
                key={app.clientId}
                className="group relative flex flex-col gap-6 py-6 px-1 border-b border-[color:var(--workspace-border)] transition-colors hover:bg-[var(--workspace-shell)]/5"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 text-base font-black uppercase text-[var(--zane-ai-deep)] dark:text-white shadow-lg shadow-black/5">
                      {(app.appName ?? "?").slice(0, 1)}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-lg font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">{app.appName}</div>
                        <div className="mt-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-accent)]">
                          {app.publisherName}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-[var(--zane-ai-text-muted)] dark:text-white/40 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--zane-ai-accent)]" />
                          {dictionary.settings.connectedAppsConnectedAt}: {formatLocaleDateTime(locale, app.createdAt, { dateStyle: "medium" })}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5 opacity-50" />
                          {dictionary.settings.connectedAppsLastUsed}:{" "}
                          {app.lastUsedAt
                            ? formatLocaleDateTime(locale, app.lastUsedAt, { dateStyle: "medium" })
                            : dictionary.settings.connectedAppsNeverUsed}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canManage ? (
                    <button
                      type="button"
                      disabled={isRevoking}
                      onClick={() => handleRevoke(app.clientId)}
                      className="inline-flex h-9 items-center justify-center gap-3 rounded-full border border-red-500/30 px-5 text-[9px] font-black uppercase tracking-[0.15em] text-red-600 transition hover:bg-red-500/10 dark:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShieldBan className="h-4 w-4" />
                      {isRevoking ? dictionary.settings.connectedAppsRevoking : dictionary.settings.connectedAppsRevoke}
                    </button>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(app.scopeDetails ?? []).map((scope) => (
                    <span
                      key={scope.id}
                      className="rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/10 px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-text-muted)] dark:text-white/40"
                    >
                      {scope.label}
                    </span>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
