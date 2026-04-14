import { StyleSheet, View, Pressable, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ArrowRight, Search, Settings, Bookmark, Scale, User, MapPin, Plus, ChevronRight } from "lucide-react-native";
import { TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { createE2EThread } from "@/e2e/store";
import { useThreads } from "@/persistence/convex/useConversationData";
import { useAppStore } from "@/store";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuthSession } from "@/auth/useAuthSession";

export default function MenuScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const setActiveThreadId = useAppStore((state) => state.setActiveThreadId);
  const resetConversationState = useAppStore((state) => state.resetConversationState);
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const threads = useThreads();
  const startThread = useMutation(api.agent.public.startThread.startThread);
  const { isAuthenticated, isGuest, user } = useAuthSession();

  const handleNewThread = async () => {
    if (!isAuthenticated) {
      Alert.alert("Guest browsing", "Sign in to create and sync conversation threads.");
      router.navigate("/(app)");
      return;
    }
    resetConversationState();
    if (e2eQaMode) {
      const threadId = createE2EThread();
      setActiveThreadId(threadId);
      router.navigate("/(app)");
      return;
    }
    const threadId = await startThread({});
    setActiveThreadId(threadId);
    router.navigate("/(app)");
  };

  const displayName = user?.name ?? user?.email ?? "Ahmed Mansour";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "A";

  return (
    <Screen>
      {/* Reversed Identity Back Button Pattern */}
      <View style={[styles.identityHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <Pressable 
            style={({ pressed }) => [styles.identityBlock, pressed && { opacity: 0.7 }]}
            onPress={() => router.navigate("/(app)/profile")}
          >
            <View style={styles.avatarMini}>
              <Text style={styles.avatarLetter}>{avatarLetter}</Text>
            </View>
            <Text variant="body" style={styles.identityName}>{displayName}</Text>
          </Pressable>
          
          <View style={styles.headerActions}>
            <Pressable testID="menu.close" style={styles.iconBtn} onPress={() => router.dismissAll()}>
              <ArrowRight size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 88, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.block}>
            <Text variant="caption" tone="muted" style={styles.sectionEyebrow}>THEORIES</Text>
          <View style={styles.theoryGroup}>
            {/* New Thread Action Integrated */}
            <Pressable testID="chat.new_thread" style={styles.theoryActionItem} onPress={handleNewThread}>
              <View style={styles.plusCircle}>
                <Plus size={18} color={colors.textPrimary} />
              </View>
              <Text variant="body" style={styles.theoryActionText}>New Conversation</Text>
            </Pressable>

            <View style={styles.divider} />

            {/* List of Recent Theories */}
            {threads.slice(0, 3).map((thread: any) => (
              <View key={thread._id}>
                <Pressable
                  testID={`history.thread.${thread._id}`}
                  style={styles.theoryItem}
                  onPress={() => {
                    setActiveThreadId(thread._id);
                    router.navigate("/(app)");
                  }}
                >
                  <View style={styles.theoryHeader}>
                    <Text variant="body" style={styles.theoryTitle}>{thread.title ?? "Untitled search"}</Text>
                    <Text variant="caption" style={styles.theoryTime}>
                      {new Date(thread._creationTime).toLocaleDateString()}
                    </Text>
                  </View>
                </Pressable>
                <View style={styles.divider} />
              </View>
            ))}

            {isGuest ? (
              <View style={styles.theoryItem}>
                <Text variant="body" style={styles.theoryTitle}>Guest mode</Text>
                <Text variant="caption" style={styles.theoryPreview}>
                  Sign in to save and reopen your research archive.
                </Text>
              </View>
            ) : null}

            <Pressable 
              style={styles.seeAllItem} 
              onPress={() => router.navigate("/(app)/theories")}
            >
              <Text variant="caption" style={styles.seeAllText}>See All Research Archive</Text>
              <ChevronRight size={14} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        <View style={styles.block}>
          <Text variant="caption" tone="muted" style={styles.sectionEyebrow}>COLLECTIONS & TOOLS</Text>
          <View style={styles.cardGroup}>
            <Pressable testID="menu.saved" style={styles.menuItem} onPress={() => router.navigate("/(app)/saved")}>
              <View style={styles.circleIcon}>
                <Bookmark size={18} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={styles.itemText}>Saved Properties</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable testID="menu.compare" style={styles.menuItem} onPress={() => router.navigate("/(app)/compare")}>
              <View style={styles.circleIcon}>
                <Scale size={18} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={styles.itemText}>Compare Tray</Text>
            </Pressable>
            
            <View style={styles.divider} />

            <Pressable testID="menu.profile" style={styles.menuItem} onPress={() => router.navigate("/(app)/profile")}>
              <View style={styles.circleIcon}>
                <User size={18} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={styles.itemText}>User Profile</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.menuItem}>
              <View style={styles.circleIcon}>
                <Settings size={18} color={colors.textPrimary} />
              </View>
              <Text variant="body" tone="primary" style={styles.itemText}>Settings</Text>
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
    gap: 32, // Airy, professional gap
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
  identityBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  identityName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  block: {
    gap: theme.spacing.sm,
  },
  searchBlock: {
    marginBottom: theme.spacing.md,
  },
  searchSurface: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    color: colors.textSecondary,
    fontWeight: "700",
  },
  theoryGroup: {
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  theoryItem: {
    padding: theme.spacing.md,
  },
  theoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  theoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  theoryTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  theoryPreview: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
    opacity: 0.75,
    lineHeight: 18,
  },
  cardGroup: {
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: 12,
  },
  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  itemText: {
    fontWeight: "600",
  },
  theoryActionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: 12,
  },
  plusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  theoryActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
  },
  seeAllText: {
    color: colors.textMuted,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: -0.1,
  },
  sectionEyebrow: {
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 2.2, // Elite tracking
    fontSize: 10,
    paddingHorizontal: theme.spacing.xs,
    marginBottom: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth, // Visionary precision
    backgroundColor: colors.divider,
    marginHorizontal: theme.spacing.md,
  },
});
