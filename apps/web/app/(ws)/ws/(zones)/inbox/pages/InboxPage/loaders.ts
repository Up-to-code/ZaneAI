import type { InboxDealOption, InboxProjectOption, InboxWorkspaceClientProps } from "./InboxWorkspaceClient.types";

type LoadInboxWorkspaceClientPropsArgs = {
  conversationId?: string;
  routeHref: string;
  startUserId?: string | null;
};

/**
 * WHY:   Inbox workspace client needs data for collaboration options.
 * WHAT:  Returns an empty inbox payload — real data will come from Convex queries.
 * HOW:   Returns empty arrays for all options until CRM and project data are wired.
 */
export async function loadInboxWorkspaceClientProps({
  conversationId,
  routeHref,
  startUserId = null,
}: LoadInboxWorkspaceClientPropsArgs): Promise<InboxWorkspaceClientProps> {
  void routeHref;

  const dealOptions: InboxDealOption[] = [];
  const projectOptions: InboxProjectOption[] = [];

  return {
    canUseBusinessActions: true,
    currentUserId: "",
    dealOptions,
    hasConversationRoute: Boolean(conversationId),
    incomingInvites: [],
    initialConversation: null,
    initialConversations: [],
    initialSelectedConversationId: conversationId ?? null,
    initialStartUserId: startUserId,
    projectOptions,
  };
}
