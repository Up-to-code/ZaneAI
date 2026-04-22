import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
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
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { ArrowDown, ArrowUp, Maximize2, Mic, Square, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EdgeFade } from "@/conversation/components/EdgeFade";
import { PromptChips, type PromptChipData } from "./PromptChips";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { Text } from "@/foundation/primitives/Text";
import { useComposerSheetMotion } from "@/conversation/hooks/useComposerSheetMotion";
import { useDetectionHeightAndWidthOfTheScreen } from "@/lib/detectionHeightAndWidthOfTheScreen";
import { useAppStore } from "@/store";
import { useVoiceComposer } from "@/voice/hooks/useVoiceComposer";
import { RecordingVisualizer } from "@/voice/components/RecordingVisualizer";
import type { ImageSource } from "expo-image";
import type { AssistantDirection, AssistantSurfaceCopy, AssistantUiLocale } from "@/conversation/assistantProtocol";
import { isRtlDirection } from "@/conversation/lib/assistantPresentation";

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
  surfaceCopy: AssistantSurfaceCopy;
  direction: AssistantDirection;
  uiLocale?: AssistantUiLocale | null;
  isEditing?: boolean;
  onCancelEdit?: () => void;
};

type PlacePrompt = {
  id: string;
  name: string;
  tag: string;
  image: ImageSource;
  query: string;
};

const PLACE_PROMPTS: Record<"ar" | "en" | "fr", PlacePrompt[]> = {
  ar: [
    {
      id: "new_cairo",
      name: "القاهرة الجديدة",
      tag: "فيلات وكومباوند",
      image: require("../../../assets/places/new_cairo.png"),
      query: "ورّيني عقارات في القاهرة الجديدة، خصوصًا الفيلات والكومباوندات",
    },
    {
      id: "sheikh_zayed",
      name: "الشيخ زايد",
      tag: "كمبوندات مغلقة",
      image: require("../../../assets/places/sheikh_zayed.png"),
      query: "دورلي على شقق داخل كمبوندات مغلقة في الشيخ زايد",
    },
    {
      id: "maadi",
      name: "المعادي",
      tag: "هادية وقريبة",
      image: require("../../../assets/places/maadi.png"),
      query: "إيه أفضل الفيلات والبيوت المعروضة للبيع في المعادي؟",
    },
    {
      id: "new_capital",
      name: "العاصمة الجديدة",
      tag: "استثمار وعائد",
      image: require("../../../assets/places/new_capital.png"),
      query: "ورّيني فرص استثمارية قوية في العاصمة الإدارية الجديدة",
    },
    {
      id: "north_coast",
      name: "الساحل الشمالي",
      tag: "شاطئ ومصيف",
      image: require("../../../assets/places/north_coast.png"),
      query: "دورلي على شاليهات وفيلات مميزة في الساحل الشمالي",
    },
    {
      id: "october",
      name: "6 أكتوبر",
      tag: "عائلي وسعره معقول",
      image: require("../../../assets/places/october_city.png"),
      query: "ورّيني شقق وكمبوندات مناسبة للعائلات في 6 أكتوبر",
    },
    {
      id: "deep_search",
      name: "بحث سوق عميق",
      tag: "تحليل وبيانات",
      image: require("../../../assets/places/new_cairo.png"),
      query: "اعمل بحث سوق عميق عن العقارات الفاخرة ذات أفضل عائد استثماري في شرق القاهرة",
    },
  ],
  en: [
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
  {
    id: "deep_search",
    name: "Deep Market Search",
    tag: "Analysis · Data",
    image: require("../../../assets/places/new_cairo.png"), // Reusing an existing icon placeholder
    query: "Perform a deep market search for luxury properties with the best ROI in East Cairo",
  },
  ],
  fr: [
    {
      id: "new_cairo",
      name: "Nouveau Caire",
      tag: "Villas et compounds",
      image: require("../../../assets/places/new_cairo.png"),
      query: "Montre-moi des biens au Nouveau Caire, surtout des villas et des compounds",
    },
    {
      id: "sheikh_zayed",
      name: "Sheikh Zayed",
      tag: "Résidences sécurisées",
      image: require("../../../assets/places/sheikh_zayed.png"),
      query: "Trouve des appartements en résidence fermée à Sheikh Zayed",
    },
    {
      id: "maadi",
      name: "Maadi",
      tag: "Calme et verdoyant",
      image: require("../../../assets/places/maadi.png"),
      query: "Quelles sont les meilleures villas et maisons à vendre à Maadi ?",
    },
    {
      id: "new_capital",
      name: "Nouvelle Capitale",
      tag: "Croissance et rendement",
      image: require("../../../assets/places/new_capital.png"),
      query: "Montre-moi les meilleures opportunités d’investissement dans la Nouvelle Capitale Administrative",
    },
    {
      id: "north_coast",
      name: "North Coast",
      tag: "Plage et été",
      image: require("../../../assets/places/north_coast.png"),
      query: "Trouve des chalets et villas en bord de mer sur la côte nord de l’Égypte",
    },
    {
      id: "october",
      name: "6 Octobre",
      tag: "Familial et accessible",
      image: require("../../../assets/places/october_city.png"),
      query: "Montre-moi des appartements et compounds familiaux à 6 Octobre",
    },
    {
      id: "deep_search",
      name: "Recherche de marché",
      tag: "Analyse et données",
      image: require("../../../assets/places/new_cairo.png"),
      query: "Fais une recherche de marché approfondie sur les biens de luxe avec le meilleur rendement dans l’est du Caire",
    },
  ],
};

