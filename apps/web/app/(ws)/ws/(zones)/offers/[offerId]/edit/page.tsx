import { notFound } from "next/navigation";
import CreateOfferForm from "../../shared/forms/CreateOfferForm";
import { demoPrimaryOrganization, demoProjects, demoWorkspaceBehavior, getDemoOffer } from "../../../../_lib/demoData";
import type { OfferPropertyOption } from "../../types/offerTypes";

type WorkspaceOfferEditRouteProps = {
  params: Promise<{ offerId: string }>;
};

/**
 * WHY:   Draft offer edit routes should remain explorable after removing the live offers zone.
 * WHAT:  Reuses the offers form with fixture-backed initial values and non-persistent actions.
 * HOW:   Loads the offer from local demo data and redirects back into the detail page after previewing changes.
 */
export default async function WorkspaceOfferEditRoute({
  params,
}: WorkspaceOfferEditRouteProps) {
  const { offerId } = await params;
  const properties: OfferPropertyOption[] = demoProjects.map((project) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    image: project.image,
    expectedPrice: project.priceLabel,
    shortDescription: project.shortDescription,
    publicationState: project.publicationState,
  }));
  const offer = getDemoOffer(offerId);

  if (!offer || !offer.canEditDraft) {
    notFound();
  }

  async function updateOffer() {
    "use server";
    return { redirectTo: `/ws/offers/${offerId}` };
  }

  async function archiveOffer() {
    "use server";
    return { redirectTo: "/ws/offers" };
  }

  return (
    <CreateOfferForm
      properties={properties}
      audience={demoWorkspaceBehavior.audience}
      organization={demoPrimaryOrganization}
      pageTitle="تعديل مسودة العرض"
      pageDescription="حدّث العرض المنشور باسم المنظمة، سواء كان عرض عقار أو مشاركة موجّهة أو طلب عميل."
      submitLabel="استعراض المسودة"
      backHref={`/ws/offers/${offerId}`}
      initialData={{
        propertyId: offer.propertyId ?? undefined,
        mode: offer.type,
        title: offer.message ?? "",
        description: offer.description ?? undefined,
        price: String(offer.price),
        allowedAudience: offer.allowedAudience,
        commissionText: offer.commissionText ?? undefined,
        permitStatus: offer.permitStatus ?? undefined,
        productStatus: offer.productStatus ?? undefined,
        clientName: offer.clientContext?.clientName ?? undefined,
        clientPhone: offer.clientContext?.clientPhone ?? undefined,
        clientBudget: offer.clientContext?.clientBudget ?? undefined,
        clientBudgetMin:
          offer.clientContext?.budgetMin != null ? String(offer.clientContext.budgetMin) : undefined,
        clientBudgetMax:
          offer.clientContext?.budgetMax != null ? String(offer.clientContext.budgetMax) : undefined,
        clientLocation: offer.clientContext?.location ?? undefined,
        clientArea: offer.clientContext?.area ?? undefined,
        clientBedsMin:
          offer.clientContext?.bedsMin != null ? String(offer.clientContext.bedsMin) : undefined,
        clientBathsMin:
          offer.clientContext?.bathsMin != null ? String(offer.clientContext.bathsMin) : undefined,
        clientSqftMin:
          offer.clientContext?.sqftMin != null ? String(offer.clientContext.sqftMin) : undefined,
        clientSqftMax:
          offer.clientContext?.sqftMax != null ? String(offer.clientContext.sqftMax) : undefined,
        clientNeed: offer.clientContext?.clientNeed ?? undefined,
        attachments: offer.attachments ?? [],
      }}
      onSubmit={updateOffer}
      onArchive={archiveOffer}
    />
  );
}
