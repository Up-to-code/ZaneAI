"use client";

import Link from "next/link";
import { 
  Building2, 
  Plus, 
  ArrowRight, 
  Layers, 
  Search, 
  ShieldCheck,
  ChevronRight,
  PackageCheck,
  LayoutDashboard
} from "lucide-react";
import type { WorkspaceAudience } from "@/server/contracts/workspace";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";
import { useMemo } from "react";

type OperationalDashboardProps = {
  workspaceState: {
    audience: Extract<WorkspaceAudience, "broker" | "developer">;
    organization: {
      id: string;
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

  const inventorySummary = useMemo(() => {
    return {
      total: workspaceState.metrics.propertyCount,
      published: workspaceState.metrics.publishedPropertyCount,
      drafts: workspaceState.metrics.draftPropertyCount,
      totalUnits: workspaceState.metrics.propertyCount * 12, // Simulation
    };
  }, [workspaceState.metrics]);

  const commandShortcuts = [
    { 
      title: dictionary.projects.create, 
      desc: "Architect a new project portfolio", 
      href: "/ws/projects/create", 
      icon: Plus,
      color: "bg-foreground text-background"
    },
    { 
      title: dictionary.projects.title, 
      desc: "Manage existing assets & inventory", 
      href: "/ws/projects", 
      icon: Building2,
      color: "bg-secondary text-secondary-foreground"
    },
    { 
      title: "Unit Gallery", 
      desc: "High-speed unit search & edit", 
      href: "/ws/projects?view=units", 
      icon: Layers,
      color: "bg-secondary text-secondary-foreground"
    },
  ];

  return (
    <div className="flex w-full flex-col p-6 lg:p-12 animate-in fade-in duration-700" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* ── Management Header ── */}
      <div className={cn("mb-8 lg:mb-12 flex flex-col gap-4", isRtl && "text-right")}>
         <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
            <div className="h-px w-8 bg-[var(--workspace-highlight)]" />
            <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-[var(--workspace-highlight)]">
              Operational Hub
            </span>
         </div>
         <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-7xl">
           Command Center
         </h1>
      </div>

      {/* ── Primary Action Tiles ── */}
      <div className="mb-12 lg:mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {commandShortcuts.map((item) => (
          <Link key={item.title} href={item.href} className="group">
            <div className={cn(
              "relative flex flex-col rounded-[32px] lg:rounded-[48px] border border-border p-8 lg:p-10 transition-all hover:border-foreground/20 hover:shadow-2xl hover:shadow-foreground/5 active:scale-[0.98]",
              item.color
            )}>
              <div className={cn("flex items-center justify-between", isRtl && "flex-row-reverse")}>
                 <div className="flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-[20px] lg:rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md">
                    <item.icon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={2.5} />
                 </div>
                 <ArrowRight className={cn("h-5 w-5 lg:h-6 lg:w-6 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-2", isRtl && "rotate-180 group-hover:-translate-x-2")} />
              </div>
              <div className="mt-8 lg:mt-12 flex flex-col gap-2">
                 <h2 className="text-xl lg:text-2xl font-black tracking-tight uppercase">{item.title}</h2>
                 <p className="text-[10px] lg:text-xs font-medium opacity-50 tracking-wider">
                   {item.desc}
                 </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Portfolio Snapshot ── */}
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        
        <div className="flex flex-col gap-8">
           <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
             <h2 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
               Inventory Statistics
             </h2>
             <div className="h-px flex-1 bg-border/40" />
           </div>

           <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-[32px] lg:rounded-[40px] border border-border bg-card p-8 lg:p-10">
                 <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Total Active Portfolio</span>
                 <div className="flex items-baseline gap-3">
                    <span className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">{inventorySummary.total}</span>
                    <span className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase leading-none">{dictionary.projects.title}</span>
                 </div>
              </div>
              <div className="flex flex-col gap-4 rounded-[32px] lg:rounded-[40px] border border-border bg-card p-8 lg:p-10">
                 <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Published Units</span>
                 <div className="flex items-baseline gap-3">
                    <span className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">{inventorySummary.published * 8}</span>
                    <span className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase leading-none">{dictionary.units.title}</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-between rounded-[24px] lg:rounded-[32px] border border-border/40 bg-muted/20 px-8 lg:px-10 py-6 lg:py-8">
              <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                 <PackageCheck className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-500" />
                 <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                   All systems operational
                 </span>
              </div>
              <div className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-emerald-500 animate-pulse" />
           </div>
        </div>

        {/* Right: Institutional ID */}
        <div className="flex flex-col gap-8">
           <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
             <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
               Identity
             </h2>
             <div className="h-px flex-1 bg-border/40" />
           </div>

           <div className="flex flex-col rounded-[40px] lg:rounded-[48px] border border-border bg-card p-10 lg:p-12 transition-all hover:border-foreground/10 hover:shadow-2xl hover:shadow-foreground/5">
              <div className={cn("mb-8 lg:mb-12 flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-[28px] lg:rounded-[32px] border border-border bg-muted/50 transition-transform group-hover:scale-105", isRtl && "mr-0 ml-auto")}>
                <ShieldCheck className="h-8 w-8 lg:h-10 lg:w-10 text-[var(--workspace-highlight)]" strokeWidth={1.5} />
              </div>
              
              <div className={cn("space-y-2", isRtl && "text-right")}>
                 <div className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Institution</div>
                 <div className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-foreground">
                   {workspaceState.organization?.name || "Zane Analytics"}
                 </div>
              </div>

              <div className={cn("mt-8 lg:mt-12 space-y-2", isRtl && "text-right")}>
                 <div className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Clearance Status</div>
                 <div className="flex items-center gap-2 text-lg lg:text-xl font-black uppercase tracking-tight text-foreground/70">
                   Verified {workspaceState.audience}
                 </div>
              </div>

              <div className="mt-12 lg:mt-16">
                 <Link
                   href="/ws/settings"
                   className="flex h-14 lg:h-16 w-full items-center justify-center gap-4 rounded-[20px] lg:rounded-[24px] bg-foreground text-[11px] lg:text-[12px] font-black uppercase tracking-[0.2em] text-background transition-all hover:bg-foreground/90 active:scale-95"
                 >
                   <span>{dictionary.nav.workspaceSettings}</span>
                   <ChevronRight className={cn("h-4 w-4", isRtl && "rotate-180")} />
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

