"use client";

import { useMutation, useQuery } from "convex/react";
import ProjectsPage from "./pages/ProjectsPage";
import { api } from "@/lib/convexApi";

/**
 * WHY:   The projects root route should remain visually rich after removing the live property backend.
 * WHAT:  Renders the existing projects workspace with deterministic project fixtures.
 * HOW:   Supplies the same view-model shape as before, but sourced locally from demo data.
 */
export default function WorkspaceProjectsRoute() {
  const projects = useQuery(api.partnerProperties.listWorkspaceProperties, {});
  const publishProperty = useMutation(api.partnerProperties.setWorkspacePropertyPublicationState);
  const deleteProperty = useMutation(api.partnerProperties.deleteWorkspaceProperty);

  if (!projects) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="text-2xl font-black text-foreground">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <ProjectsPage
      projects={projects}
      onDeleteProject={async (projectId) => {
        await deleteProperty({ propertyId: projectId as any });
        return { ok: true, redirectTo: "/ws/projects" };
      }}
      onPublishProject={async (projectId) => {
        await publishProperty({ propertyId: projectId as any, publicationState: "published" });
        return { ok: true, redirectTo: `/ws/projects/${projectId}` };
      }}
      onTrackProjectEvent={async () => ({ ok: true })}
    />
  );
}
