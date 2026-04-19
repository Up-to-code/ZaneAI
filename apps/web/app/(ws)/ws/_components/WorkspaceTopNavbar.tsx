"use client";

import Link from "next/link";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import WebLocaleSwitcher from "@/app/_components/WebLocaleSwitcher";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";
import type { WorkspaceOrganizationDisplay } from "../_lib/organizationDisplay";
import { cn } from "@/lib/i18n";
import type { SidebarUser } from "./Sidebar/types";
import ThemeToggle from "@/app/_components/ThemeToggle";
import type { ComplianceBanner } from "../_lib/complianceBanner";
import WorkspaceIdentityMenu from "./WorkspaceIdentityMenu";
import type { WorkspaceShellVariant } from "../_lib/workspaceChrome";


const DEFAULT_HEADER_CLASS_NAME =
  "sticky top-0 z-30 h-16 lg:h-[72px] border-b border-[color:var(--workspace-border)] bg-[var(--workspace-chrome-header-bg)] px-4 backdrop-blur-xl lg:px-8";

export default function WorkspaceTopNavbar({
  user,
  organization,
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
  const { dictionary, direction, isRtl } = useWebLocale();
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
            <Image
              src="/brand-logo.svg" 
              alt="ZANE-AI" 
              width={100}
              height={20}
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
