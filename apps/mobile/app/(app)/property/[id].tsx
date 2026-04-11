import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useMemo } from "react";
import {
  ArrowLeft,
  Bookmark,
  Scale,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  CalendarDays,
  MessageSquareMore,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { track } from "@/persistence/analytics/track";
import { useAppStore } from "@/store";

export default function PropertyDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const property = useAppStore((state) =>
    state.properties.find((p) => p.id === params.id),
  );
  const savedIds = useAppStore((state) => state.savedPropertyIds);
  const compareIds = useAppStore((state) => state.comparePropertyIds);
  const toggleSavedProperty = useAppStore((state) => state.toggleSavedProperty);
  const toggleCompareProperty = useAppStore((state) => state.toggleCompareProperty);

  if (!property) {
    return (
      <Screen style={styles.centered}>
        <Text variant="title">Property not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backFallback}>
          <ArrowLeft size={18} color={colors.textSecondary} />
          <Text tone="secondary">Go back</Text>
        </Pressable>
      </Screen>
    );
  }

  const isSaved = savedIds.includes(property.id);
  const isCompared = compareIds.includes(property.id);

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={property.heroUrl} style={styles.hero} contentFit="cover" />

          <View style={[styles.heroControls, { top: insets.top + 8 }]}>
            <Pressable style={styles.heroBtn} onPress={() => router.back()} accessibilityLabel="Go back">
              <ArrowLeft size={20} color={"#FFF"} />
            </Pressable>
            <View style={styles.heroActions}>
              <Pressable
                style={[styles.heroBtn, isSaved && styles.heroBtnActive]}
                onPress={() => {
                  toggleSavedProperty(property.id);
                  track("property_save", { propertyId: property.id, saved: !isSaved });
                }}
              >
                <Bookmark
                  size={20}
                  color={isSaved ? colors.accent : "#FFF"}
                  fill={isSaved ? colors.accent : "transparent"}
                />
              </Pressable>
              <Pressable
                style={[styles.heroBtn, isCompared && styles.heroBtnActive]}
                onPress={() => {
                  toggleCompareProperty(property.id);
                  track("property_compare", { propertyId: property.id });
                }}
              >
                <Scale size={20} color={isCompared ? colors.accent : "#FFF"} />
              </Pressable>
            </View>
          </View>

          <View style={styles.matchBadge}>
            <Text variant="label" style={styles.matchText}>{property.matchScore}</Text>
            <Text variant="caption" style={styles.matchLabel}>match</Text>
          </View>
        </View>

        {/* Info Block */}
        <View style={styles.cardGroup}>
          <View style={styles.header}>
            <Text variant="display" style={styles.price}>{property.priceLabel}</Text>
            <Text variant="title" tone="primary" style={styles.title}>{property.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.accent} />
              <Text tone="secondary">{property.locationLabel}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {[
              { icon: <BedDouble size={18} color={colors.accent} />, label: `${property.beds} Beds` },
              { icon: <Bath size={18} color={colors.accent} />, label: `${property.baths} Baths` },
              { icon: <Ruler size={18} color={colors.accent} />, label: `${property.area.toLocaleString()} sqft` },
            ].map(({ icon, label }) => (
              <View key={label} style={styles.statCard}>
                {icon}
                <Text variant="label">{label}</Text>
              </View>
            ))}
          </View>

          {property.tags.length > 0 && (
            <View style={styles.tagsWrap}>
              {property.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text variant="caption" style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="title" style={styles.sectionTitle}>Zayon Intelligence</Text>
        </View>

        <View style={styles.cardGroup}>
          <View style={styles.section}>
            <Text style={styles.aiSummary}>{property.aiSummary}</Text>
          </View>

          {property.matchReasons.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text variant="caption" tone="muted" style={styles.sectionEyebrow}>WHY IT FITS</Text>
                <View style={styles.reasonList}>
                  {property.matchReasons.map((reason) => (
                    <View key={reason} style={styles.reasonRow}>
                      <View style={styles.reasonDot} />
                      <Text tone="secondary">{reason}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />
          <View style={styles.section}>
            <Text variant="caption" tone="muted" style={styles.sectionEyebrow}>CONFIDENCE SCORE</Text>
            <View style={styles.scoreTrackBackground}>
              <View style={[styles.scoreTrackFill, { width: `${property.matchScore}%` as any }]} />
            </View>
            <Text tone="secondary" variant="caption">
              Score of {property.matchScore}/100 — Strong signal across location, resale, and lifestyle fit.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + theme.spacing.md }]}>
        <View style={styles.ctaInner}>
          <Button
            label="Contact agent"
            trailing={<MessageSquareMore size={16} color={colors.textPrimary} />}
            onPress={() => track("contact_agent", { propertyId: property.id })}
            style={styles.ctaPrimary}
          />
          <Button
            label="Schedule"
            variant="secondary"
            trailing={<CalendarDays size={16} color={colors.textPrimary} />}
            onPress={() => track("schedule_visit", { propertyId: property.id })}
          />
        </View>
      </View>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: colors.backgroundSoft,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.lg,
    backgroundColor: colors.background,
  },
  backFallback: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.pill,
    backgroundColor: colors.surface,
  },

  // Hero
  heroWrap: {
    marginHorizontal: -theme.spacing.lg, // bleed edge-to-edge
  },
  hero: {
    width: "100%",
    height: 380,
  },
  heroControls: {
    position: "absolute",
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  heroBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroBtnActive: {
    backgroundColor: `${colors.accent}44`,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  matchBadge: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  matchText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
  },
  matchLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
  },

  // Info Block (Unified Card wrapping top stats)
  cardGroup: {
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.md,
  },

  // Header
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  price: {
    color: colors.textPrimary,
  },
  title: {
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  // Stats strip
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    gap: theme.spacing.xs,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: colors.surfaceRaised,
  },

  // Tags
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  tag: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.pill,
    backgroundColor: `${colors.accent}11`,
  },
  tagText: {
    color: colors.accent,
  },

  // Sections Breakout
  sectionHeader: {
    marginBottom: -theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  sectionTitle: {
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionEyebrow: {
    letterSpacing: 1.4,
    color: colors.accent,
  },
  aiSummary: {
    ...theme.typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  reasonList: {
    gap: theme.spacing.md,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 7,
    flexShrink: 0,
  },

  // Score track
  scoreTrackBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceRaised,
    overflow: "hidden",
  },
  scoreTrackFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: theme.spacing.lg,
  },

  // CTA
  cta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  ctaInner: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  ctaPrimary: {
    flex: 1,
  },
});
