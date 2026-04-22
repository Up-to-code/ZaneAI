"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";
import FilterChipBar from "../../../../_components/Visuals/FilterChipBar";
import AgUnitCard from "@/app/(ws)/ws/_components/Visuals/AgUnitCard";
import type { WorkspaceProject } from "../../types/projectTypes";
import type { ProjectMutationActionResult } from "./actionTypes";
import type { ProjectAnalyticsEventType } from "@/server/contracts/properties";
import ProjectPortfolioCard from "./ProjectPortfolioCard";
import AgSearchInput from "@/app/(ws)/ws/_components/AgUi/AgSearchInput";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const lowerQuery = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.developerName?.toLowerCase().includes(lowerQuery) ||
        p.location?.toLowerCase().includes(lowerQuery),
    );
  }, [projects, searchQuery]);

  const filteredUnits = useMemo(() => {
    if (!searchQuery) return allUnits;
    const lowerQuery = searchQuery.toLowerCase();
    return allUnits.filter(
      (u) =>
        u.label.toLowerCase().includes(lowerQuery) ||
        u.projectTitle.toLowerCase().includes(lowerQuery) ||
        u.unitType?.toLowerCase().includes(lowerQuery),
    );
  }, [allUnits, searchQuery]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="flex w-full flex-col gap-6 md:gap-8 px-5 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 bg-background min-h-screen">
      
      {/* ── Institutional Header: Portfolio ── */}
      <div className="flex flex-col justify-between gap-6 md:gap-10 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-4 md:gap-5">
           <div className={cn("flex items-center gap-2.5", isRtl && "flex-row-reverse")}>
             <div className="h-px w-6 md:w-8 bg-foreground/20" />
             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] md:tracking-[0.4em] text-muted-foreground/50">
               {dictionary.projects.portfolioManagement}
             </span>
           </div>
           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground leading-[1] md:leading-[0.9] uppercase">
             {dictionary.projects.title}
           </h1>
           <p className={cn(
             "max-w-xl text-[14px] md:text-[15px] font-medium leading-relaxed text-muted-foreground/50",
             isRtl ? "text-right" : "text-left"
           )}>
             {dictionary.projects.description}
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 lg:w-auto">
          <AgSearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            className="sm:min-w-[280px]"
          />
          <Link
            href="/ws/projects/create"
            className="group flex h-12 w-full items-center justify-between rounded-full bg-foreground px-8 md:px-10 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-background transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-[220px]"
          >
            <span>{dictionary.projects.create}</span>
            <Plus className="h-4 w-4" strokeWidth={4} />
          </Link>
        </div>
      </div>

      {/* ── Portfolio Aggregate Scorecard ── */}
      <div className="flex flex-col lg:flex-row items-stretch gap-0 border border-border rounded-[24px] md:rounded-[28px] bg-gradient-to-br from-foreground/[0.03] to-transparent overflow-hidden shadow-sm">
         <div className="flex-1 flex flex-col gap-1.5 md:gap-2 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border/50">
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{dictionary.projects.totalPortfolio}</span>
            <span className="text-[28px] md:text-[32px] font-black tracking-tighter text-foreground tabular-nums leading-none">{projects.length} <span className="text-[10px] md:text-[12px] text-muted-foreground/30 font-bold uppercase ml-1">{dictionary.projects.title}</span></span>
         </div>
         <div className="flex-1 flex flex-col gap-1.5 md:gap-2 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border/50">
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{dictionary.projects.aggregateInventory}</span>
            <span className="text-[28px] md:text-[32px] font-black tracking-tighter text-foreground tabular-nums leading-none">{allUnits.length} <span className="text-[10px] md:text-[12px] text-muted-foreground/30 font-bold uppercase ml-1">{dictionary.units.title}</span></span>
         </div>
         <div className="flex-1 flex flex-col gap-1.5 md:gap-2 p-6 md:p-8 bg-foreground/[0.01]">
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{dictionary.projects.portfolioStatus}</span>
            <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
               <div className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
               <span className="text-[14px] md:text-[16px] font-black text-emerald-600 uppercase tracking-[0.15em] leading-none">{dictionary.projects.operational}</span>
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
                   {searchQuery ? dictionary.common.noResults || "No matching results" : dictionary.projects.noProjectsFound}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredUnits.map((unit) => (
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
            {filteredUnits.length === 0 && (
              <div className="col-span-full py-12 text-center rounded-[32px] border border-dashed border-border/50">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                  {searchQuery ? dictionary.common.noResults || "No matching results" : dictionary.projects.noUnitsFound}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
