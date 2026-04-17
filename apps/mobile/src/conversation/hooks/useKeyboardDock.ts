import { Platform } from "react-native";

type KeyboardDockResult = {
  dockBottomOffset: number;
  listBottomPadding: number;
  keyboardVisible: boolean;
};

export function useKeyboardDock({
  bottomInset,
  dockHeight,
  keyboardHeight,
  keyboardGap = 4,
}: {
  bottomInset: number;
  dockHeight: number;
  keyboardHeight: number;
  keyboardGap?: number;
}): KeyboardDockResult {
  const keyboardVisible = keyboardHeight > 0;
  const restingGap = 0;

  return {
    dockBottomOffset:
      Platform.OS === "ios" && keyboardVisible
        ? keyboardHeight + keyboardGap + 4
        : 0,
    listBottomPadding:
      Math.min(dockHeight, 200) + // Clamp stale dockHeight to prevent ghost spikes
      (Platform.OS === "ios" && keyboardVisible
        ? keyboardHeight + keyboardGap + 4
        : restingGap),
    keyboardVisible,
  };
}
