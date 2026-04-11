import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Image } from "expo-image";
import { Bookmark, Scale, MapPin, Share, Trash2, ListFilter, ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const properties = useAppStore((state) => state.properties);
  const savedPropertyIds = useAppStore((state) => state.savedPropertyIds);
  const comparePropertyIds = useAppStore((state) => state.comparePropertyIds);

  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

  // Split into 2 columns for masonry-like effect
  const leftCol = savedProperties.filter((_, i) => i % 2 === 0);
  const rightCol = savedProperties.filter((_, i) => i % 2 !== 0);

  return (
    <Screen style={styles.screen}>
      {/* Crystal Header (Glassmorphic Floating) */}
      <View style={[styles.crystalHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Pressable style={styles.circleBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text variant="label" style={styles.headerEyebrow}>SHORTLIST</Text>
            <Text variant="title" style={styles.headerTitle}>Favorites</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.circleBtn}><Share size={20} color={colors.textPrimary} /></Pressable>
          </View>
        </View>
      </View>

      {/* Side Action Bar - Modernized */}
      <View style={[styles.sideFloat, { top: insets.top + 120 }]}>
        <SideAction icon={<ListFilter size={18} color={colors.textPrimary} />} />
        <SideAction icon={<Trash2 size={18} color={colors.accent} />} last />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]}
      >
        {savedProperties.length === 0 ? (
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
          <View style={styles.boardContainer}>
            <View style={styles.column}>
              {leftCol.map((p, i) => (
                <GridCard key={p.id} property={p} index={i} colors={colors} styles={styles} router={router} />
              ))}
            </View>
            <View style={styles.column}>
              {rightCol.map((p, i) => (
                <GridCard key={p.id} property={p} index={i} colors={colors} styles={styles} router={router} isRight />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );

  function SideAction({ icon, last }: { icon: any; last?: boolean }) {
    return (
      <Pressable style={[styles.sideItem, last && { borderBottomWidth: 0 }]}>
        {icon}
      </Pressable>
    );
  }
}

function GridCard({ property, index, colors, styles, router, isRight }: any) {
  const comparePropertyIds = useAppStore((state) => state.comparePropertyIds);
  const isCompared = comparePropertyIds.includes(property.id);

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 120).springify().damping(12)}
      layout={Layout.springify()}
      style={styles.cardWrapper}
    >
      <Pressable 
        style={[styles.smallCard, isRight && styles.rightCard]} 
        onPress={() => router.push(`/(app)/property/${property.id}`)}
      >
        <Image source={property.heroUrl} style={styles.cardImage} contentFit="cover" />
        
        <View style={[styles.matchIndicator, { backgroundColor: colors.accent }]}>
          <Text style={styles.matchText}>{property.matchScore}%</Text>
        </View>

        <View style={styles.cardOverlay}>
          <Text variant="label" style={styles.priceText}>{property.priceLabel}</Text>
          <View style={styles.locationRow}>
            <MapPin size={10} color={colors.accent} />
            <Text variant="caption" numberOfLines={1} style={styles.locationText}>{property.locationLabel}</Text>
          </View>
        </View>
        
        {isCompared && (
          <View style={styles.compareTag}>
            <Scale size={10} color="#fff" />
          </View>
        )}
      </Pressable>
    </Animated.View>
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
    backgroundColor: `${colors.background}E6`, // 90% opacity for glass effect
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    height: 70,
  },
  headerTitleWrap: {
    alignItems: "center",
  },
  headerEyebrow: {
    letterSpacing: 2,
    color: colors.textMuted,
    fontSize: 9,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  headerActions: {
    width: 40,
    alignItems: "flex-end",
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sideFloat: {
    position: "absolute",
    right: theme.spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 20,
    zIndex: 110,
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  sideItem: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  scrollContent: {
    paddingTop: 100, // tighter
    paddingHorizontal: theme.spacing.md,
  },
  boardContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  column: {
    flex: 1,
    gap: theme.spacing.md,
  },
  cardWrapper: {
    width: "100%",
  },
  smallCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.divider,
    elevation: 2,
  },
  rightCard: {
    marginTop: 20, // Staggered look
  },
  cardImage: {
    width: "100%",
    height: 200, // Taller image for masonry
  },
  matchIndicator: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  matchText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  cardOverlay: {
    padding: 12,
    gap: 4,
  },
  priceText: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  compareTag: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
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
