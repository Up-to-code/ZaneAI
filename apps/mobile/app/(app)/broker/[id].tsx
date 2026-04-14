import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ArrowLeft, Phone, Mail, Star, MapPin, Building2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { PropertyCard } from "@/decision/components/PropertyCard";
import { useCandidateProperties } from "@/persistence/convex/usePropertyData";
import type { PropertyCardVM } from "@/types/domain";

export default function BrokerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ id: string }>();

  const rawProperties = useCandidateProperties();
  
  const { broker, brokerListings } = useMemo(() => {
    const brokerProperty = rawProperties.find((p: PropertyCardVM) => p.broker && p.broker.id === params.id);
    const listings = rawProperties.filter((p: PropertyCardVM) => p.broker && p.broker.id === params.id);
    return { broker: brokerProperty?.broker, brokerListings: listings };
  }, [rawProperties, params.id]);

  if (!broker) return null;

  return (
    <Screen style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.circleBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileCard}>
           <Image source={broker.avatarUrl} style={styles.avatar} contentFit="cover" />
           <Text variant="display" style={{ color: colors.textPrimary, marginTop: 12 }}>{broker.name}</Text>
           <Text tone="secondary" variant="body" style={{ marginTop: 4 }}>{broker.agency}</Text>
           
           <View style={styles.metaRow}>
             <View style={styles.metaBadge}>
               <Star size={14} color="#FBBF24" fill="#FBBF24" />
               <Text variant="label" style={{ fontWeight: "700" }}>{broker.rating}</Text>
             </View>
             <View style={styles.metaBadge}>
               <Building2 size={14} color={colors.accent} />
               <Text variant="label" tone="secondary">{broker.activeListingsCount} Listings</Text>
             </View>
           </View>

           <Text tone="secondary" style={styles.bio}>{broker.description}</Text>

           <View style={styles.actionRow}>
             <Pressable style={[styles.actionBtn, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
               <Phone size={18} color={colors.background} />
               <Text variant="label" style={{ color: colors.background }}>Call Agent</Text>
             </Pressable>
             <Pressable style={styles.actionBtn}>
               <Mail size={18} color={colors.textPrimary} />
             </Pressable>
           </View>
        </Animated.View>

        {/* Listings Section */}
        <View style={styles.listingsSection}>
           <Text variant="title" style={{ color: colors.textPrimary, marginBottom: 16 }}>Active Listings</Text>
           {brokerListings.map((property: PropertyCardVM, idx: number) => (
             <Animated.View key={property.id} entering={FadeInDown.delay(200 + (idx * 100))}>
               <PropertyCard property={property} compact={false} style={{ marginBottom: theme.spacing.md }} />
             </Animated.View>
           ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    height: 100,
    backgroundColor: colors.background,
    justifyContent: "center",
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
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: 16,
    marginBottom: 20,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${colors.accent}15`,
    borderRadius: theme.radii.pill,
  },
  bio: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
    gap: theme.spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 48,
    borderRadius: theme.radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  listingsSection: {
    paddingBottom: theme.spacing.xl,
  },
});
