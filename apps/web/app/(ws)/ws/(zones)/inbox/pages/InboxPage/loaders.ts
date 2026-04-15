import { demoCrmClients, demoProjects, demoWorkspaceBehavior } from "../../../../_lib/demoData";
import type { InboxDealOption, InboxProjectOption, InboxWorkspaceClientProps } from "./InboxWorkspaceClient.types";

function toInboxStage(stage: typeof demoCrmClients[number]["stage"]): InboxDealOption["stage"] {
  if (stage === "qualified") return "contacted";
  if (stage === "proposal") return "negotiation";
  return stage;
}

type LoadInboxWorkspaceClientPropsArgs = {
  conversationId?: string;
  routeHref: string;
  startUserId?: string | null;
};

/**
 * WHY:   Legacy inbox workspace client still needs deterministic data when opened directly in demo mode.
 * WHAT:  Returns a fully local inbox payload with fixture-backed collaboration options and no server calls.
 * HOW:   Reuses the workspace demo user plus CRM/project fixtures while leaving conversation data empty by default.
 */
export async function loadInboxWorkspaceClientProps({
  conversationId,
  routeHref,
  startUserId = null,
}: LoadInboxWorkspaceClientPropsArgs): Promise<InboxWorkspaceClientProps> {
  void routeHref;

  const dealOptions: InboxDealOption[] = demoCrmClients.map((deal) => ({
    id: deal.id,
    title: deal.name,
    stage: toInboxStage(deal.stage),
    value: deal.budgetLabel ? Number.parseInt(deal.budgetLabel.replace(/[^\d]/g, ""), 10) || undefined : undefined,
    contactName: deal.linkedClient?.name ?? deal.name,
  }));

  const projectOptions: InboxProjectOption[] = demoProjects.map((project) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    imageUrl: project.image,
    price: undefined,
    shortDescription: project.summary,
    organizationName: demoWorkspaceBehavior.primaryOrganization?.name ?? null,
    publicationState: "published",
  }));

  return {
    canUseBusinessActions: true,
    currentUserId: demoWorkspaceBehavior.user.id,
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
