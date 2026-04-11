import { useEffect, useState, useMemo } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type KeyboardEventName,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
} from "react-native";
import { ArrowUp, Mic, MicOff, Square } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";
import { useVoiceComposer } from "@/voice/hooks/useVoiceComposer";
import { RecordingVisualizer } from "@/voice/components/RecordingVisualizer";

type ZayonComposerDockProps = {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  keyboardVisible?: boolean;
};

export function ZayonComposerDock({
  onSend,
  onStop,
  isStreaming,
  keyboardVisible = false,
}: ZayonComposerDockProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);
  const [inputHeight, setInputHeight] = useState(24);
  const draftText = useAppStore((state) => state.draftText);
  const setDraftText = useAppStore((state) => state.setDraftText);
  const setComposerDockHeight = useAppStore((state) => state.setComposerDockHeight);
  const setKeyboardHeight = useAppStore((state) => state.setKeyboardHeight);
  const setComposerFocused = useAppStore((state) => state.setComposerFocused);
  const { voiceState, start, stop } = useVoiceComposer();

  const isRecording = voiceState === "listening" || voiceState === "transcribing";
  const isVoicePending = voiceState === "requesting_permission";
  const hasText = draftText.trim().length > 0;
  const inputExpanded = draftText.includes("\n") || draftText.trim().length > 52;

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent as KeyboardEventName, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent as KeyboardEventName, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [setKeyboardHeight]);

  useEffect(() => {
    if (!draftText.trim().length) {
      setInputHeight(24);
    }
  }, [draftText]);

  useEffect(() => {
    if (isStreaming) {
      Keyboard.dismiss();
      setComposerFocused(false);
    }
  }, [isStreaming, setComposerFocused]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setComposerDockHeight(event.nativeEvent.layout.height);
  };

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const contentHeight = Math.round(event.nativeEvent.contentSize.height);
    setInputHeight(Math.min(Math.max(contentHeight, 24), 120));
  };

  const handleSend = () => {
    const value = draftText.trim();
    if (!value) return;
    Keyboard.dismiss();
    setComposerFocused(false);
    onSend(value);
    setDraftText("");
  };

  const handleVoicePress = () => {
    if (isRecording) {
      stop();
      return;
    }

    void start();
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        keyboardVisible ? styles.keyboardOpen : null,
      ]}
    >
      <View style={styles.backdrop} />

      <View style={styles.inputRow}>
        <View style={[styles.fieldSurface, inputExpanded ? styles.fieldSurfaceExpanded : null]}>
          {isRecording ? (
            <View style={styles.visualizerWrap}>
              <RecordingVisualizer active={isRecording} />
            </View>
          ) : (
            <TextInput
              value={draftText}
              onChangeText={setDraftText}
              onContentSizeChange={handleContentSizeChange}
              multiline
              blurOnSubmit={false}
              autoCorrect
              autoCapitalize="sentences"
              enablesReturnKeyAutomatically
              placeholder="Type your follow-up here..."
              placeholderTextColor={colors.textMuted}
              cursorColor={colors.accent}
              selectionColor={colors.accent}
              underlineColorAndroid="transparent"
              textAlignVertical="top"
              scrollEnabled={inputExpanded}
              onFocus={() => setComposerFocused(true)}
              onBlur={() => setComposerFocused(false)}
              style={[styles.input, { height: inputHeight }]}
            />
          )}
        </View>

        <View style={styles.actionWell}>
          {isStreaming ? (
            <Pressable
              onPress={onStop}
              style={({ pressed }) => [
                styles.actionButton,
                styles.actionActive,
                pressed ? styles.actionPressed : null,
              ]}
            >
              <Square size={18} color={colors.textPrimary} fill={colors.textPrimary} />
            </Pressable>
          ) : hasText && !isRecording ? (
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                styles.actionButton,
                styles.actionActive,
                pressed ? styles.actionPressed : null,
              ]}
            >
              <ArrowUp size={18} color={colors.textPrimary} />
            </Pressable>
          ) : (
            <Pressable
              disabled={isVoicePending}
              onPress={handleVoicePress}
              style={({ pressed }) => [
                styles.actionButton,
                isRecording ? styles.actionActive : styles.actionIdle,
                pressed ? styles.actionPressed : null,
                isVoicePending ? styles.actionDisabled : null,
              ]}
            >
              {isRecording ? (
                <MicOff size={18} color={colors.textPrimary} />
              ) : (
                <Mic size={18} color={colors.textSecondary} />
              )}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any, insets: any) => StyleSheet.create({
  container: {
    zIndex: 20,
    backgroundColor: "transparent",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: Math.max(insets.bottom, theme.spacing.md),
  },
  keyboardOpen: {
    paddingBottom: theme.spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  fieldSurface: {
    flex: 1,
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    justifyContent: "center",
    // Premium floating shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  fieldSurfaceExpanded: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  input: {
    minHeight: 24,
    maxHeight: 120,
    color: colors.textPrimary,
    fontFamily: "Manrope_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: "transparent",
    paddingVertical: 0,
    includeFontPadding: false,
  },
  visualizerWrap: {
    minHeight: 24,
    justifyContent: "center",
  },
  actionWell: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    // Same shadow as field for balance
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  actionActive: {
    backgroundColor: colors.accent,
  },
  actionIdle: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
