"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  MapPin,
  PencilLine,
  Play,
  LayoutGrid,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/i18n";
import { AgDeleteConfirmModal } from "@/app/(ws)/ws/public";
import type { WorkspaceProject } from "../../types/projectTypes";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import ProjectUnitsManager from "./ProjectUnitsManager";
import type { ProjectMutationActionResult } from "../ProjectsPage/actionTypes";
import type { ProjectAnalyticsEventType } from "@/server/contracts/properties";

const publicationLabels: Record<WorkspaceProject["publicationState"], string> = {
  draft: "مسودة",
  published: "منشور",
  archived: "مؤرشف",
};

const publicationTone: Record<WorkspaceProject["publicationState"], string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-400",
  published: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400",
  archived: "border-border bg-muted/60 text-muted-foreground",
};

/**
 * WHY:   The project detail surface should feel owner-first, lighter, and easier to scan.
 * WHAT:  Renders the redesigned project detail page with 'Normal' human-scale sizing.
 * HOW:   Linear flow: Header -> Gallery -> Metrics -> Units. Uses standard typography (text-3xl/4xl) and compact spacing.
 */
export default function ProjectDetailPage({
  project,
  onPublishProject,
  onDeleteProject,
  onTrackProjectEvent,
}: {
  project: WorkspaceProject;
  onPublishProject?: () => Promise<ProjectMutationActionResult>;
  onDeleteProject?: () => Promise<ProjectMutationActionResult>;
  onTrackProjectEvent?: (input: {
    eventType: ProjectAnalyticsEventType;
    source: string;
  }) => Promise<{ ok: true }>;
}) {
  const router = useRouter();
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    void onTrackProjectEvent?.({
      eventType: "project_detail_view",
      source: "project_detail_page",
    });
  }, [onTrackProjectEvent, project.id]);

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-10 lg:px-12 lg:py-16">
        
        {/* ── Institutional Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Link
              href="/ws/projects"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 transition hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>{isRtl ? "العودة للمشاريع" : "BACK TO PROJECTS"}</span>
            </Link>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--workspace-highlight)]">
                  <MapPin className="h-3 w-3" />
                  <span>{project.location}</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">{project.title}</h1>
               <div className="flex flex-wrap gap-2 mt-1">
                  {project.amenities?.slice(0, 4).map((amenity) => (
                    <span key={amenity} className="rounded-full border border-[var(--workspace-border)] px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{amenity}</span>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
             <span className={cn(
               "rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-widest",
               publicationTone[project.publicationState]
             )}>
                {publicationLabels[project.publicationState]}
             </span>
             <div className="h-8 w-px bg-[var(--workspace-border)] mx-1 hidden lg:block" />
             <div className="flex items-center gap-2">
               {project.canEdit && (
                 <Link
                   href={`/ws/projects/${project.id}/edit`}
                   className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                   title="تعديل المشروع"
                 >
                   <PencilLine className="h-4 w-4" />
                 </Link>
               )}
             </div>
          </div>
        </div>

        {actionError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/20 px-6 py-4 text-right text-[13px] font-bold text-rose-700 animate-in fade-in slide-in-from-top-2">
            {actionError}
          </div>
        )}

        {/* ── Cinematic Hero Gallery ── */}
        <div className="relative h-[420px] w-full overflow-hidden rounded-[32px] border border-[var(--workspace-border)] group">
          <img 
            src={project.image} 
            alt={project.title} 
            className="h-full w-full object-cover transition-transform duration-[1.5s]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className={cn(
            "absolute bottom-8 flex items-center gap-3 px-8 w-full",
            isRtl ? "flex-row-reverse" : "flex-row"
          )}>
               <button className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 px-7 py-3.5 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-white/20 active:scale-95">
                  <Play className="h-4 w-4 fill-white" />
                  <span>{isRtl ? "جولة فيديو" : "VIDEO TOUR"}</span>
               </button>
               <button className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 px-7 py-3.5 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-white/20 active:scale-95">
                  <LayoutGrid className="h-4 w-4" />
                  <span>{isRtl ? "المعرض" : "GALLERY"}</span>
               </button>
          </div>
        </div>

        {/* ── Luxury Metrics Scorecard ── */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 border border-foreground/[0.08] rounded-[24px] bg-gradient-to-br from-foreground/[0.02] to-transparent overflow-hidden">
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-foreground/[0.05]">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">STARTING PRICE</span>
              <span className="text-[28px] font-black tracking-tighter text-foreground tabular-nums">{project.priceLabel}</span>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-foreground/[0.05]">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">TOTAL INVENTORY</span>
              <span className="text-[28px] font-black tracking-tighter text-foreground tabular-nums">{project.units.length} <span className="text-[12px] text-muted-foreground/30 font-bold uppercase ml-1">Assets</span></span>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-foreground/[0.05]">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">ASSET CAPACITY</span>
              <span className="text-[28px] font-black tracking-tighter text-foreground tabular-nums">{project.expectedUnits || "0"}</span>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 bg-foreground/[0.02]">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--workspace-highlight)] opacity-50">PORTFOLIO STATUS</span>
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[14px] font-black text-emerald-600 uppercase tracking-[0.1em] leading-none">Operational</span>
              </div>
           </div>
        </div>

        {/* ── Units Catalog Section ── */}
        <div className="flex flex-col gap-10 mt-12">
           <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
                 {isRtl ? "كتالوج الوحدات" : "Inventory Catalog"}
              </h2>
              <p className="text-[15px] font-medium text-muted-foreground max-w-xl leading-relaxed opacity-70">
                 {isRtl 
                   ? "إدارة وتحليل وتتبع أداء جميع الوحدات العقارية الفردية ضمن محفظة هذا المشروع."
                   : "Manage, analyze, and track performance of all individual real estate products within this project portfolio."}
              </p>
           </div>
           
           <div className="pt-4">
              <ProjectUnitsManager 
                projectId={project.id} 
                initialUnits={project.units} 
                projectImage={project.image}
                projectLocation={project.location}
              />
           </div>
        </div>
      </div>

      <AgDeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (!onDeleteProject) return;
          startTransition(async () => {
            setActionError(null);
            const result = await onDeleteProject();
            if (!result.ok) {
              setActionError(result.message);
              setDeleteOpen(false);
              return;
            }
            setDeleteOpen(false);
            router.push("/ws/projects");
          });
        }}
        title={`حذف المشروع: ${project.title}`}
        description="سيتم حذف المشروع من مساحة العمل الحالية."
        confirmLabel="حذف المشروع"
      />
    </div>
  );
}
