import { StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, ShieldCheck, RefreshCcw } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

// Specific 'Midnight Zinc' palette
const COLORS = {
  background: "#000000",
  black: "#000000",
  zinc800: "#27272A",
  white: "#FFFFFF",
  zinc400: "#A1A1AA",
};

export default function OtpScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      <View style={styles.background}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.background }]} />
      </View>

      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={COLORS.white} />
        </Pressable>
        <Text variant="title" style={styles.headerTitle}>Verification</Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
          <Text variant="display" style={styles.display}>Check your identity</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit ODP to <Text style={{ color: COLORS.white, fontWeight: "700" }}>ahmed@zayon.ai</Text>.
          </Text>
        </Animated.View>

        <View style={styles.codeRow}>
          {[4, 8, 2, " ", " ", " "].map((digit, i) => (
            <View key={i} style={[styles.digitBox, digit === " " && styles.emptyBox]}>
              <Text variant="title" style={{ fontSize: 28, fontWeight: "900", color: COLORS.white }}>{digit}</Text>
            </View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
          <Button 
            label="Verify Identity" 
            variant="primary" 
            onPress={() => router.push("/(auth)/password")} 
            style={styles.mainBtn} 
          />
          
          <Pressable style={styles.resendBtn}>
            <RefreshCcw size={14} color={COLORS.zinc400} />
            <Text variant="label" style={{ color: COLORS.zinc400 }}>Resend Code (59s)</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.securitySeal}>
          <ShieldCheck size={14} color={theme.colors.success} />
          <Text variant="caption" style={{ color: theme.colors.success, fontSize: 10, letterSpacing: 1 }}>
            SECURE CHANNEL ENCRYPTED
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: COLORS.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
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
    backgroundColor: COLORS.zinc800,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 48,
    marginTop: -40,
  },
  intro: {
    gap: 12,
  },
  display: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.zinc400,
    lineHeight: 24,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  digitBox: {
    flex: 1,
    height: 72,
    backgroundColor: COLORS.zinc800,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  emptyBox: {
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "transparent",
  },
  actions: {
    gap: 24,
  },
  mainBtn: {
    height: 64,
    backgroundColor: COLORS.white,
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  securitySeal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: 0.8,
  },
});
