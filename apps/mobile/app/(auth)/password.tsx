import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { AuthField } from "@/auth/components/AuthField";
import { E2E_QA_PASSWORD, E2E_QA_USER } from "@/e2e/fixtures";
import { loginE2EQaUser } from "@/e2e/store";
import { useAppStore } from "@/store";
import { authClient } from "@/auth/authClient";

export default function PasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const authEmailDraft = useAppStore((state) => state.authEmailDraft);
  const authPasswordDraft = useAppStore((state) => state.authPasswordDraft);
  const setAuthPasswordDraft = useAppStore((state) => state.setAuthPasswordDraft);
  const setGuestMode = useAppStore((state) => state.setGuestMode);
  const [pending, setPending] = useState(false);
  const styles = StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 60,
      paddingHorizontal: 24,
      gap: 16,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.divider,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: 1,
      textTransform: "uppercase",
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      gap: 40,
      marginTop: -20,
    },
    intro: {
      gap: 12,
    },
    display: {
      fontSize: 32,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      gap: 20,
    },
    actions: {
      gap: 16,
    },
    mainBtn: {
      height: 64,
      backgroundColor: colors.textPrimary,
    },
    shieldWrap: {
      alignItems: "center",
      gap: 12,
      opacity: 0.7,
    },
  });

  const handleSignIn = async () => {
    if (!authEmailDraft.trim() || !authPasswordDraft.trim()) {
      Alert.alert("Missing details", "Enter your email and password to continue.");
      return;
    }
    setPending(true);
    try {
      setGuestMode(false);
      if (
        __DEV__
        && authEmailDraft.trim().toLowerCase() === E2E_QA_USER.email
        && authPasswordDraft === E2E_QA_PASSWORD
      ) {
        loginE2EQaUser();
        router.replace("/(app)");
        return;
      }
      const result = await (authClient as any).signIn.email({
        email: authEmailDraft.trim(),
        password: authPasswordDraft,
      });
      if (result?.error) {
        throw new Error(result.error.message ?? "Unable to sign in.");
      }
      router.replace("/(app)");
    } catch (error) {
      Alert.alert(
        "Sign in failed",
        error instanceof Error ? error.message : "Unable to sign in.",
        [
          { text: "Try again", style: "cancel" },
          { text: "Create account", onPress: () => router.push("/(auth)/identity") },
        ],
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
          <Text variant="title" style={styles.headerTitle}>Security Core</Text>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
            <Text variant="display" style={styles.display}>Secure identity</Text>
            <Text style={styles.subtitle}>
              Enter the password for <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>{authEmailDraft || "your account"}</Text>.
            </Text>
          </Animated.View>

          <View style={styles.form}>
            <AuthField
              testID="auth.password"
              label="Password"
              icon={Lock}
              secureTextEntry
              placeholder="Your password"
              value={authPasswordDraft}
              onChangeText={setAuthPasswordDraft}
            />
          </View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
            <Button
              testID="auth.sign_in"
              label={pending ? "Signing in..." : "Establish Security"}
              variant="primary"
              onPress={() => void handleSignIn()}
              style={styles.mainBtn}
              textStyle={{ color: colors.background }}
              disabled={pending}
            />
          </Animated.View>

          <View style={styles.shieldWrap}>
            <ShieldCheck size={24} color={colors.textPrimary} />
            <Text variant="caption" style={{ textAlign: "center", lineHeight: 18, color: colors.textSecondary }}>
              YOUR SECURITY KEY IS ENCRYPTED WITH{"\n"}AES-256 SYSTEM STANDARDS
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
