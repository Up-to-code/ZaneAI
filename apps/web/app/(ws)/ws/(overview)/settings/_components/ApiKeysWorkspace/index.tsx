"use client";

import { KeyRound, Plus } from "lucide-react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { ApiKeysList } from "./ApiKeysList";
import { CreateApiKeyDialog } from "./CreateApiKeyDialog";
import { useApiKeysWorkspace } from "./useApiKeysWorkspace";
import type { ApiKeysWorkspaceProps } from "./types";
import { cn } from "@/lib/i18n";

/**
 * WHY:   Organization settings need one focused workspace for self-service API key management.
 * WHAT:  Lists org API keys, lets owners create keys, and lets owners/managers revoke keys.
 * HOW:   Keeps permission selection and one-time secret reveal in local state while delegating persistence to server actions.
 */
export default function ApiKeysWorkspace({
  initialKeys,
  canCreate,
  canRevoke,
  canView,
  hasOrganization,
  onCreateKey,
  onRevokeKey,
}: ApiKeysWorkspaceProps) {
  const { dictionary, direction } = useWebLocale();
  const workspace = useApiKeysWorkspace({ canCreate, canRevoke, initialKeys, onCreateKey, onRevokeKey });

  if (!hasOrganization) {
    return (
      <section className="px-1" dir={direction}>
        <div className="border-l-4 border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 px-6 py-4 text-[13px] font-bold text-[var(--zane-ai-text-muted)]">
          {dictionary.settings.apiKeysNoOrgTitle}
        </div>
      </section>
    );
  }

  if (!canView) {
    return (
      <section className="px-1" dir={direction}>
        <div className="border-l-2 border-amber-500 bg-amber-500/5 px-6 py-3 text-[13px] font-bold text-amber-700 dark:text-amber-300">
          {dictionary.settings.apiKeysRestrictedTitle}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8 pb-12" dir={direction}>
      <header className="flex flex-wrap items-start justify-between gap-10 px-1">
        <div className="space-y-3">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-3xl">
            {dictionary.settings.apiKeysPageTitle}
          </h2>
          <p className="max-w-2xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
            {dictionary.settings.apiKeysPageDescription}
          </p>
        </div>

        <CreateApiKeyDialog
          canCreate={canCreate}
          copied={workspace.copied}
          isModalOpen={workspace.isModalOpen}
          isSubmitting={workspace.isSubmitting}
          name={workspace.name}
          onApplyPreset={workspace.applyPreset}
          onClose={workspace.handleModalClose}
          onCopy={workspace.handleCopy}
          onCreateKey={workspace.handleCreateKey}
          onNameChange={workspace.setName}
          onOpenChange={workspace.handleOpenChange}
          onTogglePermission={workspace.togglePermission}
          revealedResult={workspace.revealedResult}
          selectedPermissionKeys={workspace.selectedPermissionKeys}
          status={workspace.status}
        />
      </header>

      {workspace.status ? (
        <div className="px-1">
          <div className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-accent)]">
            {workspace.status}
          </div>
        </div>
      ) : null}

      <section className="flex flex-col border-t border-[color:var(--workspace-border)]">
        {workspace.keys.length > 0 ? (
          <ApiKeysList
            keys={workspace.keys}
            canRevoke={canRevoke}
            isRevoking={workspace.isRevoking}
            onRevoke={workspace.handleRevoke}
          />
        ) : (
          <div className="px-1 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 text-[var(--zane-ai-accent)]">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="mt-8 text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
              {dictionary.settings.apiKeysEmptyTitle}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
              {dictionary.settings.apiKeysEmptyDescription}
            </p>
            {canCreate ? (
              <button
                type="button"
                onClick={() => workspace.setIsModalOpen(true)}
                className="mt-10 inline-flex h-11 items-center gap-4 rounded-full bg-[var(--zane-ai-deep)] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-sm"
              >
                <Plus className="h-4 w-4" strokeWidth={4} />
                {dictionary.settings.apiKeysCreateFirst}
              </button>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
