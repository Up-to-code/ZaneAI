"use client";

import Link from "next/link";
import { Building2, KeyRound, PlugZap, ShieldCheck, Users } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";

type SettingsTabIcon = "building" | "shield" | "users" | "plug" | "key";

const settingsTabIcons: Record<SettingsTabIcon, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  building: Building2,
  shield: ShieldCheck,
  users: Users,
  plug: PlugZap,
  key: KeyRound,
};

type SettingsTabItem = {
  key: string;
  label: string;
  icon?: SettingsTabIcon;
};

interface SettingsTabsProps {
  tabs: readonly SettingsTabItem[];
  defaultTab?: string;
}

function buildSettingsHref(pathname: string | null, searchParams: ReturnType<typeof useSearchParams>, tabKey: string) {
  const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
  nextParams.set("tab", tabKey);
  const hrefPath = pathname && pathname.length > 0 ? pathname : "/ws/settings";
  const hrefQuery = nextParams.toString();
  return hrefQuery ? `${hrefPath}?${hrefQuery}` : hrefPath;
}

export default function SettingsTabs({ tabs, defaultTab }: SettingsTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, direction } = useWebLocale();
  const selectedTab = searchParams?.get("tab");
  const currentTab = tabs.some((tab) => tab.key === selectedTab)
    ? selectedTab
    : defaultTab || tabs[0]?.key;

  return (
    <div
      className="mt-4"
      dir={direction}
    >
      <nav className="flex flex-wrap gap-10 border-b border-[color:var(--workspace-border)]" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const href = buildSettingsHref(pathname, searchParams, tab.key);
          const Icon = tab.icon ? settingsTabIcons[tab.icon] : null;
          return (
            <Link
              key={tab.key}
              href={href}
              aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative inline-flex items-center gap-2.5 px-0.5 py-3 text-[12px] font-bold uppercase tracking-[0.15em] transition-all",
              isActive
                ? "text-[var(--zane-ai-deep)] dark:text-white"
                : "text-[var(--zane-ai-text-muted)] hover:text-[var(--zane-ai-deep)] dark:text-white/40 dark:hover:text-white",
            )}
            >
            {Icon ? <Icon className={cn("h-3.5 w-3.5 shrink-0 transition-colors", isActive ? "text-[var(--zane-ai-accent)]" : "opacity-30")} strokeWidth={2.5} /> : null}
              {tab.label}
              {isActive && (
                <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-[var(--zane-ai-accent)] shadow-[0_0_8px_rgba(var(--zane-ai-accent-rgb),0.2)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
