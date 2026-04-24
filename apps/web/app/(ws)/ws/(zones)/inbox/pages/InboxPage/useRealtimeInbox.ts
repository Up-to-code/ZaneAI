"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { ConversationDetail, ConversationSummary, UserConversationTarget } from "@/server/contracts/inbox";
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

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(typeof payload?.message === "string" ? payload.message : "Request failed.");
  }

  return payload as T;
}

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

export function useRealtimeInbox({
  currentUserId,
  initialArchivedConversations,
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
  const [archivedConversations, setArchivedConversations] = useState<ConversationSummary[]>(() =>
    initialArchivedConversations.map((conversation) => ({
      ...conversation,
      otherUser: { ...conversation.otherUser },
      lastMessage: conversation.lastMessage ? { ...conversation.lastMessage } : null,
    })),
  );
  const [conversationOverrides, setConversationOverrides] = useState<Record<string, ConversationDetail>>(() =>
    initialConversation ? { [initialConversation.id]: cloneConversation(initialConversation) } : {},
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialSelectedConversationId ?? initialConversation?.id ?? initialConversations[0]?.id ?? null,
  );
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UserConversationTarget[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(() => Boolean(initialConversation?.archivedAt));
  const [isArchivingConversation, setIsArchivingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLiveConversationLoading, setIsLiveConversationLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());

  const activeConversationList = showArchived ? archivedConversations : activeConversations;

  const conversation = useMemo<ConversationDetail | null>(() => {
    if (!activeConversationId) {
      return null;
    }

    return conversationOverrides[activeConversationId] ?? null;
  }, [activeConversationId, conversationOverrides]);

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
    if (!activeConversationId || conversationOverrides[activeConversationId]) {
      return;
    }

    let cancelled = false;
    setIsLiveConversationLoading(true);

    void fetchJson<ConversationDetail>(`/api/ws/inbox/conversations/${encodeURIComponent(activeConversationId)}`)
      .then((nextConversation) => {
        if (cancelled) {
          return;
        }

        setConversationOverrides((current) => ({
          ...current,
          [nextConversation.id]: cloneConversation(nextConversation),
        }));
      })
      .catch((error) => {
        if (!cancelled) {
          setSendError(error instanceof Error ? error.message : "تعذر تحميل المحادثة.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLiveConversationLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeConversationId, conversationOverrides]);

  useEffect(() => {
    if (!deferredSearch) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    void fetchJson<UserConversationTarget[]>(
      `/api/ws/inbox/search?query=${encodeURIComponent(deferredSearch)}`,
    )
      .then((results) => {
        if (!cancelled) {
          setSearchResults(results.filter((target) => target.id !== currentUserId));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearchResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsSearching(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUserId, deferredSearch]);

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
    setSendError(null);
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
      await handleSetConversationArchived(archivedConversation.id, false);
      return;
    }

    const { conversationId } = await fetchJson<{ conversationId: string }>("/api/ws/inbox/resolve", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ targetUserId }),
    });
    const nextConversation = await fetchJson<ConversationDetail>(
      `/api/ws/inbox/conversations/${encodeURIComponent(conversationId)}`,
    );
    const summary: ConversationSummary = {
      id: nextConversation.id,
      directKey: nextConversation.directKey,
      otherUser: nextConversation.otherUser,
      lastMessage: nextConversation.lastMessage,
      lastMessagePreview: nextConversation.lastMessagePreview,
      updatedAt: nextConversation.updatedAt,
      unreadCount: nextConversation.unreadCount,
      archivedAt: nextConversation.archivedAt ?? null,
    };

    setConversationOverrides((current) => ({ ...current, [nextConversation.id]: cloneConversation(nextConversation) }));
    setActiveConversations((current) => [summary, ...current.filter((item) => item.id !== summary.id)]);
    setSearch("");
    setShowArchived(false);
    setActiveConversationId(nextConversation.id);
    syncConversationUrl(nextConversation.id);
  };

  const handleSetConversationArchived = async (conversationId: string, archived: boolean) => {
    setIsArchivingConversation(true);
    setSendError(null);

    try {
      await fetchJson<{ ok: true }>(
        `/api/ws/inbox/conversations/${encodeURIComponent(conversationId)}/archive`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ archived }),
        },
      );

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
    if (!activeConversationId) {
      return;
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      return;
    }

    setSendError(null);
    setIsSending(true);

    try {
      await fetchJson<{ conversationId: string; messageId: string }>("/api/ws/inbox/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          conversationId: activeConversationId,
          body: trimmedBody,
          clientRequestId: `client-${Date.now()}`,
        }),
      });

      const nextConversation = await fetchJson<ConversationDetail>(
        `/api/ws/inbox/conversations/${encodeURIComponent(activeConversationId)}`,
      );

      setConversationOverrides((current) => ({ ...current, [activeConversationId]: cloneConversation(nextConversation) }));
      setActiveConversations((current) => {
        const nextSummary: ConversationSummary = {
          id: nextConversation.id,
          directKey: nextConversation.directKey,
          otherUser: nextConversation.otherUser,
          lastMessage: nextConversation.lastMessage,
          lastMessagePreview: nextConversation.lastMessagePreview,
          updatedAt: nextConversation.updatedAt,
          unreadCount: nextConversation.unreadCount,
          archivedAt: null,
        };

        return [nextSummary, ...current.filter((item) => item.id !== activeConversationId)];
      });
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "تعذر إرسال الرسالة.");
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
    isLiveConversationLoading,
    isShowingArchived: showArchived,
    isSending,
    isSearching,
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
