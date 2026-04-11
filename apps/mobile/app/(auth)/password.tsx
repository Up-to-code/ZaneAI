import { StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, Lock, Eye, ShieldCheck, CheckCircle2 } from "lucide-react-native";

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

export default function PasswordScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={COLORS.white} />
        </Pressable>
        <Text variant="title" style={styles.headerTitle}>Security Core</Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
          <Text variant="display" style={styles.display}>Secure identity</Text>
          <Text style={styles.subtitle}>
            Create a unique access key for your Zayon workspace.
          </Text>
        </Animated.View>

        <View style={styles.form}>
          <View style={styles.inputCard}>
            <Lock size={18} color={COLORS.white} />
            <Text variant="body" style={{ flex: 1, fontWeight: "600", letterSpacing: 2, color: COLORS.white }}>••••••••••••</Text>
            <Eye size={18} color={COLORS.zinc400} />
          </View>

          <View style={styles.validationList}>
            <ValidationItem label="Minimum 12 characters" complete />
            <ValidationItem label="Advanced entropy score" complete />
            <ValidationItem label="Visionary system compatible" complete />
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
          <Button 
            label="Establish Security" 
            variant="primary" 
            onPress={() => router.push("/(auth)/identity")} 
            style={styles.mainBtn} 
          />
        </Animated.View>

        <View style={styles.shieldWrap}>
          <ShieldCheck size={24} color={COLORS.white} />
          <Text variant="caption" style={{ textAlign: "center", lineHeight: 18, color: COLORS.zinc400 }}>
            YOUR SECURITY KEY IS ENCRYPTED WITH{"\n"}AES-256 SYSTEM STANDARDS
          </Text>
        </View>
      </View>
    </Screen>
  );
}

function ValidationItem({ label, complete }: { label: string; complete: boolean }) {
  return (
    <View style={styles.validationItem}>
      <CheckCircle2 size={14} color={complete ? theme.colors.success : COLORS.zinc400} />
      <Text variant="caption" style={{ color: complete ? COLORS.white : COLORS.zinc400 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: COLORS.background,
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
    gap: 40,
    marginTop: -20,
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
  },
  form: {
    gap: 20,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.zinc800,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  validationList: {
    gap: 10,
    paddingLeft: 4,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actions: {
    gap: 16,
  },
  mainBtn: {
    height: 64,
    backgroundColor: COLORS.white,
  },
  shieldWrap: {
    alignItems: "center",
    gap: 12,
    opacity: 0.7,
  },
});
