import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "@/foundation/theme/ThemeProvider";

type LogoMarkProps = {
  size?: number;
};

export function LogoMark({ size = 28 }: LogoMarkProps) {
  const { colors } = useTheme();

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Visual Anchor: Transparent Tint Background */}
      <View 
        style={[
          StyleSheet.absoluteFill, 
          { 
            backgroundColor: colors.accent, 
            opacity: 0.06, 
            borderRadius: size / 2,
            transform: [{ scale: 1.2 }] 
          }
        ]} 
      />
      
      <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 48 48" fill="none">
        <Path
          d="M9 10H39L16 38H39"
          stroke={colors.textPrimary}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M31 10L9 38"
          stroke={colors.accent}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
