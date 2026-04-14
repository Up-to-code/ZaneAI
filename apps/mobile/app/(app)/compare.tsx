import { ScrollView, StyleSheet, View, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Image } from "expo-image";
import { Scale, Bookmark, MapPin, BedDouble, Bath, Ruler } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { ScreenHeader } from "@/shell/components/ScreenHeader";
import { toggleE2ESavedProperty } from "@/e2e/store";
import { track } from "@/persistence/analytics/track";
import { useAppStore } from "@/store";
import { usePropertiesByIds, useSavedProperties } from "@/persistence/convex/usePropertyData";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { PropertyCardVM } from "@/types/domain";
import { useAuthSession } from "@/auth/useAuthSession";

export default function CompareScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isAuthenticated } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);

  const comparePropertyIds = useAppStore((state) => state.comparePropertyIds);
  const toggleCompareProperty = useAppStore((state) => state.toggleCompareProperty);
  const savedProperties = useSavedProperties();
  const toggleSavedProperty = useMutation(api.property.public.toggleSavedProperty.toggleSavedProperty);
  const compareProperties = usePropertiesByIds(comparePropertyIds);
  const savedPropertyIds = useMemo(
    () => savedProperties.map((item: { propertyExternalId: string }) => item.propertyExternalId),
    [savedProperties],
  );

  return (
    <Screen style={styles.screen}>
      <ScreenHeader
        eyebrow="ANALYSIS"
        title="Compare Tray"
        subtitle="Side-by-side breakdown of your top picks."
        showCopy={true}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {compareProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Scale size={40} color={colors.textMuted} strokeWidth={1.5} />
            <Text variant="title" style={styles.emptyTitle}>Compare tray is empty</Text>
            <Text tone="secondary" style={styles.emptySubtitle}>
              Tap the scale icon on any property card to add it for side-by-side analysis.
            </Text>
          </View>
        ) : (
          <>
            {/* Comparison Details Card */}
            {compareProperties.length === 2 && (
              <View style={styles.cardGroup}>
                <View style={[styles.section, { paddingBottom: 8 }]}>
                  <Text variant="caption" tone="muted" style={styles.sectionEyebrow}>CORE COMPARISON</Text>
                </View>
                <View testID="compare.table" style={styles.compareTable}>
                  {[
                    { label: "Price", values: compareProperties.map((p: PropertyCardVM) => p.priceLabel) },
                    { label: "Location", values: compareProperties.map((p: PropertyCardVM) => p.locationLabel) },
                    { label: "Beds", values: compareProperties.map((p: PropertyCardVM) => `${p.beds}`) },
                    { label: "Area", values: compareProperties.map((p: PropertyCardVM) => `${p.area.toLocaleString()} sqft`) },
                    { label: "Yield", values: compareProperties.map((p: PropertyCardVM) => getYieldLabel(p.id)) },
                  ].map(({ label, values }, index) => (
                    <View key={label} style={[styles.tableRow, index === 0 && { borderTopWidth: 0 }]}>
                      <Text variant="caption" tone="muted" style={styles.tableLabel}>{label}</Text>
                      {values.map((val: string, i: number) => (
                        <Text key={i} variant="label" style={styles.tableValue}>{val}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Individual Property Cards */}
            <View style={styles.propertyList}>
              {compareProperties.map((property: PropertyCardVM) => {
                const isSaved = savedPropertyIds.includes(property.id);
                return (
                  <Pressable
                    key={property.id}
                    style={styles.card}
                    onPress={() => {
                      track("property_click", { propertyId: property.id });
                      router.push(`/(app)/property/${property.id}`);
                    }}
                  >
                    <Image source={property.heroUrl} style={styles.cardImage} contentFit="cover" />
                    <View style={[styles.matchBadge, { backgroundColor: colors.accent }]}>
                      <Text variant="label" style={styles.matchText}>{property.matchScore}</Text>
                    </View>
                    <View style={styles.cardBody}>
                      <View style={styles.cardTop}>
                        <View style={styles.cardInfo}>
                          <Text variant="title" style={{ color: colors.textPrimary }}>{property.priceLabel}</Text>
                          <Text tone="secondary">{property.title}</Text>
                          <View style={styles.locationRow}>
                            <MapPin size={12} color={colors.accent} />
                            <Text variant="caption" tone="muted">{property.locationLabel}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.meta}>
                        <View style={styles.metaItem}>
                          <BedDouble size={14} color={colors.textMuted} />
                          <Text variant="caption" tone="secondary">{property.beds} bd</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Bath size={14} color={colors.textMuted} />
                          <Text variant="caption" tone="secondary">{property.baths} ba</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ruler size={14} color={colors.textMuted} />
                          <Text variant="caption" tone="secondary">{property.area.toLocaleString()} sqft</Text>
                        </View>
                      </View>

                      <View style={styles.cardActions}>
                        <Pressable
                          style={[styles.actionBtn, styles.actionBtnAccent]}
                          onPress={() => {
                            toggleCompareProperty(property.id);
                            track("property_compare", { propertyId: property.id, compared: false });
                          }}
                        >
                          <Scale size={16} color={colors.accent} />
                          <Text variant="caption" style={{ color: colors.accent }}>Remove</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.actionBtn, isSaved && styles.actionBtnActive]}
                          onPress={() => {
                            if (!isAuthenticated && !e2eQaMode) {
                              Alert.alert("Sign in required", "Create an account or sign in to save properties across devices.");
                              return;
                            }
                            if (e2eQaMode) {
                              toggleE2ESavedProperty(property.id);
                            } else {
                              void toggleSavedProperty({ propertyExternalId: property.id });
                            }
                            track("property_save", { propertyId: property.id, saved: !isSaved });
                          }}
                        >
                          <Bookmark
                            size={16}
                            color={isSaved ? colors.accent : colors.textSecondary}
                            fill={isSaved ? colors.accent : "transparent"}
                          />
                          <Text variant="caption" tone="secondary">
                            {isSaved ? "Saved" : "Save"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function getYieldLabel(propertyId: string) {
  if (propertyId === "prop-dubai-marina-01") {
    return "6.2%";
  }

  if (propertyId === "prop-business-bay-02") {
    return "5.7%";
  }

  if (propertyId === "prop-palm-03") {
    return "4.9%";
  }

  return "5.0%";
}

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 0,
    backgroundColor: colors.backgroundSoft,
  },
  content: {
    paddingTop: theme.spacing.md,
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyState: {
    marginTop: theme.spacing.xxxl * 1.5,
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: { textAlign: "center", color: colors.textPrimary },
  emptySubtitle: { textAlign: "center", lineHeight: 22, color: colors.textSecondary },

  cardGroup: {
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.md,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
  },
  sectionEyebrow: {
    letterSpacing: 1.4,
    color: colors.accent,
  },

  // Table
  compareTable: {
    marginTop: theme.spacing.sm,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  tableLabel: {
    width: 80,
    letterSpacing: 0.5,
  },
  tableValue: {
    flex: 1,
    textAlign: "center",
    color: colors.textPrimary,
  },

  propertyList: {
    gap: theme.spacing.lg,
  },

  // Card
  card: {
    borderRadius: theme.radii.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  matchBadge: {
    position: "absolute",
    top: 136,
    right: theme.spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  matchText: { color: colors.background, fontFamily: theme.typography.label.fontFamily },
  cardBody: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardInfo: { flex: 1, gap: theme.spacing.xs },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  meta: { flexDirection: "row", gap: theme.spacing.lg },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: theme.spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: colors.surfaceRaised,
  },
  actionBtnAccent: {
    backgroundColor: `${colors.accent}11`,
  },
  actionBtnActive: {
    backgroundColor: `${colors.accent}11`,
    borderWidth: 1,
    borderColor: `${colors.accent}33`,
  },
});
