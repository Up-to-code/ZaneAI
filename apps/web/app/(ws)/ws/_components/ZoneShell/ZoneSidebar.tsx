"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SidebarUser } from "../Sidebar/types";
import type { WorkspaceOrganizationDisplay } from "../../_lib/organizationDisplay";
import type { ZoneShellData } from "../../_lib/zones";

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

  return (
    <aside
      data-slot="zone-sidebar"
      className="flex h-full flex-col border-e border-[color:var(--workspace-border)] bg-[var(--zayon-deep)] text-white"
    >
      {/* Brand Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-white/[0.06] px-5">
        <span className="text-lg font-black tracking-tight text-[var(--zayon-accent)]">
          Zane-ai <span className="text-white/90">Zane-ai</span>
        </span>
      </div>

      <div className="border-b border-white/[0.06] px-5 py-6">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{organization.name}</div>
        <h1 className="text-xl font-black tracking-tight text-white mb-1.5">{zone.label}</h1>
        <p className="text-[13px] font-medium leading-relaxed text-slate-400">{zone.description}</p>
      </div>

      <div className="border-b border-white/[0.06] px-3 py-3">
        <Link
          href="/ws"
          className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-2.5 text-[10px] font-bold tracking-wide text-[var(--zayon-text-secondary)] transition-all duration-150 hover:bg-[var(--zayon-accent-soft)] hover:text-[var(--zayon-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zayon-accent)] active:scale-[0.98]"
        >
          <span className="flex items-center gap-2.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            العودة للرئيسية
          </span>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      <nav aria-label="Zone navigation" className="flex-1 space-y-0.5 px-3 py-4">
        {zone.localNav.map((item) => {
          if (!item.href || item.disabled) {
            return (
              <span
                key={`${zone.key}-${item.label}`}
                className="flex items-center justify-between rounded-[8px] border border-transparent px-4 py-2.5 text-[10px] font-bold tracking-wide text-slate-600"
                aria-disabled="true"
              >
                <span>{item.label}</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </span>
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-2.5 text-[10px] font-bold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zayon-accent)]",
                isActive
                  ? "border-[color:color-mix(in_srgb,var(--zayon-accent)_26%,transparent)] bg-[var(--zayon-accent-soft)] text-[var(--zayon-accent)]"
                  : "border-transparent text-slate-400 hover:bg-white/[0.06] hover:text-slate-200",
              )}
            >
              <span>{item.label}</span>
              <ChevronLeft className="h-3 w-3" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
