"use client";

import ProjectDetailPage from "../pages/ProjectDetailPage";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";

type WorkspaceProjectDetailRouteProps = {
  params: {
    projectId: string;
  };
};

export default function WorkspaceProjectDetailRoute({
  params,
}: WorkspaceProjectDetailRouteProps) {
  const project = useQuery(api.partnerProperties.getWorkspaceProperty, { propertyId: params.projectId as any });
  const publishProperty = useMutation(api.partnerProperties.setWorkspacePropertyPublicationState);
  const deleteProperty = useMutation(api.partnerProperties.deleteWorkspaceProperty);

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
        await publishProperty({ propertyId: params.projectId as any, publicationState: "published" });
        return { ok: true, redirectTo: `/ws/projects/${params.projectId}` };
      }}
      onDeleteProject={async () => {
        await deleteProperty({ propertyId: params.projectId as any });
        return { ok: true, redirectTo: "/ws/projects" };
      }}
      onTrackProjectEvent={async () => ({ ok: true })}
    />
  );
}
