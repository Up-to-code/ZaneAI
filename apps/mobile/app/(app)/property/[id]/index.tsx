import { ScrollView, StyleSheet, View, Pressable, Alert } from "react-native";
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
  ChevronRight,
  TrendingUp
} from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { toggleE2ESavedProperty } from "@/e2e/store";
import { track } from "@/persistence/analytics/track";
import { api } from "@/persistence/convex/api";
import { usePropertyById, useSavedProperties } from "@/persistence/convex/usePropertyData";
import { useAppStore } from "@/store";
import { useMutation } from "convex/react";
import { useAuthSession } from "@/auth/useAuthSession";

export default function PropertyDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isGuest } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const toggleGuestMirrorSavedProperty = useAppStore((state) => state.toggleGuestMirrorSavedProperty);

  const property = usePropertyById(params.id);
  const savedListings = useSavedProperties();
  const savedIds = useMemo(
    () => savedListings.map((item: { listingId: string }) => item.listingId),
    [savedListings],
  );
  const compareIds = useAppStore((state) => state.comparePropertyIds);
  const toggleSavedListing = useMutation(api.listings.toggleSavedListing);
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
              <ArrowLeft size={20} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.heroActions}>
              <Pressable
                testID="property.save"
                accessibilityLabel="Save property"
                style={[styles.heroBtn, isSaved && styles.heroBtnActive]}
                onPress={() => {
                  if (!isAuthenticated && !isGuest && !e2eQaMode) {
                    Alert.alert("Sign in required", "Create an account or sign in to save properties across devices.");
                    return;
                  }
                  if (e2eQaMode) {
                    toggleE2ESavedProperty(property.id);
                  } else if (isAuthenticated) {
                    void toggleSavedListing({ listingId: property.id });
                  } else {
                    toggleGuestMirrorSavedProperty(property.id);
                  }
                  track("property_save", { propertyId: property.id, saved: !isSaved });
                }}
              >
                <Bookmark
                  size={20}
                  color={isSaved ? colors.accent : colors.textPrimary}
                  fill={isSaved ? colors.accent : "transparent"}
                />
              </Pressable>
              <Pressable
                testID="property.compare"
                accessibilityLabel="Compare property"
                style={[styles.heroBtn, isCompared && styles.heroBtnActive]}
                onPress={() => {
                  toggleCompareProperty(property.id);
                  track("property_compare", { propertyId: property.id });
                }}
              >
                <Scale size={20} color={isCompared ? colors.accent : colors.textPrimary} />
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

        {/* Description Section */}
        {property.description && (
          <View style={styles.cardGroup}>
            <View style={styles.section}>
              <Text variant="title" style={{ color: colors.textPrimary, marginBottom: 8 }}>About this property</Text>
              <Text tone="secondary" style={{ lineHeight: 22 }}>{property.description}</Text>
            </View>
          </View>
        )}

        {/* Top Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <View style={styles.cardGroup}>
            <View style={styles.section}>
              <Text variant="title" style={{ color: colors.textPrimary, marginBottom: 16 }}>Amenities</Text>

              <View style={styles.amenitiesGrid}>
                {property.amenities.slice(0, 8).map(amenity => {
                  const Icon = (LucideIcons as any)[amenity.iconName] || LucideIcons.CheckCircle;
                  return (
                    <View key={amenity.id} style={styles.amenityItem}>
                      <View style={styles.amenityIconWrap}>
                        <Icon size={20} color={colors.accent} strokeWidth={1.5} />
                      </View>
                      <Text variant="caption" tone="secondary">{amenity.label}</Text>
                    </View>
                  )
                })}
              </View>

              <Pressable
                style={styles.viewAllRow}
                onPress={() => router.push(`/(app)/property/${property.id}/amenities`)}
              >
                <Text tone="primary" style={{ fontWeight: "600" }}>View all {property.amenities.length} amenities</Text>
                <ChevronRight size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Market Insights (Price Chart Placeholder) */}
        {property.priceAnalysis && (
          <View style={styles.cardGroup}>
            <View style={styles.section}>
              <Text variant="title" style={{ color: colors.textPrimary, marginBottom: 16 }}>Market Insights</Text>

              <View style={styles.priceInsightBox}>
                <View style={styles.priceInsightHeader}>
                  <Text tone="secondary">Asking Price</Text>
                  <Text variant="title" style={{ color: colors.textPrimary }}>AED {(property.priceAnalysis.propertyAskPrice / 1000000).toFixed(2)}M</Text>
                </View>
                <View style={styles.priceInsightHeader}>
                  <Text tone="secondary">Area Average</Text>
                  <Text variant="title" style={{ color: colors.textPrimary }}>AED {(property.priceAnalysis.areaAveragePrice / 1000000).toFixed(2)}M</Text>
                </View>
              </View>

              {/* Pseudo-chart bars */}
              <View style={styles.chartArea}>
                <View style={styles.chartLine} />
                <View style={styles.chartBars}>
                  {property.priceAnalysis.historicalData.map((data, idx) => {
                    const maxVal = Math.max(...property.priceAnalysis.historicalData.map(d => d.value));
                    const heightPct = (data.value / maxVal) * 100;
                    return (
                      <View key={idx} style={styles.chartPillarWrap}>
                        <View style={[styles.chartBar, { height: `${heightPct}%` as any, backgroundColor: idx === 5 ? colors.accent : colors.surfaceRaised }]} />
                        <Text variant="caption" style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>{data.month}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.chartCallout}>
                <TrendingUp size={16} color={colors.accent} />
                <Text tone="secondary" variant="caption">Steady 4% growth across 6 months in this layout type.</Text>
              </View>
            </View>
          </View>
        )}

        {/* Broker Profile Card */}
        {property.broker && (
          <View style={styles.cardGroup}>
            <View style={styles.sectionHeader}>
              <Text variant="title" style={styles.sectionTitle}>Listing Agent</Text>
            </View>
            <Pressable
              style={styles.brokerCard}
              onPress={() => router.push(`/(app)/broker/${property.broker.id}`)}
            >
              <Image source={property.broker.avatarUrl} style={styles.brokerAvatar} contentFit="cover" />
              <View style={styles.brokerInfo}>
                <Text variant="title" style={{ fontSize: 16 }}>{property.broker.name}</Text>
                <Text tone="secondary" variant="caption">{property.broker.agency}</Text>
                <View style={styles.brokerMeta}>
                  <LucideIcons.Star size={12} color="#FBBF24" fill="#FBBF24" />
                  <Text variant="caption" style={{ fontWeight: "700" }}>{property.broker.rating}</Text>
                  <Text variant="caption" tone="muted"> • {property.broker.activeListingsCount} active listings</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text variant="title" style={styles.sectionTitle}>ZaneAI Intelligence</Text>
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
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
    color: colors.background,
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
  },
  matchLabel: {
    color: `${colors.background}CC`,
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

  // Amenities Grid
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  amenityItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  amenityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.accent}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },

  // Chart Details
  priceInsightBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  priceInsightHeader: {
    gap: 4,
  },
  chartArea: {
    height: 120,
    marginBottom: theme.spacing.md,
    justifyContent: "flex-end",
  },
  chartLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.divider,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  chartPillarWrap: {
    alignItems: "center",
    width: 30,
  },
  chartBar: {
    width: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${colors.accent}15`,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
  },

  // Broker
  brokerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  brokerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  brokerInfo: {
    flex: 1,
    gap: 2,
  },
  brokerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
});
