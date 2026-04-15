import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { ArrowRight, Mail, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

import { Text } from "@/foundation/primitives/Text";
import { Button } from "@/foundation/primitives/Button";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAuthSession } from "@/auth/useAuthSession";
import { authClient, signInAnonymously } from "@/auth/authClient";
import { getOAuthCallbackUrl } from "@/auth/AuthProvider";
import { AppleIcon, GoogleIcon } from "@/foundation/components/BrandIcons";
import { TypewriterText } from "@/foundation/components/TypewriterText";
import { useAppStore } from "@/store";
import { LogoMark } from "@/foundation/icons/LogoMark";

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { canAccessApp, canUpgrade, isReady } = useAuthSession();
  const setGuestMode = useAppStore((state) => state.setGuestMode);

  if (isReady && canAccessApp && !canUpgrade) {
    return <Redirect href="/(app)" />;
  }

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    try {
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

  const handleAnonymousContinue = async () => {
    try {
      await signInAnonymously();
      setGuestMode(true);
      router.replace("/(app)");
    } catch (error) {
      setGuestMode(false);
      Alert.alert(
        "Guest mode unavailable",
        error instanceof Error ? error.message : "Unable to start guest mode right now.",
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Absolute Dismiss Button */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <Pressable 
          accessibilityLabel="Dismiss sign in"
          onPress={() => router.navigate("/(app)")}
          style={styles.closeBtn}
        >
          <X size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        bounces={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 80, paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(120).springify()} style={styles.heroWrap}>
          <Text variant="display" style={[styles.wordmark, { color: colors.textPrimary }]}>
            ZANE-AI
          </Text>

          <View style={styles.typewriterWrap}>
            <TypewriterText
              phrases={[
                "Zane-ai searching...",
                "Comparing properties.",
                "And more in the app.",
              ]}
            />
          </View>
        </Animated.View>


        <Animated.View
          entering={FadeInDown.delay(220).springify()}
          style={styles.actionsWrap}
        >
          <View style={styles.buttonStack}>
            <Button
              testID="auth.continue_apple"
              variant="primary"
              leading={<AppleIcon size={18} color={colors.background} />}
              label="Continue with Apple"
              onPress={() => void handleSocialSignIn("apple")}
              style={[styles.primaryBtn, { backgroundColor: colors.textPrimary }]}
              textStyle={{ color: colors.background }}
            />

            <Button
              testID="auth.continue_google"
              variant="secondary"
              leading={<GoogleIcon size={20} />}
              label="Continue with Google"
              onPress={() => void handleSocialSignIn("google")}
              style={[
                styles.secondaryBtn,
                { backgroundColor: colors.surface, borderColor: colors.divider },
              ]}
              textStyle={{ color: colors.textPrimary }}
            />

            <Button
              testID="auth.continue_email"
              variant="secondary"
              leading={<Mail size={20} color={colors.textPrimary} />}
              label="Continue with Email"
              onPress={() => {
                router.push("/(auth)/email-options");
              }}
              style={[
                styles.secondaryBtn,
                { backgroundColor: colors.surface, borderColor: colors.divider },
              ]}
              textStyle={{ color: colors.textPrimary }}
            />

            {!canUpgrade && (
              <Pressable
                testID="auth.continue_anonymous"
                onPress={() => void handleAnonymousContinue()}
                style={styles.guestAction}
              >
                <Text variant="caption" tone="muted">
                  Or continue as guest
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xxxl,
    justifyContent: "space-between",
  },
  heroWrap: {
    alignItems: "center",
    gap: 20,
    marginTop: 100,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  wordmark: {
    fontSize: 42,
    fontFamily: "Manrope_800ExtraBold",
    letterSpacing: 2,
    lineHeight: 52,
    textAlign: "center",
    color: colors.textPrimary,
  },
  typewriterWrap: {
    minHeight: 40,
    justifyContent: "center",
    opacity: 0.7,
  },
  header: {
    position: "absolute",
    right: 24,
    zIndex: 100,
  },
  closeBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  actionsWrap: {
    marginBottom: 40,
  },
  buttonStack: {
    gap: 12,
  },
  primaryBtn: {
    minHeight: 58,
    borderRadius: 29,
  },
  secondaryBtn: {
    minHeight: 58,
    borderRadius: 29,
    borderWidth: 1,
  },
  guestAction: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 10,
  },
});


