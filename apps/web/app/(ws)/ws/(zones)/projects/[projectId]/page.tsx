"use client";

import { use } from "react";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { getDemoProject } from "../../../_lib/demoData";
import type { Id } from "@convex/dataModel";

type WorkspaceProjectDetailRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default function WorkspaceProjectDetailRoute({
  params,
}: WorkspaceProjectDetailRouteProps) {
  const { projectId } = use(params);
  const demoProject = getDemoProject(projectId);
  const liveProject = useQuery(
    api.partnerProperties.getWorkspaceProperty,
    demoProject ? "skip" : { propertyId: projectId as Id<"projects"> },
  );
  const publishProperty = useMutation(api.partnerProperties.setWorkspacePropertyPublicationState);
  const deleteProperty = useMutation(api.partnerProperties.deleteWorkspaceProperty);
  const project = demoProject ?? liveProject;

  if (project === undefined) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="text-2xl font-black text-foreground">Loading property...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="text-2xl font-black text-foreground">Property not found</div>
        </div>
      </div>
    );
  }

  return (
    <ProjectDetailPage
      project={project}
      onPublishProject={async () => {
        if (demoProject) {
          return { ok: true, redirectTo: `/ws/projects/${projectId}` };
        }
        await publishProperty({ propertyId: projectId as Id<"projects">, publicationState: "published" });
        return { ok: true, redirectTo: `/ws/projects/${projectId}` };
      }}
      onDeleteProject={async () => {
        if (demoProject) {
          return { ok: true, redirectTo: "/ws/projects" };
        }
        await deleteProperty({ propertyId: projectId as Id<"projects"> });
        return { ok: true, redirectTo: "/ws/projects" };
      }}
      onTrackProjectEvent={async () => ({ ok: true })}
    />
  );
}