const EDITING_COPY: Record<"ar" | "en" | "fr", { label: string; cancel: string }> = {
  ar: { label: "تعديل الرسالة", cancel: "إلغاء" },
  en: { label: "Editing message", cancel: "Cancel" },
  fr: { label: "Modification du message", cancel: "Annuler" },
};

const EXPANDED_COPY: Record<"ar" | "en" | "fr", { title: string; done: string; placeholder: string }> = {
  ar: { title: "اكتب براحتك", done: "تم", placeholder: "اكتب سؤالك أو تفاصيل طلبك..." },
  en: { title: "Write in detail", done: "Done", placeholder: "Write your question or details..." },
  fr: { title: "Écrire en détail", done: "Terminé", placeholder: "Écris ta question ou les détails..." },
};

const INPUT_MIN_HEIGHT = 24;
const INPUT_MAX_HEIGHT = 108;

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
  surfaceCopy,
  direction,
  uiLocale,
  isEditing = false,
  onCancelEdit,
}: ZaneAiComposerDockProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const screen = useDetectionHeightAndWidthOfTheScreen();
  const sheetMotion = useComposerSheetMotion(screen.screenClass === "compact");
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);
  const [inputHeight, setInputHeight] = useState(INPUT_MIN_HEIGHT);
  const [expandedComposerOpen, setExpandedComposerOpen] = useState(false);
  const dockInputRef = useRef<TextInput | null>(null);
  const sheetInputRef = useRef<TextInput | null>(null);
  const sheetFocusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dockFocusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftText = useAppStore((state) => state.draftText);
  const keyboardHeight = useAppStore((state) => state.keyboardHeight);
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
  const estimatedLineCount = Math.max(
    draftText.split("\n").length,
    Math.ceil(draftText.length / 34),
  );
  const showExpandComposer = estimatedLineCount > 3 || inputHeight >= 74;
  const isRtl = isRtlDirection(direction);
  const sheetKeyboardOffset = Platform.OS === "ios" && keyboardHeight > 0
    ? Math.max(keyboardHeight - insets.bottom, 0) + screen.composerSheet.keyboardGap
    : 0;
  const sheetSafeBottom = Math.max(insets.bottom, theme.spacing.md);
  const sheetTopMargin = insets.top + screen.composerSheet.topMargin;
  const sheetAvailableHeight = Math.max(
    screen.height - sheetTopMargin - sheetKeyboardOffset,
    screen.composerSheet.minHeight,
  );
  const sheetHeight = Math.min(screen.height * screen.composerSheet.maxHeightRatio, sheetAvailableHeight);

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

  useEffect(() => () => {
    if (sheetFocusTimeoutRef.current) {
      clearTimeout(sheetFocusTimeoutRef.current);
    }
    if (dockFocusTimeoutRef.current) {
      clearTimeout(dockFocusTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!expandedComposerOpen) {
      return;
    }

    if (sheetFocusTimeoutRef.current) {
      clearTimeout(sheetFocusTimeoutRef.current);
    }

    sheetFocusTimeoutRef.current = setTimeout(() => {
      sheetInputRef.current?.focus();
    }, sheetMotion.openFocusDelayMs);
  }, [expandedComposerOpen, sheetMotion.openFocusDelayMs]);

  useEffect(() => {
    if (!error) return;

    Alert.alert(surfaceCopy.aiUnavailableTitle, error, [
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
    setInputHeight(Math.min(Math.max(contentHeight, INPUT_MIN_HEIGHT), INPUT_MAX_HEIGHT));
  };

  const submitDraft = () => {
    const value = draftText.trim();
    if (!value || disabled) return;
    setInputHeight(INPUT_MIN_HEIGHT); // Force reset to avoid "ghost" height spikes
    onSend(value);
    setDraftText("");
  };

  const closeExpandedComposer = ({ restoreDockFocus = true }: { restoreDockFocus?: boolean } = {}) => {
    if (sheetFocusTimeoutRef.current) {
      clearTimeout(sheetFocusTimeoutRef.current);
      sheetFocusTimeoutRef.current = null;
    }
    if (dockFocusTimeoutRef.current) {
      clearTimeout(dockFocusTimeoutRef.current);
      dockFocusTimeoutRef.current = null;
    }

    setExpandedComposerOpen(false);
    sheetInputRef.current?.blur();
    Keyboard.dismiss();
    setComposerFocused(false);

    if (restoreDockFocus) {
      dockFocusTimeoutRef.current = setTimeout(() => {
        dockInputRef.current?.focus();
      }, sheetMotion.closeDockFocusDelayMs);
    }
  };

  const openExpandedComposer = () => {
    if (disabled || expandedComposerOpen) return;
    if (dockFocusTimeoutRef.current) {
      clearTimeout(dockFocusTimeoutRef.current);
      dockFocusTimeoutRef.current = null;
    }
    dockInputRef.current?.blur();
    Keyboard.dismiss();
    setComposerFocused(false);
    setExpandedComposerOpen(true);
  };

  const handleSend = ({ fromExpandedComposer = false }: { fromExpandedComposer?: boolean } = {}) => {
    if (fromExpandedComposer) {
      closeExpandedComposer({ restoreDockFocus: false });
    } else {
      Keyboard.dismiss();
      setComposerFocused(false);
    }
    submitDraft();
  };

  const handleDockSendPress = () => {
    handleSend();
  };

  const promptLocale = uiLocale ?? "en";
  const editingCopy = EDITING_COPY[promptLocale];
  const expandedCopy = EXPANDED_COPY[promptLocale];
  const preparedPrompts = useMemo<PromptChipData[]>(() =>
    PLACE_PROMPTS[promptLocale].map(p => ({
      id: p.id,
      label: p.name,
      tag: p.tag,
      onPress: () => setDraftText(p.query)
    })),
    [promptLocale, setDraftText]
  );

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
              <Text variant="caption" style={styles.disabledBannerActionText}>{surfaceCopy.upgradeAction}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {isNewThread && (
        <Animated.View
          entering={FadeInDown.duration(400)}
          exiting={FadeOutDown.duration(200)}
          style={styles.promptsContainer}
        >
          <PromptChips
            prompts={preparedPrompts}
            isAr={isRtl}
            contentContainerStyle={styles.promptsScrollContent}
          />
        </Animated.View>
      )}

      {!expandedComposerOpen ? (
        <View style={styles.composerShell}>
          <View pointerEvents="none" style={styles.composerTopFade}>
            <EdgeFade color={colors.background} placement="bottom" startOpacity={0.92} midOpacity={0.34} />
          </View>
          {isEditing ? (
            <View style={[styles.editingShelf, isRtl ? styles.editingShelfRtl : null]}>
              <Animated.View
                entering={FadeInUp.duration(180)}
                exiting={FadeOutDown.duration(120)}
                style={[styles.editingStrip, isRtl ? styles.editingStripRtl : null]}
              >
                <Text style={styles.editingLabel}>{editingCopy.label}</Text>
                <Pressable
                  onPress={onCancelEdit}
                  hitSlop={10}
                  style={({ pressed }) => [styles.editingCancel, pressed ? styles.actionPressed : null]}
                >
                  <Text style={styles.editingCancelText}>{editingCopy.cancel}</Text>
                </Pressable>
              </Animated.View>
            </View>
          ) : null}

          <Animated.View
            layout={LinearTransition.duration(180)}
            style={[
              styles.unifiedBar,
              inputExpanded ? styles.unifiedBarExpanded : styles.unifiedBarCompact,
            ]}
          >
            <View style={[styles.inputField, inputExpanded ? styles.inputFieldExpanded : null]}>
              {isRecording ? (
                <View style={styles.visualizerWrap}>
                  <RecordingVisualizer active={isRecording} level={audioLevel} />
                </View>
              ) : (
                <>
                  <TextInput
                    testID="chat.composer"
                    ref={dockInputRef}
                    value={draftText}
                    editable={!disabled}
                    onChangeText={setDraftText}
                    onContentSizeChange={handleContentSizeChange}
                    multiline
                    blurOnSubmit={false}
                    autoCorrect
                    autoCapitalize="sentences"
                    enablesReturnKeyAutomatically
                    placeholder={disabled ? surfaceCopy.composerDisabledPlaceholder : surfaceCopy.composerPlaceholder}
                    placeholderTextColor={colors.textMuted}
                    cursorColor={colors.accent}
                    selectionColor={colors.accent}
                    underlineColorAndroid="transparent"
                    textAlignVertical={inputExpanded ? "top" : "center"}
                    scrollEnabled={inputExpanded}
                    onFocus={() => setComposerFocused(true)}
                    onBlur={() => setComposerFocused(false)}
                    style={[
                      styles.input,
                      inputExpanded ? styles.inputExpanded : styles.inputCompact,
                      { height: inputHeight },
                      isRtl ? { textAlign: "right", writingDirection: "rtl" } : null,
                    ]}
                  />
                  {inputExpanded ? (
                    <Animated.View
                      pointerEvents="none"
                      entering={FadeIn.duration(120)}
                      exiting={FadeOut.duration(90)}
                      style={styles.inputFadeTop}
                    >
                      <EdgeFade color={colors.surfaceRaised} placement="top" />
                    </Animated.View>
                  ) : null}
                  {inputExpanded ? (
                    <Animated.View
                      pointerEvents="none"
                      entering={FadeIn.duration(120)}
                      exiting={FadeOut.duration(90)}
                      style={styles.inputFadeBottom}
                    >
                      <EdgeFade color={colors.surfaceRaised} placement="bottom" />
                    </Animated.View>
                  ) : null}
                </>
              )}
            </View>

            <View style={[styles.actionWell, showExpandComposer && !isStreaming ? styles.actionWellExpanded : null]}>
              {showExpandComposer && !isStreaming ? (
                <Pressable
                  disabled={disabled}
                  onPress={openExpandedComposer}
                  style={({ pressed }) => [
                    styles.expandButton,
                    pressed ? styles.actionPressed : null,
                    disabled ? styles.actionDisabled : null,
                  ]}
                >
                  <Maximize2 size={16} color={colors.textSecondary} strokeWidth={2.2} />
                </Pressable>
              ) : null}
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
                  onPress={handleDockSendPress}
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
          </Animated.View>
        </View>
      ) : null}

      <Modal
        animationType="slide"
        transparent
        visible={expandedComposerOpen}
        onRequestClose={() => closeExpandedComposer({ restoreDockFocus: true })}
      >
          <View style={[styles.sheetBackdrop, { paddingBottom: sheetKeyboardOffset, paddingTop: insets.top }]}>
            <Pressable style={styles.sheetDismissZone} onPress={() => closeExpandedComposer({ restoreDockFocus: true })} />
            <Animated.View
              entering={FadeInUp.duration(sheetMotion.enterDurationMs)}
              exiting={FadeOutDown.duration(sheetMotion.exitDurationMs)}
              style={[
                styles.expandedSheet,
                {
                  height: sheetHeight,
                  maxHeight: sheetAvailableHeight,
                  paddingHorizontal: screen.composerSheet.horizontalPadding,
                  paddingBottom: sheetSafeBottom,
                },
              ]}
            >
              <View style={[styles.sheetHandle, isRtl ? styles.sheetHandleRtl : null]}>
                <View style={[styles.sheetHeaderSide, { width: screen.composerSheet.headerSideWidth }]}>
                  <Pressable
                    hitSlop={10}
                    onPress={() => closeExpandedComposer({ restoreDockFocus: true })}
                    style={({ pressed }) => [
                      styles.sheetIconButton,
                      {
                        width: screen.composerSheet.iconButtonSize,
                        height: screen.composerSheet.iconButtonSize,
                        borderRadius: screen.composerSheet.iconButtonSize / 2,
                      },
                      pressed ? styles.actionPressed : null,
                    ]}
                  >
                    <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
                  </Pressable>
                </View>
                <Text style={[styles.sheetTitle, { fontSize: screen.composerSheet.titleFontSize }]}>
                  {expandedCopy.title}
                </Text>
                <View style={[styles.sheetHeaderSide, styles.sheetHeaderSideEnd, { width: screen.composerSheet.headerSideWidth }]}>
                  <Pressable
                    hitSlop={10}
                    onPress={() => closeExpandedComposer({ restoreDockFocus: true })}
                    style={({ pressed }) => [
                      styles.sheetDoneButton,
                      {
                        width: screen.composerSheet.headerSideWidth,
                        height: screen.composerSheet.headerButtonHeight,
                        borderRadius: screen.composerSheet.headerButtonHeight / 2,
                      },
                      pressed ? styles.actionPressed : null,
                    ]}
                  >
                    <Text style={styles.sheetDoneText}>{expandedCopy.done}</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.sheetInputWrap}>
                <TextInput
                  ref={sheetInputRef}
                  value={draftText}
                  editable={!disabled}
                  onChangeText={setDraftText}
                  multiline
                  autoCorrect
                  autoCapitalize="sentences"
                  placeholder={expandedCopy.placeholder}
                  placeholderTextColor={colors.textMuted}
                  cursorColor={colors.accent}
                  selectionColor={colors.accent}
                  textAlignVertical="top"
                  onFocus={() => setComposerFocused(true)}
                  onBlur={() => setComposerFocused(false)}
                  style={[
                    styles.sheetInput,
                    {
                      fontSize: screen.composerSheet.inputFontSize,
                      lineHeight: screen.composerSheet.inputLineHeight,
                    },
                    isRtl ? { textAlign: "right", writingDirection: "rtl" } : null,
                  ]}
                />
                <View pointerEvents="none" style={styles.sheetInputFadeTop}>
                  <EdgeFade color={colors.background} placement="top" startOpacity={0.88} midOpacity={0.3} />
                </View>
                <View pointerEvents="none" style={styles.sheetInputFadeBottom}>
                  <EdgeFade color={colors.background} placement="bottom" startOpacity={0.88} midOpacity={0.3} />
                </View>
              </View>
              <View
                style={[
                  styles.sheetFooter,
                  isRtl ? styles.sheetFooterRtl : null,
                  { paddingTop: screen.composerSheet.footerTopPadding },
                ]}
              >
                <Pressable
                  disabled={!hasText || disabled}
                  onPress={() => {
                    handleSend({ fromExpandedComposer: true });
                  }}
                  style={({ pressed }) => [
                    styles.sheetSendButton,
                    {
                      width: screen.composerSheet.footerButtonSize,
                      height: screen.composerSheet.footerButtonSize,
                      borderRadius: screen.composerSheet.footerButtonSize / 2,
                    },
                    pressed ? styles.actionPressed : null,
                    !hasText || disabled ? styles.actionDisabled : null,
                  ]}
                >
                  <ArrowUp size={18} color="#FFFFFF" strokeWidth={2.5} />
                </Pressable>
                <Pressable
                  onPress={() => closeExpandedComposer({ restoreDockFocus: true })}
                  style={({ pressed }) => [
                    styles.sheetCollapseButton,
                    {
                      width: screen.composerSheet.footerButtonSize,
                      height: screen.composerSheet.footerButtonSize,
                      borderRadius: screen.composerSheet.footerButtonSize / 2,
                    },
                    pressed ? styles.actionPressed : null,
                  ]}
                >
                  <ArrowDown size={17} color={colors.textSecondary} strokeWidth={2.2} />
                </Pressable>
              </View>
            </Animated.View>
          </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any, insets: any) => StyleSheet.create({
  container: {
    zIndex: 2000,
    position: "relative",
    backgroundColor: "transparent",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 4,
    paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
  },
  keyboardOpen: {
    paddingBottom: 0,
  },
  promptsContainer: {
    marginBottom: 12,
  },
  composerShell: {
    position: "relative",
  },
  composerTopFade: {
    position: "absolute",
    left: -theme.spacing.lg,
    right: -theme.spacing.lg,
    top: -34,
    height: 42,
  },
  editingShelf: {
    minHeight: 0,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  editingShelfRtl: {
    alignItems: "flex-end",
  },
  editingStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editingStripRtl: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  editingLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: colors.textPrimary,
  },
  editingCancel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  editingCancelText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: colors.accent,
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
  promptsScrollContent: {
    paddingHorizontal: 0, // PromptChips already has padding, we might need to adjust or keep it empty
    gap: 8,
  },
  unifiedBar: {
    flexDirection: "row",
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceRaised,
    paddingLeft: theme.spacing.lg,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  unifiedBarCompact: {
    alignItems: "center",
  },
  unifiedBarExpanded: {
    alignItems: "flex-end",
    borderRadius: 24,
  },
  inputField: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    minHeight: 44,
    paddingRight: 8,
  },
  inputFieldExpanded: {
    justifyContent: "flex-start",
    paddingTop: 4,
    paddingBottom: 4,
  },
  input: {
    minHeight: INPUT_MIN_HEIGHT,
    maxHeight: INPUT_MAX_HEIGHT,
    color: colors.textPrimary,
    fontFamily: "Manrope_500Medium",
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: "transparent",
  },
  inputCompact: {
    paddingTop: 1,
    paddingBottom: 1,
  },
  inputExpanded: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 2,
  },
  inputFadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  inputFadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: "hidden",
  },
  visualizerWrap: {
    minHeight: 24,
    justifyContent: "center",
  },
  actionWell: {
    width: 44,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionWellExpanded: {
    width: 84,
  },
  expandButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  sheetBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  sheetDismissZone: {
    flex: 1,
  },
  expandedSheet: {
    paddingTop: 10,
    paddingHorizontal: theme.spacing.lg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -10 },
    elevation: 14,
  },
  sheetHandle: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  sheetHandleRtl: {
    flexDirection: "row-reverse",
  },
  sheetHeaderSide: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sheetHeaderSideEnd: {
    alignItems: "flex-end",
  },
  sheetIconButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
  },
  sheetTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: colors.textPrimary,
  },
  sheetDoneButton: {
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
  },
  sheetDoneText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: colors.accent,
  },
  sheetInputWrap: {
    flex: 1,
    position: "relative",
  },
  sheetInput: {
    flex: 1,
    minHeight: 120,
    paddingHorizontal: 2,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontFamily: "Manrope_500Medium",
    fontSize: 18,
    lineHeight: 28,
    backgroundColor: "transparent",
  },
  sheetInputFadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 18,
  },
  sheetInputFadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 22,
  },
  sheetFooter: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 12,
  },
  sheetFooterRtl: {
    flexDirection: "row",
  },
  sheetSendButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  sheetCollapseButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
