"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Eye,
  MapPin,
  PencilLine,
  Users,
} from "lucide-react";
import { AgDeleteConfirmModal } from "@/app/(ws)/ws/public";
import type { WorkspaceProject } from "../../types/projectTypes";
import ProjectUnitsManager from "./ProjectUnitsManager";
import type { ProjectMutationActionResult } from "../ProjectsPage/actionTypes";
import type { ProjectAnalyticsEventType } from "@/server/contracts/properties";

const publicationLabels: Record<WorkspaceProject["publicationState"], string> = {
  draft: "مسودة",
  published: "منشور",
  archived: "مؤرشف",
};

const publicationTone: Record<WorkspaceProject["publicationState"], string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-800",
  published: "border-emerald-200 bg-emerald-50 text-emerald-800",
  archived: "border-border bg-muted/60 text-muted-foreground",
};



/**
 * WHY:   The project detail surface should feel owner-first, lighter, and easier to scan while still preserving shared-viewer safety.
 * WHAT:  Renders the redesigned project detail page with a clean hero, gallery, focused fact/access sections, and tracked owner actions.
 * HOW:   Tracks page and CTA events through server actions, keeps destructive actions behind a confirmation modal, and conditionally reveals owner-only controls.
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
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isSharedReadOnly = project.accessMode === "shared";
  const projectDocuments = project.assets.filter((asset) => asset.kind === "pdf");
  const visibilityLabel =
    project.visibility.clientVisibility === "public" ? "مرئي للعميل والـ AI" : "داخلي داخل مساحة العمل";
  const accessLabel = isSharedReadOnly ? "مشاهدة فقط" : "إدارة المشروع";

  useEffect(() => {
    void onTrackProjectEvent?.({
      eventType: "project_detail_view",
      source: "project_detail_page",
    });
  }, [onTrackProjectEvent, project.id]);

  return (
    <div className="min-h-full bg-background pb-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--workspace-border)] pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/ws/projects"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-muted-foreground transition hover:bg-[var(--workspace-highlight)] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              العودة للمشاريع
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-bold ${publicationTone[project.publicationState]}`}>
              {publicationLabels[project.publicationState]}
            </span>
            {project.canEdit ? (
              <Link
                href={`/ws/projects/${project.id}/edit`}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-panel)] px-4 text-[12px] font-bold transition hover:bg-muted shadow-sm"
              >
                <PencilLine className="h-3.5 w-3.5" />
                تعديل المشروع
              </Link>
            ) : null}
            <Link
              href={`/ws/projects/${project.id}/analytics`}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-panel)] px-4 text-[12px] font-bold transition hover:bg-muted shadow-sm"
            >
              <Eye className="h-3.5 w-3.5" />
              تحليل المشروع
            </Link>
          </div>
        </nav>

        {actionError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-right text-[13px] font-bold text-rose-700">
            {actionError}
          </div>
        ) : null}

        <div className="mb-4 mt-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              {project.image ? (
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--workspace-border)]">
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-panel)]">
                  <Building2 className="h-7 w-7 text-muted-foreground/50" />
                </div>
              )}
              <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tight text-foreground">{project.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 text-[12px] font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-panel)] px-3 py-1">
                <Users className="h-3.5 w-3.5" />
                {project.visibility.viewers.length} {isSharedReadOnly ? "Only Access" : "Viewers"}
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-panel)] px-3 py-1">
                <Building2 className="h-3.5 w-3.5" />
                {project.units.length} Units
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 w-full">
           <ProjectUnitsManager 
             projectId={project.id} 
             initialUnits={project.units} 
             projectImage={project.image}
             projectLocation={project.location}
           />
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
