import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import {
  AnchorItem,
  StreamingItem,
  StreamingMessageList,
  StreamingMessageListProvider,
  type StreamingMessageListRef,
  useStreamingMessageList,
} from "react-native-streaming-message-list";
import { ArrowDown } from "lucide-react-native";

import { GenerativeUIAdapter } from "@/conversation/adapters/GenerativeUIAdapter";
import { MessageBubble } from "@/conversation/components/MessageBubble";
import { EmptyThreadWelcome } from "@/conversation/components/EmptyThreadWelcome";
import { IconButton } from "@/foundation/primitives/IconButton";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";
import type { ConversationMessage } from "@/types/domain";
import { PropertyCard } from "@/decision/components/PropertyCard";

type ConversationFeedProps = {
  messages: ConversationMessage[];
};

const AUTO_SCROLL_THRESHOLD = 120;

function ScrollToLatestButton({
  onPress,
}: {
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isAtEnd, contentFillsViewport } = useStreamingMessageList();

  if (isAtEnd || !contentFillsViewport) {
    return null;
  }

  return (
    <View style={styles.scrollButtonWrap}>
      <IconButton onPress={onPress}>
        <ArrowDown size={18} color={colors.textPrimary} />
      </IconButton>
    </View>
  );
}

export function ConversationFeed({ messages }: ConversationFeedProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const listRef = useRef<StreamingMessageListRef | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevMessageCountRef = useRef(messages.length);
  const properties = useAppStore((state) => state.properties);

  const lastUserIndex = useMemo(
    () => messages.findLastIndex((message) => message.role === "user"),
    [messages],
  );
  const lastAssistantIndex = useMemo(
    () => messages.findLastIndex((message) => message.role === "assistant"),
    [messages],
  );
  const latestAssistantMessage = lastAssistantIndex >= 0 ? messages[lastAssistantIndex] : null;

  const scrollToLatest = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  const updateAutoScrollPreference = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    shouldAutoScrollRef.current =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - AUTO_SCROLL_THRESHOLD;
  };

  // Reset auto-scroll when new messages are added (user sends a message)
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      shouldAutoScrollRef.current = true;
      // Immediate scroll for new user messages
      setTimeout(() => scrollToLatest(), 50);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  // Auto-scroll during assistant streaming
  useEffect(() => {
    if (!latestAssistantMessage || !shouldAutoScrollRef.current) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      scrollToLatest();
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [
    latestAssistantMessage?.id,
    latestAssistantMessage?.streamState,
    latestAssistantMessage?.text,
    latestAssistantMessage?.relatedPropertyIds.length,
  ]);

  // Show welcome screen for empty/new threads
  const hasUserMessages = messages.some((m) => m.role === "user");

  if (!hasUserMessages) {
    return (
      <View style={styles.container}>
        <EmptyThreadWelcome />
      </View>
    );
  }

  return (
    <StreamingMessageListProvider>
      <View style={styles.container}>
        <StreamingMessageList
          ref={listRef}
          data={messages}
          isStreaming={messages[lastAssistantIndex]?.streamState === "streaming"}
          keyExtractor={(item: ConversationMessage) => item.id}
          contentContainerStyle={styles.content}
          onScroll={updateAutoScrollPreference}
          onContentSizeChange={() => {
            if (!shouldAutoScrollRef.current || !latestAssistantMessage) {
              return;
            }

            requestAnimationFrame(() => {
              scrollToLatest();
            });
          }}
          renderItem={({ item, index }: { item: ConversationMessage; index: number }) => {
            const propertyCards = properties.filter((property) =>
              item.relatedPropertyIds.includes(property.id),
            );
            const isTextComplete = item.streamState === "complete" || item.streamState === "stopped";

            let content = (
              <View>
                <MessageBubble message={item} />
                {item.role === "assistant" && isTextComplete && item.relatedPropertyIds.length > 0
                  ? propertyCards.map((property, cardIndex) => (
                      <Animated.View
                        key={property.id}
                        entering={FadeInDown.delay(cardIndex * 120).duration(350).springify()}
                      >
                        <PropertyCard property={property} compact />
                      </Animated.View>
                    ))
                  : null}
                {item.kind === "summary_card" && isTextComplete ? (
                  <Animated.View entering={FadeInDown.duration(300)}>
                    <GenerativeUIAdapter />
                  </Animated.View>
                ) : null}
              </View>
            );

            if (index === lastUserIndex) {
              content = <AnchorItem>{content}</AnchorItem>;
            }

            if (index === lastAssistantIndex) {
              content = <StreamingItem>{content}</StreamingItem>;
            }

            return content;
          }}
        />

        <ScrollToLatestButton
          onPress={() => {
            shouldAutoScrollRef.current = true;
            scrollToLatest();
          }}
        />
      </View>
    </StreamingMessageListProvider>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  scrollButtonWrap: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: theme.spacing.md,
  },
});
