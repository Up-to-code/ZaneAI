import { notFound } from "next/navigation";
import type { ProjectFormData } from "@/app/(ws)/ws/public";

/**
 * WHY:   The legacy project-edit loader is still referenced by tests and auxiliary imports.
 * WHAT:  Returns a minimal edit payload shape — real data is now loaded client-side via Convex.
 * HOW:   This loader is effectively a stub; the edit page.tsx now uses useQuery directly.
 */
export async function loadEditProjectPageState(projectId: string) {
  if (!projectId) {
    notFound();
  }

  const initialData: Partial<ProjectFormData> = {
    name: "",
    location: "",
    description: "",
  };

  return {
    actionArgs: { audience: "developer" as const, ownerContext: null, projectId },
    description: "تعديل البيانات والصور.",
    initialData,
    title: "تعديل المشروع",
  };
}
