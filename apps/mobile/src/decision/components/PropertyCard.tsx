import { memo, useMemo } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import {
  Bath,
  BedDouble,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  Ruler,
} from "lucide-react-native";
import type { ReactNode } from "react";

import { useAuthSession } from "@/auth/useAuthSession";
import { toggleE2ESavedProperty } from "@/e2e/store";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { track } from "@/persistence/analytics/track";
import { api } from "@/persistence/convex/api";
import { useSavedProperties } from "@/persistence/convex/usePropertyData";
import { useAppStore } from "@/store";
import type { PropertyCardVM } from "@/types/domain";

type PropertyCardProps = {
  property: PropertyCardVM;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const PropertyCard = memo(function PropertyCard({ property, compact = false, style }: PropertyCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { isAuthenticated } = useAuthSession();
  const setSelectedPropertyId = useAppStore((state) => state.setSelectedPropertyId);
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eSavedPropertyIds = useAppStore((state) => state.e2eSavedPropertyIds);
  const savedPropertyIds = useAppStore((state) => state.guestMirrorSavedPropertyIds);
  const toggleSavedProperty = useAppStore((state) => state.toggleGuestMirrorSavedProperty);
  const savedListings = useSavedProperties();
  const toggleSavedListing = useMutation(api.listings.toggleSavedListing);
  const isSaved = e2eQaMode
    ? e2eSavedPropertyIds.includes(property.id)
    : isAuthenticated
      ? savedListings.some((item: { listingId: string }) => item.listingId === property.id)
      : savedPropertyIds.includes(property.id);

  const openProperty = () => {
    setSelectedPropertyId(property.id);
    track("property_click", { propertyId: property.id });
    router.push(`/(app)/property/${property.id}`);
  };

  const toggleSave = () => {
    if (e2eQaMode) {
      toggleE2ESavedProperty(property.id);
    } else if (isAuthenticated) {
      void toggleSavedListing({ listingId: property.id });
    } else {
      toggleSavedProperty(property.id);
    }

    track("property_save", { propertyId: property.id, saved: !isSaved });
  };

  const contactBroker = (mode: "email" | "phone" | "whatsapp") => {
    track("contact_agent", { propertyId: property.id, mode });

    if (mode === "email") {
      Linking.openURL(`mailto:?subject=${encodeURIComponent(property.title)}`);
      return;
    }

    const phone = property.broker.phone.replace(/[^\d+]/g, "");
    if (!phone) return;

    if (mode === "whatsapp") {
      Linking.openURL(`https://wa.me/${phone.replace(/^\+/, "")}`);
      return;
    }

    Linking.openURL(`tel:${phone}`);
  };

  return (
    <Pressable
      testID={`property.card.${property.id}`}
      onPress={openProperty}
      style={[styles.card, compact && styles.compactCard, style]}
    >
      <View style={[styles.mediaFrame, compact && styles.compactMediaFrame]}>
        <Image source={property.heroUrl} style={styles.image} contentFit="cover" />

        <Pressable
          accessibilityLabel="Previous image"
          onPress={(event) => event.stopPropagation()}
          style={[styles.galleryButton, styles.galleryButtonLeft]}
        >
          <ChevronLeft size={28} color={colors.textSecondary} strokeWidth={3} />
        </Pressable>
        <Pressable
          accessibilityLabel="Next image"
          onPress={(event) => event.stopPropagation()}
          style={[styles.galleryButton, styles.galleryButtonRight]}
        >
          <ChevronRight size={28} color={colors.textSecondary} strokeWidth={3} />
        </Pressable>

        <Pressable
          accessibilityLabel={isSaved ? "Remove property from favorites" : "Save property"}
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            toggleSave();
          }}
          style={styles.favoriteButton}
        >
          <Heart
            size={30}
            color={isSaved ? colors.accent : colors.background}
            fill={isSaved ? colors.accent : colors.background}
            strokeWidth={3}
          />
        </Pressable>

        <View style={styles.pagination}>
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={[styles.paginationDot, item === 5 && styles.paginationDotActive]} />
          ))}
        </View>
      </View>

      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={styles.statusRow}>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedText}>Verified</Text>
            <CheckCircle2 size={18} color={colors.textPrimary} fill={colors.textPrimary} />
          </View>
          <Text variant="title" style={[styles.price, compact && styles.compactPrice]}>
            {property.priceLabel}
          </Text>
        </View>

        <View style={styles.specRow}>
          <Spec icon={<Ruler size={22} color={colors.textMuted} />} value={`${property.area}`} label="sqft" />
          <Spec icon={<Bath size={22} color={colors.textMuted} />} value={`${property.baths}`} label="" />
          <Spec icon={<BedDouble size={22} color={colors.textMuted} />} value={`${property.beds}`} label="" />
        </View>

        <View style={styles.heading}>
          <Text variant="title" style={[styles.titleText, compact && styles.compactTitle]} numberOfLines={2}>
            {property.title}
          </Text>
          <Text variant="body" style={styles.locationText} numberOfLines={1}>
            {property.locationLabel}
          </Text>
        </View>

        {!compact ? (
          <View style={styles.actionRow}>
            <ContactButton
              icon={<MessageCircle size={25} color={colors.success} />}
              label="WhatsApp"
              onPress={() => contactBroker("whatsapp")}
              style={styles.whatsappAction}
            />
            <ContactButton
              icon={<Phone size={25} color={colors.accent} fill={colors.accent} />}
              label="Call"
              onPress={() => contactBroker("phone")}
            />
            <ContactButton
              icon={<Mail size={25} color={colors.accent} fill={colors.accent} />}
              label="Email"
              onPress={() => contactBroker("email")}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});

