import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, Lock, Mail, ShieldCheck } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { AuthField } from "@/auth/components/AuthField";
import { useAuthSession } from "@/auth/useAuthSession";
import { E2E_QA_PASSWORD, E2E_QA_USER } from "@/e2e/fixtures";
import { loginE2EQaUser } from "@/e2e/store";
import { authClient } from "@/auth/authClient";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  const { canUpgrade } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const styles = StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
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
      marginTop: 20,
    },
    forgotText: {
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Enter your email and password to continue.");
      return;
    }
    setPending(true);
    try {
      if (
        __DEV__
        && email.trim().toLowerCase() === E2E_QA_USER.email
        && password === E2E_QA_PASSWORD
      ) {
        loginE2EQaUser();
        router.replace("/(app)");
        return;
      }
      const result = await (authClient as any).signIn.email({
        email: email.trim(),
        password: password,
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
          { text: "Create account", onPress: () => router.push("/(auth)/register") },
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

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
              <Text variant="display" style={styles.display}>Secure identity</Text>
              <Text style={styles.subtitle}>
                {canUpgrade
                  ? "Sign in to keep your anonymous research and sync it into your account."
                  : "Sign in with your email and password."}
              </Text>
            </Animated.View>

            <View style={styles.form}>
              <AuthField
                testID="auth.email"
                label="Email"
                icon={Mail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
              />
              <AuthField
                testID="auth.password"
                label="Password"
                icon={Lock}
                secureTextEntry
                placeholder="Your password"
                value={password}
                onChangeText={setPassword}
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
              <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </Animated.View>

            <View style={styles.shieldWrap}>
              <ShieldCheck size={24} color={colors.textPrimary} />
              <Text variant="caption" style={{ textAlign: "center", lineHeight: 18, color: colors.textSecondary }}>
                YOUR SECURITY KEY IS ENCRYPTED WITH{"\n"}AES-256 SYSTEM STANDARDS
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
