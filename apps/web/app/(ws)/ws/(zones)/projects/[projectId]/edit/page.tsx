"use client";

import type { ProjectFormData } from "@/app/(ws)/ws/public";
import ProjectFormScreen from "../../shared/forms/ProjectFormScreen";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";

type EditProjectRouteProps = {
  params: {
    projectId: string;
  };
};

type WorkspaceProjectForForm = any;

function mapProjectToFormData(project: WorkspaceProjectForForm) {
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
  const project = useQuery(api.partnerProperties.getWorkspaceProperty, { propertyId: params.projectId as any });
  const updateProperty = useMutation(api.partnerProperties.updateWorkspaceProperty);
  const deleteProperty = useMutation(api.partnerProperties.deleteWorkspaceProperty);

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
      projectId={params.projectId}
      initialData={mapProjectToFormData(project)}
      title="Edit property"
      description="Update the partner record, revise the media pack, and keep publishing under your control."
      submitLabel="Save property"
      onSave={async (data) => {
        await updateProperty({
          propertyId: params.projectId as any,
          data: data as any,
        });
        return { ok: true, redirectTo: `/ws/projects/${params.projectId}` };
      }}
      onDelete={async () => {
        await deleteProperty({ propertyId: params.projectId as any });
        return { redirectTo: "/ws/projects" };
      }}
    />
  );
}
