import ClientsPage from "../pages/ClientsPage";

/**
 * WHY:   The CRM client index should display real CRM data from the backend.
 * WHAT:  Currently shows an empty client list until a real CRM Convex query is built.
 * HOW:   Passes an empty client list and default pagination to the existing page component.
 */
export default async function WorkspaceCrmClientsRoute({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string; filter?: string }>;
}) {
  const params = await searchParams;
  return (
    <ClientsPage
      clients={[]}
      initialFilter={params.filter ?? "all"}
      pagination={{
        cursor: params.cursor ?? null,
        continueCursor: null,
        isDone: true,
      }}
    />
  );
}
