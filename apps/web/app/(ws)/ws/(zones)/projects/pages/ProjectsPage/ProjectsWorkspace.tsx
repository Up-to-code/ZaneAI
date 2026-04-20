"use client";

import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
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
    <div dir={isRtl ? "rtl" : "ltr"} className="flex w-full flex-col gap-6 px-6 py-6 lg:px-8 lg:py-8">
      
      {/* ── Header: Portfolio Engine ── */}
      <div className="mb-10 flex flex-col justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--zane-ai-line)] bg-white/5 dark:border-white/10 dark:bg-black">
            <Building2 className="h-5 w-5 text-[var(--zane-ai-accent)]" />
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
              {dictionary.projects.portfolioManagement}
            </div>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-4xl">
              {dictionary.projects.title}
            </h1>
            <p className={`mt-4 max-w-2xl text-[12px] font-medium leading-relaxed tracking-wider text-[var(--zane-ai-text-muted)] dark:text-white/50 ${isRtl ? "text-right" : "text-left"}`}>
              {dictionary.projects.description}
            </p>
          </div>
        </div>
        
        <Link
          href="/ws/projects/create"
          className="group flex w-full items-center justify-between rounded-2xl border border-[var(--zane-ai-deep)] bg-transparent px-6 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-deep)] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black lg:w-[240px]"
        >
          {dictionary.projects.create}
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        </Link>
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
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectPortfolioCard
                key={project.id}
                project={project}
                onTrackProjectEvent={onTrackProjectEvent}
              />
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-2 flex min-h-[40vh] items-center justify-center rounded-[32px] border border-dashed border-[var(--zane-ai-line)] bg-[var(--zane-ai-surface)] p-12 text-center dark:border-white/10 dark:bg-black/20">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
                   {dictionary.projects.noProjectsFound}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
             <>
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
                    />
                  ))}
                  {allUnits.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
                         {dictionary.projects.noUnitsFound}
                      </span>
                    </div>
                  )}
               </>
          </div>
        )}
      </div>

    </div>
  );
}
