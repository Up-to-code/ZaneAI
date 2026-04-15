import { useEffect, useMemo, useState } from "react";
import { useConvex, useQuery } from "convex/react";

import { buyerAssistantTurnSchema } from "@/conversation/buyerProtocol";
import { useAuthSession } from "@/auth/useAuthSession";
import { api } from "@/persistence/convex/api";
import { resolveE2EPromptScenario } from "@/e2e/fixtures";
import { toPropertyCardVM } from "@/persistence/convex/propertyAdapter";
import { useAppStore } from "@/store";
import type { AgentRuntimeHealth, ConversationMessage, ConversationRunStage, ConversationRunStatus } from "@/types/domain";

function getMessageText(message: any) {
  const content = message?.message?.content;
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("");
  }
  return "";
}

function getMessageUiTurn(message: any) {
  const parsed = buyerAssistantTurnSchema.safeParse(message?.metadata?.uiTurn);
  return parsed.success ? parsed.data : undefined;
}

function getMessageMeta(message: any) {
  const value = message?.metadata?.meta;
  const meta = value && typeof value === "object" ? value : {};
  return {
    ...meta,
    runId: message?.metadata?.runId ? String(message.metadata.runId) : undefined,
    recommendationBatchId: message?.metadata?.recommendationBatchId
      ? String(message.metadata.recommendationBatchId)
      : undefined,
  };
}

function getTurnSources(message: any) {
  const uiTurn = getMessageUiTurn(message);
  if (!uiTurn) {
    return [];
  }

  const sourceCard = uiTurn.cards.find((card) => card.type === "market_sources");
  return sourceCard?.type === "market_sources" ? sourceCard.sources : [];
}

const DEFAULT_PENDING_ASSISTANT_TEXT = "Searching your catalog and checking live market context…";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown runtime error.";
}

