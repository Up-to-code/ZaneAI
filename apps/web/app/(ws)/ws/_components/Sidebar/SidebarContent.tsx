import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SidebarProps } from "./types";
import { PenSquare, LifeBuoy, MessageSquare, Moon, Globe, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { getWorkspaceZonesForKeys } from "../../_lib/zones";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import ThemeToggle from "@/app/_components/ThemeToggle";
import WebLocaleSwitcher from "@/app/_components/WebLocaleSwitcher";

export default function SidebarContent({
  user,
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
  
  const threads = (recentAssistantThreads || []).slice(0, 4).map(t => ({
    id: String("_id" in t ? t._id : (t as any).id),
    title: ("title" in t ? (t as any).title : null) || "Assistant Thread",
  }));

  const SIDEBAR_SHELL_CLASS = "bg-[var(--zane-ai-background)] text-[var(--zane-ai-deep)] dark:bg-black dark:text-white";

  return (
    <div
      className={cn(
        "flex min-h-full flex-col",
        SIDEBAR_SHELL_CLASS,
        mode === "desktop" ? "h-full" : "w-full overflow-y-auto overflow-x-hidden",
      )}
    >
      {/* ── Mode Switcher & Header ───────────────────────────── */}
      <div className="flex h-16 lg:h-20 shrink-0 items-center justify-between border-b border-[var(--zane-ai-line)] px-4 lg:px-6 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-3 lg:gap-4">
          {mode === "desktop" ? headerAction : null}
          <div className="min-w-0 flex flex-col justify-center pt-1">
            <div className="truncate text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
              Infrastructure
            </div>
            <div className="truncate mt-1 text-[15px] lg:text-[17px] font-black uppercase tracking-[0.15em] text-[var(--zane-ai-deep)] dark:text-white">
              {organization.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/ws"
            prefetch={false}
            className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center border border-[var(--zane-ai-line)] bg-transparent text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-deep)] hover:text-white active:scale-95 dark:border-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
            title="New Context"
          >
            <PenSquare className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4">
        <div className="flex h-10 w-full items-center rounded-full border border-[var(--zane-ai-line)] bg-[var(--zane-ai-background)] p-1 dark:border-white/10 dark:bg-black">
          <div className="flex h-full flex-1 items-center justify-center rounded-full bg-[var(--zane-ai-deep)] text-[9px] font-black uppercase tracking-widest text-white transition-all dark:bg-white dark:text-black">
             {dictionary.nav.normalMode}
          </div>
          <div className="group relative flex h-full flex-1 items-center justify-center rounded-full bg-transparent text-[9px] font-black uppercase tracking-widest text-[var(--zane-ai-text-muted)] transition-all dark:text-white/40">
             {dictionary.nav.aiMode}
             <span className="absolute -right-1 -top-1 rounded bg-[var(--zane-ai-accent)] px-1 py-0.5 text-[6px] font-black text-white">
               {dictionary.nav.soonBadge}
             </span>
          </div>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav
        aria-label={dictionary.nav.workspaceNavigation}
        className="flex-1 overflow-y-auto px-4 lg:px-6 py-2 flex flex-col gap-8 lg:gap-10 pb-10"
      >
        <div className="flex flex-col">
          <h3 className="mb-3 lg:mb-4 text-[9px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
            {dictionary.nav.operationsLabel}
          </h3>
          <ul className="flex flex-col border-t border-[var(--zane-ai-line)] dark:border-white/10">
            {zones.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const isComingSoon = item.comingSoon;

              return (
                <li key={item.label} className="flex flex-col border-b border-[var(--zane-ai-line)] dark:border-white/10 w-full">
                  {isComingSoon ? (
                    <div
                      className="flex items-center gap-3 lg:gap-4 px-2 py-3 lg:py-4 transition-all w-full leading-none opacity-40 cursor-not-allowed"
                    >
                      <Icon className="h-4 w-4 shrink-0 transition-colors" strokeWidth={2.5} />
                      <span className="flex-1 truncate text-[11px] font-black uppercase tracking-[0.2em] transition-colors">
                        {item.label}
                      </span>
                      <span className="rounded-[4px] bg-[var(--zane-ai-surface)] px-1.5 py-0.5 text-[6px] font-black uppercase tracking-widest text-[var(--zane-ai-text-muted)] dark:bg-white/5 dark:text-white/40">
                        {dictionary.nav.soonBadge || "Soon"}
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 lg:gap-4 px-2 py-3 lg:py-4 transition-all w-full leading-none group",
                        isActive
                          ? "bg-transparent text-[var(--zane-ai-deep)] dark:text-white"
                          : "bg-transparent text-[var(--zane-ai-deep)] dark:text-white hover:opacity-70 active:scale-[0.98]"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[var(--zane-ai-accent)]" : "")} strokeWidth={2.5} />
                      <span className={cn("flex-1 truncate text-[11px] font-black uppercase tracking-[0.2em] transition-colors", isActive ? "text-[var(--zane-ai-accent)]" : "")}>
                        {item.label}
                      </span>
                      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[var(--zane-ai-accent)] absolute right-4 lg:right-6 mix-blend-difference" />}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {threads.length > 0 && (
          <div className="flex flex-col">
            <h3 className="mb-3 lg:mb-4 text-[9px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
              {dictionary.nav.contextsAndThreads}
            </h3>
            <ul className="flex flex-col border-t border-[var(--zane-ai-line)] dark:border-white/10">
              {threads.map((thread) => (
                <li key={thread.id} className="flex flex-col border-b border-[var(--zane-ai-line)] dark:border-white/10 w-full">
                  <Link
                    href={`/ws/c/${thread.id}`}
                    className="flex items-center gap-3 lg:gap-4 px-2 py-3 lg:py-4 transition-all w-full leading-none group tooltip"
                    title={thread.title}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-[var(--zane-ai-text-muted)] dark:text-white/40 transition-colors group-hover:text-[var(--zane-ai-accent)]" strokeWidth={2.5} />
                    <span className="flex-1 truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--zane-ai-text-muted)] dark:text-white/60 transition-colors group-hover:text-[var(--zane-ai-deep)] dark:group-hover:text-white">
                      {thread.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
