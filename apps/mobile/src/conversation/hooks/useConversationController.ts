import { startTransition, useEffect, useMemo, useRef } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";

import type { AssistantAction } from "@/conversation/assistantProtocol";
import {
  shouldResolveCompletedRunWithoutAssistant,
} from "@/conversation/lib/pendingRun";
import { getPendingRunTimeoutSnapshot } from "@/conversation/lib/runProgress";
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
import { getConvexUrl } from "@/runtime/expoRuntime";
import { useAppStore } from "@/store";
import type { ConversationMessage } from "@/types/domain";

function isThreadNotFoundError(error: unknown) {
  return error instanceof Error && /Thread not found/i.test(error.message);
}

function logMobileControllerEvent(
  event: string,
  payload: Record<string, unknown>,
  level: "info" | "warn" | "error" = "info",
) {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    scope: "mobile_controller",
    event,
    level,
    ...payload,
  });
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}

function isLiveRunStatus(status: string | null | undefined) {
  return status === "queued" || status === "running";
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
  const createBuyerIntentMutation = useMutation(api.buyer.createBuyerIntent);
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
  const runThreadId = canQueryActiveThread ? activeThreadId : null;
  const runStageFeed = useRunStageFeed(
    runThreadId,
    activeRunId,
    runtimeHealth.capabilities?.stageFeed ?? true,
  );
  const runStatus = useRunStatus(
    runThreadId,
    activeRunId,
    runtimeHealth.capabilities?.runStatus ?? true,
  );
  const hasCompletedAssistant = useMemo(() => messages.some(
    (message) =>
      message.role === "assistant"
      && message.id !== "pending-assistant"
      && (!pendingStartedAt || message.createdAt >= pendingStartedAt),
  ), [messages, pendingStartedAt]);
  const lastAssistantMessageAt = useMemo(() => {
    const assistantMessages = messages
      .filter(
        (message) =>
          message.role === "assistant"
          && message.id !== "pending-assistant"
          && (!pendingStartedAt || message.createdAt >= pendingStartedAt),
      )
      .map((message) => message.createdAt);

    return assistantMessages.length > 0 ? Math.max(...assistantMessages) : null;
  }, [messages, pendingStartedAt]);
  const lastStageAt = useMemo(() => (
    runStageFeed.length > 0 ? runStageFeed[runStageFeed.length - 1]?.timestamp ?? null : null
  ), [runStageFeed]);
  const lastStageSeq = runStageFeed.length > 0 ? runStageFeed[runStageFeed.length - 1]?.seq ?? null : null;
  const pendingTimeout = useMemo(() => getPendingRunTimeoutSnapshot({
    pendingStartedAt,
    runStatusUpdatedAt: runStatus?.updatedAt,
    lastStageAt,
    lastAssistantMessageAt,
    workerLastHeartbeatAt: runtimeHealth.worker?.available ? runtimeHealth.worker.lastHeartbeatAt ?? null : null,
  }), [
    lastAssistantMessageAt,
    lastStageAt,
    pendingStartedAt,
    runStatus?.updatedAt,
    runtimeHealth.worker?.available,
    runtimeHealth.worker?.lastHeartbeatAt,
  ]);

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
    if (!hasCompletedAssistant || (!pendingPrompt && !runFailureMessage)) {
      return;
    }

    logMobileControllerEvent("assistant_message_arrived", {
      threadId: activeThreadId ?? null,
      runId: activeRunId ?? null,
      pendingPrompt: Boolean(pendingPrompt),
      hadFailureBanner: Boolean(runFailureMessage),
      lastAssistantMessageAt,
    });
    if (pendingPrompt) {
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
    setRunFailureMessage(null);
  }, [activeRunId, activeThreadId, currentRoute, hasCompletedAssistant, lastAssistantMessageAt, pendingPrompt, runFailureMessage, sessionId, setActiveRunId, setPendingPrompt, setRunFailureMessage]);

  useEffect(() => {
    if (!pendingPrompt || !runStatus) {
      return;
    }

    if (runStatus.status === "failed" || runStatus.status === "cancelled") {
      logMobileControllerEvent("run_status_terminal", {
        threadId: activeThreadId ?? null,
        runId: activeRunId ?? null,
        workflowId: runStatus.workflowId ?? null,
        status: runStatus.status,
        reasonCode: runStatus.status === "cancelled" ? "workflow_cancelled" : "workflow_failed",
        diagnostics: runStatus.diagnostics,
      }, runStatus.status === "failed" ? "error" : "warn");
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
      logMobileControllerEvent("run_completed_without_assistant", {
        threadId: activeThreadId ?? null,
        runId: activeRunId ?? null,
        workflowId: runStatus.workflowId ?? null,
        status: runStatus.status,
      }, "warn");
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
  }, [activeRunId, activeThreadId, currentRoute, messages, pendingPrompt, pendingStartedAt, runStatus, sessionId, setActiveRunId, setPendingPrompt, setRunFailureMessage]);

  useEffect(() => {
    if (!pendingPrompt || !pendingStartedAt) {
      return;
    }

    if (hasCompletedAssistant || (runStatus && !isLiveRunStatus(runStatus.status))) {
      return;
    }

    const endStreamAsTimedOut = () => {
      const timeoutState = getPendingRunTimeoutSnapshot({
        pendingStartedAt,
        runStatusUpdatedAt: runStatus?.updatedAt,
        lastStageAt,
        lastAssistantMessageAt,
        workerLastHeartbeatAt: runtimeHealth.worker?.available ? runtimeHealth.worker.lastHeartbeatAt ?? null : null,
        now: Date.now(),
      });
      if (!timeoutState.hasTimedOut) {
        return;
      }

      const timeoutMessage = runtimeHealth.worker?.available === false
        ? runtimeHealth.message ?? "AI worker offline. Start `npm run convex` so runs can complete."
        : "Assistant is taking too long. Please try again.";
      logMobileControllerEvent("run_timeout_decision", {
        threadId: activeThreadId ?? null,
        runId: activeRunId ?? null,
        workflowId: runStatus?.workflowId ?? null,
        reasonCode: runtimeHealth.worker?.available === false ? "worker_offline" : "timeout",
        runtimeStatus: runtimeHealth.status,
        lastRunStatusUpdatedAt: runStatus?.updatedAt ?? null,
        lastStageAt,
        lastStageSeq,
        lastAssistantMessageAt,
        lastProgressAt: timeoutState.lastProgressAt,
        timeoutAt: timeoutState.timeoutAt,
        timeoutKind: timeoutState.timedOutBy,
        convexUrl: getConvexUrl() || null,
        featureVersion: runtimeHealth.featureVersion ?? null,
        workerAvailable: runtimeHealth.worker?.available ?? null,
      }, "warn");
      track("ai_response_stream_end", {
        sessionId,
        threadId: activeThreadId ?? undefined,
        route: currentRoute,
        stopped: false,
        source: "assistant",
      });
      setPendingPrompt(null);
      setActiveRunId(null);
      setRunFailureMessage(timeoutMessage);
    };

    if (pendingTimeout.hasTimedOut) {
      endStreamAsTimedOut();
      return;
    }

    if (pendingTimeout.msUntilTimeout == null) {
      return;
    }

    const timer = setTimeout(endStreamAsTimedOut, pendingTimeout.msUntilTimeout);

    return () => {
      clearTimeout(timer);
    };
  }, [
    activeRunId,
    activeThreadId,
    currentRoute,
    hasCompletedAssistant,
    lastAssistantMessageAt,
    lastStageAt,
    lastStageSeq,
    pendingPrompt,
    pendingStartedAt,
    pendingTimeout.hasTimedOut,
    pendingTimeout.msUntilTimeout,
    runStatus?.status,
    runStatus?.updatedAt,
    runStatus?.workflowId,
    runtimeHealth.message,
    runtimeHealth.status,
    runtimeHealth.featureVersion,
    runtimeHealth.worker?.available,
    runtimeHealth.worker?.lastHeartbeatAt,
    sessionId,
    setActiveRunId,
    setPendingPrompt,
    setRunFailureMessage,
  ]);

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
    logMobileControllerEvent("send_start", {
      threadId: activeThreadId ?? null,
      runId: activeRunId ?? null,
      runtimeStatus: runtimeHealth.status,
      workerAvailable: runtimeHealth.worker?.available ?? null,
      featureVersion: runtimeHealth.featureVersion ?? null,
      webSearchConfigured: runtimeHealth.webSearch?.configured ?? null,
      promptLength: prompt.length,
    });

    if (!isAuthenticated) {
      logMobileControllerEvent("send_blocked", {
        reasonCode: "auth_required",
        isGuest,
      }, "warn");
      setRunFailureMessage(
        isGuest
          ? "Restoring your guest session. Try again in a moment."
          : "Sign in required before sending a prompt.",
      );
      return;
    }

    if (runtimeHealth.status !== "ready") {
      logMobileControllerEvent("send_blocked", {
        reasonCode: runtimeHealth.worker?.available === false ? "worker_offline" : "runtime_unavailable",
        runtimeStatus: runtimeHealth.status,
        featureVersion: runtimeHealth.featureVersion ?? null,
      }, "warn");
      setRunFailureMessage(runtimeHealth.message ?? "Checking AI runtime. Try again in a moment.");
      return;
    }

    const threadId = await ensureActiveThread();
    if (!threadId) {
      logMobileControllerEvent("send_blocked", {
        reasonCode: "thread_unavailable",
      }, "warn");
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
      logMobileControllerEvent("send_mutation_success", {
        threadId,
        runId: String(result.runId),
        serverThreadId: result.threadId,
        threadReconciled: Boolean(result.threadId && result.threadId !== threadId),
      });
      if (result.threadId && result.threadId !== threadId) {
        setActiveThreadId(result.threadId);
      }
      setActiveRunId(String(result.runId));
    } catch (error) {
      logMobileControllerEvent("send_mutation_failed", {
        threadId,
        runId: activeRunId ?? null,
        reasonCode: isThreadNotFoundError(error) ? "thread_not_found" : "send_failed",
        error: error instanceof Error ? error.message : String(error),
      }, "error");
      if (isThreadNotFoundError(error)) {
        try {
          const replacementThreadId = await startThreadMutation({});
          logMobileControllerEvent("thread_recovered", {
            reasonCode: "thread_recovered",
            oldThreadId: threadId,
            replacementThreadId,
          }, "warn");
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
          logMobileControllerEvent("send_retry_success", {
            threadId: replacementThreadId,
            runId: String(retry.runId),
            serverThreadId: retry.threadId,
            threadReconciled: Boolean(retry.threadId && retry.threadId !== replacementThreadId),
          });
          if (retry.threadId && retry.threadId !== replacementThreadId) {
            setActiveThreadId(retry.threadId);
          }
          setActiveRunId(String(retry.runId));
          return;
        } catch (retryError) {
          logMobileControllerEvent("send_retry_failed", {
            threadId,
            reasonCode: "thread_not_found",
            error: retryError instanceof Error ? retryError.message : String(retryError),
          }, "error");
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
      if (!isAuthenticated) {
        track("contact_agent", { ...basePayload, authRequired: true });
        router.push("/(auth)");
        return;
      }
      if (action.payload.propertyId) {
        await createBuyerIntentMutation({
          listingId: action.payload.propertyId,
          intentType: "contact",
          source: "assistant",
          threadId: activeThreadId ?? undefined,
          prompt: action.payload.prompt,
        });
      }
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
      if (!isAuthenticated) {
        track("schedule_visit", { ...basePayload, authRequired: true });
        router.push("/(auth)");
        return;
      }
      if (action.payload.propertyId) {
        await createBuyerIntentMutation({
          listingId: action.payload.propertyId,
          intentType: "schedule_visit",
          source: "assistant",
          threadId: activeThreadId ?? undefined,
          prompt: action.payload.prompt,
        });
      }
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
