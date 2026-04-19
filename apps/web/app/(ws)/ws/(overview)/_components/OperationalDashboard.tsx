"use client";

import Link from "next/link";
import { 
  Building2, 
  ArrowRight, 
  Globe, 
  LifeBuoy, 
  TrendingUp, 
  Package, 
  FileEdit,
  ShieldCheck
} from "lucide-react";
import type { WorkspaceAudience } from "@/server/contracts/workspace";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";

type OperationalDashboardProps = {
  workspaceState: {
    audience: Extract<WorkspaceAudience, "broker" | "developer">;
    organization: {
      name: string;
    } | null;
    metrics: {
      propertyCount: number;
      publishedPropertyCount: number;
      draftPropertyCount: number;
    };
  };
};

export default function OperationalDashboard({ workspaceState }: OperationalDashboardProps) {
  const { dictionary, isRtl } = useWebLocale();

  const metrics = [
    { label: dictionary.projects.all, value: workspaceState.metrics.propertyCount, icon: Package },
    { label: "Published", value: workspaceState.metrics.publishedPropertyCount, icon: TrendingUp },
    { label: "Drafts", value: workspaceState.metrics.draftPropertyCount, icon: FileEdit },
  ];

  const quickLinks = [
    { title: dictionary.projects.title, desc: dictionary.projects.description, href: "/ws/projects", icon: Building2 },
    { title: dictionary.nav.workspaceSettings, desc: dictionary.settings.description, href: "/ws/settings", icon: Globe },
    { title: "Support", desc: "Technical documentation & support.", href: "/ws/help", icon: LifeBuoy, isComingSoon: true },
  ];

  return (
    <div className="flex w-full flex-col p-6 lg:p-10 animate-in fade-in duration-500">
      
      {/* ── Metric Architecture ────────────────────────────────── */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {metrics.map((item) => (
          <div key={item.label} className="group flex flex-col rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-6 transition-all hover:bg-[var(--workspace-elevated)] dark:hover:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-text-muted)] dark:text-white/40">{item.label}</span>
              <item.icon className="h-3.5 w-3.5 text-[var(--zane-ai-accent)]" strokeWidth={2.5} />
            </div>
            <div className="mt-8 text-4xl font-black tracking-tighter text-[var(--zane-ai-deep)] dark:text-white lg:text-5xl">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Left: Operational Modules */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
              {dictionary.nav.operationsLabel}
            </h2>
            <div className="h-px flex-1 bg-[var(--workspace-border)]" />
          </div>

          <div className="flex flex-col divide-y divide-[color:var(--workspace-border)] overflow-hidden rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)]">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-center gap-5 px-6 py-6 transition-colors hover:bg-[var(--workspace-elevated)] dark:hover:bg-white/[0.02]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] group-hover:bg-white/5">
                    <Icon className="h-5 w-5 text-[var(--zane-ai-deep)] dark:text-white/70" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-black uppercase tracking-[0.1em] text-[var(--zane-ai-deep)] dark:text-white">
                      {item.title}
                    </div>
                    <p className="mt-1 truncate text-[11px] font-medium tracking-wider text-[var(--zane-ai-text-muted)] dark:text-white/40">
                      {item.desc}
                    </p>
                  </div>
                  {!item.isComingSoon && (
                    <ArrowRight className={cn("h-4 w-4 text-[var(--zane-ai-text-muted)] transition-transform group-hover:translate-x-1 dark:text-white/30", isRtl && "rotate-180 group-hover:-translate-x-1")} />
                  )}
                  {item.isComingSoon && (
                    <span className="rounded-full bg-[var(--workspace-elevated)] px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:bg-white/5 dark:text-white/30">
                      Soon
                    </span>
                  )}
                </div>
              );

              if (item.isComingSoon) {
                return (
                  <div key={item.title} className="opacity-50">
                    {content}
                  </div>
                );
              }

              return (
                <Link key={item.title} href={item.href} className="group">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Authenticated Identity */}
        <div className="flex flex-col gap-6">
           <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
              Validated Context
            </h2>
            <div className="h-px flex-1 bg-[var(--workspace-border)]" />
          </div>

          <div className="flex flex-col rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-8">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-elevated)]">
              <ShieldCheck className="h-6 w-6 text-[var(--zane-ai-accent)]" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-1">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/30">Organization</div>
               <div className="text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
                 {workspaceState.organization?.name}
               </div>
            </div>

            <div className="mt-8 space-y-1">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/30">Authorization Level</div>
               <div className="text-xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
                 Verified {workspaceState.audience}
               </div>
            </div>

            <div className="mt-12">
               <Link
                 href="/ws/settings"
                 className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-elevated)] text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-deep)] hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black"
               >
                 {dictionary.nav.workspaceSettings}
                 <ArrowRight className={cn("h-3.5 w-3.5", isRtl && "rotate-180")} />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
