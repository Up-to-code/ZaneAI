import ClientsPage from "../pages/ClientsPage";
import { demoCrmClients } from "../../../_lib/demoData";

function paginateDeals<T>(rows: T[], cursor: string | null, numItems: number) {
  const offset = cursor ? Number(cursor) : 0;
  const page = rows.slice(offset, offset + numItems);
  const nextOffset = offset + numItems;
  return {
    page,
    isDone: nextOffset >= rows.length,
    continueCursor: nextOffset >= rows.length ? null : String(nextOffset),
  };
}

/**
 * WHY:   The CRM client index should remain available for demos without loading the real CRM backend.
 * WHAT:  Renders the existing client list with static CRM fixtures.
 * HOW:   Keeps pagination and filters local while swapping out the server zone loader.
 */
export default async function WorkspaceCrmClientsRoute({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const page = paginateDeals(demoCrmClients, params.cursor ?? null, 12);
  return (
    <ClientsPage
      clients={page.page}
      initialFilter={params.filter ?? "all"}
      pagination={{
        cursor: params.cursor ?? null,
        continueCursor: page.continueCursor,
        isDone: page.isDone,
      }}
    />
  );
}
