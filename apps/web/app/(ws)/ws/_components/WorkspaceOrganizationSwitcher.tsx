"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/i18n";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";

/**
 * WHY:   Demo workspace chrome still needs organization context inside the identity menu.
 * WHAT:  Shows the active demo organization plus a non-persistent create-demo shortcut.
 * HOW:   Avoids Clerk and sync routes entirely while preserving the existing menu footprint.
 */
export default function WorkspaceOrganizationSwitcher({
  organizationName,
  memberLabel,
}: {
  organizationName: string;
  memberLabel: string;
}) {
  const { dictionary, direction, isRtl } = useWebLocale();

  return (
    <div
      data-slot="workspace-organization-switcher"
      className="space-y-2 rounded-[16px] border border-[color:color-mix(in_srgb,var(--workspace-border)_82%,transparent)] bg-[var(--workspace-panel)] p-2"
      dir={direction}
    >
      <div className={cn("flex items-center justify-between gap-2 px-1", isRtl ? "flex-row-reverse" : "flex-row")}>
        <div className={cn("text-[11px] font-black uppercase tracking-[0.16em] text-[var(--workspace-muted)]", isRtl ? "text-right" : "text-left")}>
          {dictionary.settings.organization}
        </div>
        <Link
          href="/ws?onboarding=required"
          className="inline-flex items-center gap-1 rounded-full border border-[color:color-mix(in_srgb,var(--workspace-border)_82%,transparent)] px-2.5 py-1 text-[10px] font-bold text-[var(--workspace-bubble-other-foreground)] transition hover:bg-[var(--workspace-elevated)]"
        >
          <Plus className="h-3 w-3" />
          <span>Create</span>
        </Link>
      </div>

      <div className="space-y-1">
        <div
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start",
            "bg-[var(--workspace-highlight)] text-white",
          )}
        >
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold">{organizationName}</div>
            <div className="mt-0.5 truncate text-[11px] font-medium text-white/80">
              {memberLabel || dictionary.settings.member}
            </div>
          </div>
          <div className="shrink-0">
            <Check className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
