import { StyleSheet, View, Pressable, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useThreads } from "@/persistence/convex/useConversationData";
import { useAppStore } from "@/store";

export default function TheoriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const styles = useMemo(() => createStyles(colors), [colors]);
  const threads = useThreads();
  const setActiveThreadId = useAppStore((state) => state.setActiveThreadId);

  const filteredTheories = threads.filter((thread: any) =>
    (thread.title ?? "Untitled search").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Screen>
      {/* Search Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowRight size={20} color={colors.textPrimary} style={{ transform: [{ rotate: "180deg" }] }} />
          </Pressable>
          <Text variant="title" style={styles.headerTitle}>Archive</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.searchBlock}>
          <View style={styles.searchSurface}>
            <Search size={18} color={colors.textMuted} />
            <TextInput 
              placeholder="Search spoke theories..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.theoryGroup}>
          {filteredTheories.map((thread: any, index: number) => (
            <View key={thread._id}>
              <Pressable
                testID={`history.thread.${thread._id}`}
                style={styles.theoryItem}
                onPress={() => {
                  setActiveThreadId(thread._id);
                  router.replace("/(app)");
                }}
              >
                <View style={styles.theoryMain}>
                  <View style={styles.theoryContent}>
                    <Text variant="body" style={styles.theoryTitle}>{thread.title ?? "Untitled search"}</Text>
                    <Text variant="caption" style={styles.theoryPreview} numberOfLines={1}>
                      {thread.summary ?? "Open this thread to continue the research."}
                    </Text>
                  </View>
                  <View style={styles.theoryMeta}>
                    <Text variant="caption" style={styles.theoryTime}>
                      {new Date(thread._creationTime).toLocaleDateString()}
                    </Text>
                    <ChevronRight size={14} color={colors.textMuted} />
                  </View>
                </View>
              </Pressable>
              {index < filteredTheories.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
          
          {filteredTheories.length === 0 && (
            <View style={styles.emptyState}>
              <Text variant="body" tone="muted">
                No theories found matching {"\""}
                {searchQuery}
                {"\""}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: `${colors.background}FA`,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    zIndex: 100,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.6,
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
  searchBlock: {
    paddingVertical: 12,
  },
  searchSurface: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    height: 48,
    borderRadius: 12, // Apple-style tighter radius
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
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
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
  theoryMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  theoryContent: {
    flex: 1,
    marginRight: 12,
    gap: 2,
  },
  theoryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  theoryPreview: {
    fontSize: 13,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  theoryMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  theoryTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: theme.spacing.md,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
});
