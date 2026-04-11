import type { StateCreator } from "zustand";

import { initialMessages } from "@/persistence/mocks/mock-data";
import type { ConversationMessage, StreamState } from "@/types/domain";

export type ConversationSlice = {
  messages: ConversationMessage[];
  isStreaming: boolean;
  activeTurnId: string | null;
  setMessages: (messages: ConversationMessage[]) => void;
  addMessage: (message: ConversationMessage) => void;
  updateAssistantMessage: (messageId: string, updater: (message: ConversationMessage) => ConversationMessage) => void;
  setStreamingState: (messageId: string, value: StreamState, text?: string) => void;
  stopStream: () => void;
  newThread: () => void;
};

export const createConversationSlice: StateCreator<
  ConversationSlice & { sessionId: string },
  [],
  [],
  ConversationSlice
> = (set, get) => ({
  messages: initialMessages(get()?.sessionId ?? `session-${Date.now()}`),
  isStreaming: false,
  activeTurnId: null,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      activeTurnId: message.role === "assistant" ? message.id : state.activeTurnId,
      isStreaming: message.streamState === "streaming" ? true : state.isStreaming,
    })),
  updateAssistantMessage: (messageId, updater) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? updater(message) : message,
      ),
    })),
  setStreamingState: (messageId, value, text) =>
    set((state) => ({
      isStreaming: value === "streaming",
      activeTurnId: value === "streaming" ? messageId : null,
      messages: state.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              streamState: value,
              text: text ?? message.text,
            }
          : message,
      ),
    })),
  stopStream: () =>
    set((state) => ({
      isStreaming: false,
      activeTurnId: null,
      messages: state.messages.map((message) =>
        message.streamState === "streaming"
          ? {
              ...message,
              streamState: "stopped",
            }
          : message,
      ),
    })),
  newThread: () =>
    set({
      messages: [],
      isStreaming: false,
      activeTurnId: null,
    }),
});
