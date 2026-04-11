import { startTransition, useMemo, useRef } from "react";

import { buildSummary } from "@/conversation/utils/buildSummary";
import { track } from "@/persistence/analytics/track";
import { useAppStore } from "@/store";
import type { ConversationMessage } from "@/types/domain";

export function useConversationController() {
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionId = useAppStore((state) => state.sessionId);
  const properties = useAppStore((state) => state.properties);
  const draftText = useAppStore((state) => state.draftText);
  const activeTurnId = useAppStore((state) => state.activeTurnId);
  const addMessage = useAppStore((state) => state.addMessage);
  const clearDraft = useAppStore((state) => state.clearDraft);
  const setStreamingState = useAppStore((state) => state.setStreamingState);
  const updateAssistantMessage = useAppStore((state) => state.updateAssistantMessage);
  const stopStream = useAppStore((state) => state.stopStream);

  const rankedProperties = useMemo(
    () => [...properties].sort((left, right) => right.matchScore - left.matchScore),
    [properties],
  );

  const stop = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
    stopStream();
    track("ai_response_stream_end", { sessionId, stopped: true });
  };

  const sendPrompt = (overrideText?: string) => {
    const prompt = (overrideText ?? draftText).trim();
    if (!prompt) {
      return;
    }

    const userMessage: ConversationMessage = {
      id: `msg-user-${Date.now()}`,
      sessionId,
      role: "user",
      kind: "text",
      text: prompt,
      streamState: "complete",
      relatedPropertyIds: [],
      createdAt: Date.now(),
    };

    const assistantMessageId = `msg-assistant-${Date.now() + 1}`;
    const assistantMessage: ConversationMessage = {
      id: assistantMessageId,
      sessionId,
      role: "assistant",
      kind: "property_bundle",
      text: "",
      streamState: "streaming",
      relatedPropertyIds: rankedProperties.slice(0, 2).map((property) => property.id),
      createdAt: Date.now() + 1,
    };

    startTransition(() => {
      addMessage(userMessage);
      addMessage(assistantMessage);
      clearDraft();
    });

    track("ai_prompt_sent", { sessionId, prompt });
    track("ai_response_stream_start", { sessionId, assistantMessageId });

    const summary = buildSummary(prompt, rankedProperties);
    const words = summary.split(" ");
    let index = 0;

    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }

    timeoutRef.current = setInterval(() => {
      index += 1;
      const nextText = words.slice(0, index).join(" ");
      updateAssistantMessage(assistantMessageId, (message) => ({
        ...message,
        text: nextText,
      }));

      if (index >= words.length) {
        if (timeoutRef.current) {
          clearInterval(timeoutRef.current);
          timeoutRef.current = null;
        }
        setStreamingState(assistantMessageId, "complete", summary);
        track("ai_response_stream_end", { sessionId, assistantMessageId, stopped: false });
      }
    }, 60);
  };

  return {
    activeTurnId,
    sendPrompt,
    stop,
  };
}
