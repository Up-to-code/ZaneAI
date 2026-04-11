import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";

import { ConversationFeed } from "@/conversation/components/ConversationFeed";
import { ZayonComposerDock } from "@/conversation/components/ZayonComposerDock";
import { useConversationController } from "@/conversation/hooks/useConversationController";
import { useKeyboardDock } from "@/conversation/hooks/useKeyboardDock";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";

export function ConversationViewport() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const messages = useAppStore((state) => state.messages);
  const composerDockHeight = useAppStore((state) => state.composerDockHeight);
  const keyboardHeight = useAppStore((state) => state.keyboardHeight);
  const isStreaming = useAppStore((state) => state.isStreaming);
  const { sendPrompt, stop } = useConversationController();
  const insets = useSafeAreaInsets();
  const { dockBottomOffset, listBottomPadding, keyboardVisible } = useKeyboardDock({
    bottomInset: insets.bottom,
    dockHeight: composerDockHeight,
    keyboardHeight,
  });

  return (
    <View style={styles.container}>
      <View style={[styles.feedWrap, { paddingBottom: listBottomPadding }]}>
        <ConversationFeed messages={messages} />
      </View>
      <View pointerEvents="box-none" style={[styles.dockWrap, { bottom: dockBottomOffset }]}>
        <ZayonComposerDock
          onSend={sendPrompt}
          onStop={stop}
          isStreaming={isStreaming}
          keyboardVisible={keyboardVisible}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.background,
  },
  feedWrap: {
    flex: 1,
  },
  dockWrap: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
