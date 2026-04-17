import { startTransition, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";

import type { AssistantAction } from "@/conversation/assistantProtocol";
import {
  ASSISTANT_PENDING_TIMEOUT_MS,
  hasPendingRunTimedOut,
  shouldResolveCompletedRunWithoutAssistant,
} from "@/conversation/lib/pendingRun";
import { useAuthSession } from "@/auth/useAuthSession";
import {
  canQueryConversationThread,
  resolveActiveConversationThreadId,
} from "@/conversation/lib/threadSelection";
import {
  appendE2EUserPrompt,
  completeE2EPrompt,
  createE2EThread,
} from "@/e2e/store";
import { track } from "@/persistence/analytics/track";
import { api } from "@/persistence/convex/api";
import {
  useAgentRuntimeHealth,
  useRunStageFeed,
  useRunStatus,
  useThreadMessages,
  useThreadsState,
} from "@/persistence/convex/useConversationData";
import { useAppStore } from "@/store";
import type { ConversationMessage } from "@/types/domain";

function isThreadNotFoundError(error: unknown) {
  return error instanceof Error && /Thread not found/i.test(error.message);
}

export function useConversationController() {
  const { canUpgrade, isGuest, isAuthenticated } = useAuthSession();
  const router = useRouter();
  const sessionId = useAppStore((state) => state.sessionId);
  const draftText = useAppStore((state) => state.draftText);
  const currentRoute = useAppStore((state) => state.currentRoute);
  const activeThreadId = useAppStore((state) => state.activeThreadId);
  const activeRunId = useAppStore((state) => state.activeRunId);
  const isCreatingThread = useAppStore((state) => state.isCreatingThread);
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

  const {
    threads,
    isLoaded: threadsLoaded,
    serverThreads,
    serverLoaded,
  } = useThreadsState();
  const startThreadMutation = useMutation(api.agent.public.startThread.startThread);
  const sendUserMessageMutation = useMutation(api.agent.public.sendUserMessage.sendUserMessage);
  const stopRunMutation = useMutation(api.agent.public.stopRun.stopRun);
  const toggleSavedListingMutation = useMutation(api.listings.toggleSavedListing);
  const runtimeHealth = useAgentRuntimeHealth();
  const resolvedThreadId = resolveActiveConversationThreadId({
    activeThreadId,
    isCreatingThread,
    threads,
    threadsLoaded,
  });
  const canQueryActiveThread = canQueryConversationThread({
    activeThreadId,
    isCreatingThread,
    threads: serverThreads,
    threadsLoaded: serverLoaded,
  });
  const messages = useThreadMessages(activeThreadId, pendingPrompt, canQueryActiveThread);
  const runStageFeed = useRunStageFeed(
    canQueryActiveThread ? activeThreadId : null,
    activeRunId,
    runtimeHealth.status === "ready" && Boolean(runtimeHealth.capabilities?.stageFeed),
  );
  const runStatus = useRunStatus(
    canQueryActiveThread ? activeThreadId : null,
    activeRunId,
    runtimeHealth.status === "ready" && Boolean(runtimeHealth.capabilities?.runStatus),
  );

  useEffect(() => {
    if (!threadsLoaded || isCreatingThread || resolvedThreadId === activeThreadId) {
      return;
    }

    setActiveThreadId(resolvedThreadId);
  }, [activeThreadId, isCreatingThread, resolvedThreadId, setActiveThreadId, threadsLoaded]);

  useEffect(() => () => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const hasCompletedAssistant = messages.some(
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
  }, [activeThreadId, currentRoute, messages, pendingPrompt, pendingStartedAt, sessionId, setActiveRunId, setPendingPrompt, setRunFailureMessage]);

  useEffect(() => {
    const hasCompletedAssistant = messages.some(
      (message) =>
        message.role === "assistant"
        && message.id !== "pending-assistant"
        && (!pendingStartedAt || message.createdAt >= pendingStartedAt),
    );

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

    if (shouldResolveCompletedRunWithoutAssistant(pendingPrompt, hasCompletedAssistant, runStatus.status)) {
      track("ai_response_stream_end", {
        sessionId,
        threadId: activeThreadId ?? undefined,
        route: currentRoute,
        stopped: false,
        source: "assistant",
      });
      setPendingPrompt(null);
      setActiveRunId(null);
      setRunFailureMessage("Assistant completed without a response. Please try again.");
      return;
    }

    if (runStatus.status === "completed" && hasCompletedAssistant) {
      setRunFailureMessage(null);
    }
  }, [activeThreadId, currentRoute, messages, pendingPrompt, pendingStartedAt, runStatus, sessionId, setActiveRunId, setPendingPrompt, setRunFailureMessage]);

  useEffect(() => {
    if (!pendingPrompt || !pendingStartedAt) {
      return;
    }

    const endStreamAsTimedOut = () => {
      track("ai_response_stream_end", {
        sessionId,
        threadId: activeThreadId ?? undefined,
        route: currentRoute,
        stopped: false,
        source: "assistant",
      });
      setPendingPrompt(null);
      setActiveRunId(null);
      setRunFailureMessage("Assistant is taking too long. Please try again.");
    };

    if (hasPendingRunTimedOut(pendingStartedAt)) {
      endStreamAsTimedOut();
      return;
    }

    const timer = setTimeout(
      endStreamAsTimedOut,
      ASSISTANT_PENDING_TIMEOUT_MS - (Date.now() - pendingStartedAt),
    );

    return () => {
      clearTimeout(timer);
    };
  }, [activeThreadId, currentRoute, pendingPrompt, pendingStartedAt, sessionId, setActiveRunId, setPendingPrompt, setRunFailureMessage]);

  const isStreaming = Boolean(pendingPrompt);

  const ensureActiveThread = async () => {
    if (!isAuthenticated) return null;
    if (canQueryActiveThread && activeThreadId) return activeThreadId;
    if (!serverLoaded && activeThreadId) {
      return null;
    }
    const latestServerThreadId = serverThreads[0]?._id ?? null;
    if (latestServerThreadId) {
      setActiveThreadId(latestServerThreadId);
      return latestServerThreadId;
    }

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
      setRunFailureMessage("Syncing your conversation threads. Try again in a moment.");
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
      if (result.threadId && result.threadId !== threadId) {
        setActiveThreadId(result.threadId);
      }
      setActiveRunId(String(result.runId));
    } catch (error) {
      if (isThreadNotFoundError(error)) {
        try {
          const replacementThreadId = await startThreadMutation({});
          setActiveThreadId(replacementThreadId);
          track("ai_prompt_sent", {
            sessionId,
            threadId: replacementThreadId,
            route: currentRoute,
            prompt,
            source: "assistant",
          });
          track("ai_response_stream_start", {
            sessionId,
            threadId: replacementThreadId,
            route: currentRoute,
            source: "assistant",
          });
          const retry = await sendUserMessageMutation({ threadId: replacementThreadId, prompt });
          if (retry.threadId && retry.threadId !== replacementThreadId) {
            setActiveThreadId(retry.threadId);
          }
          setActiveRunId(String(retry.runId));
          return;
        } catch (retryError) {
          setPendingPrompt(null);
          setRunFailureMessage(retryError instanceof Error ? retryError.message : "Unable to send prompt.");
          return;
        }
      }

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

  const handleTurnAction = async (action: AssistantAction, message: ConversationMessage) => {
    const basePayload = {
      sessionId,
      threadId: activeThreadId ?? undefined,
      route: currentRoute,
      source: "assistant",
      actionName: action.name,
      runId: message.turnMeta?.runId,
      messageId: message.id,
      propertyId: "propertyId" in action.payload ? action.payload.propertyId : undefined,
    };

    if (action.name === "save_property") {
      if (isAuthenticated) {
        await toggleSavedListingMutation({ listingId: action.payload.propertyId });
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
      if (action.payload.propertyId) {
        setDraftText(`I want to schedule a visit for ${action.payload.propertyId}.`);
      }
      return;
    }

    if (action.name === "open_search") {
      const searchPrompt = [
        action.payload.query,
        action.payload.location,
        action.payload.minPrice ? `min ${action.payload.minPrice}` : null,
        action.payload.maxPrice ? `max ${action.payload.maxPrice}` : null,
        action.payload.minBeds ? `${action.payload.minBeds}+ beds` : null,
      ].filter(Boolean).join(" ");
      if (searchPrompt) {
        setDraftText(searchPrompt);
      }
      track("ai_suggestion_clicked", basePayload);
      return;
    }

    if (action.name === "continue_thread") {
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
    runStageFeed,
    handleTurnAction,
    openUpgrade: () => router.push("/(auth)"),
    clearRunFailureMessage: () => setRunFailureMessage(null),
  };
}
