import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";

import { ConversationFeed } from "@/conversation/components/ConversationFeed";
import { ConversationStatusBanner } from "@/conversation/components/ConversationStatusBanner";
import { ZaneAiComposerDock } from "@/conversation/components/ZaneAiComposerDock";
import { useConversationController } from "@/conversation/hooks/useConversationController";
import { useKeyboardDock } from "@/conversation/hooks/useKeyboardDock";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";

export function ConversationViewport() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const composerDockHeight = useAppStore((state) => state.composerDockHeight);
  const keyboardHeight = useAppStore((state) => state.keyboardHeight);
  const {
    canUpgrade,
    clearRunFailureMessage,
    handleTurnAction,
    isAnonymous,
    isStreaming,
    messages,
    openUpgrade,
    runFailureMessage,
    runStageFeed,
    runtimeHealth,
    sendPrompt,
    stop,
  } = useConversationController();
  const insets = useSafeAreaInsets();
  const { dockBottomOffset, listBottomPadding, keyboardVisible } = useKeyboardDock({
    bottomInset: insets.bottom,
    dockHeight: composerDockHeight,
    keyboardHeight,
  });

  return (
    <View style={styles.container}>
      <View style={[styles.feedWrap, { paddingBottom: listBottomPadding }]}>
        {runtimeHealth.status === "unavailable" ? (
          <ConversationStatusBanner
            title="AI unavailable"
            body={runtimeHealth.message ?? "Convex runtime missing deploy or model config."}
            tone="error"
          />
        ) : null}

        {runFailureMessage ? (
          <ConversationStatusBanner
            title="Run failed"
            body={runFailureMessage}
            tone="warning"
            onDismiss={clearRunFailureMessage}
          />
        ) : null}



        <ConversationFeed
          messages={messages}
          runStageFeed={runStageFeed}
          onTurnAction={handleTurnAction}
        />
      </View>
      <View pointerEvents="box-none" style={[styles.dockWrap, { bottom: dockBottomOffset }]}>
        <ZaneAiComposerDock
          onSend={sendPrompt}
          onStop={stop}
          isStreaming={isStreaming}
          disabled={runtimeHealth.status === "unavailable"}
          disabledReason={runtimeHealth.message}
          canUpgrade={canUpgrade}
          onUpgrade={openUpgrade}
          keyboardVisible={keyboardVisible}
          messageCount={messages.length}
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
