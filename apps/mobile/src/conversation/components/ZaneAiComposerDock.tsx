import { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type KeyboardEventName,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { ArrowUp, Mic, Square } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { Text } from "@/foundation/primitives/Text";
import { useAppStore } from "@/store";
import { useVoiceComposer } from "@/voice/hooks/useVoiceComposer";
import { RecordingVisualizer } from "@/voice/components/RecordingVisualizer";
import { Image } from "expo-image";
import type { ImageSource } from "expo-image";

type ZaneAiComposerDockProps = {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  disabledReason?: string;
  canUpgrade?: boolean;
  onUpgrade?: () => void;
  keyboardVisible?: boolean;
  messageCount?: number;
};

type PlacePrompt = {
  id: string;
  name: string;
  tag: string;
  image: ImageSource;
  query: string;
};

const PLACE_PROMPTS: PlacePrompt[] = [
  {
    id: "new_cairo",
    name: "New Cairo",
    tag: "Villas & Compounds",
    image: require("../../../assets/places/new_cairo.png"),
    query: "Show me properties in New Cairo — villas and compounds",
  },
  {
    id: "sheikh_zayed",
    name: "Sheikh Zayed",
    tag: "Gated Communities",
    image: require("../../../assets/places/sheikh_zayed.png"),
    query: "Find gated compound apartments in Sheikh Zayed City",
  },
  {
    id: "maadi",
    name: "Maadi",
    tag: "Leafy Suburb · Nile Views",
    image: require("../../../assets/places/maadi.png"),
    query: "What are the best villas and houses for sale in Maadi?",
  },
  {
    id: "new_capital",
    name: "New Capital",
    tag: "Rising City · Best ROI",
    image: require("../../../assets/places/new_capital.png"),
    query: "Show investment opportunities in the New Administrative Capital",
  },
  {
    id: "north_coast",
    name: "North Coast",
    tag: "Sahel · Beachfront",
    image: require("../../../assets/places/north_coast.png"),
    query: "Find beach chalets and villas on Egypt's North Coast",
  },
  {
    id: "october",
    name: "6th October",
    tag: "Affordable · Family",
    image: require("../../../assets/places/october_city.png"),
    query: "Show family apartments and compounds in 6th October City",
  },
];

export function ZaneAiComposerDock({
  onSend,
  onStop,
  isStreaming,
  disabled = false,
  disabledReason,
  canUpgrade = false,
  onUpgrade,
  keyboardVisible = false,
  messageCount = 0,
}: ZaneAiComposerDockProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);
  const [inputHeight, setInputHeight] = useState(24);
  const draftText = useAppStore((state) => state.draftText);
  const setDraftText = useAppStore((state) => state.setDraftText);
  const setComposerDockHeight = useAppStore((state) => state.setComposerDockHeight);
  const setKeyboardHeight = useAppStore((state) => state.setKeyboardHeight);
  const setComposerFocused = useAppStore((state) => state.setComposerFocused);
  const setVoiceError = useAppStore((state) => state.setVoiceError);
  const setVoiceState = useAppStore((state) => state.setVoiceState);
  const { voiceState, audioLevel, error, start, stop } = useVoiceComposer();

  const isNewThread = messageCount === 0;
  const isRecording =
    voiceState === "requesting_permission" ||
    voiceState === "listening" ||
    voiceState === "transcribing";
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
    if (isStreaming) {
      Keyboard.dismiss();
      setComposerFocused(false);
    }
  }, [isStreaming, setComposerFocused]);

  useEffect(() => {
    if (!error) return;

    Alert.alert("Voice input unavailable", error, [
      {
        text: "OK",
        onPress: () => {
          setVoiceError(null);
          setVoiceState("idle");
        },
      },
    ]);
  }, [error, setVoiceError, setVoiceState]);

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
    if (!value || disabled) return;
    Keyboard.dismiss();
    setComposerFocused(false);
    onSend(value);
    setDraftText("");
  };

  const handleVoicePress = () => {
    if (disabled) return;
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
      {/* Floating Pure Canvas Utilities */}

      {disabledReason ? (
        <View style={styles.disabledBanner}>
          <Text style={styles.disabledBannerText}>{disabledReason}</Text>
          {canUpgrade && onUpgrade ? (
            <Pressable style={styles.disabledBannerAction} onPress={onUpgrade}>
              <Text variant="caption" style={styles.disabledBannerActionText}>Upgrade</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {isNewThread && (
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          exiting={FadeOutDown.duration(200)}
          style={styles.promptsContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptsScroll}
            keyboardShouldPersistTaps="handled"
          >
            {PLACE_PROMPTS.map((place) => (
              <Pressable
                key={place.id}
                onPress={() => setDraftText(place.query)}
                style={({ pressed }) => [
                  styles.placeCard,
                  pressed ? styles.placeCardPressed : null,
                ]}
              >
                <Text style={styles.placeName} numberOfLines={1}>
                  {place.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      <View style={[styles.unifiedBar, inputExpanded ? styles.unifiedBarExpanded : null]}>
        <View style={styles.inputField}>
          {isRecording ? (
            <View style={styles.visualizerWrap}>
              <RecordingVisualizer active={isRecording} level={audioLevel} />
            </View>
          ) : (
            <TextInput
              testID="chat.composer"
              value={draftText}
              editable={!disabled}
              onChangeText={setDraftText}
              onContentSizeChange={handleContentSizeChange}
              multiline
              blurOnSubmit={false}
              autoCorrect
              autoCapitalize="sentences"
              enablesReturnKeyAutomatically
              placeholder={disabled ? "AI unavailable right now" : "Type your follow-up here..."}
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
              <Square size={16} color="#FFFFFF" fill="#FFFFFF" />
            </Pressable>
          ) : hasText && !isRecording ? (
            <Pressable
              testID="chat.send"
              disabled={disabled}
              onPress={handleSend}
              style={({ pressed }) => [
                styles.actionButton,
                styles.actionActive,
                pressed ? styles.actionPressed : null,
                disabled ? styles.actionDisabled : null,
              ]}
            >
              <ArrowUp size={18} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>
          ) : (
            <Pressable
              disabled={isVoicePending || disabled}
              onPress={handleVoicePress}
              style={({ pressed }) => [
                styles.actionButton,
                isRecording ? styles.actionActive : styles.actionIdle,
                pressed ? styles.actionPressed : null,
                isVoicePending || disabled ? styles.actionDisabled : null,
              ]}
            >
              {isRecording ? (
                <Square size={16} color="#FFFFFF" fill="#FFFFFF" />
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
    zIndex: 2000,
    backgroundColor: "transparent",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 10,
    paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
  },
  keyboardOpen: {
    paddingBottom: 8,
  },
  promptsContainer: {
    marginBottom: 12,
  },
  disabledBanner: {
    marginBottom: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: theme.radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabledBannerText: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disabledBannerAction: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },
  disabledBannerActionText: {
    color: colors.background,
    fontFamily: "Manrope_700Bold",
  },
  promptsScroll: {
    paddingHorizontal: 0,
    gap: 8,
  },
  placeCard: {
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSoft,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  placeCardPressed: {
    opacity: 0.7,
    backgroundColor: colors.backgroundSoft,
    transform: [{ scale: 0.98 }],
  },
  placeName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: colors.textPrimary,
  },
  unifiedBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceRaised,
    paddingLeft: theme.spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unifiedBarExpanded: {
    borderRadius: 24,
  },
  inputField: {
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingRight: 8,
  },
  input: {
    minHeight: 24,
    maxHeight: 150,
    color: colors.textPrimary,
    fontFamily: "Manrope_500Medium",
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: "transparent",
    paddingVertical: 0,
  },
  visualizerWrap: {
    minHeight: 24,
    justifyContent: "center",
  },
  actionWell: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionActive: {
    backgroundColor: colors.accent,
  },
  actionIdle: {
    backgroundColor: "transparent",
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.92 }],
  },
});



