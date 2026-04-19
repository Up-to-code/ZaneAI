"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/i18n";
import type { SidebarUser } from "../Sidebar/types";
import type { WorkspaceOrganizationDisplay } from "../../_lib/organizationDisplay";
import type { ZoneShellData } from "../../_lib/zones";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";

/**
 * WHY:   Business zones need their own persistent navigation so each zone feels like a dedicated workspace.
 * WHAT:  Renders the full-height zone sidebar with branding, back action, local links, and user identity.
 * HOW:   Uses the current pathname to highlight the active local link while keeping the sidebar focused on the current zone only.
 */
export default function ZoneSidebar({
  zone,
  organization,
}: {
  zone: ZoneShellData;
  user: SidebarUser;
  organization: WorkspaceOrganizationDisplay;
}) {
  const pathname = usePathname();
  const { dictionary, isRtl } = useWebLocale();

  return (
    <aside
      data-slot="zone-sidebar"
      className="flex h-full flex-col border-e border-[color:var(--workspace-border)] bg-[var(--workspace-chrome-sidebar-bg)]"
    >
      {/* Brand Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-[color:var(--workspace-border)] px-5">
        <span className="text-lg font-black tracking-tight text-[var(--zane-ai-accent)]">
          Zane-ai
        </span>
      </div>

      <div className="border-b border-[color:var(--workspace-border)] px-5 py-6">
        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40 mb-1.5">{organization.name}</div>
        <h1 className="text-xl font-black tracking-tight text-[var(--zane-ai-deep)] dark:text-white mb-1.5">{zone.label}</h1>
        <p className="text-[12px] font-medium leading-relaxed tracking-wider text-[var(--zane-ai-text-muted)] dark:text-white/50">{zone.description}</p>
      </div>

      <div className="border-b border-[color:var(--workspace-border)] px-3 py-3">
        <Link
          href="/ws"
          className={cn(
            "flex items-center justify-between rounded-2xl bg-[var(--workspace-elevated)] px-4 py-2.5 text-[10px] font-bold tracking-wide text-[var(--zane-ai-text-muted)] dark:text-white/50 transition-all duration-150 hover:bg-[var(--workspace-accent-soft)] hover:text-[var(--zane-ai-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zane-ai-accent)] active:scale-[0.98]",
            isRtl ? "flex-row-reverse" : "flex-row",
          )}
        >
          <span className={cn("flex items-center gap-2.5", isRtl ? "flex-row-reverse" : "flex-row")}>
            <ArrowLeft className={cn("h-3.5 w-3.5", isRtl ? "rotate-180" : "")} />
            {dictionary.errors.backHome}
          </span>
          <ChevronLeft className={cn("h-3.5 w-3.5", isRtl ? "" : "rotate-180")} />
        </Link>
      </div>

      <nav aria-label="Zone navigation" className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {zone.localNav.map((item) => {
          if (!item.href || item.disabled) {
            return (
              <span
                key={`${zone.key}-${item.label}`}
                className="flex items-center justify-between rounded-[8px] border border-transparent px-4 py-2.5 text-[10px] font-bold tracking-wide text-[var(--zane-ai-text-muted)] dark:text-white/30"
                aria-disabled="true"
              >
                <span>{item.label}</span>
                <ChevronLeft className={cn("h-3.5 w-3.5", isRtl ? "" : "rotate-180")} />
              </span>
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-2.5 text-[10px] font-bold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zane-ai-accent)]",
                isActive
                  ? "border-[color:color-mix(in_srgb,var(--zane-ai-accent)_26%,transparent)] bg-[var(--zane-ai-accent-soft)] text-[var(--zane-ai-accent)]"
                  : "border-transparent text-[var(--zane-ai-text-muted)] dark:text-white/50 hover:bg-[var(--workspace-elevated)] hover:text-[var(--zane-ai-deep)] dark:hover:text-white",
              )}
            >
              <span>{item.label}</span>
              <ChevronLeft className={cn("h-3 w-3", isRtl ? "" : "rotate-180")} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
