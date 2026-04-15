import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/decision/components/PropertyCard";
import { Bookmark, Search, ListFilter, ArrowRight } from "lucide-react-native";
import { TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useSavedProperties } from "@/persistence/convex/usePropertyData";
import type { PropertyCardVM } from "@/types/domain";

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState("");
  const savedProperties = useSavedProperties()
    .map((item: { property: PropertyCardVM | null }) => item.property)
    .filter((property: PropertyCardVM | null): property is PropertyCardVM => property !== null);
  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return savedProperties;
    }
    return savedProperties.filter((property: PropertyCardVM) =>
      `${property.title} ${property.locationLabel}`.toLowerCase().includes(query),
    );
  }, [savedProperties, searchQuery]);

  return (
    <Screen style={styles.screen}>
      {/* Unified Sticky Header (Identity + Search) */}
      <View style={[styles.crystalHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContentOuter}>
          <View style={styles.identityRow}>
            <View style={styles.identityBlock}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarLetter}>A</Text>
              </View>
              <Text variant="body" style={styles.identityName}>Ahmed Mansour</Text>
            </View>
            <Pressable accessibilityLabel="Go back" style={styles.headerBtn} onPress={() => router.back()}>
              <ArrowRight size={20} color={colors.textPrimary} style={{ transform: [{ rotate: "180deg" }] }} />
            </Pressable>
          </View>

          {/* Integrated Search Hub - Now part of Sticky Portal */}
          <View style={styles.archiveHeader}>
            <View style={styles.searchSurface}>
              <Search size={18} color={colors.textMuted} />
              <TextInput 
                placeholder="Search saved properties..."
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable style={styles.filterBtn}>
              <ListFilter size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHead}>
          <Text variant="caption" style={styles.sectionEyebrow}>CRAB EMOTIONS</Text>
        </View>

        {filteredProperties.length === 0 ? (
          <View style={[styles.emptyState, { marginTop: insets.top + 100 }]}>
            <Animated.View entering={FadeInDown.springify()} style={styles.emptyIcon}>
              <Bookmark size={48} color={colors.accent} strokeWidth={1.5} />
            </Animated.View>
            <Text variant="title">No favorites yet</Text>
            <Text tone="muted" style={{ textAlign: "center", paddingHorizontal: 40 }}>
              Properties you bookmark will materialize here as a curated collection.
            </Text>
          </View>
        ) : (
          <View testID="saved.list" style={styles.heroList}>
            {filteredProperties.map((p: PropertyCardVM, i: number) => (
              <Animated.View 
                key={p.id}
                entering={FadeInDown.delay(i * 100).springify()}
              >
                <PropertyCard property={p} style={{ marginHorizontal: 0 }} />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  crystalHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: `${colors.background}FA`, // 98% opacity for a crystal clear vision
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  headerContentOuter: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 16,
    gap: 16,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
  },
  identityBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatarMini: {
    width: 36, // Slight expansion for status
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.05)", // Ghostly ring
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  identityName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  scrollContent: {
    paddingTop: 160, // Accommodate larger sticky header
    paddingHorizontal: theme.spacing.lg,
  },
  archiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
  },
  searchSurface: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    height: "100%", // Match parent
    borderRadius: 12,
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
  filterBtn: {
    width: 48,
    height: "100%", // Perfect symmetry
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sectionHead: {
    marginBottom: 16, // Refined gap
  },
  sectionEyebrow: {
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 3.2, // Elite spectral tracking
    fontSize: 9, // Slightly smaller, more sophisticated
    paddingHorizontal: 6,
    opacity: 0.6,
  },
  heroList: {
    paddingVertical: theme.spacing.md,
  },
  emptyState: {
    alignItems: "center",
    gap: 16,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.accent}15`,
    justifyContent: "center",
    alignItems: "center",
  },
});
