"use client";

import CreateOfferForm from "../shared/forms/CreateOfferForm";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import type { OfferPropertyOption } from "../types/offerTypes";
import { useSearchParams } from "next/navigation";

export default function CreateOfferPage() {
  const params = Object.fromEntries(useSearchParams().entries());
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState);
  const projects = useQuery(api.partnerProperties.listWorkspaceProperties);

  if (workspaceState === undefined || projects === undefined) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading…</div>
      </div>
    );
  }

  const properties: OfferPropertyOption[] = (projects ?? []).map((project: { id: string; title: string; location: string; image: string; priceLabel: string; shortDescription?: string; publicationState: string }) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    image: project.image,
    expectedPrice: project.priceLabel,
    shortDescription: project.shortDescription,
    publicationState: project.publicationState,
  }));

  const propertyId = params.propertyId;
  const mode = params.mode;
  const clientName = params.clientName;
  const clientPhone = params.clientPhone;
  const clientBudget = params.clientBudget;
  const clientBudgetMin = params.clientBudgetMin;
  const clientBudgetMax = params.clientBudgetMax;
  const clientLocation = params.clientLocation;
  const clientArea = params.clientArea;
  const clientBedsMin = params.clientBedsMin;
  const clientBathsMin = params.clientBathsMin;
  const clientSqftMin = params.clientSqftMin;
  const clientSqftMax = params.clientSqftMax;
  const clientNeed = params.clientNeed;

  async function createOffer() {
    return { redirectTo: "/ws/offers" };
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
      simplifiedFieldsOnly
      initialData={{
        propertyId,
        mode: mode === "collaboration_case" ? "collaboration_case" : "open_offer",
        clientName,
        clientPhone,
        clientBudget,
        clientBudgetMin,
        clientBudgetMax,
        title: mode === "collaboration_case" ? clientName : undefined,
        price: mode === "collaboration_case" ? clientBudgetMax ?? clientBudget : undefined,
        clientLocation,
        clientArea,
        clientBedsMin,
        clientBathsMin,
        clientSqftMin,
        clientSqftMax,
        clientNeed,
        description: mode === "collaboration_case" ? clientNeed : undefined,
      }}
      onSubmit={createOffer}
    />
  );
}
