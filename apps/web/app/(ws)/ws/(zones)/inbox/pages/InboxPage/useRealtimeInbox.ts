"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { ConversationDetail, ConversationMessage, ConversationSummary, UserConversationTarget } from "@/server/contracts/inbox";
import type { UseRealtimeInboxArgs, UseRealtimeInboxResult } from "./useRealtimeInbox.shared";

export { useWorkspaceSignalCounts } from "./useWorkspaceSignalCounts";

function cloneConversation(conversation: ConversationDetail): ConversationDetail {
  return {
    ...conversation,
    otherUser: { ...conversation.otherUser },
    lastMessage: conversation.lastMessage ? { ...conversation.lastMessage } : null,
    messages: [...conversation.messages],
  };
}

function buildConversationDetail(summary: ConversationSummary): ConversationDetail {
  return {
    ...summary,
    otherParticipantLastReadAt: null,
    messages: summary.lastMessage
      ? [
          {
            id: summary.lastMessage.id,
            senderUserId: summary.lastMessage.senderUserId,
            recipientUserId: summary.otherUser.id,
            type: summary.lastMessage.type,
            body: summary.lastMessage.body,
            createdAt: summary.lastMessage.createdAt,
            metadata: null,
          } as ConversationMessage,
        ]
      : [],
  };
}

