"use client";

import Link from "next/link";
import { Building2, KeyRound, PlugZap, ShieldCheck, Users } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";

type SettingsTabIcon = "building" | "shield" | "users" | "plug" | "key";

const settingsTabIcons: Record<SettingsTabIcon, React.ComponentType<{ className?: string }>> = {
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
  const { locale } = useWebLocale();
  const selectedTab = searchParams?.get("tab");
  const currentTab = tabs.some((tab) => tab.key === selectedTab)
    ? selectedTab
    : defaultTab || tabs[0]?.key;

  return (
    <div
      className="pb-1"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <nav className="flex flex-wrap gap-2" aria-label="Tabs">
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
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-all",
                isActive
                  ? "bg-[var(--workspace-panel)] text-[var(--workspace-highlight)]"
                  : "text-muted-foreground hover:bg-[var(--workspace-panel)] hover:text-foreground",
              )}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
