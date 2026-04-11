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
  keyboardGap = 5,
}: {
  bottomInset: number;
  dockHeight: number;
  keyboardHeight: number;
  keyboardGap?: number;
}): KeyboardDockResult {
  const keyboardVisible = keyboardHeight > 0;
  const restingGap = 8;

  return {
    dockBottomOffset:
      Platform.OS === "ios" && keyboardVisible
        ? keyboardHeight + keyboardGap
        : 0,
    listBottomPadding:
      dockHeight +
      (Platform.OS === "ios" && keyboardVisible
        ? keyboardHeight + keyboardGap + 32 // increased buffer
        : restingGap + 12), // slightly more resting room
    keyboardVisible,
  };
}
