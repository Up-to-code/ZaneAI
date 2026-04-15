"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import FilterChipBar from "../../../../_components/Visuals/FilterChipBar";
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
  const { dictionary } = useWebLocale();
  const [projects] = useState(initialProjects);
  const [filterKey, setFilterKey] = useState("all");

  const filteredProjects = useMemo(
    () =>
      projects.filter((project: WorkspaceProject) => {
        if (filterKey === "all") return true;
        if (filterKey === "linked") return project.brokers.some((broker: any) => broker.state === "client-linked");
        if (filterKey === "idle") return project.brokers.some((broker: any) => broker.state === "idle");
        if (filterKey === "empty") return project.brokers.length === 0;
        return true;
      }),
    [projects, filterKey],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-8 lg:px-8 lg:py-10">
      
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center rounded-[32px] border border-[var(--zayon-line)] bg-[var(--zayon-surface)] p-8 dark:border-white/10 dark:bg-black/20">
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-widest text-[var(--zayon-deep)] dark:text-white">
            {dictionary.projects.title}
          </h1>
          <p className="mt-2 max-w-xl text-xs font-medium leading-relaxed tracking-widest text-[var(--zayon-text-muted)] dark:text-white/60">
            {dictionary.projects.description}
          </p>
        </div>
        
        <Link
          href="/ws/projects/create"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--zayon-deep)] px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {dictionary.projects.create}
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        <FilterChipBar
          chips={[
            { key: "all", label: dictionary.projects.all },
            { key: "linked", label: dictionary.projects.linkedClient },
            { key: "idle", label: dictionary.projects.idleBroker },
            { key: "empty", label: dictionary.projects.noBrokers },
          ]}
          activeKey={filterKey}
          onChange={setFilterKey}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectPortfolioCard
              key={project.id}
              project={project}
              onTrackProjectEvent={onTrackProjectEvent}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-2 flex min-h-[40vh] items-center justify-center rounded-[32px] border border-dashed border-[var(--zayon-line)] bg-[var(--zayon-surface)] p-12 text-center dark:border-white/10 dark:bg-black/20">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--zayon-text-muted)] dark:text-white/40">
                 No properties identified within this parameter.
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
