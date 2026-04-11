import type { StateCreator } from "zustand";

import { mockProperties } from "@/persistence/mocks/mock-data";
import type { PropertyCardVM } from "@/types/domain";

export type PropertySlice = {
  properties: PropertyCardVM[];
  visiblePropertyIds: string[];
  selectedPropertyId: string | null;
  savedPropertyIds: string[];
  comparePropertyIds: string[];
  setVisiblePropertyIds: (ids: string[]) => void;
  setSelectedPropertyId: (id: string | null) => void;
  toggleSavedProperty: (id: string) => void;
  toggleCompareProperty: (id: string) => void;
};

export const createPropertySlice: StateCreator<PropertySlice, [], [], PropertySlice> = (set) => ({
  properties: mockProperties,
  visiblePropertyIds: mockProperties.map((property) => property.id),
  selectedPropertyId: mockProperties[0]?.id ?? null,
  savedPropertyIds: [mockProperties[0]?.id].filter(Boolean),
  comparePropertyIds: [],
  setVisiblePropertyIds: (ids) => set({ visiblePropertyIds: ids }),
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  toggleSavedProperty: (id) =>
    set((state) => ({
      savedPropertyIds: state.savedPropertyIds.includes(id)
        ? state.savedPropertyIds.filter((propertyId) => propertyId !== id)
        : [...state.savedPropertyIds, id],
    })),
  toggleCompareProperty: (id) =>
    set((state) => ({
      comparePropertyIds: state.comparePropertyIds.includes(id)
        ? state.comparePropertyIds.filter((propertyId) => propertyId !== id)
        : [...state.comparePropertyIds, id].slice(-2),
    })),
});
