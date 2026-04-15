import DealFormScreen from "../../shared/forms/DealFormScreen";
import { getWorkspaceLocale } from "../../../../_lib/workspaceLocale";
import { demoCrmClients, demoProjects } from "../../../../_lib/demoData";

/**
 * WHY:   The add-client route should stay explorable in demo mode without writing CRM records.
 * WHAT:  Reuses the existing deal form with local fixture options and a demo submit handler.
 * HOW:   Preserves the UX while redirecting back into the CRM zone after a non-persistent submit.
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
