"use client";

import { use } from "react";
import type { ProjectFormData } from "@/app/(ws)/ws/public";
import ProjectFormScreen from "../../shared/forms/ProjectFormScreen";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { getDemoProject } from "../../../../_lib/demoData";
import type { Id } from "@convex/dataModel";
import type { WorkspaceProject } from "../../types/projectTypes";

type EditProjectRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

function mapProjectToFormData(project: WorkspaceProject) {
  return {
    name: project.title,
    price: project.priceLabel,
    location: project.location,
    description: project.summary,
    shortDescription: project.shortDescription,
    amenitiesText: project.amenities.join("\n"),
    hasParking: project.parking.hasParking,
    parkingSpaces: String(project.parking.spaces ?? ""),
    coverImageKey: project.gallery.coverImageKey,
    galleryDisplayMode: project.gallery.displayMode,
    galleryAspectRatio: project.gallery.aspectRatio,
    privatePermitSummary: project.permit.privateSummary ?? "",
    privatePermitFiles: project.permit.privateFiles,
    rooms: project.specs.rooms,
    baths: project.specs.baths,
    area: project.specs.area,
    status: project.specs.status,
    clientVisibility: project.visibility.clientVisibility,
    images: project.galleryImages,
    video: null,
    brokerId: project.brokers[0]?.id ?? null,
    visibilityMembers: project.visibility.viewers,
  } satisfies Partial<ProjectFormData>;
}

export default function EditProjectRoute({ params }: EditProjectRouteProps) {
  const { projectId } = use(params);
  const demoProject = getDemoProject(projectId);
  const liveProject = useQuery(
    api.partnerProperties.getWorkspaceProperty,
    demoProject ? "skip" : { propertyId: projectId as Id<"projects"> },
  );
  const updateProperty = useMutation(api.partnerProperties.updateWorkspaceProperty);
  const deleteProperty = useMutation(api.partnerProperties.deleteWorkspaceProperty);
  const project = demoProject ?? liveProject;

  if (project === undefined) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="text-2xl font-black text-foreground">Loading property editor...</div>
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
    <ProjectFormScreen
      projectId={projectId}
      initialData={mapProjectToFormData(project)}
      title="Edit property"
      description="Update the partner record, revise the media pack, and keep publishing under your control."
      submitLabel="Save property"
      onSave={async (data) => {
        if (demoProject) {
          return { ok: true, redirectTo: `/ws/projects/${projectId}` };
        }
        await updateProperty({
          propertyId: projectId as Id<"projects">,
          data,
        });
        return { ok: true, redirectTo: `/ws/projects/${projectId}` };
      }}
      onDelete={async () => {
        if (!demoProject) {
          await deleteProperty({ propertyId: projectId as Id<"projects"> });
        }
        return { redirectTo: "/ws/projects" };
      }}
    />
  );
}
