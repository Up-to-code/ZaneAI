"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Bell, Mail } from "lucide-react";
import WebLocaleSwitcher from "@/app/_components/WebLocaleSwitcher";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";
import type { WorkspaceOrganizationDisplay } from "../_lib/organizationDisplay";
import { cn } from "@/lib/i18n";
import type { SidebarUser } from "./Sidebar/types";
import ThemeToggle from "@/app/_components/ThemeToggle";
import type { ComplianceBanner } from "../_lib/complianceBanner";
import WorkspaceIdentityMenu from "./WorkspaceIdentityMenu";
import { matchesWorkspacePath, type WorkspaceShellVariant } from "../_lib/workspaceChrome";


const HEADER_ACTION_BASE_CLASS_NAME =
  "inline-flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full border border-transparent bg-transparent text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-line)] hover:text-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white active:scale-[0.96]";

const HEADER_ICON_ACTION_CLASS_NAME = HEADER_ACTION_BASE_CLASS_NAME;

const DEFAULT_HEADER_CLASS_NAME =
  "h-16 lg:h-[72px] border-b border-[color:var(--workspace-border)] bg-[var(--workspace-chrome-header-bg)] px-4 backdrop-blur-xl lg:px-8";

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
      <div className="flex min-w-0 items-center gap-3 lg:gap-6">
        {mobileNavigation ? <div className="lg:hidden">{mobileNavigation}</div> : null}
        
        {/* Brand Identity: Pure Canvas Anchor */}
        <Link 
          href="/ws" 
          className="group relative hidden items-center gap-3 transition-all hover:opacity-100 lg:flex"
        >
          {/* Subtle Branding Glow */}
          <div className="absolute -inset-1.5 -z-10 bg-[var(--zane-ai-accent)]/5 blur-xl transition-all duration-500 group-hover:bg-[var(--zane-ai-accent)]/10" />
          
          <div className="relative flex items-center gap-3">
            <img 
              src="/brand-logo.svg" 
              alt="ZANE-AI" 
              className="h-[20px] w-auto transition-transform duration-500 group-hover:scale-110" 
            />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--zane-ai-deep)] transition-colors duration-300 group-hover:text-[var(--zane-ai-accent)] dark:text-white">
              Zane-AI
            </span>
          </div>
          
          <span className="mx-4 h-4 w-px bg-[var(--zane-ai-line)] transition-colors dark:bg-white/10" aria-hidden="true" />
        </Link>
        {isAssistantVariant ? (
          <div className={cn("flex min-w-0 items-center gap-2 lg:gap-3", isRtl ? "flex-row-reverse" : "flex-row")}>
            <h1 className="truncate text-[11px] lg:text-[12px] font-extrabold uppercase tracking-[0.2em] text-[var(--zane-ai-deep)] dark:text-white">{resolvedTitle}</h1>
            <span className="h-2 w-px shrink-0 bg-[var(--zane-ai-line)] dark:bg-white/10" aria-hidden="true" />
            <p
              className={cn(
                "hidden max-w-[20rem] truncate text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--zane-ai-text-muted)] sm:block dark:text-white/40",
                isRtl ? "text-right" : "text-left",
              )}
              title={organization.name}
            >
              {organization.name}
            </p>
          </div>
        ) : (
          <h1 className="truncate text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--zane-ai-deep)] dark:text-white lg:text-[13px]">{resolvedTitle}</h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 lg:gap-3">
        <div className="flex items-center gap-1">
          <WebLocaleSwitcher className="h-9 w-9 lg:h-10 lg:w-10 border-none bg-transparent text-[var(--zane-ai-deep)] transition hover:bg-[var(--zane-ai-line)] dark:text-white/80 dark:hover:bg-white/10" />
          <ThemeToggle className="h-9 w-9 lg:h-10 lg:w-10 border-none bg-transparent text-[var(--zane-ai-deep)] transition hover:bg-[var(--zane-ai-line)] dark:text-white/80 dark:hover:bg-white/10" />
        </div>
        
        <div className="mx-1 h-4 lg:h-5 w-px bg-[var(--zane-ai-line)] dark:bg-white/10" aria-hidden="true" />
        
        <div className="flex items-center gap-1 lg:gap-1.5">
          <SignalButton
            label={dictionary.nav.notifications}
            count={signalCounts.notificationCount}
            href="/ws/notifications"
            icon={<Bell className="h-4 w-4" />}
          />
          {canUseInbox ? (
            <SignalButton
              label={dictionary.nav.inbox}
              count={signalCounts.inboxCount}
              href="/ws/inbox"
              isActive={isInboxActive}
              icon={<Mail className="h-4 w-4" />}
            />
          ) : null}
        </div>
        
        <div className="mx-1 h-4 lg:h-5 w-px bg-[var(--zane-ai-line)] dark:bg-white/10" aria-hidden="true" />
        
        {verificationBadgeLabel ? (
          <Link
            href={verificationHref}
            data-slot="workspace-compliance-badge"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--zane-ai-line)] bg-transparent px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-surface)] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            title={complianceBanner?.title}
            aria-label={verificationBadgeLabel}
          >
            <AlertTriangle className="h-3 w-3 text-[var(--zane-ai-accent)]" />
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
}: {
  label: string;
  count: number;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        HEADER_ICON_ACTION_CLASS_NAME,
        "relative",
        isActive
          ? "bg-[var(--zane-ai-deep)] text-white shadow-sm dark:bg-white dark:text-black"
          : "text-[var(--zane-ai-deep)] hover:bg-[var(--zane-ai-line)] dark:text-white/80 dark:hover:bg-white/10",
      )}
      aria-label={`${label}: ${count}`}
      title={label}
    >
      {icon}
      {count > 0 ? (
        <span className="absolute end-0 top-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--zane-ai-accent)] ring-2 ring-[var(--zane-ai-background)] dark:ring-black" />
      ) : null}
    </Link>
  );
}
