"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Bell, Mail } from "lucide-react";
import WebLocaleSwitcher from "@/app/_components/WebLocaleSwitcher";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";
import type { WorkspaceOrganizationDisplay } from "../_lib/organizationDisplay";
import { cn } from "@/lib/utils";
import type { SidebarUser } from "./Sidebar/types";
import ThemeToggle from "@/app/_components/ThemeToggle";
import type { ComplianceBanner } from "../_lib/complianceBanner";
import WorkspaceIdentityMenu from "./WorkspaceIdentityMenu";
import { matchesWorkspacePath, type WorkspaceShellVariant } from "../_lib/workspaceChrome";


const HEADER_ACTION_BASE_CLASS_NAME =
  "inline-flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full border border-[var(--zayon-line)] bg-transparent text-[var(--zayon-deep)] transition-all hover:text-[var(--zayon-accent)] focus-visible:outline-none dark:border-white/10 dark:text-white dark:hover:text-[var(--zayon-accent)] active:scale-[0.98]";

const HEADER_ICON_ACTION_CLASS_NAME = HEADER_ACTION_BASE_CLASS_NAME;

const DEFAULT_HEADER_CLASS_NAME =
  "h-16 lg:h-20 border-[var(--zayon-line)] bg-[var(--zayon-background)] px-4 lg:px-6 dark:border-white/10 dark:bg-black";

export default function WorkspaceTopNavbar({
  user,
  organization,
  visibleZoneKeys,
  initialSignalCounts = { notificationCount: 0, inboxCount: 0 },
  complianceBanner = null,
  variant = "default",
  title,
  mobileNavigation,
}: {
  user: SidebarUser;
  organization: WorkspaceOrganizationDisplay;
  visibleZoneKeys?: WorkspaceZoneKey[];
  initialSignalCounts?: { notificationCount: number; inboxCount: number };
  complianceBanner?: ComplianceBanner | null;
  variant?: WorkspaceShellVariant;
  title?: string;
  mobileNavigation?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { dictionary, direction, isRtl } = useWebLocale();
  const signalCounts = initialSignalCounts;
  const isInboxActive = matchesWorkspacePath(pathname, "/ws/inbox");
  const canUseInbox = (visibleZoneKeys ?? []).includes("inbox");
  const isAssistantVariant = variant === "assistant";
  const resolvedTitle = title ?? (isAssistantVariant ? dictionary.nav.assistantTitle : dictionary.nav.overviewTitle);
  const verificationHref = complianceBanner?.ctaHref ?? "/ws/settings?tab=verification";
  const verificationBadgeLabel = complianceBanner?.ctaLabel ?? complianceBanner?.title ?? null;

  return (
    <header
      data-slot="workspace-top-navbar"
      data-variant={variant}
      dir={direction}
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 border-b transition-colors",
        DEFAULT_HEADER_CLASS_NAME
      )}
    >
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        {mobileNavigation ? <div className="lg:hidden">{mobileNavigation}</div> : null}
        {isAssistantVariant ? (
          <div className={cn("flex min-w-0 items-center gap-2 lg:gap-3", isRtl ? "flex-row-reverse" : "flex-row")}>
            <h1 className="truncate text-xs lg:text-sm font-black uppercase tracking-widest text-[var(--zayon-deep)] dark:text-white">{resolvedTitle}</h1>
            <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--zayon-line)] dark:bg-white/20" aria-hidden="true" />
            <p
              className={cn(
                "hidden max-w-[18rem] truncate text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zayon-text-muted)] sm:block dark:text-white/40",
                isRtl ? "text-right" : "text-left",
              )}
              title={organization.name}
            >
              {organization.name}
            </p>
          </div>
        ) : (
          <h1 className="truncate text-sm font-black uppercase tracking-[0.15em] text-[var(--zayon-deep)] dark:text-white lg:text-base">{resolvedTitle}</h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 lg:gap-3">
        <WebLocaleSwitcher className="h-9 w-9 lg:h-10 lg:w-10 border border-[var(--zayon-line)] bg-transparent text-[var(--zayon-deep)] transition hover:text-[var(--zayon-accent)] dark:border-white/10 dark:text-white dark:hover:text-[var(--zayon-accent)]" />
        <ThemeToggle className="h-9 w-9 lg:h-10 lg:w-10 border border-[var(--zayon-line)] bg-transparent text-[var(--zayon-deep)] transition hover:text-[var(--zayon-accent)] dark:border-white/10 dark:text-white dark:hover:text-[var(--zayon-accent)]" />
        
        <div className="mx-0.5 lg:mx-1 h-5 lg:h-6 w-px bg-[var(--zayon-line)] dark:bg-white/10" aria-hidden="true" />
        
        <div className="flex items-center gap-1.5 lg:gap-2">
          <SignalButton
            label={dictionary.nav.notifications}
            count={signalCounts.notificationCount}
            href="/ws/notifications"
            icon={<Bell className="h-4 w-4" />}
            variant={variant}
          />
          {canUseInbox ? (
            <SignalButton
              label={dictionary.nav.inbox}
              count={signalCounts.inboxCount}
              href="/ws/inbox"
              isActive={isInboxActive}
              icon={<Mail className="h-4 w-4" />}
              variant={variant}
            />
          ) : null}
        </div>
        
        <div className="mx-1 h-6 w-px bg-[var(--zayon-line)] dark:bg-white/10" aria-hidden="true" />
        
        {verificationBadgeLabel ? (
          <Link
            href={verificationHref}
            data-slot="workspace-compliance-badge"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--zayon-line)] bg-transparent px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--zayon-deep)] transition-all hover:bg-[var(--zayon-surface)] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            title={complianceBanner?.title}
            aria-label={verificationBadgeLabel}
          >
            <AlertTriangle className="h-3 w-3 text-[var(--zayon-accent)]" />
            <span className="hidden sm:inline">{verificationBadgeLabel}</span>
          </Link>
        ) : null}
        
        <div className="pl-1">
          <WorkspaceIdentityMenu user={user} organization={organization} variant={variant} />
        </div>
      </div>
    </header>
  );
}

function SignalButton({
  label,
  count,
  href,
  icon,
  isActive,
  variant = "default",
}: {
  label: string;
  count: number;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
  variant?: WorkspaceShellVariant;
}) {
  const isAssistantVariant = variant === "assistant";

  return (
    <Link
      href={href}
      className={cn(
        HEADER_ICON_ACTION_CLASS_NAME,
        "relative",
        isActive
          ? "bg-[var(--zayon-deep)] text-white dark:bg-white dark:text-black"
          : "text-[var(--zayon-deep)] dark:text-white",
      )}
      aria-label={`${label}: ${count}`}
      title={label}
    >
      {icon}
      {count > 0 ? (
        <span className="absolute end-0 top-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--zayon-accent)] ring-2 ring-[var(--zayon-background)] dark:ring-black" />
      ) : null}
    </Link>
  );
}
