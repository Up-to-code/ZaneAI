"use client";

import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";
import FilterChipBar from "../../../../_components/Visuals/FilterChipBar";
import AgUnitCard from "@/app/(ws)/ws/_components/Visuals/AgUnitCard";
import type { WorkspaceProject } from "../../types/projectTypes";
import type { ProjectMutationActionResult } from "./actionTypes";
import type { ProjectAnalyticsEventType } from "@/server/contracts/properties";
import ProjectPortfolioCard from "./ProjectPortfolioCard";

type ProjectsWorkspaceProps = {
  initialProjects: WorkspaceProject[];
  onDeleteProject?: (projectId: string) => Promise<ProjectMutationActionResult>;
  onPublishProject?: (projectId: string) => Promise<ProjectMutationActionResult>;
  onTrackProjectEvent?: (input: {
    id: string;
    eventType: ProjectAnalyticsEventType;
    source: string;
  }) => Promise<{ ok: true }>;
};

export default function ProjectsWorkspace({
  initialProjects,
  onDeleteProject,
  onPublishProject,
  onTrackProjectEvent,
}: ProjectsWorkspaceProps) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const [projects] = useState(initialProjects);
  const [filterKey, setFilterKey] = useState("projects"); // Default to projects view

  const allUnits = useMemo(
    () =>
      projects.flatMap((project) =>
        project.units.map((unit) => ({
          ...unit,
          projectId: project.id,
          projectTitle: project.title,
          projectImage: project.image,
        })),
      ),
    [projects],
  );

  const filteredProjects = useMemo(() => projects, [projects]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="flex w-full flex-col gap-8 px-6 py-10 lg:px-12 lg:py-16 bg-background min-h-screen">
      
      {/* ── Institutional Header: Portfolio ── */}
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-5">
           <div className="flex items-center gap-2.5">
             <div className="h-px w-8 bg-foreground/20" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">
               {dictionary.projects.portfolioManagement}
             </span>
           </div>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
             {dictionary.projects.title}
           </h1>
           <p className={cn(
             "max-w-2xl text-[15px] font-medium leading-relaxed text-muted-foreground/50",
             isRtl ? "text-right" : "text-left"
           )}>
             {dictionary.projects.description}
           </p>
        </div>
        
        <Link
          href="/ws/projects/create"
          className="group flex h-14 w-full items-center justify-between rounded-full bg-foreground px-10 text-[11px] font-black uppercase tracking-[0.2em] text-background transition-all hover:scale-[1.02] active:scale-[0.98] lg:w-[280px]"
        >
          <span>{dictionary.projects.create}</span>
          <Plus className="h-4 w-4" strokeWidth={4} />
        </Link>
      </div>

      {/* ── Portfolio Aggregate Scorecard ── */}
      <div className="flex flex-col lg:flex-row items-stretch gap-0 border border-border rounded-[28px] bg-gradient-to-br from-foreground/[0.03] to-transparent overflow-hidden shadow-sm">
         <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">TOTAL PORTFOLIO</span>
            <span className="text-[32px] font-black tracking-tighter text-foreground tabular-nums leading-none">{projects.length} <span className="text-[12px] text-muted-foreground/30 font-bold uppercase ml-1">Projects</span></span>
         </div>
         <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">AGGREGATE INVENTORY</span>
            <span className="text-[32px] font-black tracking-tighter text-foreground tabular-nums leading-none">{allUnits.length} <span className="text-[12px] text-muted-foreground/30 font-bold uppercase ml-1">Assets</span></span>
         </div>
         <div className="flex-1 flex flex-col gap-2 p-8 bg-foreground/[0.01]">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">PORTFOLIO STATUS</span>
            <div className="flex items-center gap-3">
               <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
               <span className="text-[16px] font-black text-emerald-600 uppercase tracking-[0.15em] leading-none">Operational</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-8">
        <FilterChipBar
          chips={[
            { key: "projects", label: dictionary.projects.title },
            { key: "units", label: dictionary.projects.unitsLabel },
          ]}
          activeKey={filterKey}
          onChange={setFilterKey}
        />

        {filterKey === "projects" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <ProjectPortfolioCard
                key={project.id}
                project={project}
                onEdit={() => {}} // Placeholder for now, can link to /edit route
                onDelete={() => onDeleteProject?.(project.id)}
                onTrackProjectEvent={onTrackProjectEvent}
                variant="vertical"
              />
            ))}
            {filteredProjects.length === 0 && (
              <div className="flex min-h-[40vh] items-center justify-center rounded-[48px] border border-dashed border-[var(--workspace-border)] bg-[var(--workspace-panel)]/50 p-12 text-center">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                   {dictionary.projects.noProjectsFound}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allUnits.map((unit) => (
              <AgUnitCard
                key={`${unit.projectId}-${unit.id}`}
                id={unit.id}
                label={unit.label}
                unitType={unit.unitType ?? "apartment"}
                typeLabel={unit.projectTitle}
                floor={unit.floor}
                bedrooms={unit.bedrooms}
                bathrooms={unit.bathrooms}
                area={typeof unit.area === "number" ? `${unit.area}` : unit.area}
                priceLabel={unit.priceLabel}
                status={unit.status ?? "available"}
                statusLabel={unit.status === "available" ? dictionary.units.available : unit.status === "sold" ? dictionary.units.sold : unit.status === "reserved" ? dictionary.units.reserved : undefined}
                image={unit.image ?? unit.projectImage}
                projectId={unit.projectId}
                variant="vertical"
              />
            ))}
            {allUnits.length === 0 && (
              <div className="col-span-full py-12 text-center rounded-[32px] border border-dashed border-border/50">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                  {dictionary.projects.noUnitsFound}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
