"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Copy, KeyRound, Plus, X } from "lucide-react";
import type { FormEvent } from "react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";
import type { OrganizationApiKeyPermission } from "@/lib/auth/organizationPermissions";
import { getActionCatalog, getPermissionCatalog, permissionKey } from "./catalog";

/**
 * WHY:   API key creation combines permission design, submission, and one-time secret reveal in one contained flow.
 * WHAT:  Renders the create-key modal, including permission presets and the post-create secret reveal screen.
 * HOW:   Receives all mutable state and callbacks from the parent hook so the dialog stays presentational.
 */
export function CreateApiKeyDialog({
  canCreate,
  copied,
  isModalOpen,
  isSubmitting,
  name,
  onApplyPreset,
  onClose,
  onCopy,
  onCreateKey,
  onNameChange,
  onOpenChange,
  onTogglePermission,
  revealedResult,
  selectedPermissionKeys,
  status,
}: {
  canCreate: boolean;
  copied: boolean;
  isModalOpen: boolean;
  isSubmitting: boolean;
  name: string;
  onApplyPreset: (preset: "read" | "write" | "full") => void;
  onClose: () => void;
  onCopy: () => void;
  onCreateKey: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onTogglePermission: (permission: OrganizationApiKeyPermission) => void;
  revealedResult: { apiKey: string } | null;
  selectedPermissionKeys: string[];
  status: string | null;
}) {
  const { dictionary, locale, direction } = useWebLocale();
  const actionCatalog = getActionCatalog(locale);
  const permissionCatalog = getPermissionCatalog(locale);

  if (!canCreate) {
    return (
      <div className="rounded-full border border-amber-500/30 bg-amber-500/5 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
        {dictionary.settings.apiKeysCreateOwnerOnly}
      </div>
    );
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger className="group relative inline-flex h-11 items-center gap-4 overflow-hidden rounded-full bg-[var(--zane-ai-deep)] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md shadow-black/10 active:scale-[0.98]">
        <Plus className="relative z-10 h-4 w-4" strokeWidth={4} />
        <span className="relative z-10">{dictionary.settings.apiKeysCreateButton}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-all duration-500 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="pointer-events-none fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 outline-none transition-all duration-500 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <div className="pointer-events-auto flex max-h-[90vh] flex-col overflow-hidden rounded-[28px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-black/5 dark:ring-white/10 overscroll-contain">
            <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--workspace-border)] p-8" dir={direction}>
              <Dialog.Title className={cn("text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white")}>
                {revealedResult ? dictionary.settings.apiKeysCreatedTitle : dictionary.settings.apiKeysCreateDialogTitle}
              </Dialog.Title>
              <Dialog.Close
                aria-label={dictionary.settings.apiKeysClose}
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--zane-ai-text-muted)] transition-all hover:bg-[var(--zane-ai-accent)] hover:text-white dark:text-white/40 dark:hover:text-white"
              >
                <X className="h-5 w-5" strokeWidth={3} />
              </Dialog.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-8" dir={direction}>
              {revealedResult ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <KeyRound className="h-8 w-8" />
                    <div className="absolute inset-0 animate-ping rounded-full border-4 border-emerald-500/20" />
                  </div>
                  <h3 className="mb-4 text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">{dictionary.settings.apiKeysSecretTitle}</h3>
                  <p className="mb-10 max-w-xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/60">
                    {dictionary.settings.apiKeysSecretDescription}
                  </p>

                  <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/10 p-1.5 shadow-inner">
                    <div className="flex items-center gap-6 p-5">
                      <code className="block flex-1 overflow-x-auto text-left text-[13px] font-black tracking-tight text-[var(--zane-ai-deep)] dark:text-white" dir="ltr">
                        {revealedResult.apiKey}
                      </code>
                      <button
                        type="button"
                        onClick={onCopy}
                        className="group relative flex h-11 shrink-0 items-center gap-3 overflow-hidden rounded-full bg-[var(--zane-ai-deep)] px-8 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                      >
                        <Copy className="h-4 w-4" strokeWidth={3} />
                        {copied ? dictionary.settings.apiKeysCopied : dictionary.settings.apiKeysCopy}
                      </button>
                    </div>
                  </div>

                  <div className="mt-12">
                    <Dialog.Close
                      onClick={onClose}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--zane-ai-accent)] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[var(--zane-ai-accent)]/20 transition hover:bg-[var(--zane-ai-accent)]/90 active:scale-95"
                    >
                      {dictionary.settings.apiKeysCopiedConfirm}
                    </Dialog.Close>
                  </div>
                </div>
              ) : (
                <form onSubmit={(event) => void onCreateKey(event)} className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-80">
                      {dictionary.settings.apiKeysNameLabel}
                    </label>
                    <input
                      type="text"
                      name="apiKeyName"
                      autoComplete="off"
                      value={name}
                      onChange={(event) => onNameChange(event.target.value)}
                      disabled={isSubmitting}
                      placeholder={dictionary.settings.apiKeysNamePlaceholder}
                      className="w-full border-b border-[color:var(--workspace-border)] bg-transparent py-3 text-lg font-black uppercase tracking-tight text-[var(--zane-ai-deep)] transition-all placeholder:opacity-30 focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white disabled:opacity-40"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-10">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-80">{dictionary.settings.apiKeysPermissionsLabel}</label>
                        <p className="max-w-md text-[12px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">{dictionary.settings.apiKeysPermissionsHint}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/10 p-1">
                        <button type="button" onClick={() => onApplyPreset("read")} className="rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-text-muted)] transition hover:bg-[var(--workspace-panel)] hover:text-[var(--zane-ai-deep)] dark:hover:text-white">{dictionary.settings.apiKeysReadOnly}</button>
                        <button type="button" onClick={() => onApplyPreset("write")} className="rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-text-muted)] transition hover:bg-[var(--workspace-panel)] hover:text-[var(--zane-ai-deep)] dark:hover:text-white">{dictionary.settings.apiKeysReadWrite}</button>
                        <button type="button" onClick={() => onApplyPreset("full")} className="rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-text-muted)] transition hover:bg-[var(--workspace-panel)] hover:text-[var(--zane-ai-deep)] dark:hover:text-white">{dictionary.settings.apiKeysFullAccess}</button>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/5 shadow-inner">
                      <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr] items-center border-b border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 text-center text-[9px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-50 sm:grid-cols-[160px_1fr_1fr_1fr_1fr]">
                        <div className="px-6 py-3.5 text-left">{dictionary.settings.apiKeysResourceColumn}</div>
                        {actionCatalog.map((action) => (
                          <div key={action.action} className="px-4 py-3.5">{action.label}</div>
                        ))}
                      </div>
                      <div className="divide-y divide-[color:var(--workspace-border)]">
                        {permissionCatalog.map((resource) => {
                          const ResourceIcon = resource.icon;
                          return (
                            <div key={resource.resource} className="grid grid-cols-[140px_1fr_1fr_1fr_1fr] items-center transition-colors hover:bg-[var(--workspace-shell)]/10 sm:grid-cols-[160px_1fr_1fr_1fr_1fr]">
                              <div className="flex items-center gap-4 px-6 py-5 text-[12px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
                                <ResourceIcon className="h-4 w-4 text-[var(--zane-ai-accent)]" strokeWidth={3} />
                                <span>{resource.label}</span>
                              </div>
                              {actionCatalog.map((action) => {
                                const supported = resource.allowedActions.includes(action.action);
                                const permission = { resource: resource.resource, action: action.action } as OrganizationApiKeyPermission;
                                const checked = selectedPermissionKeys.includes(permissionKey(permission));
                                return (
                                  <label
                                    key={action.action}
                                    className={cn(
                                      "flex items-center justify-center p-3",
                                      supported ? "cursor-pointer" : "cursor-not-allowed opacity-35",
                                    )}
                                  >
                                    <span className="sr-only">{action.label} {resource.label}</span>
                                    <div
                                      className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                                        checked
                                          ? "scale-110 bg-[var(--zane-ai-deep)] text-white dark:bg-white dark:text-black shadow-md shadow-black/10"
                                          : "scale-100 bg-[var(--workspace-shell)]/10 text-[var(--zane-ai-text-muted)]",
                                      )}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={!supported}
                                        onChange={() => supported && onTogglePermission(permission)}
                                        className="sr-only"
                                      />
                                      {!supported ? (
                                        <span className="text-[10px] font-black">-</span>
                                      ) : checked ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="h-3 w-3">
                                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      ) : (
                                        <div className="h-1.5 w-1.5 rounded-full bg-current opacity-30" />
                                      )}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse justify-between gap-8 pt-4 sm:flex-row sm:items-center">
                    <div aria-live="polite" className="text-[11px] font-black uppercase tracking-[0.15em] text-red-600 dark:text-red-400">
                      {status}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative inline-flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--zane-ai-deep)] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md shadow-black/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? dictionary.settings.apiKeysCreatingStatus : dictionary.settings.apiKeysCreateButton}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
