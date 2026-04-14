import { Alert, StyleSheet, View, Pressable } from "react-native";
import { Redirect, useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Mail, Apple, Search, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

import { useAppStore } from "@/store";
import { Text } from "@/foundation/primitives/Text";
import { Button } from "@/foundation/primitives/Button";
import { theme } from "@/foundation/theme/tokens";
import { TypewriterText } from "@/foundation/components/TypewriterText";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAuthSession } from "@/auth/useAuthSession";
import { authClient } from "@/auth/authClient";
import { getOAuthCallbackUrl } from "@/auth/AuthProvider";

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { canAccessApp, isReady } = useAuthSession();
  const clearAuthDrafts = useAppStore((state) => state.clearAuthDrafts);
  const setGuestMode = useAppStore((state) => state.setGuestMode);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.xxl,
      backgroundColor: colors.background,
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
      color: colors.textPrimary,
      letterSpacing: 6,
      paddingVertical: 10,
      lineHeight: 60,
    },
    bottomSection: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 52,
      borderTopRightRadius: 52,
      paddingTop: theme.spacing.xxxl,
      paddingHorizontal: theme.spacing.xl,
      borderTopWidth: 1,
      borderColor: colors.divider,
    },
    buttonStack: {
      gap: theme.spacing.md,
    },
    primaryBtn: {
      backgroundColor: colors.textPrimary,
      height: 64,
      borderRadius: 24,
    },
    secondaryBtn: {
      backgroundColor: colors.surfaceRaised,
      height: 64,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.divider,
    },
  });

  if (isReady && canAccessApp) {
    return <Redirect href="/(app)" />;
  }

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    try {
      setGuestMode(false);
      const result = await (authClient as any).signIn.social({
        provider,
        callbackURL: getOAuthCallbackUrl(),
        disableRedirect: true,
      });
      const url = result?.data?.url;
      if (!url) {
        throw new Error(`${provider} sign in is not configured for this environment.`);
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Sign in unavailable", error instanceof Error ? error.message : "Unable to start sign in.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Pressable
          testID="auth.skip_guest"
          style={[styles.skipBtn, { top: Math.max(insets.top, 20) }]}
          onPress={() => {
            clearAuthDrafts();
            setGuestMode(true);
          }}
        >
          <X size={24} color={colors.textPrimary} strokeWidth={1} />
        </Pressable>

        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.identityWrap}>
          <Text variant="display" style={styles.brandTitle}>ZANE-AI</Text>
          <TypewriterText
            phrases={[
              "Are you intelligent?",
              "Think deeper.",
              "Search simply.",
              "Zane-ai remembers.",
            ]}
          />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.duration(600).springify()}
        style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 48) }]}
      >
        <View style={styles.buttonStack}>
          <Button
            testID="auth.continue_apple"
            variant="primary"
            leading={<Apple size={20} color={colors.background} fill={colors.background} />}
            label="Continue with Apple"
            onPress={() => void handleSocialSignIn("apple")}
            style={styles.primaryBtn}
            textStyle={{ color: colors.background }}
          />

          <Button
            testID="auth.continue_google"
            variant="secondary"
            leading={<Search size={22} color="#EF4444" />}
            label="Continue with Google"
            onPress={() => void handleSocialSignIn("google")}
            style={styles.secondaryBtn}
          />

          <Button
            testID="auth.continue_email"
            variant="secondary"
            leading={<Mail size={22} color={colors.textPrimary} />}
            label="Continue with Email"
            onPress={() => {
              clearAuthDrafts();
              router.push("/(auth)/otp");
            }}
            style={styles.secondaryBtn}
          />
        </View>
      </Animated.View>
    </View>
  );
}
