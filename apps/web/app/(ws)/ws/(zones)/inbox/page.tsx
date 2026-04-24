import InboxWorkspaceClient from "./pages/InboxPage/InboxWorkspaceClient";
import { loadInboxWorkspaceClientProps } from "./pages/InboxPage/loaders";

type InboxIndexPageProps = {
  searchParams: Promise<{
    conversationId?: string;
    startUserId?: string;
  }>;
};

export default async function InboxIndexPage({ searchParams }: InboxIndexPageProps) {
  const { conversationId, startUserId } = await searchParams;
  const props = await loadInboxWorkspaceClientProps({
    conversationId,
    routeHref: "/ws/inbox",
    startUserId: startUserId ?? null,
  });

  return <InboxWorkspaceClient {...props} />;
}
