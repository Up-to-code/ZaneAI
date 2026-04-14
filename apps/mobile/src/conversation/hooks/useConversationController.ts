import { startTransition, useEffect, useMemo, useRef } from "react";
import { useMutation } from "convex/react";

import { api } from "@convex/_generated/api";
import { useAuthSession } from "@/auth/useAuthSession";
import {
  appendE2EUserPrompt,
  completeE2EPrompt,
  createE2EThread,
} from "@/e2e/store";
import { track } from "@/persistence/analytics/track";
import { useThreads, useThreadMessages, useRecommendationBatches } from "@/persistence/convex/useConversationData";
import { useAppStore } from "@/store";
import type { ConversationMessage } from "@/types/domain";

export function useConversationController() {
  const { isAuthenticated } = useAuthSession();
  const sessionId = useAppStore((state) => state.sessionId);
  const draftText = useAppStore((state) => state.draftText);
  const currentRoute = useAppStore((state) => state.currentRoute);
  const activeThreadId = useAppStore((state) => state.activeThreadId);
  const activeRunId = useAppStore((state) => state.activeRunId);
  const pendingPrompt = useAppStore((state) => state.pendingPrompt);
  const pendingStartedAt = useAppStore((state) => state.pendingStartedAt);
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const setActiveThreadId = useAppStore((state) => state.setActiveThreadId);
  const setActiveRunId = useAppStore((state) => state.setActiveRunId);
  const setPendingPrompt = useAppStore((state) => state.setPendingPrompt);
  const clearDraft = useAppStore((state) => state.clearDraft);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const threads = useThreads();
  const startThreadMutation = useMutation(api.agent.public.startThread.startThread);
  const sendUserMessageMutation = useMutation(api.agent.public.sendUserMessage.sendUserMessage);
  const stopRunMutation = useMutation(api.agent.public.stopRun.stopRun);
  const recommendationBatches = useRecommendationBatches(activeThreadId);
  const rawMessages = useThreadMessages(activeThreadId, pendingPrompt);

  useEffect(() => {
    if (!activeThreadId && threads[0]?._id) {
      setActiveThreadId(threads[0]._id);
    }
  }, [activeThreadId, setActiveThreadId, threads]);

  useEffect(() => () => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const hasCompletedAssistant = rawMessages.some(
      (message) =>
        message.role === "assistant"
        && message.id !== "pending-assistant"
        && (!pendingStartedAt || message.createdAt >= pendingStartedAt),
    );
    if (pendingPrompt && hasCompletedAssistant) {
      track("ai_response_stream_end", {
        sessionId,
        threadId: activeThreadId ?? undefined,
        route: currentRoute,
        stopped: false,
        source: "assistant",
      });
      setPendingPrompt(null);
      setActiveRunId(null);
    }
  }, [activeThreadId, currentRoute, pendingPrompt, pendingStartedAt, rawMessages, sessionId, setActiveRunId, setPendingPrompt]);

  const messages = useMemo<ConversationMessage[]>(() => {
    const latestBatch = recommendationBatches[recommendationBatches.length - 1];
    const assistantIndex = rawMessages.findLastIndex((message) => message.role === "assistant");
    if (assistantIndex < 0) {
      return rawMessages;
    }
    const batchKind = latestBatch && "kind" in latestBatch ? latestBatch.kind : undefined;
    return rawMessages.map((message, index) =>
      index === assistantIndex && latestBatch
        ? {
            ...message,
            kind:
              message.kind !== "text"
                ? message.kind
                : batchKind ?? (latestBatch.properties.length > 0 ? "property_bundle" : "text"),
            relatedPropertyIds: latestBatch.properties.map((property) => property.id),
            sourceMetadata: latestBatch.sources ?? [],
            runId: latestBatch.runId,
          }
        : message,
    );
  }, [rawMessages, recommendationBatches]);

  const isStreaming = Boolean(pendingPrompt);

  const ensureActiveThread = async () => {
    if (!isAuthenticated) return null;
    if (activeThreadId) return activeThreadId;

    if (e2eQaMode) {
      const threadId = createE2EThread();
      setActiveThreadId(threadId);
      return threadId;
    }

    const threadId = await startThreadMutation({});
    setActiveThreadId(threadId);
    return threadId;
  };

  const sendPrompt = async (overrideText?: string) => {
    const prompt = (overrideText ?? draftText).trim();
    if (!prompt) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    const threadId = await ensureActiveThread();
    if (!threadId) {
      return;
    }
    const startedAt = Date.now();
    startTransition(() => {
      clearDraft();
      setPendingPrompt(prompt, startedAt);
    });

    track("ai_prompt_sent", { sessionId, threadId, route: currentRoute, prompt, source: "assistant" });
    track("ai_response_stream_start", { sessionId, threadId, route: currentRoute, source: "assistant" });

    if (e2eQaMode) {
      const runId = appendE2EUserPrompt(threadId, prompt, startedAt);
      setActiveRunId(runId);

      completionTimeoutRef.current = setTimeout(() => {
        completeE2EPrompt(threadId, prompt, startedAt, runId);
        completionTimeoutRef.current = null;
      }, 300);

      return;
    }

    try {
      const result = await sendUserMessageMutation({ threadId, prompt });
      setActiveRunId(String(result.runId));
    } catch (error) {
      setPendingPrompt(null);
      throw error;
    }
  };

  const stop = async () => {
    if (!isAuthenticated) {
      setPendingPrompt(null);
      return;
    }
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    if (e2eQaMode) {
      setPendingPrompt(null);
      setActiveRunId(null);
      track("ai_response_stream_end", {
        sessionId,
        threadId: activeThreadId ?? undefined,
        route: currentRoute,
        stopped: true,
        source: "assistant",
      });
      return;
    }
    if (!activeThreadId || !activeRunId) {
      setPendingPrompt(null);
      return;
    }
    await stopRunMutation({ runId: activeRunId as never, threadId: activeThreadId });
    setPendingPrompt(null);
    setActiveRunId(null);
    track("ai_response_stream_end", {
      sessionId,
      threadId: activeThreadId,
      route: currentRoute,
      stopped: true,
      source: "assistant",
    });
  };

  return {
    activeThreadId,
    messages,
    isStreaming,
    sendPrompt,
    stop,
    threads,
    recommendationBatches,
  };
}
