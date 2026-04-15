"use client";

import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
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
    <div className="mx-auto flex w-full max-w-[1500px] flex-col px-6 py-10 lg:px-16 lg:py-16">
      
      {/* ── Header: Portfolio Engine ── */}
      <div className="mb-12 flex flex-col justify-between gap-10 lg:mb-20 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--zane-ai-line)] bg-white/5 dark:border-white/10 dark:bg-black">
            <Building2 className="h-6 w-6 text-[var(--zane-ai-accent)]" />
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">Portfolio Management</div>
            <h1 className="mt-2 text-5xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-7xl">
              {dictionary.projects.title}
            </h1>
            <p className="mt-8 max-w-2xl text-[13px] font-medium leading-relaxed tracking-widest text-[var(--zane-ai-text-muted)] dark:text-white/50">
              {dictionary.projects.description}
            </p>
          </div>
        </div>
        
        <Link
          href="/ws/projects/create"
          className="group flex w-full items-center justify-between rounded-2xl border border-[var(--zane-ai-deep)] bg-transparent px-8 py-5 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-deep)] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black lg:w-[280px]"
        >
          {dictionary.projects.create}
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
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
            <div className="col-span-2 flex min-h-[40vh] items-center justify-center rounded-[32px] border border-dashed border-[var(--zane-ai-line)] bg-[var(--zane-ai-surface)] p-12 text-center dark:border-white/10 dark:bg-black/20">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
                 No properties identified within this parameter.
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
