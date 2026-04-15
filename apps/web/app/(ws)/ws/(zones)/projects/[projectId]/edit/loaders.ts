import { notFound } from "next/navigation";
import type { ProjectFormData } from "@/app/(ws)/ws/public";
import { getDemoProject } from "../../../../_lib/demoData";

/**
 * WHY:   The legacy project-edit loader is still referenced by tests and auxiliary imports.
 * WHAT:  Returns the same edit payload shape using demo project fixtures only.
 * HOW:   Mirrors the static edit page fields so no server zone, session, or Convex access is required.
 */
export async function loadEditProjectPageState(projectId: string) {
  const project = getDemoProject(projectId);

  if (!project) {
    notFound();
  }

  const initialData: Partial<ProjectFormData> = {
    name: project.title,
    location: project.location,
    description: project.summary,
    projectType: "apartments", // Demo fallback
    expectedUnits: "", // Demo fallback
  };

  return {
    actionArgs: { audience: "developer" as const, ownerContext: null, projectId },
    description: `${project.title} — تعديل البيانات والصور.`,
    initialData,
    title: "تعديل المشروع",
  };
}
