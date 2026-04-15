import { startTransition, useEffect, useMemo, useRef } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";

import type { BuyerAction } from "@/conversation/buyerProtocol";
import { useAuthSession } from "@/auth/useAuthSession";
import {
  appendE2EUserPrompt,
  completeE2EPrompt,
  createE2EThread,
} from "@/e2e/store";
import { track } from "@/persistence/analytics/track";
import { api } from "@/persistence/convex/api";
import {
  useAgentRuntimeHealth,
  useRecommendationBatches,
  useRunStageFeed,
  useRunStatus,
  useThreadMessages,
  useThreads,
} from "@/persistence/convex/useConversationData";
import { useAppStore } from "@/store";
import type { ConversationMessage, PropertyCardVM } from "@/types/domain";

export function useConversationController() {
  const { canUpgrade, isGuest, isAuthenticated } = useAuthSession();
  const router = useRouter();
  const sessionId = useAppStore((state) => state.sessionId);
  const draftText = useAppStore((state) => state.draftText);
  const currentRoute = useAppStore((state) => state.currentRoute);
  const activeThreadId = useAppStore((state) => state.activeThreadId);
  const activeRunId = useAppStore((state) => state.activeRunId);
  const pendingPrompt = useAppStore((state) => state.pendingPrompt);
  const pendingStartedAt = useAppStore((state) => state.pendingStartedAt);
  const runFailureMessage = useAppStore((state) => state.runFailureMessage);
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const setActiveThreadId = useAppStore((state) => state.setActiveThreadId);
  const setActiveRunId = useAppStore((state) => state.setActiveRunId);
  const setPendingPrompt = useAppStore((state) => state.setPendingPrompt);
  const setRunFailureMessage = useAppStore((state) => state.setRunFailureMessage);
  const clearDraft = useAppStore((state) => state.clearDraft);
  const setDraftText = useAppStore((state) => state.setDraftText);
  const toggleCompareProperty = useAppStore((state) => state.toggleCompareProperty);
  const toggleGuestMirrorSavedProperty = useAppStore((state) => state.toggleGuestMirrorSavedProperty);
  const setSelectedPropertyId = useAppStore((state) => state.setSelectedPropertyId);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const threads = useThreads();
  const startThreadMutation = useMutation(api.agent.public.startThread.startThread);
  const sendUserMessageMutation = useMutation(api.agent.public.sendUserMessage.sendUserMessage);
  const stopRunMutation = useMutation(api.agent.public.stopRun.stopRun);
  const toggleSavedPropertyMutation = useMutation(api.property.public.toggleSavedProperty.toggleSavedProperty);
  const runtimeHealth = useAgentRuntimeHealth();
  const recommendationBatches = useRecommendationBatches(activeThreadId);
  const rawMessages = useThreadMessages(activeThreadId, pendingPrompt);
  const runStageFeed = useRunStageFeed(
    activeThreadId,
    activeRunId,
    runtimeHealth.status === "ready" && Boolean(runtimeHealth.capabilities?.stageFeed),
  );
  const runStatus = useRunStatus(
    activeThreadId,
    activeRunId,
    runtimeHealth.status === "ready" && Boolean(runtimeHealth.capabilities?.runStatus),
  );

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
      setRunFailureMessage(null);
    }
  }, [activeThreadId, currentRoute, pendingPrompt, pendingStartedAt, rawMessages, sessionId, setActiveRunId, setPendingPrompt, setRunFailureMessage]);

  useEffect(() => {
    if (!pendingPrompt || !runStatus) {
      return;
    }

    if (runStatus.status === "failed" || runStatus.status === "cancelled") {
      track("ai_response_stream_end", {
        sessionId,
        threadId: activeThreadId ?? undefined,
        route: currentRoute,
        stopped: runStatus.status === "cancelled",
        source: "assistant",
      });
      setPendingPrompt(null);
      setActiveRunId(null);
      setRunFailureMessage(
        runStatus.diagnostics[0]
          ?? (runStatus.status === "cancelled" ? "Run stopped." : "Assistant run failed."),
      );
      return;
    }

    if (runStatus.status === "completed") {
      setRunFailureMessage(null);
    }
  }, [
    activeThreadId,
    currentRoute,
    pendingPrompt,
    runStatus,
    sessionId,
    setActiveRunId,
    setPendingPrompt,
    setRunFailureMessage,
  ]);

  const messages = useMemo<ConversationMessage[]>(() => {
    const latestBatch = recommendationBatches[recommendationBatches.length - 1];
    const assistantIndex = rawMessages.findLastIndex((message) => message.role === "assistant");
    if (assistantIndex < 0) {
      return rawMessages;
    }
    const batchKind = latestBatch && "kind" in latestBatch ? latestBatch.kind : undefined;
    return rawMessages.map((message, index) =>
      message.uiTurn
        ? {
            ...message,
            kind: "buyer_turn",
            relatedPropertyIds: message.uiTurn.propertyIds,
            sourceMetadata:
              message.uiTurn.cards.find((card) => card.type === "market_sources")?.type === "market_sources"
                ? message.uiTurn.cards.find((card) => card.type === "market_sources")!.sources
                : message.sourceMetadata,
            runId: message.turnMeta?.runId ?? message.runId,
          }
        : index === assistantIndex && latestBatch
        ? {
            ...message,
            kind:
              message.kind !== "text"
                ? message.kind
                : batchKind ?? (latestBatch.properties.length > 0 ? "property_bundle" : "text"),
            relatedPropertyIds: latestBatch.properties.map((property: PropertyCardVM) => property.id),
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
      setRunFailureMessage(
        isGuest
          ? "Restoring your guest session. Try again in a moment."
          : "Sign in required before sending a prompt.",
      );
      return;
    }

    if (runtimeHealth.status !== "ready") {
      setRunFailureMessage(runtimeHealth.message ?? "AI runtime unavailable.");
      return;
    }

    const threadId = await ensureActiveThread();
    if (!threadId) {
      return;
    }
    const startedAt = Date.now();
    startTransition(() => {
      setRunFailureMessage(null);
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
      setRunFailureMessage(error instanceof Error ? error.message : "Unable to send prompt.");
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
      setRunFailureMessage(null);
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
    setRunFailureMessage(null);
    track("ai_response_stream_end", {
      sessionId,
      threadId: activeThreadId,
      route: currentRoute,
      stopped: true,
      source: "assistant",
    });
  };

  const handleTurnAction = async (action: BuyerAction, message: ConversationMessage) => {
    const basePayload = {
      sessionId,
      threadId: activeThreadId ?? undefined,
      route: currentRoute,
      source: "assistant",
      actionName: action.name,
      runId: message.turnMeta?.runId,
      messageId: message.id,
      recommendationBatchId: message.turnMeta?.recommendationBatchId,
      propertyId: "propertyId" in action.payload ? action.payload.propertyId : undefined,
    };

    if (action.name === "save_property") {
      if (isAuthenticated) {
        await toggleSavedPropertyMutation({ propertyExternalId: action.payload.propertyId });
      } else if (isGuest) {
        toggleGuestMirrorSavedProperty(action.payload.propertyId);
      }
      track("property_save", basePayload);
      return;
    }

    if (action.name === "compare_property") {
      toggleCompareProperty(action.payload.propertyId);
      track("property_compare", basePayload);
      return;
    }

    if (action.name === "open_property") {
      setSelectedPropertyId(action.payload.propertyId);
      track("property_click", basePayload);
      router.push(`/(app)/property/${action.payload.propertyId}`);
      return;
    }

    if (action.name === "contact_agent") {
      track("contact_agent", basePayload);
      if (action.payload.prompt) {
        await sendPrompt(action.payload.prompt);
        return;
      }
      if (action.payload.brokerId) {
        router.push(`/(app)/broker/${action.payload.brokerId}`);
        return;
      }
      if (action.payload.propertyId) {
        setSelectedPropertyId(action.payload.propertyId);
        router.push(`/(app)/property/${action.payload.propertyId}`);
      }
      return;
    }

    if (action.name === "schedule_visit") {
      track("schedule_visit", basePayload);
      if (action.payload.prompt) {
        await sendPrompt(action.payload.prompt);
        return;
      }
      setDraftText(`I want to schedule a visit for ${action.payload.propertyId}.`);
      return;
    }

    if (
      action.name === "refine_search"
      || action.name === "ask_followup"
      || action.name === "continue_thread"
    ) {
      track("ai_suggestion_clicked", basePayload);
      await sendPrompt(action.payload.prompt);
    }
  };

  return {
    activeThreadId,
    canUpgrade,
    isAnonymous: isGuest,
    runtimeHealth,
    messages,
    isStreaming,
    runFailureMessage,
    sendPrompt,
    stop,
    threads,
    recommendationBatches,
    runStageFeed,
    handleTurnAction,
    openUpgrade: () => router.push("/(auth)"),
    clearRunFailureMessage: () => setRunFailureMessage(null),
  };
}
