import { StyleSheet, View, Text as RNText } from "react-native";
import React, { useEffect, useMemo, useRef, useCallback } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  FadeIn,
  Easing,
} from "react-native-reanimated";

import { Text } from "@/foundation/primitives/Text";
import { BreathingText } from "@/foundation/animations/BreathingText";
import { MarkdownText } from "@/foundation/primitives/MarkdownText";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { isArabic } from "@/foundation/utils/rtl";
import type { ConversationMessage, ConversationRunStage } from "@/types/domain";

type MessageBubbleProps = {
  message: ConversationMessage;
  latestStageEvent?: ConversationRunStage;
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

const PENDING_PLACEHOLDER = "Thinking through your request\u2026";

/**
 * Animated three-dot indicator shown while the assistant is thinking.
 */
function ThinkingDots() {
  const { colors } = useTheme();
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const cfg = { duration: 400, easing: Easing.inOut(Easing.quad) };
    dot1.value = withRepeat(withSequence(withTiming(1, cfg), withTiming(0.3, cfg)), -1);
    dot2.value = withDelay(150, withRepeat(withSequence(withTiming(1, cfg), withTiming(0.3, cfg)), -1));
    dot3.value = withDelay(300, withRepeat(withSequence(withTiming(1, cfg), withTiming(0.3, cfg)), -1));
  }, [dot1, dot2, dot3]);

  const s1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const s2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const s3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  const dotStyle = {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: colors.textMuted, marginHorizontal: 2,
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
      <Animated.View style={[dotStyle, s1]} />
      <Animated.View style={[dotStyle, s2]} />
      <Animated.View style={[dotStyle, s3]} />
    </View>
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
    // Completed — render with full markdown support (paragraphs, lists, etc)
    return <MarkdownText text={text} tone="secondary" style={style} />;
  }

  // Pre-parse the entire text to identify styled segments
  // This ensures spans like __charming bookstore__ are treated as one unit for styling
  const parsedFullText = parseInlineMarkdown(text);

  return (
    <Text tone="secondary" selectable={true} style={style}>
      {parsedFullText.map((part, i) => {
        if (typeof part === "string") {
          // Plain text segments — handle the streaming transition
          const segmentWords = part.split(/(\s+)/);
          return segmentWords.map((word, wordIdx) => {
            const absoluteWordIdx = i * 1000 + wordIdx; // Unique stable key
            if (absoluteWordIdx < settledCount) {
              return word;
            }
            return (
              <FadeWord
                key={absoluteWordIdx}
                word={word}
                delay={wordIdx * 25}
              />
            );
          });
        }
        
        // Styled segment (Text component) — reveal immediately with styling
        if (React.isValidElement(part)) {
          return React.cloneElement(part as React.ReactElement<any>, {
            key: i,
          });
        }
        
        return part;
      })}
    </Text>
  );
}

/**
 * Simplified inline markdown parser for streaming text only.
 */
function parseInlineMarkdown(text: string) {
  // Regex: Bold (** or __), Italic (* or _), Link [t](u), Hashtag #w
  const regex = /(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|\[.*?\]\(.*?\)|#\w+)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    // Bold: **text** or __text__
    if ((part.startsWith("**") && part.endsWith("**") && part.length >= 4) || 
        (part.startsWith("__") && part.endsWith("__") && part.length >= 4)) {
      const content = part.slice(2, -2);
      return (
        <Text key={i} style={{ fontFamily: "Manrope_700Bold" }}>
          {content}
        </Text>
      );
    }
    // Italic: *text* or _text_
    else if ((part.startsWith("*") && part.endsWith("*") && part.length >= 2) || 
             (part.startsWith("_") && part.endsWith("_") && part.length >= 2)) {
      const content = part.slice(1, -1);
      return (
        <Text key={i} style={{ fontStyle: "italic" }}>
          {content}
        </Text>
      );
    }
    // Link: [text](url) - Styled only during streaming
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <Text key={i} style={{ color: "#007AFF", textDecorationLine: "underline", fontFamily: "Manrope_600SemiBold" }}>
          {linkMatch[1]}
        </Text>
      );
    }
    // Hashtag: #word
    if (part.startsWith("#") && part.length > 1 && !part.includes(" ")) {
      return (
        <Text key={i} style={{ color: "#6366f1", fontFamily: "Manrope_700Bold" }}>
          {part}
        </Text>
      );
    }
    return part;
  });
}

export function MessageBubble({ message, latestStageEvent }: MessageBubbleProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isUser = message.role === "user";
  const isStreaming = message.streamState === "streaming";
  const isPending =
    isStreaming && (message.id === "pending-assistant" || message.text === PENDING_PLACEHOLDER);

  if (isUser) {
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[styles.row, styles.userRow, { marginTop: 32 }]}
      >
        <View style={styles.userBubble}>
          <Text tone="primary" selectable={true} style={styles.userText}>
            {message.text}
          </Text>
        </View>
      </Animated.View>
    );
  }

  const isAr = !isUser && !isPending && isArabic(message.text);

  return (
    <Animated.View entering={FadeIn.duration(250)} style={[styles.row, styles.assistantRow, isAr && { alignItems: "flex-end" }]}>
      <View style={[styles.brandingWrap, isAr && { alignItems: "flex-end" }]}>
        <Text variant="label" style={styles.assistantLabel}>
          ZANE AI
        </Text>
        <BreathingText
          text="INTELLIGENT INFRASTRUCTURE"
          style={[styles.tagline, isAr && { textAlign: "right" }]}
          minOpacity={isStreaming ? 0.3 : 0.6}
          maxOpacity={isStreaming ? 0.8 : 0.6}
        />
      </View>

      {latestStageEvent && isPending && (
        <View style={styles.statusLine}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {latestStageEvent.route
              ? `${latestStageEvent.route.toUpperCase()} MODE • `
              : ""}
            {latestStageEvent.message.toLowerCase()}
          </Text>
        </View>
      )}

      {isPending ? (
        <ThinkingDots />
      ) : (
        <StreamingText
          text={message.text}
          isStreaming={isStreaming}
          style={styles.assistantText}
        />
      )}
    </Animated.View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  row: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 22,
    borderBottomRightRadius: 4,
  },
  userText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Manrope_500Medium",
  },
  assistantLabel: {
    color: colors.accent,
    letterSpacing: 1.5,
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
  },
  brandingWrap: {
    marginBottom: 4,
  },
  tagline: {
    fontSize: 8,
    fontFamily: "Manrope_700Bold",
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: -2,
  },
  statusLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: colors.textSecondary,
  },
  assistantText: {
    lineHeight: 24,
  },
});
