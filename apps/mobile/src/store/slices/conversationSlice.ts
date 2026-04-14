import type { StateCreator } from "zustand";

export type ConversationSlice = {
  activeThreadId: string | null;
  activeRunId: string | null;
  pendingPrompt: string | null;
  pendingStartedAt: number | null;
  setActiveThreadId: (threadId: string | null) => void;
  setActiveRunId: (runId: string | null) => void;
  setPendingPrompt: (prompt: string | null, startedAt?: number | null) => void;
  resetConversationState: () => void;
};

export const createConversationSlice: StateCreator<
  ConversationSlice,
  [],
  [],
  ConversationSlice
> = (set) => ({
  activeThreadId: null,
  activeRunId: null,
  pendingPrompt: null,
  pendingStartedAt: null,
  setActiveThreadId: (threadId) => set({ activeThreadId: threadId }),
  setActiveRunId: (runId) => set({ activeRunId: runId }),
  setPendingPrompt: (prompt, startedAt = prompt ? Date.now() : null) =>
    set({ pendingPrompt: prompt, pendingStartedAt: startedAt }),
  resetConversationState: () =>
    set({
      activeThreadId: null,
      activeRunId: null,
      pendingPrompt: null,
      pendingStartedAt: null,
    }),
});
