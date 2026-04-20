"use client";

import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { formatWebCopy } from "@/lib/i18n";
import { permissionKey, permissionLabel, formatApiKeyDate } from "./catalog";
import type { OrganizationApiKeyPermission } from "@/lib/auth/organizationPermissions";
import type { OrganizationApiKeySummary } from "@/server/contracts/organizationApiKeys";
import { cn } from "@/lib/i18n";

function ApiKeyPermissions({ permissions }: { permissions: OrganizationApiKeyPermission[] }) {
  const { locale } = useWebLocale();
  return (
    <div className="flex flex-wrap gap-1.5">
      {permissions.map((permission) => (
        <span
          key={permissionKey(permission)}
          className="rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-text-muted)] dark:text-white/40"
        >
          {permissionLabel(permission, locale)}
        </span>
      ))}
    </div>
  );
}

/**
 * WHY:   API key overview should stay visually focused while revoke actions remain available inline.
 * WHAT:  Renders the current organization API keys with permissions, ownership details, and revoke buttons.
 * HOW:   Uses the shared permission catalog helpers for labels and leaves revocation side effects to the parent hook.
 */
export function ApiKeysList({
  keys,
  canRevoke,
  isRevoking,
  onRevoke,
}: {
  keys: OrganizationApiKeySummary[];
  canRevoke: boolean;
  isRevoking: string | null;
  onRevoke: (keyId: string) => Promise<void>;
}) {
  const { dictionary, locale, direction } = useWebLocale();
  return (
    <div className="flex flex-col" dir={direction}>
      <div className="hidden grid-cols-[1.5fr_2fr_1.5fr_1fr_120px] items-center gap-10 border-b border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/10 px-1 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-50 lg:grid">
        <div>{dictionary.settings.apiKeysPageTitle}</div>
        <div>{dictionary.settings.apiKeysPermissionsLabel}</div>
        <div>{dictionary.settings.apiKeysDetailsColumn}</div>
        <div>{dictionary.settings.apiKeysLastUsedColumn}</div>
        <div className="text-right">{dictionary.settings.apiKeysActionColumn}</div>
      </div>
      <div className="divide-y divide-[color:var(--workspace-border)]">
        {keys.map((key) => (
          <article
            key={key.keyId}
            className="flex flex-col gap-5 py-6 px-1 transition-colors hover:bg-[var(--workspace-shell)]/5 lg:grid lg:grid-cols-[1.5fr_2fr_1.5fr_1fr_120px] lg:items-center lg:gap-10"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-[15px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
                  {key.name || dictionary.settings.apiKeysUnnamed}
                </h3>
                {key.status === "active" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-accent)] tabular-nums">
                {key.prefix}••••••••
              </div>
            </div>

            <ApiKeyPermissions permissions={key.permissions} />

            <div className="space-y-1.5">
              <div className="text-[11px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
                {key.createdByName ?? key.createdBy}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--zane-ai-text-muted)] opacity-50">
                {formatWebCopy(dictionary.settings.apiKeysCreatedAt, {
                  date: formatApiKeyDate(key.createdAt, locale, dictionary.settings.apiKeysNeverUsed),
                })}
              </div>
            </div>

            <div className="text-[11px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white tabular-nums">
              {formatApiKeyDate(key.lastUsedAt, locale, dictionary.settings.apiKeysNeverUsed)}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => onRevoke(key.keyId)}
                disabled={!canRevoke || key.status !== "active" || isRevoking === key.keyId}
                className="inline-flex h-8 items-center justify-center rounded-full border border-red-500/30 px-5 text-[9px] font-black uppercase tracking-[0.15em] text-red-600 transition hover:bg-red-500/10 dark:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRevoking === key.keyId
                  ? dictionary.settings.apiKeysRevoking
                  : key.status === "active"
                    ? dictionary.settings.apiKeysRevoke
                    : dictionary.settings.apiKeysRevokedState}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
