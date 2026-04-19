import Link from "next/link";
import { cn } from "@/lib/i18n";
import type { SidebarProps } from "./types";
import { MessageSquare } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getWorkspaceZonesForKeys } from "../../_lib/zones";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";

export default function SidebarContent({
  organization,
  visibleZoneKeys,
  recentAssistantThreads,
  allAssistantThreads,
  mode = "desktop",
  variant,
  headerAction,
  titleId,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const { dictionary, locale } = useWebLocale();
  void allAssistantThreads;
  void variant;
  void titleId;
  void onNavigate;
  const zones = getWorkspaceZonesForKeys(visibleZoneKeys ?? ["overview"], locale);

  const threads = (recentAssistantThreads || []).slice(0, 4).map((thread) => ({
    id: thread.id,
    title: thread.title || "Assistant Thread",
  }));

  const SIDEBAR_SHELL_CLASS =
    "bg-[var(--workspace-chrome-sidebar-bg)] text-foreground";
  const searchParams = useSearchParams();
  void searchParams;
  const router = useRouter();
  const isAiMode = pathname === "/ws/ai";
  const showAssistantThreads = isAiMode && threads.length > 0;

  const handleModeToggle = (ai: boolean) => {
    if (ai) {
      router.replace("/ws/ai");
    } else {
      router.replace("/ws");
    }
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col",
        SIDEBAR_SHELL_CLASS,
        mode === "desktop" ? "h-full" : "w-full overflow-y-auto overflow-x-hidden",
      )}
    >
      {/* ── Mode Switcher & Header ───────────────────────────── */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[color:var(--workspace-border)] px-4 lg:h-[72px] lg:px-6">
        <div className="flex min-w-0 items-center gap-3 lg:gap-4">
          {mode === "desktop" ? headerAction : null}
          <div className="min-w-0 flex flex-col justify-center pt-1">
            <div className="truncate text-[9px] font-black uppercase tracking-[0.35em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
              Infrastructure
            </div>
            <div className="truncate mt-0.5 text-[14px] lg:text-[16px] font-black uppercase tracking-[0.18em] text-[var(--zane-ai-deep)] dark:text-white">
              {organization.name}
            </div>
          </div>
        </div>
        {isAiMode ? (
          <div className="flex items-center gap-2">
            <Link
              href="/ws"
              prefetch={false}
              className="flex h-9 w-9 items-center justify-center border border-[color:var(--workspace-border)] bg-transparent text-foreground transition-all hover:bg-foreground hover:text-background active:scale-95 lg:h-10 lg:w-10"
              title="New Context"
            >
              <MessageSquare className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>

      {/* ── Mode Switcher & Header ───────────────────────────── */}
      <div className="px-4 lg:px-6 py-4">
        <div className="flex h-10 w-full items-center rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-1">
          <button
            onClick={() => handleModeToggle(false)}
            className={cn(
              "flex h-full flex-1 items-center justify-center rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
              !isAiMode 
                ? "bg-[var(--zane-ai-deep)] text-white dark:bg-white dark:text-black" 
                : "bg-transparent text-[var(--zane-ai-text-muted)] dark:text-white/40 hover:opacity-70"
            )}
          >
            {dictionary.nav.normalMode}
          </button>
          <button
            onClick={() => {
              // DISABLED: AI Mode is "Coming Soon"
            }}
            className={cn(
              "group relative flex h-full flex-1 items-center justify-center rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
              isAiMode 
                ? "bg-[var(--zane-ai-deep)] text-white dark:bg-white dark:text-black" 
                : "bg-transparent text-[var(--zane-ai-text-muted)] dark:text-white/40 cursor-default"
            )}
          >
            {dictionary.nav.aiMode}
            {!isAiMode && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-[var(--zane-ai-accent)] px-1.5 py-0.5 text-[6px] font-black uppercase tracking-widest text-white">
                {dictionary.nav.soonBadge}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav
        aria-label={dictionary.nav.workspaceNavigation}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 lg:px-6 py-2 flex flex-col gap-8 lg:gap-10 pb-10"
      >
        <div className="flex flex-col">
          <h3 className="mb-3 lg:mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40 px-2 lg:px-4">
            {dictionary.nav.operationsLabel}
          </h3>
          <ul className="flex flex-col border-t border-[color:var(--workspace-border)]">
            {zones.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const isComingSoon = item.comingSoon;

              return (
                <li key={item.label} className="flex w-full flex-col border-b border-[color:var(--workspace-border)]">
                  {isComingSoon ? (
                    <div
                      className="flex items-center gap-3 lg:gap-4 px-4 py-3 lg:py-4 transition-all w-full leading-none opacity-40 cursor-not-allowed"
                    >
                      <Icon className="h-4 w-4 shrink-0 transition-colors" strokeWidth={2} />
                      <span className="flex-1 truncate text-[11px] font-black uppercase tracking-[0.2em] transition-colors">
                        {item.label}
                      </span>
                      <span className="rounded-full bg-[var(--workspace-border)] px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/30">
                        {dictionary.nav.soonBadge || "Soon"}
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex w-full items-center gap-3 px-4 py-3 leading-none transition-all lg:gap-4 lg:py-4",
                        isActive
                          ? "bg-transparent text-[var(--zane-ai-deep)] dark:text-white"
                          : "bg-transparent text-[var(--zane-ai-deep)] dark:text-white hover:opacity-70 active:scale-[0.98]"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[var(--zane-ai-accent)]" : "")} strokeWidth={2} />
                      <span className={cn("flex-1 truncate text-[11px] font-black uppercase tracking-[0.2em] transition-colors", isActive ? "text-[var(--zane-ai-accent)]" : "")}>
                        {item.label}
                      </span>
                      {isActive && <div className="absolute end-4 h-1 w-1 rounded-full bg-[var(--zane-ai-accent)]" />}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {showAssistantThreads ? (
          <div className="flex flex-col">
            <h3 className="mb-3 lg:mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40 px-2 lg:px-4">
              {dictionary.nav.contextsAndThreads}
            </h3>
            <ul className="flex flex-col border-t border-[color:var(--workspace-border)]">
              {threads.map((thread) => (
                <li key={thread.id} className="flex w-full flex-col border-b border-[color:var(--workspace-border)]">
                  <Link
                    href={`/ws/c/${thread.id}`}
                    className="flex items-center gap-3 lg:gap-4 px-4 py-3 lg:py-4 transition-all w-full leading-none group tooltip"
                    title={thread.title}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-[var(--zane-ai-text-muted)] dark:text-white/40 transition-colors group-hover:text-[var(--zane-ai-accent)]" strokeWidth={2} />
                    <span className="flex-1 truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--zane-ai-text-muted)] dark:text-white/60 transition-colors group-hover:text-[var(--zane-ai-deep)] dark:group-hover:text-white">
                      {thread.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
