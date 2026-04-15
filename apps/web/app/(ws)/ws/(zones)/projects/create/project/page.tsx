"use client";

import ProjectFormScreen from "../../shared/forms/ProjectFormScreen";
import { useMutation } from "convex/react";
import { api } from "@/lib/convexApi";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";

export default function CreateProjectPage() {
  const createProperty = useMutation(api.partnerProperties.createWorkspaceProperty);
  const { dictionary } = useWebLocale();

  return (
    <ProjectFormScreen
      title={dictionary.projects.createProjectHeadline}
      description={dictionary.projects.createProjectDesc}
      submitLabel={dictionary.projects.create}
      onSave={async (data) => {
        const result = await createProperty(data as any);
        return { ok: true, redirectTo: `/ws/projects/${result.propertyId}` };
      }}
    />
  );
}
