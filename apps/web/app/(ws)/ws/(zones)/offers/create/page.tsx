import CreateOfferForm from "../shared/forms/CreateOfferForm";
import { demoPrimaryOrganization, demoProjects, demoWorkspaceBehavior } from "../../../_lib/demoData";
import type { OfferPropertyOption } from "../types/offerTypes";

export default async function CreateOfferPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const properties: OfferPropertyOption[] = demoProjects.map((project) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    image: project.image,
    expectedPrice: project.priceLabel,
    shortDescription: project.shortDescription,
    publicationState: project.publicationState,
  }));
  const propertyId = Array.isArray(params.propertyId) ? params.propertyId[0] : params.propertyId;
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const clientName = Array.isArray(params.clientName) ? params.clientName[0] : params.clientName;
  const clientPhone = Array.isArray(params.clientPhone) ? params.clientPhone[0] : params.clientPhone;
  const clientBudget = Array.isArray(params.clientBudget) ? params.clientBudget[0] : params.clientBudget;
  const clientBudgetMin = Array.isArray(params.clientBudgetMin) ? params.clientBudgetMin[0] : params.clientBudgetMin;
  const clientBudgetMax = Array.isArray(params.clientBudgetMax) ? params.clientBudgetMax[0] : params.clientBudgetMax;
  const clientLocation = Array.isArray(params.clientLocation) ? params.clientLocation[0] : params.clientLocation;
  const clientArea = Array.isArray(params.clientArea) ? params.clientArea[0] : params.clientArea;
  const clientBedsMin = Array.isArray(params.clientBedsMin) ? params.clientBedsMin[0] : params.clientBedsMin;
  const clientBathsMin = Array.isArray(params.clientBathsMin) ? params.clientBathsMin[0] : params.clientBathsMin;
  const clientSqftMin = Array.isArray(params.clientSqftMin) ? params.clientSqftMin[0] : params.clientSqftMin;
  const clientSqftMax = Array.isArray(params.clientSqftMax) ? params.clientSqftMax[0] : params.clientSqftMax;
  const clientNeed = Array.isArray(params.clientNeed) ? params.clientNeed[0] : params.clientNeed;

  async function createOffer() {
    "use server";
    return { redirectTo: "/ws/offers/offer-1" };
  }

  return (
    <CreateOfferForm
      properties={properties}
      audience={demoWorkspaceBehavior.audience}
      organization={demoPrimaryOrganization}
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
