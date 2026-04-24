import type { InboxDealOption, InboxProjectOption, InboxWorkspaceClientProps } from "./InboxWorkspaceClient.types";
import { getInboxConversation, listInboxConversations } from "@/server/domains/workspace/inbox/service";
import { requireSessionContext } from "@/server/auth/session";

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
  const session = await requireSessionContext();

  const dealOptions: InboxDealOption[] = [];
  const projectOptions: InboxProjectOption[] = [];
  const [initialConversations, archivedConversations] = await Promise.all([
    listInboxConversations(false),
    listInboxConversations(true),
  ]);
  const initialConversation = conversationId
    ? await getInboxConversation(conversationId).catch(() => null)
    : null;
  const initialSelectedConversationId =
    conversationId
    ?? initialConversation?.id
    ?? initialConversations[0]?.id
    ?? null;

  return {
    canUseBusinessActions: true,
    currentUserId: session.context.userId,
    dealOptions,
    hasConversationRoute: Boolean(conversationId),
    incomingInvites: [],
    initialConversation,
    initialConversations,
    initialArchivedConversations: archivedConversations,
    initialSelectedConversationId,
    initialStartUserId: startUserId,
    projectOptions,
  };
}
