"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { WorkspaceProject } from "../../types/projectTypes";
import type { ProjectAnalyticsEventType } from "@/server/contracts/properties";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import type { WebDictionary } from "@/lib/i18n";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  LineChart,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type ProjectPortfolioCardProps = {
  project: WorkspaceProject;
  onEdit?: () => void;
  onDelete?: () => void;
  onTrackProjectEvent?: (input: {
    id: string;
    eventType: ProjectAnalyticsEventType;
    source: string;
  }) => Promise<{ ok: true }>;
  variant?: "horizontal" | "vertical";
};

function getProjectTypeLabel(projectType: string | undefined, dictionary: WebDictionary): string {
  switch (projectType) {
    case "villas": return dictionary.projects.types.villas;
    case "apartments": return dictionary.projects.types.apartments;
    case "land_plots": return dictionary.projects.types.land_plots;
    case "mixed": return dictionary.projects.types.mixed;
    case "custom": return dictionary.projects.types.custom;
    default: return dictionary.projects.types.fallback;
  }
}

export default function ProjectPortfolioCard({
  project,
  onEdit,
  onDelete,
  onTrackProjectEvent,
  variant = "vertical",
}: ProjectPortfolioCardProps) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const projectTypeLabel = getProjectTypeLabel(project.projectType, dictionary);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "group overflow-hidden rounded-[32px] border border-border bg-gradient-to-br from-foreground/[0.01] to-transparent w-full transition-all hover:border-foreground/30 shadow-sm",
        variant === "vertical" ? "flex flex-col" : "flex flex-col lg:flex-row items-stretch min-h-[300px]"
      )}
    >
      {/* Image Hero */}
      <div className={cn(
        "relative overflow-hidden bg-muted/20 shrink-0",
        variant === "vertical" ? "h-64 w-full" : "w-full lg:w-[280px] xl:w-[320px] min-h-[200px]"
      )}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={project.image} 
          alt={project.title} 
          className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
        
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className={cn(
            "absolute top-6 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md",
            isRtl ? "left-6" : "right-6"
          )}
        >
          {projectTypeLabel}
        </motion.div>
      </div>
 
      {/* Content */}
      <div className="flex flex-1 flex-col p-6 gap-6 justify-between">
        <div className="flex flex-col gap-6">
          <div className={cn(
            "flex flex-col gap-4",
            variant === "horizontal" ? "xl:flex-row xl:items-start xl:justify-between" : ""
          )}>
            <div className="flex flex-col gap-2 flex-1">
               <h2 className="text-[24px] lg:text-[28px] font-black tracking-tighter text-foreground leading-tight transition-colors line-clamp-1 uppercase leading-none">{project.title}</h2>
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  <MapPin className="h-3 w-3" />
                  <span>{project.location}</span>
               </div>
            </div>
            
            <div className={cn(
               "flex items-center gap-3 shrink-0",
               variant === "horizontal" ? "xl:items-center" : "items-start"
            )}>
               <div className={cn(
                 "flex flex-col gap-1",
                 variant === "horizontal" ? "xl:items-end" : "items-start"
               )}>
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{dictionary.projects.averagePrice}</span>
                 <div className="text-[22px] font-black text-foreground tabular-nums tracking-tighter leading-none">{project.priceLabel}</div>
               </div>

               <DropdownMenu>
                 <DropdownMenuTrigger
                   render={(
                     <button className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/[0.08] transition hover:bg-foreground/[0.04] active:scale-95">
                       <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                     </button>
                   )}
                 />
                 <DropdownMenuContent align={isRtl ? "start" : "end"} className="min-w-[200px] p-2 rounded-2xl border border-border bg-popover shadow-2xl animate-in fade-in zoom-in-95">
                   {onEdit && (
                     <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-foreground/[0.03] transition-colors cursor-pointer">
                       <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                       <span>{isRtl ? "تعديل المشروع" : "EDIT PORTFOLIO"}</span>
                     </DropdownMenuItem>
                   )}
                   <DropdownMenuSeparator className="my-1 bg-foreground/[0.05]" />
                   {onDelete && (
                     <DropdownMenuItem 
                      onClick={onDelete} 
                      variant="destructive"
                      className="flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                     >
                       <Trash2 className="h-3.5 w-3.5" />
                       <span>{isRtl ? "حذف المشروع" : "DELETE PORTFOLIO"}</span>
                     </DropdownMenuItem>
                   )}
                 </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Key Portfolio Metrics - Institutional Style */}
          <div className="flex flex-wrap items-center gap-10">
            {typeof project.expectedUnits === "number" && (
               <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">{dictionary.projects.totalUnits}</span>
                  <div className="text-[18px] font-black text-foreground tabular-nums leading-none">
                    {project.expectedUnits} <span className="text-[10px] opacity-20 ml-0.5">UNITS</span>
                  </div>
               </div>
            )}
            {typeof project.installmentYears === "number" && (
               <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">{dictionary.projects.installments}</span>
                  <div className="text-[18px] font-black text-foreground leading-none">
                    {project.installmentYears} <span className="text-[10px] opacity-20 ml-0.5 uppercase">{dictionary.projects.years.split(' ').pop()}</span>
                  </div>
               </div>
            )}
            <div className="flex flex-col gap-1.5">
               <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">{isRtl ? "الحالة" : "STATUS"}</span>
               <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[13px] font-black text-emerald-600 uppercase tracking-[0.1em] leading-none">Active</span>
               </div>
            </div>
          </div>

          {(project.shortDescription || project.summary) && (
            <p className={cn(
              "text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-2 max-w-xl",
              isRtl ? "text-right" : "text-left"
            )}>
              {project.shortDescription || project.summary}
            </p>
          )}
        </div>

        {/* Actions Row - Institutional Layout (Unified) */}
        <div className="flex flex-col pt-8 border-t border-border/50">
          <Link 
            href={`/ws/projects/${project.id}`}
            onClick={() => {
              void onTrackProjectEvent?.({
                id: project.id,
                eventType: "project_analyze_click",
                source: "projects_list_card",
              });
            }}
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4.5 text-[11px] font-black uppercase tracking-[0.3em] text-background shadow-md shadow-foreground/5 transition-all hover:bg-foreground/90 hover:shadow-lg hover:shadow-foreground/10 active:scale-[0.98]"
            >
              <span>{isRtl ? "عرض المحفظة" : "OPEN ASSETS"}</span>
              <ChevronRight className={cn("h-4 w-4", isRtl ? "rotate-180" : "")} />
            </motion.button>
          </Link>

          <div className="flex items-center justify-center gap-2 mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
            <span>Portfolio Security Scan</span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

import { cn } from "@/lib/i18n";
import { MapPin } from "lucide-react";