export function useAgentRuntimeHealth() {
  const convex = useConvex();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const [state, setState] = useState<AgentRuntimeHealth>(
    e2eQaMode
      ? {
          status: "ready",
          auth: { anonymousEnabled: true, emailPasswordEnabled: true },
          llm: { configured: true, provider: "openai" },
          webSearch: { configured: true },
          featureVersion: "e2e",
          capabilities: {
            sendMessage: true,
            threadMessages: true,
            recommendationBatches: true,
            stageFeed: true,
            runStatus: true,
          },
        }
      : { status: "loading" },
  );

  useEffect(() => {
    if (e2eQaMode) {
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const result = await convex.query(api.agent.public.getRuntimeHealth.getRuntimeHealth, {});
        if (!active) return;
        setState({
          status: result.llm.configured ? "ready" : "unavailable",
          ...result,
          message: result.llm.configured
            ? undefined
            : "AI unavailable. Add OPENROUTER_API_KEY or OPENAI_API_KEY to Convex runtime.",
        });
      } catch (error) {
        if (!active) return;
        setState({
          status: "unavailable",
          message: `AI runtime drift. Deploy current Convex backend. ${getErrorMessage(error)}`,
        });
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [convex, e2eQaMode]);

  return state;
}

export function useThreads() {
  const { isAuthenticated, isGuest } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eThreads = useAppStore((state) => state.e2eThreads);
  const guestMirrorThreads = useAppStore((state) => state.guestMirrorThreads);
  const syncGuestMirrorThreadSummaries = useAppStore((state) => state.syncGuestMirrorThreadSummaries);
  const rows = useQuery(
    api.agent.public.listThreads.listThreads,
    isAuthenticated && !e2eQaMode ? {} : "skip",
  );

  useEffect(() => {
    if (e2eQaMode || !isGuest || rows === undefined) {
      return;
    }

    if (rows.length === 0 && guestMirrorThreads.length > 0) {
      return;
    }

    syncGuestMirrorThreadSummaries(
      rows.map((thread: any) => ({
        _id: thread._id,
        _creationTime: thread._creationTime,
        title: thread.title ?? null,
        summary: thread.summary ?? null,
      })),
    );
  }, [e2eQaMode, guestMirrorThreads.length, isGuest, rows, syncGuestMirrorThreadSummaries]);

  if (e2eQaMode) {
    return e2eThreads;
  }

  if (rows !== undefined) {
    if (rows.length === 0 && isGuest && guestMirrorThreads.length > 0) {
      return guestMirrorThreads;
    }
    return rows;
  }

  return isGuest ? guestMirrorThreads : [];
}

export function useThreadMessages(threadId: string | null, pendingPrompt?: string | null) {
  const { isAuthenticated, isGuest } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eThreads = useAppStore((state) => state.e2eThreads);
  const guestMirrorThreads = useAppStore((state) => state.guestMirrorThreads);
  const storeGuestMirrorThreadMessages = useAppStore((state) => state.storeGuestMirrorThreadMessages);
  const result = useQuery(
    api.agent.public.getThreadMessages.getThreadMessages,
    isAuthenticated && !e2eQaMode && threadId
      ? {
          threadId,
          paginationOpts: {
            numItems: 50,
            cursor: null,
          },
        }
      : "skip",
  );

  const baseMessages = useMemo(() => {
    if (e2eQaMode) {
      const thread = e2eThreads.find((item) => item._id === threadId);
      return [...(thread?.messages ?? [])].sort((left, right) => left.createdAt - right.createdAt);
    }

    const page = result?.page ?? [];
    const messages: ConversationMessage[] = page.map((message: any) => ({
      id: message._id,
      sessionId: threadId ?? "threadless",
      role: message.message.role === "assistant" ? "assistant" : "user",
      kind: getMessageUiTurn(message) ? "buyer_turn" : "text",
      text: getMessageText(message),
      streamState: "complete",
      relatedPropertyIds: [],
      createdAt: message._creationTime,
      runId: message?.metadata?.runId ? String(message.metadata.runId) : undefined,
      sourceMetadata: getTurnSources(message),
      uiTurn: getMessageUiTurn(message),
      turnMeta: getMessageMeta(message),
    }));
    messages.sort((left, right) => left.createdAt - right.createdAt);
    return messages;
  }, [e2eQaMode, e2eThreads, result?.page, threadId]);

  useEffect(() => {
    if (e2eQaMode || !isGuest || !threadId || result === undefined) {
      return;
    }

    if (baseMessages.length === 0 && guestMirrorThreads.some((item) => item._id === threadId && item.messages.length > 0)) {
      return;
    }

    storeGuestMirrorThreadMessages(threadId, baseMessages);
  }, [baseMessages, e2eQaMode, guestMirrorThreads, isGuest, result, storeGuestMirrorThreadMessages, threadId]);

  return useMemo(() => {
    const mirroredMessages = guestMirrorThreads.find((item) => item._id === threadId)?.messages ?? [];
    const useMirrorMessages =
      !e2eQaMode
      && result !== undefined
      && baseMessages.length === 0
      && mirroredMessages.length > 0;
    const messages = [...(
      e2eQaMode
        ? baseMessages
        : useMirrorMessages
        ? mirroredMessages
        : result !== undefined
        ? baseMessages
        : isGuest
        ? mirroredMessages
        : []
    )];

    if (pendingPrompt) {
      const hasOptimisticUser = messages.some((m) => m.role === "user" && m.text === pendingPrompt);
      if (!hasOptimisticUser) {
        messages.push({
          id: "optimistic-user",
          sessionId: threadId ?? "threadless",
          role: "user",
          kind: "text",
          text: pendingPrompt,
          streamState: "complete",
          relatedPropertyIds: [],
          createdAt: Date.now() - 1,
          runId: undefined,
          sourceMetadata: [],
        });
      }
      messages.push({
        id: "pending-assistant",
        sessionId: threadId ?? "threadless",
        role: "assistant",
        kind: "property_bundle",
        text: DEFAULT_PENDING_ASSISTANT_TEXT,
        streamState: "streaming",
        relatedPropertyIds: [],
        createdAt: Date.now(),
        runId: undefined,
        sourceMetadata: [],
      });
    }

    return messages;
  }, [baseMessages, e2eQaMode, guestMirrorThreads, isGuest, pendingPrompt, result, threadId]);
}

export function useRecommendationBatches(threadId: string | null) {
  const { isAuthenticated } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eThreads = useAppStore((state) => state.e2eThreads);
  const rows = useQuery(
    api.agent.public.listRecommendationsForThread.listRecommendationsForThread,
    isAuthenticated && !e2eQaMode && threadId ? { threadId } : "skip",
  );

  return useMemo(
    () => {
      if (e2eQaMode) {
        const thread = e2eThreads.find((item) => item._id === threadId);
        return thread?.recommendationBatches ?? [];
      }

      return (rows ?? []).map((row: any) => ({
        ...row,
        properties: row.properties.map(toPropertyCardVM),
      }));
    },
    [e2eQaMode, e2eThreads, rows, threadId],
  );
}

export function useRunStageFeed(threadId: string | null, runId: string | null, enabled = true) {
  const { isAuthenticated } = useAuthSession();
  const convex = useConvex();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const [rows, setRows] = useState<ConversationRunStage[]>([]);

  useEffect(() => {
    if (e2eQaMode) {
      setRows([]);
      return;
    }

    if (!isAuthenticated || !threadId || !runId || !enabled) {
      setRows([]);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const result = await convex.query(api.agent.public.getRunStageFeed.getRunStageFeed, {
          threadId,
          runId: runId as never,
        });
        if (!active) return;
        setRows(result);
      } catch {
        if (!active) return;
        setRows([]);
      }
    };

    void load();
    const interval = setInterval(() => {
      void load();
    }, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [convex, e2eQaMode, enabled, isAuthenticated, runId, threadId]);

  return useMemo(() => {
    if (e2eQaMode) {
      return [];
    }

    return rows ?? [];
  }, [e2eQaMode, rows]);
}

export function useRunStatus(threadId: string | null, runId: string | null, enabled = true) {
  const { isAuthenticated } = useAuthSession();
  const convex = useConvex();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const [status, setStatus] = useState<ConversationRunStatus | null>(null);

  useEffect(() => {
    if (e2eQaMode) {
      setStatus(null);
      return;
    }

    if (!isAuthenticated || !threadId || !runId || !enabled) {
      setStatus(null);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const result = await convex.query(api.agent.public.getRunStatus.getRunStatus, {
          threadId,
          runId: runId as never,
        });
        if (!active) return;
        setStatus({
          ...result,
          runId: String(result.runId),
        });
      } catch {
        if (!active) return;
        setStatus(null);
      }
    };

    void load();
    const interval = setInterval(() => {
      void load();
    }, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [convex, e2eQaMode, enabled, isAuthenticated, runId, threadId]);

  return status;
}
