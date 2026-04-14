import type { StateCreator } from "zustand";

import type { PreferenceProfile } from "@/types/domain";

export type AppearanceMode = "system" | "light" | "dark";

export type PreferenceSlice = {
  preferenceProfile: PreferenceProfile;
  appearanceMode: AppearanceMode;
  patchPreferenceProfile: (value: Partial<PreferenceProfile>) => void;
  setAppearanceMode: (value: AppearanceMode) => void;
};

const defaultPreferenceProfile: PreferenceProfile = {
  budgetRange: [2500000, 5000000],
  locations: ["New Cairo", "Sheikh Zayed", "North Coast"],
  bedrooms: [2, 3],
  propertyTypes: ["Apartment", "Villa"],
  commutePrefs: ["Walkable lifestyle", "Fast access"],
  confidence: 0.5,
  updatedFrom: "bootstrap",
};

export const createPreferenceSlice: StateCreator<PreferenceSlice, [], [], PreferenceSlice> = (set) => ({
  preferenceProfile: defaultPreferenceProfile,
  appearanceMode: "system",
  patchPreferenceProfile: (value) =>
    set((state) => ({
      preferenceProfile: {
        ...state.preferenceProfile,
        ...value,
      },
    })),
  setAppearanceMode: (value) => set({ appearanceMode: value }),
});
