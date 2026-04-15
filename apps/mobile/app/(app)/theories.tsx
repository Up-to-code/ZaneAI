import { StyleSheet, View, Pressable, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";

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
    <Screen safe={false}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Pressable accessibilityLabel="Back" style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text variant="title" style={styles.headerTitle}>Archive</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.searchBlock}>
          <View style={styles.searchSurface}>
            <Search size={18} color={colors.textMuted} />
            <TextInput 
              placeholder="Search conversations..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 120, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.theoryGroup}>
          <View style={styles.groupCard}>
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
          </View>
          
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: `${colors.background}FA`,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.6,
    textAlign: "center",
    flex: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  searchBlock: {
    paddingVertical: 4,
  },
  searchSurface: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  theoryGroup: {
    marginTop: 20,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: "hidden",
  },
  theoryItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
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
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  theoryPreview: {
    fontSize: 13,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  theoryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  theoryTime: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: "SpaceMono_400Regular",
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
});
