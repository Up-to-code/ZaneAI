import type { StateCreator } from "zustand";

export type SessionSlice = {
  isAuthenticated: boolean;
  sessionId: string;
  currentRoute: string;
  hydrationComplete: boolean;
  setAuthenticated: (value: boolean) => void;
  setCurrentRoute: (route: string) => void;
  setHydrationComplete: (value: boolean) => void;
};

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set) => ({
  isAuthenticated: false,
  sessionId: `session-${Date.now()}`,
  currentRoute: "/",
  hydrationComplete: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setCurrentRoute: (route) => set({ currentRoute: route }),
  setHydrationComplete: (value) => set({ hydrationComplete: value }),
});