function Spec({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <View style={specStyles.spec}>
      <Text style={specStyles.specValue}>{value}</Text>
      {label ? <Text style={specStyles.specLabel}>{label}</Text> : null}
      {icon}
    </View>
  );
}

function ContactButton({
  icon,
  label,
  onPress,
  style,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
      style={[contactStyles.button, style]}
    >
      {icon}
      <Text style={contactStyles.label}>{label}</Text>
    </Pressable>
  );
}

const specStyles = StyleSheet.create({
  spec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  specValue: {
    color: theme.colors.textSecondary,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 0,
  },
  specLabel: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0,
  },
});

const contactStyles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 60,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "rgba(236,45,53,0.08)",
  },
  label: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
});

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 24,
    overflow: "hidden",
    marginHorizontal: theme.spacing.lg,
    marginBottom: 32,
  },
  compactCard: {
    marginHorizontal: 0,
    marginBottom: theme.spacing.md,
    borderRadius: 18,
  },
  mediaFrame: {
    width: "100%",
    aspectRatio: 1.31,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.surfaceRaised,
  },
  compactMediaFrame: {
    borderRadius: 18,
    aspectRatio: 1.25,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  galleryButton: {
    position: "absolute",
    top: "46%",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  galleryButtonLeft: {
    left: 16,
  },
  galleryButtonRight: {
    right: 16,
  },
  favoriteButton: {
    position: "absolute",
    left: 22,
    bottom: 25,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  paginationDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  paginationDotActive: {
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 22,
    gap: 16,
  },
  compactContent: {
    paddingTop: 14,
    gap: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  verifiedPill: {
    minWidth: 96,
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface,
  },
  verifiedText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  heading: {
    alignItems: "flex-end",
    gap: 8,
  },
  price: {
    flex: 1,
    fontSize: 34,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: "right",
  },
  compactPrice: {
    fontSize: 22,
  },
  specRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 24,
    flexWrap: "wrap",
  },
  titleText: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: "right",
  },
  compactTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  locationText: {
    fontSize: 21,
    lineHeight: 30,
    color: colors.textPrimary,
    fontWeight: "600",
    letterSpacing: 0,
    textAlign: "right",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  whatsappAction: {
    backgroundColor: "rgba(34,197,94,0.08)",
  },
});
