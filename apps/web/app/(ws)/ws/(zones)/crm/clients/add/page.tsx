import DealFormScreen from "../../shared/forms/DealFormScreen";
import { getWorkspaceLocale } from "../../../../_lib/workspaceLocale";

/**
 * WHY:   The add-client route should be functional with real data.
 * WHAT:  Renders the deal form with empty options until real CRM queries are built.
 * HOW:   Preserves the UX with empty project/client/broker lists.
 */
export default async function AddClientPage() {
  const locale = await getWorkspaceLocale();

  async function createClient() {
    "use server";
    return { redirectTo: "/ws/crm" };
  }

  return (
    <DealFormScreen
      pageTitle={locale === "fr" ? "Ajouter un nouveau client" : locale === "en" ? "Add a new client" : "إضافة عميل جديد"}
      pageDescription={locale === "fr" ? "Créez une nouvelle opportunité CRM liée à un client et à un bien optionnel." : locale === "en" ? "Create a new CRM deal linked to a client and an optional property." : "أنشئ صفقة CRM جديدة مرتبطة بعميل وعقار اختياري."}
      submitLabel={locale === "fr" ? "Prévisualiser" : locale === "en" ? "Preview client" : "استعراض العميل"}
      cancelHref="/ws/crm"
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
      onSubmit={createClient}
    />
  );
}
