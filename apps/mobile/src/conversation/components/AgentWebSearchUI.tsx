import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Globe, CheckCircle2 } from "lucide-react-native";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import type { ConversationMessage } from "@/types/domain";

type AgentWebSearchUIProps = {
  message: ConversationMessage;
};

export function AgentWebSearchUI({ message }: AgentWebSearchUIProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isSearching = message.streamState === "streaming";
  const sourceCount = message.sourceMetadata?.length ?? 0;
  const spinValue = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (isSearching) {
      spinValue.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      spinValue.value = 0;
      pulseOpacity.value = 1;
    }
  }, [isSearching, spinValue, pulseOpacity]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinValue.value * 360}deg` }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: isSearching ? pulseOpacity.value : 1,
    };
  });

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.container} testID="chat.result.sources">
      <View style={[styles.pill, isSearching ? styles.pillSearching : styles.pillComplete]}>
        <View style={styles.iconWrap}>
          {isSearching ? (
            <Animated.View style={animatedIconStyle}>
              <Globe size={16} color={colors.accent} />
            </Animated.View>
          ) : (
            <CheckCircle2 size={16} color={colors.textPrimary} />
          )}
        </View>
        <Animated.Text style={[styles.text, animatedTextStyle, isSearching ? { color: colors.accent } : { color: colors.textPrimary }]}>
          {isSearching
            ? "Checking catalog and live market sources..."
            : `Analyzed ${Math.max(sourceCount, 1)} trusted source${Math.max(sourceCount, 1) === 1 ? "" : "s"}`}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      alignItems: "flex-start",
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 10,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      gap: theme.spacing.sm,
      maxWidth: "85%",
    },
    pillSearching: {
      backgroundColor: "transparent",
      borderColor: colors.accent,
    },
    pillComplete: {
      backgroundColor: colors.surfaceHover,
      borderColor: colors.divider,
    },
    iconWrap: {
      justifyContent: "center",
      alignItems: "center",
      marginRight: 2,
    },
    text: {
      fontFamily: theme.typography.caption.fontFamily,
      fontSize: 13,
      lineHeight: 18,
    },
  });
