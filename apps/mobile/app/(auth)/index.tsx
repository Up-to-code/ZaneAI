import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import { Redirect, useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown, Layout } from "react-native-reanimated";
import { Mail, Apple, Search, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppStore } from "@/store";
import { Text } from "@/foundation/primitives/Text";

import { LogoMark } from "@/foundation/icons/LogoMark";
import { Button } from "@/foundation/primitives/Button";
import { theme } from "@/foundation/theme/tokens";

import { TypewriterText } from "@/foundation/components/TypewriterText";

const { width, height } = Dimensions.get("window");

// Specific 'Midnight Zinc' palette
const COLORS = {
  background: "#000000", // Pure Black
  black: "#000000",
  charcoal: "#09090B", // Zinc-950
  zinc800: "#27272A", // Brand surface
  white: "#FFFFFF",
  zinc400: "#A1A1AA",
};

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return (
    <View style={styles.container}>
      {/* Top Section: Pure Black workspace */}
      <View style={styles.topSection}>
        {/* Subtle Skip Button */}
        <Pressable 
          style={[styles.skipBtn, { top: Math.max(insets.top, 20) }]} 
          onPress={() => setAuthenticated(true)}
        >
          <X size={24} color={COLORS.white} strokeWidth={1} />
        </Pressable>

        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.identityWrap}>
          <Text variant="display" style={styles.brandTitle}>ZAYON</Text>
          <TypewriterText 
            phrases={[
              "Are you intelligent?",
              "Think deeper.",
              "Search simply.",
              "Zayon remembers.",
            ]}
            color={COLORS.zinc400}
            typingSpeed={120}
            pauseTime={2000}
          />
        </Animated.View>
      </View>

      {/* Bottom Section: Zinc-800 Action Capsule */}
      <Animated.View 
        entering={FadeInDown.duration(600).springify()} 
        style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 48) }]}
      >
        <View style={styles.buttonStack}>
          {/* Apple Button */}
          <Button 
            variant="primary"
            leading={<Apple size={20} color={COLORS.black} fill={COLORS.black} />}
            label="Continue with Apple"
            onPress={() => setAuthenticated(true)}
            style={styles.whiteBtn}
            textStyle={{ color: COLORS.black }}
          />

          {/* Google Button */}
          <Button 
            variant="secondary"
            leading={<Search size={22} color="#EF4444" />}
            label="Continue with Google"
            onPress={() => setAuthenticated(true)}
            style={styles.charcoalBtn}
          />

          {/* Email Button */}
          <Button 
            variant="secondary"
            leading={<Mail size={22} color={COLORS.white} />}
            label="Continue with Email"
            onPress={() => router.push("/(auth)/otp")}
            style={styles.charcoalBtn}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xxl,
  },
  skipBtn: {
    position: "absolute",
    right: theme.spacing.xl,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  identityWrap: {
    alignItems: "center",
    gap: theme.spacing.lg,
    marginTop: -theme.spacing.xxl,
  },
  brandTitle: {
    fontSize: 52,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 6,
    paddingVertical: 10,
    lineHeight: 60,
  },
  bottomSection: {
    backgroundColor: COLORS.zinc800,
    borderTopLeftRadius: 52,
    borderTopRightRadius: 52,
    paddingTop: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  },
  buttonStack: {
    gap: theme.spacing.md,
  },
  whiteBtn: {
    backgroundColor: COLORS.white,
    height: 64,
    borderRadius: 24,
  },
  charcoalBtn: {
    backgroundColor: COLORS.charcoal,
    height: 64,
    borderRadius: 24,
    borderWidth: 0,
  },
});
