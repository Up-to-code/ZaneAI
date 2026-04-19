"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, PanelLeftClose, PenSquare } from "lucide-react";
import Sidebar from "./Sidebar";
import type { SidebarUser } from "./Sidebar/types";
import type { WorkspaceOrganizationDisplay } from "../_lib/organizationDisplay";
import { WORKSPACE_SIDEBAR_WIDTH_CLASS } from "../_lib/shell";
import WorkspaceSidebarDrawer from "./WorkspaceSidebarDrawer";
import WorkspaceTopNavbar from "./WorkspaceTopNavbar";
import WorkspaceMessageToasts from "./WorkspaceMessageToasts";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";
import type { ZaneAiProThreadSummary } from "@/server/contracts/zaneAiPro";
import { cn } from "@/lib/i18n";
import { getWorkspaceZonesForKeys } from "../_lib/zones";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import type { ComplianceBanner } from "../_lib/complianceBanner";
import {
  getWorkspaceChromeState,
  matchesWorkspacePath,
  type WorkspaceShellVariant,
} from "../_lib/workspaceChrome";

/**
 * WHY:   The workspace route group needs one responsive shell that behaves consistently across desktop and Safari-class mobile browsers.
 * WHAT:  Renders the desktop sidebar rail, mobile drawer trigger, top navbar, and main content column for `/ws`.
 * HOW:   Uses `svh`-based sizing on the desktop shell, supports an assistant-first overview variant, and keeps mobile navigation reachable.
 */
