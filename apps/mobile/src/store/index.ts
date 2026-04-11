import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { createComposerSlice, type ComposerSlice } from "@/store/slices/composerSlice";
import { createConversationSlice, type ConversationSlice } from "@/store/slices/conversationSlice";
import { createPreferenceSlice, type PreferenceSlice } from "@/store/slices/preferenceSlice";
import { createPropertySlice, type PropertySlice } from "@/store/slices/propertySlice";
import { createSessionSlice, type SessionSlice } from "@/store/slices/sessionSlice";
import { createUiSlice, type UiSlice } from "@/store/slices/uiSlice";
import { createVoiceSlice, type VoiceSlice } from "@/store/slices/voiceSlice";

export type AppStore = SessionSlice &
  ConversationSlice &
  ComposerSlice &
  VoiceSlice &
  PropertySlice &
  PreferenceSlice &
  UiSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createSessionSlice(...args),
      ...createConversationSlice(...args),
      ...createComposerSlice(...args),
      ...createVoiceSlice(...args),
      ...createPropertySlice(...args),
      ...createPreferenceSlice(...args),
      ...createUiSlice(...args),
    }),
    {
      name: "zayon-mobile-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
        savedPropertyIds: state.savedPropertyIds,
        comparePropertyIds: state.comparePropertyIds,
        preferenceProfile: state.preferenceProfile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrationComplete(true);
      },
    },
  ),
);

export const selectors = {
  propertiesById: (state: AppStore) =>
    state.properties.reduce<Record<string, (typeof state.properties)[number]>>((accumulator, property) => {
      accumulator[property.id] = property;
      return accumulator;
    }, {}),
};
