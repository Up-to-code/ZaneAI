"use client";

import CreateOfferForm from "../../shared/forms/CreateOfferForm";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import type { OfferPropertyOption } from "../../types/offerTypes";
import { use } from "react";
import { notFound } from "next/navigation";

type WorkspaceOfferEditRouteProps = {
  params: Promise<{ offerId: string }>;
};

type WorkspacePropertyListItem = {
  id: string;
  title: string;
  location: string;
  image: string;
  priceLabel: string;
  shortDescription?: string;
  publicationState: string;
};

/**
 * WHY:   Draft offer edit routes need real data from the backend.
 * WHAT:  Currently shows a placeholder until a real offers query is built.
 * HOW:   Loads projects from Convex, but offer data will come from a future offers query.
 */
export default function WorkspaceOfferEditRoute({
  params,
}: WorkspaceOfferEditRouteProps) {
  const { offerId } = use(params);
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState);
  const projects = useQuery(api.partnerProperties.listWorkspaceProperties);

  if (workspaceState === undefined || projects === undefined) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!offerId) {
    notFound();
  }

  const properties: OfferPropertyOption[] = (projects ?? []).map((project: WorkspacePropertyListItem) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    image: project.image,
    expectedPrice: project.priceLabel,
    shortDescription: project.shortDescription,
    publicationState: project.publicationState,
  }));

  async function updateOffer() {
    return { redirectTo: `/ws/offers/${offerId}` };
  }

  const audience = (workspaceState.audience as "broker" | "developer") ?? "developer";
  const organization = workspaceState.organization ?? {
    id: "",
    name: "",
    slug: "",
    type: "developer",
    status: "active",
    description: "",
    website: "",
    contactEmail: "",
    phone: "",
  };

  return (
    <CreateOfferForm
      properties={properties}
      audience={audience}
      organization={organization}
      pageTitle="تعديل مسودة العرض"
      pageDescription="حدّث العرض المنشور باسم المنظمة، سواء كان عرض عقار أو مشاركة موجّهة أو طلب عميل."
      submitLabel="استعراض المسودة"
      backHref={`/ws/offers/${offerId}`}
      initialData={{}}
      onSubmit={updateOffer}
    />
  );
}