function buildSearchResults(
  conversations: ConversationSummary[],
  query: string,
  currentUserId: string,
): UserConversationTarget[] {
  if (!query) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();
  return conversations
    .map((conversation) => conversation.otherUser)
    .filter((target) => target.id !== currentUserId)
    .filter((target) => {
      const haystack = [target.name, target.email ?? "", target.username ?? "", target.organizationName ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
}

function buildDemoConversation(target: UserConversationTarget, currentUserId: string): ConversationDetail {
  const createdAt = Date.now();
  return {
    id: `demo-${target.id}`,
    directKey: `demo-${currentUserId}-${target.id}`,
    otherUser: target,
    unreadCount: 0,
    updatedAt: createdAt,
    lastMessage: null,
    lastMessagePreview: "",
    archivedAt: null,
    otherParticipantLastReadAt: null,
    messages: [],
  };
}

function syncConversationUrl(conversationId: string | null, method: "push" | "replace" = "push") {
  if (typeof window === "undefined") {
    return;
  }

  const nextUrl = new URL(window.location.href);
  if (conversationId) {
    nextUrl.searchParams.set("conversationId", conversationId);
  } else {
    nextUrl.searchParams.delete("conversationId");
  }
  const nextHref = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;

  if (method === "replace") {
    window.history.replaceState(null, "", nextHref);
    return;
  }

  window.history.pushState(null, "", nextHref);
}

/**
 * WHY:   The inbox should only auto-open the first conversation when the user has not already chosen one.
 * WHAT:  Returns the first conversation id eligible for automatic selection.
 * HOW:   Skips auto-selection when the route is already pinned to a conversation or when local state already has an active id.
 */
export function getInboxAutoSelectedConversationId(args: {
  activeConversationId: string | null;
  conversations: Array<{ id: string }>;
  hasInitializedAutoSelection?: boolean;
  hasConversationRoute: boolean;
}) {
  if (args.hasInitializedAutoSelection || args.hasConversationRoute || args.activeConversationId) {
    return null;
  }

  return args.conversations[0]?.id ?? null;
}

/**
 * WHY:   The inbox workspace still needs a single coordinator in demo mode.
 * WHAT:  Keeps the original inbox hook surface while storing conversation state locally.
 * HOW:   Seeds from server fixtures, mirrors conversation selection into the URL, and performs local archive/send/search updates.
 */
export function useRealtimeInbox({
  currentUserId,
  initialConversations,
  initialConversation,
  initialSelectedConversationId,
  hasConversationRoute,
}: UseRealtimeInboxArgs): UseRealtimeInboxResult {
  const [activeConversations, setActiveConversations] = useState<ConversationSummary[]>(() =>
    initialConversations.map((conversation) => ({
      ...conversation,
      otherUser: { ...conversation.otherUser },
      lastMessage: conversation.lastMessage ? { ...conversation.lastMessage } : null,
    })),
  );
  const [archivedConversations, setArchivedConversations] = useState<ConversationSummary[]>([]);
  const [conversationOverrides, setConversationOverrides] = useState<Record<string, ConversationDetail>>(() =>
    initialConversation ? { [initialConversation.id]: cloneConversation(initialConversation) } : {},
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialSelectedConversationId ?? initialConversation?.id ?? initialConversations[0]?.id ?? null,
  );
  const [search, setSearch] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(() => Boolean(initialConversation?.archivedAt));
  const [isArchivingConversation, setIsArchivingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());

  const activeConversationList = showArchived ? archivedConversations : activeConversations;

  const conversation = useMemo<ConversationDetail | null>(() => {
    if (!activeConversationId) {
      return null;
    }

    const override = conversationOverrides[activeConversationId];
    if (override) {
      return override;
    }

    const summary = [...activeConversations, ...archivedConversations].find((item) => item.id === activeConversationId);
    return summary ? buildConversationDetail(summary) : null;
  }, [activeConversationId, activeConversations, archivedConversations, conversationOverrides]);

  const searchResults = useMemo<UserConversationTarget[]>(
    () => buildSearchResults([...activeConversations, ...archivedConversations], deferredSearch, currentUserId),
    [activeConversations, archivedConversations, currentUserId, deferredSearch],
  );

  useEffect(() => {
    if (initialSelectedConversationId) {
      setActiveConversationId(initialSelectedConversationId);
      setShowArchived(Boolean(initialConversation?.archivedAt));
      return;
    }

    const nextConversationId = getInboxAutoSelectedConversationId({
      activeConversationId,
      conversations: activeConversations,
      hasInitializedAutoSelection: Boolean(activeConversationId),
      hasConversationRoute,
    });

    if (!nextConversationId) {
      return;
    }

    setActiveConversationId(nextConversationId);
    syncConversationUrl(nextConversationId, "replace");
  }, [activeConversationId, activeConversations, hasConversationRoute, initialConversation?.archivedAt, initialSelectedConversationId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextConversationId = params.get("conversationId");
      if (!nextConversationId) {
        setShowArchived(false);
        setActiveConversationId(activeConversations[0]?.id ?? null);
        return;
      }

      setShowArchived(archivedConversations.some((item) => item.id === nextConversationId));
      setActiveConversationId(nextConversationId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeConversations, archivedConversations]);

  useEffect(() => {
    if (!activeConversationList.some((item) => item.id === activeConversationId)) {
      const nextConversationId = activeConversationList[0]?.id ?? null;
      setActiveConversationId(nextConversationId);
      syncConversationUrl(nextConversationId, "replace");
    }
  }, [activeConversationId, activeConversationList]);

  const handleSelectConversation = (conversationId: string) => {
    setShowArchived(archivedConversations.some((item) => item.id === conversationId));
    setActiveConversationId(conversationId);
    syncConversationUrl(conversationId);
  };

  const handleStartConversation = async (targetUserId: string) => {
    setSendError(null);
    const existingConversation = activeConversations.find((item) => item.otherUser.id === targetUserId);
    if (existingConversation) {
      setSearch("");
      setShowArchived(false);
      setActiveConversationId(existingConversation.id);
      syncConversationUrl(existingConversation.id);
      return;
    }

    const archivedConversation = archivedConversations.find((item) => item.otherUser.id === targetUserId);
    if (archivedConversation) {
      setArchivedConversations((current) => current.filter((item) => item.id !== archivedConversation.id));
      setActiveConversations((current) => [{ ...archivedConversation, archivedAt: null }, ...current]);
      setSearch("");
      setShowArchived(false);
      setActiveConversationId(archivedConversation.id);
      syncConversationUrl(archivedConversation.id);
      return;
    }

    const target = searchResults.find((item) => item.id === targetUserId) ?? {
      id: targetUserId,
      name: "Demo contact",
      email: null,
      username: null,
      image: null,
      role: "member",
      brokerId: null,
      redId: null,
      organizationName: "Zane-ai Demo",
      organizationType: "broker" as const,
      membershipState: "member" as const,
      conversationId: null,
    };

    const conversationDetail = buildDemoConversation(target, currentUserId);
    const summary: ConversationSummary = {
      id: conversationDetail.id,
      directKey: conversationDetail.directKey,
      otherUser: conversationDetail.otherUser,
      lastMessage: null,
      lastMessagePreview: "",
      updatedAt: conversationDetail.updatedAt,
      unreadCount: 0,
      archivedAt: null,
    };

    setConversationOverrides((current) => ({ ...current, [conversationDetail.id]: conversationDetail }));
    setActiveConversations((current) => [summary, ...current]);
    setSearch("");
    setShowArchived(false);
    setActiveConversationId(conversationDetail.id);
    syncConversationUrl(conversationDetail.id);
  };

  const handleSetConversationArchived = async (conversationId: string, archived: boolean) => {
    setIsArchivingConversation(true);

    try {
      if (archived) {
        const targetConversation = activeConversations.find((item) => item.id === conversationId);
        if (!targetConversation) {
          return;
        }

        const archivedConversation = { ...targetConversation, archivedAt: Date.now() };
        setActiveConversations((current) => current.filter((item) => item.id !== conversationId));
        setArchivedConversations((current) => [archivedConversation, ...current.filter((item) => item.id !== conversationId)]);

        const nextConversationId =
          activeConversationId === conversationId
            ? activeConversations.find((item) => item.id !== conversationId)?.id ?? null
            : activeConversationId;

        setShowArchived(false);
        setActiveConversationId(nextConversationId);
        syncConversationUrl(nextConversationId, "replace");
        return;
      }

      const targetConversation = archivedConversations.find((item) => item.id === conversationId);
      if (!targetConversation) {
        return;
      }

      const restoredConversation = { ...targetConversation, archivedAt: null };
      setArchivedConversations((current) => current.filter((item) => item.id !== conversationId));
      setActiveConversations((current) => [restoredConversation, ...current.filter((item) => item.id !== conversationId)]);
      setShowArchived(false);
      setActiveConversationId(conversationId);
      syncConversationUrl(conversationId, "replace");
    } finally {
      setIsArchivingConversation(false);
    }
  };

  const handleSendMessage = async (body: string) => {
    if (!activeConversationId || !conversation) {
      return;
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      return;
    }

    setSendError(null);
    setIsSending(true);

    try {
      const createdAt = Date.now();
      const nextMessage: ConversationMessage = {
        id: `demo-message-${createdAt}`,
        senderUserId: currentUserId,
        recipientUserId: conversation.otherUser.id,
        type: "text",
        body: trimmedBody,
        createdAt,
        metadata: {
          clientRequestId: `demo-${createdAt}`,
          optimistic: true,
        },
      };

      const nextConversation: ConversationDetail = {
        ...conversation,
        updatedAt: createdAt,
        unreadCount: 0,
        lastMessage: {
          id: nextMessage.id,
          senderUserId: nextMessage.senderUserId,
          body: nextMessage.body,
          type: nextMessage.type,
          createdAt: nextMessage.createdAt,
        },
        lastMessagePreview: nextMessage.body,
        messages: [...conversation.messages, nextMessage],
      };

      setConversationOverrides((current) => ({ ...current, [activeConversationId]: nextConversation }));
      setActiveConversations((current) => {
        const currentSummary = current.find((item) => item.id === activeConversationId);
        const nextSummary: ConversationSummary = {
          id: activeConversationId,
          directKey: nextConversation.directKey,
          otherUser: nextConversation.otherUser,
          lastMessage: nextConversation.lastMessage,
          lastMessagePreview: nextConversation.lastMessagePreview,
          updatedAt: createdAt,
          unreadCount: 0,
          archivedAt: null,
        };

        if (!currentSummary) {
          return [nextSummary, ...current];
        }

        return [nextSummary, ...current.filter((item) => item.id !== activeConversationId)];
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    activeConversationId,
    archivedConversations,
    conversation,
    conversations: activeConversationList,
    handleSetConversationArchived,
    isArchivingConversation,
    isLiveConversationLoading: false,
    isShowingArchived: showArchived,
    isSending,
    isSearching: deferredSearch.length > 0,
    search,
    searchResults,
    sendError,
    setShowArchived,
    setSearch,
    handleSelectConversation,
    handleStartConversation,
    handleSendMessage,
  };
}
