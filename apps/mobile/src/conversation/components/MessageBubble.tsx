import { StyleSheet, View, Text as RNText } from "react-native";
import { useEffect, useMemo, useRef, useCallback } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  Easing,
} from "react-native-reanimated";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import type { ConversationMessage } from "@/types/domain";

type MessageBubbleProps = {
  message: ConversationMessage;
};

/**
 * A single animated word group that fades + slides in.
 * Once animation completes, it becomes static text.
 */
function FadeWord({ word, delay }: { word: string; delay: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text style={animatedStyle}>
      {word}
    </Animated.Text>
  );
}

/**
 * Gemini-style streaming text: new words materialize smoothly
 * with staggered fade-in and subtle upward motion.
 */
function StreamingText({
  text,
  isStreaming,
  style,
}: {
  text: string;
  isStreaming: boolean;
  style: any;
}) {
  const settledIndexRef = useRef(0);
  const prevTextRef = useRef("");

  // Split into words, preserving spaces
  const words = text.split(/(\s+)/);

  // When text updates during streaming, figure out what's new
  const prevWords = prevTextRef.current.split(/(\s+)/);
  const settledCount = settledIndexRef.current;

  // Once streaming ends, mark everything as settled
  useEffect(() => {
    if (!isStreaming) {
      settledIndexRef.current = words.length;
    }
  }, [isStreaming, words.length]);

  // Update prev text ref after render
  useEffect(() => {
    prevTextRef.current = text;
    if (isStreaming) {
      // Only settle words from prev render, not the new ones
      settledIndexRef.current = prevWords.length;
    }
  }, [text, isStreaming, prevWords.length]);

  if (!isStreaming) {
    // Completed — render flat, no animation overhead
    return <Text tone="secondary" style={style}>{text}</Text>;
  }

  // During streaming: settled words are plain text, new words animate
  const settledText = words.slice(0, settledCount).join("");
  const newWords = words.slice(settledCount);

  return (
    <Text tone="secondary" style={style}>
      {settledText}
      {newWords.map((word, i) => (
        <FadeWord
          key={`${settledCount}-${i}`}
          word={word}
          delay={i * 25}
        />
      ))}
    </Text>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isUser = message.role === "user";
  const isStreaming = message.streamState === "streaming";

  if (isUser) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={[styles.row, styles.userRow]}>
        <View style={styles.userBubble}>
          <Text tone="primary">{message.text}</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(250)} style={[styles.row, styles.assistantRow]}>
      <Text variant="label" style={styles.assistantLabel}>Zayon</Text>
      <StreamingText
        text={message.text}
        isStreaming={isStreaming}
        style={styles.assistantText}
      />
    </Animated.View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  row: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  userRow: {
    alignItems: "flex-end",
  },
  assistantRow: {
    alignItems: "flex-start",
    paddingRight: theme.spacing.xl,
  },
  userBubble: {
    maxWidth: "85%",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    backgroundColor: colors.surfaceRaised,
    borderRadius: theme.radii.lg,
    borderBottomEndRadius: 4,
  },
  assistantLabel: {
    color: colors.accent,
    marginBottom: 4,
  },
  assistantText: {
    lineHeight: 24,
  },
});

