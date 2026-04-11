import { track } from "@/persistence/analytics/track";
import { useAppStore } from "@/store";
import {
  isSpeechRecognitionRuntimeAvailable,
  requestSpeechPermissions,
  speechRecognitionAvailable,
  startSpeechRecognition,
  stopSpeechRecognition,
  useSpeechRecognitionEvent,
  type SpeechRecognitionError,
  type SpeechRecognitionResult,
} from "@/voice/adapters/expoSpeechAdapter";

export function useVoiceComposer() {
  const sessionId = useAppStore((state) => state.sessionId);
  const setDraftText = useAppStore((state) => state.setDraftText);
  const setPermission = useAppStore((state) => state.setPermission);
  const setVoiceState = useAppStore((state) => state.setVoiceState);
  const setTranscript = useAppStore((state) => state.setTranscript);
  const setVoiceError = useAppStore((state) => state.setVoiceError);
  const voiceState = useAppStore((state) => state.voiceState);

  useSpeechRecognitionEvent("start", () => {
    setVoiceState("listening");
    setVoiceError(null);
    track("voice_input_started", { sessionId });
  });

  useSpeechRecognitionEvent("result", (event: SpeechRecognitionResult) => {
    const transcript = event.results?.[0]?.transcript ?? "";
    setTranscript(transcript);
    setDraftText(transcript);
    setVoiceState(event.isFinal ? "idle" : "transcribing");

    if (event.isFinal) {
      track("voice_input_completed", { sessionId, transcript });
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setVoiceState("idle");
  });

  useSpeechRecognitionEvent("error", (event: SpeechRecognitionError) => {
    setVoiceState("failed");
    setVoiceError(event.message);
  });

  const start = async () => {
    setVoiceState("requesting_permission");

    if (!isSpeechRecognitionRuntimeAvailable()) {
      setPermission("denied");
      setVoiceState("failed");
      setVoiceError("Voice input needs a development build. Expo Go will use text only.");
      return;
    }

    const permission = await requestSpeechPermissions();

    if (!permission.granted) {
      setPermission("denied");
      setVoiceState("failed");
      setVoiceError("Microphone permission denied.");
      return;
    }

    setPermission("granted");

    if (!speechRecognitionAvailable()) {
      setVoiceState("failed");
      setVoiceError("Speech recognition unavailable on this device.");
      return;
    }

    startSpeechRecognition();
  };

  const stop = () => {
    stopSpeechRecognition();
  };

  return {
    voiceState,
    start,
    stop,
  };
}
