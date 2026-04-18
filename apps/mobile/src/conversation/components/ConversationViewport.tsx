import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useRef } from "react";

import { ConversationFeed } from "@/conversation/components/ConversationFeed";
import { ConversationStatusBanner } from "@/conversation/components/ConversationStatusBanner";
import { ZaneAiComposerDock } from "@/conversation/components/ZaneAiComposerDock";
import { useConversationController } from "@/conversation/hooks/useConversationController";
import { useKeyboardDock } from "@/conversation/hooks/useKeyboardDock";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { getRuntimeDisabledReason } from "@/persistence/convex/runtimeHealth";
import { useAppStore } from "@/store";
import { NormalModeView } from "@/shell/components/NormalModeView";

function logViewportEvent(event: string, payload: Record<string, unknown>) {
  console.info(JSON.stringify({
    at: new Date().toISOString(),
    scope: "mobile_viewport",
    event,
    ...payload,
  }));
}

export function ConversationViewport() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const lastBannerSignatureRef = useRef<string | null>(null);
  const composerDockHeight = useAppStore((state) => state.composerDockHeight);
  const keyboardHeight = useAppStore((state) => state.keyboardHeight);
  const operativeMode = useAppStore((state) => state.operativeMode);

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
  const runtimeUnavailable = runtimeHealth.status === "unavailable";
  const composerDisabledReason = getRuntimeDisabledReason(runtimeHealth);

  useEffect(() => {
    const payload = {
      runtimeUnavailable,
      runtimeMessage: composerDisabledReason ?? null,
      hasRunFailure: Boolean(runFailureMessage),
      runFailureMessage: runFailureMessage ?? null,
    };
    const signature = JSON.stringify(payload);
    if (lastBannerSignatureRef.current === signature) {
      return;
    }

    lastBannerSignatureRef.current = signature;
    logViewportEvent("banner_state_changed", payload);
  }, [composerDisabledReason, runFailureMessage, runtimeUnavailable]);

  const isAiMode = operativeMode === "ai";

  return (
    <View style={styles.container}>
      <View style={[styles.feedWrap, { paddingBottom: isAiMode ? listBottomPadding : 0 }]}>
        {isAiMode ? (
          <>
            {(runtimeUnavailable || runFailureMessage) ? (
              <View style={[styles.bannerStack, { paddingTop: insets.top + 64 }]}>
                {runtimeUnavailable ? (
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
              </View>
            ) : null}
            <ConversationFeed
              messages={messages}
              runStageFeed={runStageFeed}
              onTurnAction={handleTurnAction}
              onSuggestionPress={sendPrompt}
            />
          </>
        ) : (
          <NormalModeView />
        )}
      </View>
      
      {isAiMode && (
        <View pointerEvents="box-none" style={[styles.dockWrap, { bottom: dockBottomOffset }]}>
          <ZaneAiComposerDock
            onSend={sendPrompt}
            onStop={stop}
            isStreaming={isStreaming}
            disabled={runtimeUnavailable}
            disabledReason={composerDisabledReason}
            canUpgrade={canUpgrade}
            onUpgrade={openUpgrade}
            keyboardVisible={keyboardVisible}
            messageCount={messages.length}
          />
        </View>
      )}
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
  bannerStack: {
    zIndex: 2,
  },
  dockWrap: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
