import { notFound } from "next/navigation";
import DealFormScreen from "../../../shared/forms/DealFormScreen";

type WorkspaceCrmClientEditRouteProps = {
  params: Promise<{ clientId: string }>;
};

/**
 * WHY:   CRM edit routes need real data from the backend.
 * WHAT:  Currently shows an empty form until real CRM queries are built.
 * HOW:   Passes empty options and default initial data to the form.
 */
export default async function WorkspaceCrmClientEditRoute({
  params,
}: WorkspaceCrmClientEditRouteProps) {
  const { clientId } = await params;

  if (!clientId) {
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
      projects={[]}
      clients={[]}
      brokers={[]}
      initialData={{
        name: "",
        phone: "",
        budget: "",
        preference: "",
        propertyId: "",
        relationType: "internal_client",
        crmClientId: "",
        relatedBrokerId: "",
        nextFollowUpAt: "",
        stage: "new",
        notes: "",
      }}
      onSubmit={updateDeal}
      onArchive={archiveDeal}
    />
  );
}
