import { notFound, redirect } from "next/navigation";
import ClientDetailPage from "../../pages/ClientDetailPage";
import { getDemoCrmClient } from "../../../../_lib/demoData";

type WorkspaceCrmClientDetailRouteProps = {
  params: Promise<{ clientId: string }>;
};

function getCurrentTimestamp() {
  return Number(new Date());
}

/**
 * WHY:   Client detail routes should remain valid in demo mode without the CRM service.
 * WHAT:  Resolves one CRM fixture and renders the existing detail screen.
 * HOW:   Keeps the route contract intact while swapping the data source to local demo records.
 */
export default async function WorkspaceCrmClientDetailRoute({
  params,
}: WorkspaceCrmClientDetailRouteProps) {
  const { clientId } = await params;
  const client = getDemoCrmClient(clientId);

  if (!client) {
    notFound();
  }

  async function updateFollowUp(formData: FormData) {
    "use server";

    const nextFollowUpRaw = String(formData.get("nextFollowUpAt") ?? "").trim();
    if (!nextFollowUpRaw || Number.isNaN(Date.parse(nextFollowUpRaw))) return;

    redirect(`/ws/crm/clients/${clientId}`);
  }

  return (
    <ClientDetailPage
      client={client}
      nowTimestamp={getCurrentTimestamp()}
      onFollowUpSubmit={updateFollowUp}
      editHref={`/ws/crm/clients/${clientId}/edit`}
    />
  );
}
