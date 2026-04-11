import { StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, Upload, FileCheck, Shield, Check } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";

// Specific 'Midnight Zinc' palette
const COLORS = {
  background: "#000000",
  black: "#000000",
  zinc800: "#27272A",
  white: "#FFFFFF",
  zinc400: "#A1A1AA",
};

export default function IdentityScreen() {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={COLORS.white} />
        </Pressable>
        <Text variant="title" style={styles.headerTitle}>Provisioning</Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
          <Text variant="display" style={styles.display}>Cloud Identity</Text>
          <Text style={styles.subtitle}>
            Upload your credentials to activate premium real estate operating features.
          </Text>
        </Animated.View>

        <View style={styles.uploadZone}>
          <View style={styles.glassCard}>
            <View style={styles.uploadIcon}>
              <Upload size={32} color={COLORS.white} />
            </View>
            <View style={styles.uploadText}>
              <Text variant="body" style={{ fontWeight: "700", color: COLORS.white }}>Upload Document</Text>
              <Text variant="caption" style={{ color: COLORS.zinc400 }}>Passport, Driver's License, or ID</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.badgeText}>PENDING</Text>
            </View>
          </View>

          <View style={styles.fileList}>
            <FileItem name="Proof_of_Establishment.pdf" complete />
            <FileItem name="Visionary_Invite_Pass.png" complete />
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
          <Button 
            label="Initialize Environment" 
            variant="primary" 
            onPress={() => setAuthenticated(true)} 
            style={styles.mainBtn} 
          />
        </Animated.View>

        <View style={styles.trustBadge}>
          <Shield size={14} color={COLORS.zinc400} />
          <Text variant="caption" style={{ color: COLORS.zinc400 }}>END-TO-END ENCRYPTED PROVISIONING</Text>
        </View>
      </View>
    </Screen>
  );
}

function FileItem({ name, complete }: { name: string; complete: boolean }) {
  return (
    <View style={styles.fileItem}>
      <FileCheck size={18} color={COLORS.white} />
      <Text variant="caption" style={{ flex: 1, fontWeight: "600", color: COLORS.white }}>{name}</Text>
      <View style={[styles.checkCircle, { backgroundColor: theme.colors.success }]}>
        <Check size={10} color="#fff" />
      </View>
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
    lineHeight: 24,
  },
  uploadZone: {
    gap: 20,
  },
  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.zinc800,
    padding: 24,
    borderRadius: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    flex: 1,
    gap: 4,
  },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#fff",
  },
  fileList: {
    gap: 12,
    paddingHorizontal: 4,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    gap: 16,
  },
  mainBtn: {
    height: 64,
    backgroundColor: COLORS.white,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: 0.6,
  },
});
