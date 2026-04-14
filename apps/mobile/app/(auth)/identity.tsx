import { useState } from "react";
import { Alert, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, Upload, Shield, Check, User } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";
import { AuthField } from "@/auth/components/AuthField";
import { authClient } from "@/auth/authClient";

export default function IdentityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const authEmailDraft = useAppStore((state) => state.authEmailDraft);
  const authPasswordDraft = useAppStore((state) => state.authPasswordDraft);
  const authNameDraft = useAppStore((state) => state.authNameDraft);
  const setAuthNameDraft = useAppStore((state) => state.setAuthNameDraft);
  const clearAuthDrafts = useAppStore((state) => state.clearAuthDrafts);
  const setGuestMode = useAppStore((state) => state.setGuestMode);
  const [pending, setPending] = useState(false);
  const styles = StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
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
      lineHeight: 24,
    },
    uploadZone: {
      gap: 20,
    },
    glassCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: 24,
      borderRadius: 24,
      gap: 20,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    uploadIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.surfaceRaised,
      justifyContent: "center",
      alignItems: "center",
    },
    uploadText: {
      flex: 1,
      gap: 4,
    },
    statusBadge: {
      backgroundColor: `${colors.textPrimary}14`,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    badgeText: {
      fontSize: 8,
      fontWeight: "800",
      letterSpacing: 1,
      color: colors.textPrimary,
    },
    fileList: {
      gap: 12,
      paddingHorizontal: 4,
    },
    fileItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      backgroundColor: colors.surfaceRaised,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    actions: {
      gap: 16,
    },
    mainBtn: {
      height: 64,
      backgroundColor: colors.textPrimary,
    },
    trustBadge: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      opacity: 0.6,
    },
    checkCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.success,
    },
  });

  const handleCreateAccount = async () => {
    if (!authNameDraft.trim() || !authEmailDraft.trim() || !authPasswordDraft.trim()) {
      Alert.alert("Missing details", "We need your name, email, and password to create the account.");
      return;
    }
    setPending(true);
    try {
      setGuestMode(false);
      const result = await (authClient as any).signUp.email({
        name: authNameDraft.trim(),
        email: authEmailDraft.trim(),
        password: authPasswordDraft,
      });
      if (result?.error) {
        throw new Error(result.error.message ?? "Unable to create account.");
      }
      clearAuthDrafts();
      router.replace("/(app)");
    } catch (error) {
      Alert.alert("Registration failed", error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <Text variant="title" style={styles.headerTitle}>Provisioning</Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
          <Text variant="display" style={styles.display}>Cloud Identity</Text>
          <Text style={styles.subtitle}>
            Finish creating your Zane-ai account for <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>{authEmailDraft || "your email"}</Text>.
          </Text>
        </Animated.View>

        <View style={styles.uploadZone}>
          <AuthField
            label="Full name"
            icon={User}
            placeholder="Ahmed Mansour"
            value={authNameDraft}
            onChangeText={setAuthNameDraft}
          />

          <View style={styles.glassCard}>
            <View style={styles.uploadIcon}>
              <Upload size={32} color={colors.textPrimary} />
            </View>
            <View style={styles.uploadText}>
              <Text variant="body" style={{ fontWeight: "700", color: colors.textPrimary }}>Identity Ready</Text>
              <Text variant="caption" style={{ color: colors.textSecondary }}>Your account details are prepared for secure creation.</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.badgeText}>READY</Text>
            </View>
          </View>

          <View style={styles.fileList}>
            <FileItem name={authEmailDraft || "Email account"} />
            <FileItem name="Secure password credential" />
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
          <Button
            label={pending ? "Initializing..." : "Initialize Environment"}
            variant="primary"
            onPress={() => void handleCreateAccount()}
            style={styles.mainBtn}
            textStyle={{ color: colors.background }}
            disabled={pending}
          />
        </Animated.View>

        <View style={styles.trustBadge}>
          <Shield size={14} color={colors.textSecondary} />
          <Text variant="caption" style={{ color: colors.textSecondary }}>END-TO-END ENCRYPTED PROVISIONING</Text>
        </View>
      </View>
    </Screen>
  );

  function FileItem({ name }: { name: string }) {
    return (
      <View style={styles.fileItem}>
        <Text variant="caption" style={{ flex: 1, fontWeight: "600", color: colors.textPrimary }}>{name}</Text>
        <View style={styles.checkCircle}>
          <Check size={10} color={colors.background} />
        </View>
      </View>
    );
  }
}
