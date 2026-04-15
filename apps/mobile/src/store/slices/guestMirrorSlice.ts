import type { StateCreator } from "zustand";

import type { ConversationMessage } from "@/types/domain";

export type GuestMirrorThread = {
  _id: string;
  _creationTime: number;
  title: string | null;
  summary: string | null;
  messages: ConversationMessage[];
};

export type GuestMirrorSlice = {
  guestMirrorThreads: GuestMirrorThread[];
  guestMirrorSavedPropertyIds: string[];
  guestMirrorComparePropertyIds: string[];
  guestMirrorActiveThreadId: string | null;
  syncGuestMirrorThreadSummaries: (
    threads: Array<Pick<GuestMirrorThread, "_id" | "_creationTime" | "title" | "summary">>,
  ) => void;
  storeGuestMirrorThreadMessages: (threadId: string, messages: ConversationMessage[]) => void;
  setGuestMirrorSavedPropertyIds: (propertyIds: string[]) => void;
  toggleGuestMirrorSavedProperty: (propertyId: string) => void;
  setGuestMirrorComparePropertyIds: (propertyIds: string[]) => void;
  setGuestMirrorActiveThreadId: (threadId: string | null) => void;
  clearGuestMirror: () => void;
};

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values));
}

export const createGuestMirrorSlice: StateCreator<GuestMirrorSlice, [], [], GuestMirrorSlice> = (set) => ({
  guestMirrorThreads: [],
  guestMirrorSavedPropertyIds: [],
  guestMirrorComparePropertyIds: [],
  guestMirrorActiveThreadId: null,
  syncGuestMirrorThreadSummaries: (threads) =>
    set((state) => {
      const previousMessages = new Map(
        state.guestMirrorThreads.map((thread) => [thread._id, thread.messages]),
      );

      return {
        guestMirrorThreads: [...threads]
          .sort((left, right) => right._creationTime - left._creationTime)
          .map((thread) => ({
            ...thread,
            messages: previousMessages.get(thread._id) ?? [],
          })),
      };
    }),
  storeGuestMirrorThreadMessages: (threadId, messages) =>
    set((state) => {
      const existing = state.guestMirrorThreads.find((thread) => thread._id === threadId);

      if (!existing) {
        return {
          guestMirrorThreads: [
            {
              _id: threadId,
              _creationTime: messages[0]?.createdAt ?? Date.now(),
              title: "Untitled search",
              summary: "Recovered guest conversation.",
              messages,
            },
            ...state.guestMirrorThreads,
          ],
        };
      }

      return {
        guestMirrorThreads: state.guestMirrorThreads.map((thread) =>
          thread._id === threadId
            ? {
                ...thread,
                messages,
              }
            : thread,
        ),
      };
    }),
  setGuestMirrorSavedPropertyIds: (propertyIds) =>
    set({
      guestMirrorSavedPropertyIds: dedupeStrings(propertyIds),
    }),
  toggleGuestMirrorSavedProperty: (propertyId) =>
    set((state) => ({
      guestMirrorSavedPropertyIds: state.guestMirrorSavedPropertyIds.includes(propertyId)
        ? state.guestMirrorSavedPropertyIds.filter((id) => id !== propertyId)
        : dedupeStrings([...state.guestMirrorSavedPropertyIds, propertyId]),
    })),
  setGuestMirrorComparePropertyIds: (propertyIds) =>
    set({
      guestMirrorComparePropertyIds: dedupeStrings(propertyIds).slice(-2),
    }),
  setGuestMirrorActiveThreadId: (threadId) =>
    set({
      guestMirrorActiveThreadId: threadId,
    }),
  clearGuestMirror: () =>
    set({
      guestMirrorThreads: [],
      guestMirrorSavedPropertyIds: [],
      guestMirrorComparePropertyIds: [],
      guestMirrorActiveThreadId: null,
    }),
});