export default function WorkspaceShell({
  user,
  visibleZoneKeys,
  organization,
  recentAssistantThreads = [],
  allAssistantThreads = [],
  signalCounts = { notificationCount: 0, inboxCount: 0 },
  complianceBanner = null,
  variant,
  headerTitle,
  children,
}: {
  user: SidebarUser;
  visibleZoneKeys?: WorkspaceZoneKey[];
  organization: WorkspaceOrganizationDisplay;
  recentAssistantThreads?: ZaneAiProThreadSummary[];
  allAssistantThreads?: ZaneAiProThreadSummary[];
  signalCounts?: { notificationCount: number; inboxCount: number };
  complianceBanner?: ComplianceBanner | null;
  variant?: WorkspaceShellVariant;
  headerTitle?: string;
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { dictionary, direction, isRtl, locale } = useWebLocale();
  const chrome = getWorkspaceChromeState({
    pathname,
    visibleZoneKeys,
    locale,
    organizationSubtitle: organization.sidebarSubtitle,
    explicitTitle: headerTitle,
    variantOverride: variant,
  });
  const isAssistantVariant = chrome.variant === "assistant";
  const visibleZones = getWorkspaceZonesForKeys(visibleZoneKeys ?? ["overview"], locale);
  const sidebarTogglePositionClassName = isAssistantVariant ? "top-[10px]" : "top-6";
  const collapsedRailPaddingTopClassName = isAssistantVariant ? "pt-14" : "pt-16";
  const sidebarToggleButton = (
    <button
      type="button"
      onClick={() => setSidebarCollapsed((value) => !value)}
      data-slot="workspace-sidebar-trigger"
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-2 text-[var(--workspace-muted)] transition hover:bg-[var(--workspace-elevated)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--workspace-highlight)_30%,transparent)]"
      aria-label={sidebarCollapsed ? dictionary.nav.showSidebar : dictionary.nav.hideSidebar}
      title={sidebarCollapsed ? dictionary.nav.showSidebar : dictionary.nav.hideSidebar}
    >
      {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-4 w-4" />}
    </button>
  );

  return (
    <div
      data-slot="workspace-shell"
      data-variant={chrome.variant}
      dir={direction}
      className={cn(
        "relative isolate flex h-dvh max-h-dvh min-h-dvh w-full flex-col overflow-hidden bg-[var(--workspace-shell)] lg:flex-row",
        !chrome.isAssistantHome && "lg:overflow-hidden",
      )}
    >
      <div
        data-slot="workspace-sidebar-rail"
        className={cn(
          "sticky inset-y-0 top-0 z-20 hidden h-dvh max-h-dvh min-h-0 shrink-0 overflow-hidden lg:flex motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out",
          sidebarCollapsed ? "w-24" : WORKSPACE_SIDEBAR_WIDTH_CLASS,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
            sidebarCollapsed
              ? cn("pointer-events-none opacity-0", isRtl ? "-translate-x-2" : "translate-x-2")
              : "translate-x-0 opacity-100",
          )}
        >
          <Sidebar
            user={user}
            organization={organization}
            visibleZoneKeys={visibleZoneKeys}
            recentAssistantThreads={recentAssistantThreads}
            allAssistantThreads={allAssistantThreads}
            variant={chrome.variant}
            headerAction={!sidebarCollapsed ? sidebarToggleButton : undefined}
            className="h-full w-full overflow-hidden border-e border-[color:var(--workspace-border)] bg-[var(--workspace-chrome-sidebar-bg)]"
          />
        </div>
        {sidebarCollapsed ? (
          <div
            className={cn(
              "absolute z-10",
              sidebarTogglePositionClassName,
              "left-1/2 -translate-x-1/2",
            )}
          >
            {sidebarToggleButton}
          </div>
        ) : null}
        <div
          className={cn(
            "hidden h-full w-full flex-col items-center border-e border-[color:var(--workspace-border)] bg-[var(--workspace-chrome-sidebar-bg)] px-2 pb-4 lg:flex motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
            collapsedRailPaddingTopClassName,
            sidebarCollapsed
              ? "translate-x-0 opacity-100"
              : cn("pointer-events-none opacity-0", isRtl ? "translate-x-3" : "-translate-x-3"),
          )}
          aria-hidden={!sidebarCollapsed}
        >
          <div className="flex w-full flex-col items-center gap-2">
            <Link
              href="/ws"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--workspace-border)] bg-transparent text-foreground transition hover:bg-[var(--workspace-elevated)] active:scale-95"
              aria-label={dictionary.nav.newChat}
              title={dictionary.nav.newChat}
            >
              <PenSquare className="h-4 w-4" />
            </Link>
          </div>
          <nav aria-label={dictionary.nav.workspaceNavigation} className="mt-8 flex w-full flex-1 flex-col items-center gap-4">
            {visibleZones.map((item) => {
              const Icon = item.icon;
              const isActive = matchesWorkspacePath(pathname, item.href);
              const isComingSoon = item.comingSoon;

              if (isComingSoon) {
                return (
                  <div
                    key={item.href}
                    className="relative inline-flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border border-[color:var(--workspace-border)] bg-transparent text-foreground opacity-30"
                    title={`${item.label} (Coming Soon)`}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[var(--zane-ai-accent)]" />
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all active:scale-95",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-[color:var(--workspace-border)] bg-transparent text-foreground hover:bg-[var(--workspace-elevated)]",
                  )}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="relative flex h-dvh max-h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--workspace-canvas)]">
        <WorkspaceTopNavbar
          user={user}
          organization={organization}
          visibleZoneKeys={visibleZoneKeys}
          initialSignalCounts={signalCounts}
          complianceBanner={complianceBanner}
          variant={chrome.variant}
          title={chrome.headerTitle}
          mobileNavigation={
            <WorkspaceSidebarDrawer
              user={user}
              organization={organization}
              visibleZoneKeys={visibleZoneKeys}
              recentAssistantThreads={recentAssistantThreads}
              allAssistantThreads={allAssistantThreads}
            />
          }
        />

        <main
          data-slot="workspace-route-scrollport"
          className={cn(
            "min-h-0 min-w-0 flex-1",
            chrome.isAssistantHome ? "overflow-hidden" : "overflow-auto",
          )}
        >
          <div
            data-slot="workspace-content"
            className={cn(
              "min-h-full min-w-0 w-full",
              isAssistantVariant ? "flex flex-col pt-0" : undefined,
            )}
          >
            {children}
          </div>
        </main>

        <WorkspaceMessageToasts />
      </div>
    </div>
  );
}
