import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { MessageCircle, Bookmark, Scale, User, MapPin, Plus, History, ArrowLeft, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";

export default function MenuScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const newThread = useAppStore((state) => state.newThread);

  const handleNewThread = () => {
    newThread();
    router.navigate("/(app)");
  };

  return (
    <Screen>
      {/* Reversed Identity Back Button Pattern */}
      <View style={[styles.identityHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <Pressable style={styles.idBackBtn} onPress={() => router.dismissAll()}>
            <View style={styles.backArrowWrap}>
              <ArrowLeft size={16} color={colors.textPrimary} />
            </View>
            <Text variant="body" style={styles.backName}>Ahmed Mansour</Text>
            <View style={styles.backAvatar}>
              <Text style={styles.backAvatarText}>AM</Text>
            </View>
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text variant="title" style={styles.headerTitle}>Menu</Text>
          </View>
          <View style={styles.headerActions}>
            {/* Right side spacer */}
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 88, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.block}>
          <Text variant="caption" tone="muted" style={styles.sectionEyebrow}>CONVERSATIONS</Text>
          <View style={styles.cardGroup}>
            <Pressable style={styles.menuItem} onPress={handleNewThread}>
              <View style={styles.listIconWrap}>
                <Plus size={20} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={{ fontWeight: "600" }}>New Thread</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={[styles.menuItem, styles.disabledItem]}>
              <View style={styles.listIconWrap}>
                <History size={20} color={colors.textSecondary} />
              </View>
              <Text variant="body" style={styles.disabledText}>Thread History (Soon)</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.block}>
          <Text variant="caption" tone="muted" style={styles.sectionEyebrow}>APPLICATIONS</Text>
          <View style={styles.cardGroup}>
            <Pressable style={styles.menuItem} onPress={() => router.navigate("/(app)")}>
              <View style={styles.listIconWrap}>
                <MessageCircle size={20} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={{ fontWeight: "600" }}>Active Chat</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.menuItem} onPress={() => router.navigate("/(app)/saved")}>
              <View style={styles.listIconWrap}>
                <Bookmark size={20} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={{ fontWeight: "600" }}>Saved Properties</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.menuItem} onPress={() => router.navigate("/(app)/compare")}>
              <View style={styles.listIconWrap}>
                <Scale size={20} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={{ fontWeight: "600" }}>Compare Tray</Text>
            </Pressable>
            
            <View style={styles.divider} />

            <Pressable style={styles.menuItem} onPress={() => router.navigate("/(app)/profile")}>
              <View style={styles.listIconWrap}>
                <User size={20} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={{ fontWeight: "600" }}>User Profile</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={[styles.menuItem, styles.disabledItem]}>
              <View style={styles.listIconWrap}>
                <MapPin size={20} color={colors.textSecondary} />
              </View>
              <Text variant="body" style={styles.disabledText}>Neighborhoods (Soon)</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.xxxl,
    paddingBottom: 40,
  },
  identityHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: `${colors.background}FA`,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    height: 72,
  },
  idBackBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingRight: 16,
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: 12,
  },
  backAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  backAvatarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  backName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  backArrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.backgroundSoft,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -4,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    paddingRight: 40, // offset the back btn width roughly
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerActions: {
    width: 44,
  },
  block: {
    gap: theme.spacing.md,
  },
  cardGroup: {
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.xs,
  },
  sectionEyebrow: {
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    paddingHorizontal: theme.spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  listIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: theme.spacing.md,
  },
});
