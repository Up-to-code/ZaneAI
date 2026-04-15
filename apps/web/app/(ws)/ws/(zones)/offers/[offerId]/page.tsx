import { notFound } from "next/navigation";
import OfferDetailPage from "../pages/OfferDetailPage";
import { getDemoOffer } from "../../../_lib/demoData";

/**
 * WHY:   Offer detail routes should still demonstrate the final UI after moving web into demo mode.
 * WHAT:  Renders one static offer detail record with the existing visual page.
 * HOW:   Resolves the offer from local fixtures and omits all live mutations.
 */
export default async function WorkspaceOfferDetailRoute({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  const offer = getDemoOffer(offerId);
  if (!offer) {
    notFound();
  }

  async function archiveDemoOffer() {
    "use server";
    return { redirectTo: "/ws/offers" };
  }

  async function openDemoConversation() {
    "use server";
    return { conversationId: `demo-offer-${offerId}` };
  }

  return (
    <OfferDetailPage
      offer={offer}
      onMessage={openDemoConversation}
      onArchive={offer.canArchive ? archiveDemoOffer : undefined}
      editHref={offer.canEditDraft ? `/ws/offers/${offerId}/edit` : null}
    />
  );
}
