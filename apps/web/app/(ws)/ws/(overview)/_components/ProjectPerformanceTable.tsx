"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";

type PerformanceProject = {
  id: string;
  name: string;
  image: string;
  soldPercent: number;
  leads: number; // Will represent EOIs in Egyptian context
  efficiency: number;
  appreciation: number;
  delivery: string;
};

type ProjectPerformanceTableProps = {
  projects: PerformanceProject[];
};

export default function ProjectPerformanceTable({ projects }: ProjectPerformanceTableProps) {
  const { dictionary, isRtl } = useWebLocale();

  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-[32px] border border-[color:var(--workspace-border)] bg-card">
      <div className="p-10 pb-0">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/50">
          {dictionary.performance.topPerformers}
        </h3>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20">
              <th className={cn(
                "px-10 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/50",
                isRtl ? "text-right" : "text-left"
              )}>
                {dictionary.performance.project}
              </th>
              <th className={cn(
                "px-10 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/50",
                isRtl ? "text-right" : "text-left"
              )}>
                {dictionary.performance.inventoryHealth}
              </th>
              <th className={cn(
                "px-10 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/50",
                isRtl ? "text-right" : "text-left"
              )}>
                {dictionary.performance.eoiCount}
              </th>
              <th className={cn(
                "px-10 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/50",
                isRtl ? "text-right" : "text-left"
              )}>
                {dictionary.performance.appreciation}
              </th>
              <th className="px-10 py-5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {projects.map((item) => (
              <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                <td className="px-10 py-8">
                  <div className={cn("flex items-center gap-5", isRtl && "flex-row-reverse")}>
                     <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-border/60 shadow-xl shadow-black/5">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     </div>
                     <div className={cn("flex flex-col", isRtl && "items-end")}>
                        <span className="text-base font-black tracking-tight text-foreground">{item.name}</span>
                        <div className={cn("flex items-center gap-1.5 mt-0.5", isRtl && "flex-row-reverse")}>
                           <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{dictionary.performance.delivery}</span>
                           <span className="text-[10px] font-black text-muted-foreground/70 uppercase">{item.delivery}</span>
                        </div>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                   <div className="flex w-[200px] flex-col gap-2.5">
                      <div className={cn("flex items-center justify-between", isRtl && "flex-row-reverse")}>
                         <span className="text-[12px] font-black tabular-nums">{item.soldPercent}%</span>
                         <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{dictionary.performance.sold}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                         <div 
                           className="h-full bg-[var(--workspace-highlight)] transition-all duration-1000 ease-out" 
                           style={{ width: `${item.soldPercent}%` }} 
                         />
                      </div>
                   </div>
                </td>
                <td className={cn("px-10 py-8 text-xl font-black tracking-tighter tabular-nums", isRtl && "text-right")}>
                   {item.leads}
                </td>
                <td className={cn("px-10 py-8", isRtl && "text-right")}>
                   <div className="flex items-center gap-1.5 text-emerald-500">
                      <span className="text-lg font-black tabular-nums">+{item.appreciation}%</span>
                   </div>
                </td>
                <td className="px-10 py-8 text-right">
                   <Link 
                     href={`/ws/projects/${item.id}`}
                     className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background text-muted-foreground transition hover:border-foreground hover:shadow-xl hover:text-foreground"
                   >
                      <ArrowUpRight className="h-5 w-5" />
                   </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
