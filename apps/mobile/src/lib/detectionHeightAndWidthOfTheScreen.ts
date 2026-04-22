import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

type ScreenClass = "compact" | "regular" | "large";

export function useDetectionHeightAndWidthOfTheScreen() {
  const { width, height, scale, fontScale } = useWindowDimensions();

  return useMemo(() => {
    const shortSide = Math.min(width, height);
    const longSide = Math.max(width, height);
    const aspectRatio = longSide / Math.max(shortSide, 1);

    const isCompactWidth = shortSide <= 375;
    const isCompactHeight = longSide <= 812;
    const isPhone11ProClass = shortSide <= 375 && longSide <= 812;
    const isLargePhone = shortSide >= 430 || longSide >= 900;

    const screenClass: ScreenClass = isPhone11ProClass || (isCompactWidth && isCompactHeight)
      ? "compact"
      : isLargePhone
        ? "large"
        : "regular";

    return {
      width,
      height,
      shortSide,
      longSide,
      scale,
      fontScale,
      aspectRatio,
      isCompactWidth,
      isCompactHeight,
      isPhone11ProClass,
      isLargePhone,
      screenClass,
      composerSheet: {
        topMargin: isPhone11ProClass ? 52 : isCompactHeight ? 60 : 72,
        keyboardGap: isPhone11ProClass ? 18 : isCompactHeight ? 14 : 8,
        maxHeightRatio: isPhone11ProClass ? 0.5 : isCompactHeight ? 0.53 : 0.56,
        minHeight: isPhone11ProClass ? 240 : 260,
        iconButtonSize: isPhone11ProClass ? 44 : 38,
        footerButtonSize: isPhone11ProClass ? 48 : 46,
        headerButtonHeight: isPhone11ProClass ? 44 : 38,
        headerSideWidth: isPhone11ProClass ? 78 : 64,
        horizontalPadding: isPhone11ProClass ? 14 : 16,
        titleFontSize: isPhone11ProClass ? 13 : 14,
        inputFontSize: isPhone11ProClass ? 17 : 18,
        inputLineHeight: isPhone11ProClass ? 26 : 28,
        footerTopPadding: isPhone11ProClass ? 16 : 12,
      },
    };
  }, [fontScale, height, scale, width]);
}

export type DetectionHeightAndWidthOfTheScreen = ReturnType<
  typeof useDetectionHeightAndWidthOfTheScreen
>;
