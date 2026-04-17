import type { StateCreator } from "zustand";

export type ConversationSlice = {
  activeThreadId: string | null;
  activeRunId: string | null;
  isCreatingThread: boolean;
  pendingPrompt: string | null;
  pendingStartedAt: number | null;
  runFailureMessage: string | null;
  beginThreadCreation: () => void;
  cancelThreadCreation: () => void;
  setActiveThreadId: (threadId: string | null) => void;
  setActiveRunId: (runId: string | null) => void;
  setPendingPrompt: (prompt: string | null, startedAt?: number | null) => void;
  setRunFailureMessage: (message: string | null) => void;
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
  isCreatingThread: false,
  pendingPrompt: null,
  pendingStartedAt: null,
  runFailureMessage: null,
  beginThreadCreation: () =>
    set({
      activeThreadId: null,
      activeRunId: null,
      isCreatingThread: true,
      pendingPrompt: null,
      pendingStartedAt: null,
      runFailureMessage: null,
    }),
  cancelThreadCreation: () => set({ isCreatingThread: false }),
  setActiveThreadId: (threadId) =>
    set((state) => ({
      activeThreadId: threadId,
      isCreatingThread: threadId ? false : state.isCreatingThread,
    })),
  setActiveRunId: (runId) => set({ activeRunId: runId }),
  setPendingPrompt: (prompt, startedAt = prompt ? Date.now() : null) =>
    set({ pendingPrompt: prompt, pendingStartedAt: startedAt }),
  setRunFailureMessage: (message) => set({ runFailureMessage: message }),
  resetConversationState: () =>
    set({
      activeThreadId: null,
      activeRunId: null,
      isCreatingThread: false,
      pendingPrompt: null,
      pendingStartedAt: null,
      runFailureMessage: null,
    }),
});
