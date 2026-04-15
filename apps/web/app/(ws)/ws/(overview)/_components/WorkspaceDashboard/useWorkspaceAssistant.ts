"use client";

import { useState } from "react";
import type { ZaneAiProThread } from "@/server/contracts/zaneAiPro";
import type { AIMotionState } from "../../../_components/AIMotion";

export type AssistantInitialRouteState = {
  requestedThreadId: string | null;
  unavailableThreadId: string | null;
};

type UseWorkspaceAssistantParams = {
  initialThread: ZaneAiProThread | null;
  initialRouteState: AssistantInitialRouteState;
};

/**
 * WHY:   The old live assistant orchestration is not part of the static web demo.
 * WHAT:  Provides a tiny local state shim that satisfies the legacy dashboard component contract.
 * HOW:   Keeps only client-side draft state and returns inert callbacks for the removed realtime behaviors.
 */
export function useWorkspaceAssistant({
  initialThread,
  initialRouteState,
}: UseWorkspaceAssistantParams) {
  const [value, setValue] = useState("");
  const [unavailableThreadId, setUnavailableThreadId] = useState<string | null>(
    initialRouteState.unavailableThreadId,
  );

  const liveAssistantMotionState: AIMotionState = "idle";

  return {
    thread: initialThread,
    value,
    setValue,
    sendError: null as string | null,
    isLoadingThread: false,
    isSending: false,
    isVoiceRecording: false,
    isVoiceTranscribing: false,
    voiceProcessingPhase: "idle" as const,
    canRegenerate: false,
    activeTeamId: null as string | null,
    activeAgentName: null as string | null,
    liveAssistantMotionState,
    liveStageLabel: "",
    voiceLevels: [] as number[],
    unavailableThreadId,
    toggleVoiceRecording: () => undefined,
    handleStopStreaming: () => undefined,
    handleRegenerate: () => undefined,
    handleResetUnavailableThread: () => setUnavailableThreadId(null),
    handleSend: () => undefined,
  };
}
