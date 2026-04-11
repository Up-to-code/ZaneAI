import type { StateCreator } from "zustand";

import { mockPreferenceProfile } from "@/persistence/mocks/mock-data";
import type { PreferenceProfile } from "@/types/domain";

export type PreferenceSlice = {
  preferenceProfile: PreferenceProfile;
  patchPreferenceProfile: (value: Partial<PreferenceProfile>) => void;
};

export const createPreferenceSlice: StateCreator<PreferenceSlice, [], [], PreferenceSlice> = (set) => ({
  preferenceProfile: mockPreferenceProfile,
  patchPreferenceProfile: (value) =>
    set((state) => ({
      preferenceProfile: {
        ...state.preferenceProfile,
        ...value,
      },
    })),
});
