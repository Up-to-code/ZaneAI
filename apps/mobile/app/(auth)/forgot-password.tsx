import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { AuthField } from "@/auth/components/AuthField";
import { authClient } from "@/auth/authClient";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  const [email, setEmail] = useState("");
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
  });

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Missing detail", "Enter your email to request a reset link.");
      return;
    }
    setPending(true);
    try {
      const result = await (authClient as any).forgotPassword({
        email: email.trim(),
      });
      if (result?.error) {
        throw new Error(result.error.message ?? "Unable to request password reset.");
      }
      Alert.alert(
        "Reset Link Sent", 
        "Check your email and follow the instructions to reset your password.",
        [{ text: "Back to login", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (error) {
      Alert.alert("Reset failed", error instanceof Error ? error.message : "Unable to request password reset.");
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
          <Text variant="title" style={styles.headerTitle}>Recovery</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
              <Text variant="display" style={styles.display}>Restore Access</Text>
              <Text style={styles.subtitle}>
                Enter your email to securely recover your identity.
              </Text>
            </Animated.View>

            <View style={styles.form}>
              <AuthField
                label="Email"
                icon={Mail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
              <Button
                label={pending ? "Sending..." : "Request Reset Link"}
                variant="primary"
                onPress={() => void handleReset()}
                style={styles.mainBtn}
                textStyle={{ color: colors.background }}
                disabled={pending}
              />
            </Animated.View>

            <View style={styles.shieldWrap}>
              <ShieldCheck size={24} color={colors.textPrimary} />
              <Text variant="caption" style={{ textAlign: "center", lineHeight: 18, color: colors.textSecondary }}>
                IDENTITY VERIFICATION MAY BE REQUIRED{"\n"}BEFORE RESTORING ACCESS
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
