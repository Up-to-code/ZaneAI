import { notFound } from "next/navigation";
import DealFormScreen from "../../../shared/forms/DealFormScreen";
import { demoCrmClients, demoProjects, getDemoCrmClient } from "../../../../../_lib/demoData";

type WorkspaceCrmClientEditRouteProps = {
  params: Promise<{ clientId: string }>;
};

function normalizeFormStage(stage: "new" | "qualified" | "proposal" | "won" | "lost") {
  if (stage === "qualified") return "contacted" as const;
  if (stage === "proposal") return "negotiation" as const;
  return stage;
}

function toDateTimeLocalValue(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * WHY:   CRM edit routes should stay available in the static workspace demo.
 * WHAT:  Reuses the edit form with deterministic client, project, and broker fixtures.
 * HOW:   Performs no persistence and redirects back into the demo detail page after submit/archive.
 */
export default async function WorkspaceCrmClientEditRoute({
  params,
}: WorkspaceCrmClientEditRouteProps) {
  const { clientId } = await params;
  const deal = getDemoCrmClient(clientId);

  if (!deal) {
    notFound();
  }

  async function updateDeal() {
    "use server";
    return { redirectTo: `/ws/crm/clients/${clientId}` };
  }

  async function archiveDeal() {
    "use server";
    return { redirectTo: "/ws/crm" };
  }

  return (
    <DealFormScreen
      pageTitle="تعديل الصفقة"
      pageDescription="حدّث بيانات العميل والصفقة أو قم بأرشفتها دون حذف السجل نهائياً."
      submitLabel="استعراض التعديلات"
      cancelHref={`/ws/crm/clients/${clientId}`}
      projects={demoProjects.map((project) => ({
        id: project.id,
        title: project.title,
        image: project.image,
        location: project.location,
        priceLabel: project.priceLabel,
        summary: project.summary,
      }))}
      clients={demoCrmClients.map((client) => ({
        id: client.id,
        name: client.name,
        phone: client.linkedClient?.phone,
        notes: client.notes,
        sourceClientId: client.linkedClient?.sourceClientId,
      }))}
      brokers={demoCrmClients
        .filter((client) => client.personType === "broker")
        .map((client) => ({
          id: client.id,
          name: client.name,
          description: client.notes,
          phone: client.linkedClient?.phone,
          avatarLabel: client.avatarLabel,
          stateLabel: client.relationLabel,
          isVerified: true,
        }))}
      initialData={{
        name: deal.name,
        phone: deal.linkedClient?.phone ?? "",
        budget: deal.budgetLabel,
        preference: deal.preference,
        propertyId: deal.project?.id ?? "",
        relationType: deal.relationType,
        crmClientId: deal.linkedClient?.id ?? "",
        relatedBrokerId: deal.broker?.id ?? "",
        nextFollowUpAt: toDateTimeLocalValue(deal.nextFollowUpAt),
        stage: normalizeFormStage(deal.stage),
        notes: deal.notes,
      }}
      onSubmit={updateDeal}
      onArchive={archiveDeal}
    />
  );
}
