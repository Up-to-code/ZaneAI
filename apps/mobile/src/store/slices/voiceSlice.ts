import type { StateCreator } from "zustand";

import type { VoiceMode } from "@/types/domain";

export type VoiceSlice = {
  permission: "unknown" | "granted" | "denied";
  voiceState: VoiceMode;
  transcript: string;
  error: string | null;
  setPermission: (value: VoiceSlice["permission"]) => void;
  setVoiceState: (value: VoiceMode) => void;
  setTranscript: (value: string) => void;
  setVoiceError: (value: string | null) => void;
  resetVoice: () => void;
};

export const createVoiceSlice: StateCreator<VoiceSlice, [], [], VoiceSlice> = (set) => ({
  permission: "unknown",
  voiceState: "idle",
  transcript: "",
  error: null,
  setPermission: (value) => set({ permission: value }),
  setVoiceState: (value) => set({ voiceState: value }),
  setTranscript: (value) => set({ transcript: value }),
  setVoiceError: (value) => set({ error: value }),
  resetVoice: () => set({ voiceState: "idle", transcript: "", error: null }),
});
