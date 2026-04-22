import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Sparkles,
  CheckCircle2,
  Calendar,
  Wallet,
  ShieldCheck,
  Building2,
  ArrowRight,
  Info,
  ChevronRight,
  Car,
  Wind,
  Waves,
  Map,
  Flame,
  Droplets,
  Zap,
  Phone,
  ChefHat,
  Tv,
  Wifi,
  Dumbbell,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { theme } from "@/foundation/theme/tokens";
import { useCandidateProperties, usePropertyById } from "@/persistence/convex/usePropertyData";
import { PropertyCard } from "@/decision/components/PropertyCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const property = usePropertyById(id);
  const recommendations = useCandidateProperties().filter(p => p.id !== id).slice(0, 5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [isAmenitiesModalVisible, setIsAmenitiesModalVisible] = useState(false);
  const [isContactSheetVisible, setIsContactSheetVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!property) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Info size={40} color={colors.textMuted} />
        <Text style={{ color: colors.textSecondary, fontFamily: "Manrope_600SemiBold" }}>
          PROPERTY NOT FOUND
        </Text>
      </View>
    );
  }

  const renderImageItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={styles.heroImage}
      contentFit="cover"
      transition={200}
    />
  );

  const getAmenityIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("gas")) return <Flame size={16} color={colors.accent} />;
    if (l.includes("water")) return <Droplets size={16} color={colors.accent} />;
    if (l.includes("electri") || l.includes("meter")) return <Zap size={16} color={colors.accent} />;
    if (l.includes("landline") || l.includes("phone")) return <Phone size={16} color={colors.accent} />;
    if (l.includes("kitchen")) return <ChefHat size={16} color={colors.accent} />;
    if (l.includes("parking") || l.includes("garage")) return <Car size={16} color={colors.accent} />;
    if (l.includes("view") || l.includes("sea")) return <Waves size={16} color={colors.accent} />;
    if (l.includes("construction") || l.includes("year")) return <Calendar size={16} color={colors.accent} />;
    if (l.includes("tv") || l.includes("satellite")) return <Tv size={16} color={colors.accent} />;
    if (l.includes("wifi") || l.includes("internet")) return <Wifi size={16} color={colors.accent} />;
    if (l.includes("security") || l.includes("guard")) return <ShieldCheck size={16} color={colors.accent} />;
    if (l.includes("pool")) return <Waves size={16} color={colors.accent} />;
    if (l.includes("gym")) return <Dumbbell size={16} color={colors.accent} />;
    return <Info size={16} color={colors.accent} />;
  };

  const RecommendationCard = ({ property }: { property: any }) => (
    <Pressable 
      style={styles.recCard}
      onPress={() => router.push(`/(app)/property/${property.id}`)}
    >
      <View style={styles.recImageContainer}>
        <Image source={{ uri: property.heroUrl }} style={styles.recImage} />
        <View style={styles.recHeart}>
          <Heart size={14} color="#FFFFFF" fill="rgba(0,0,0,0.1)" />
        </View>
      </View>
      <View style={styles.recContent}>
        <Text style={styles.recPrice}>{property.priceLabel}</Text>
        <View style={styles.recMetaRow}>
          <Text style={styles.recMetaText}>{property.area}m²</Text>
          <View style={styles.recMetaDot} />
          <Text style={styles.recMetaText}>{property.beds} BED</Text>
        </View>
        <Text style={styles.recLocation} numberOfLines={1}>
          {property.locationLabel.split(",")[0].toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      {/* Header Actions */}
      <View style={[styles.floatingHeader, { top: insets.top + 10 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={() => setIsSaved(!isSaved)}
          >
            <Heart 
              size={20} 
              color={isSaved ? colors.accent : colors.textPrimary} 
              fill={isSaved ? colors.accent : "transparent"} 
            />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Share2 size={20} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Image Swiper */}
        <View style={styles.heroContainer}>
          <FlatList
            data={property.imageUrls || [property.heroUrl]}
            renderItem={renderImageItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(index);
            }}
            keyExtractor={(_, index) => index.toString()}
          />
          <View style={styles.pagination}>
            {(property.imageUrls || [property.heroUrl]).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot, 
                  activeImageIndex === index && styles.paginationDotActive
                ]} 
              />
            ))}
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Pricing & High-Level Identity */}
          <View style={styles.pricingSection}>
            <View style={styles.priceHeader}>
              <Text style={styles.priceLabel}>TOTAL INVESTMENT</Text>
              <Text style={styles.priceText}>{property.priceLabel}</Text>
            </View>
            <View style={styles.badgeRow}>
              <View style={styles.matchBadge}>
                <CheckCircle2 size={12} color={colors.success} />
                <Text style={styles.matchBadgeText}>{property.matchScore}% MATCH</Text>
              </View>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>PREMIUM LISTING</Text>
              </View>
            </View>
          </View>

          {/* Compound & Developer Context */}
          {(property.compoundName || property.developerName) && (
            <View style={styles.contextSection}>
              {property.compoundName && (
                <View style={styles.compoundBlock}>
                  <Map size={16} color={colors.accent} />
                  <Text style={styles.compoundText}>{property.compoundName.toUpperCase()}</Text>
                </View>
              )}
              {property.developerName && (
                <View style={styles.developerBadge}>
                  <Building2 size={12} color={colors.textMuted} />
                  <Text style={styles.developerLabel}>BY {property.developerName.toUpperCase()}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.titleSection}>
            <Text style={styles.titleText}>{property.title.toUpperCase()}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.textMuted} />
              <Text style={styles.locationText}>{property.locationLabel.toUpperCase()}</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceLabel}>REF ID:</Text>
              <Text style={styles.referenceValue}>{property.id.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Quick Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <BedDouble size={20} color={colors.textPrimary} />
              <Text style={styles.specValue}>{property.beds}</Text>
              <Text style={styles.specLabel}>BEDS</Text>
            </View>
            <View style={styles.specItem}>
              <Bath size={20} color={colors.textPrimary} />
              <Text style={styles.specValue}>{property.baths}</Text>
              <Text style={styles.specLabel}>BATHS</Text>
            </View>
            <View style={styles.specItem}>
              <Ruler size={20} color={colors.textPrimary} />
              <Text style={styles.specValue}>{property.area}</Text>
              <Text style={styles.specLabel}>SQM</Text>
            </View>
            <View style={styles.specItem}>
              <Building2 size={20} color={colors.textPrimary} />
              <Text style={styles.specValue}>LUX</Text>
              <Text style={styles.specLabel}>FINISH</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <Text style={styles.descriptionText} numberOfLines={4}>
              {property.description}
            </Text>
            <Pressable 
              onPress={() => setIsDescriptionModalVisible(true)}
              style={styles.readMoreButton}
            >
              <Text style={styles.readMoreText}>READ FULL DESCRIPTION</Text>
              <ArrowRight size={14} color={colors.accent} />
            </Pressable>
          </View>

          {/* AI Signal Card */}
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Sparkles size={18} color={colors.accent} />
              <Text style={styles.aiTitle}>INSTITUTIONAL SIGNAL</Text>
            </View>
            <Text style={styles.aiBody}>{property.aiSummary}</Text>
          </View>

          {/* Amenities Section */}
          {property.amenities.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>AMENITIES & FEATURES</Text>
                {property.amenities.length > 8 && (
                  <Pressable 
                    onPress={() => setIsAmenitiesModalVisible(true)}
                    style={styles.readMoreButton}
                  >
                    <Text style={styles.readMoreText}>VIEW ALL ({property.amenities.length})</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.amenitiesGrid}>
                {property.amenities.slice(0, 8).map((amenity) => (
                  <View key={amenity.id} style={styles.amenityItem}>
                    <View style={styles.amenityIconContainer}>
                      {getAmenityIcon(amenity.label)}
                    </View>
                    <Text style={styles.amenityText} numberOfLines={1}>{amenity.label.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Broker & Agency Hierarchy Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LISTING EXPERT & AGENCY</Text>
            <View style={styles.agencyBrokerCard}>
              <View style={styles.agencyHeader}>
                <View style={styles.agencyLogoContainer}>
                  <Building2 size={24} color={colors.accent} />
                </View>
                <View style={styles.agencyInfo}>
                  <Text style={styles.agencyNameLarge}>{property.broker.agency.toUpperCase()}</Text>
                  <Text style={styles.legalLabel}>LICENSED REAL ESTATE AGENCY</Text>
                </View>
              </View>
              
              <View style={styles.agencyDivider} />
              
              <Pressable 
                style={styles.brokerSubCard}
                onPress={() => router.push(`/(app)/broker/${property.broker.id}`)}
              >
                <Image 
                  source={{ uri: property.broker.avatarUrl }} 
                  style={styles.brokerAvatarSmall}
                />
                <View style={styles.brokerInfo}>
                  <Text style={styles.brokerNameSmall}>{property.broker.name.toUpperCase()}</Text>
                  <Text style={styles.brokerRole}>CERTIFIED ADVISOR</Text>
                </View>
                <ChevronRight size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Recommendations Section - Minimal Horizontal Cards */}
          {recommendations.length > 0 && (
            <View style={styles.recSection}>
              <Text style={styles.recSectionTitle}>SIMILAR PROPERTIES</Text>
              <View style={styles.recListWrapper}>
                <FlatList
                  data={recommendations}
                  renderItem={({ item }) => <RecommendationCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingHorizontal: 8 }}
                />
                
                {/* Simulated Left Fade */}
                <View style={[styles.edgeFade, { left: 0, width: 8, opacity: 1, backgroundColor: colors.background }]} pointerEvents="none" />
                <View style={[styles.edgeFade, { left: 8, width: 8, opacity: 0.7, backgroundColor: colors.background }]} pointerEvents="none" />
                <View style={[styles.edgeFade, { left: 16, width: 8, opacity: 0.4, backgroundColor: colors.background }]} pointerEvents="none" />
                <View style={[styles.edgeFade, { left: 24, width: 8, opacity: 0.1, backgroundColor: colors.background }]} pointerEvents="none" />
                
                {/* Simulated Right Fade */}
                <View style={[styles.edgeFade, { right: 0, width: 8, opacity: 1, backgroundColor: colors.background }]} pointerEvents="none" />
                <View style={[styles.edgeFade, { right: 8, width: 8, opacity: 0.7, backgroundColor: colors.background }]} pointerEvents="none" />
                <View style={[styles.edgeFade, { right: 16, width: 8, opacity: 0.4, backgroundColor: colors.background }]} pointerEvents="none" />
                <View style={[styles.edgeFade, { right: 24, width: 8, opacity: 0.1, backgroundColor: colors.background }]} pointerEvents="none" />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.bottomPriceInfo}>
          <Text style={styles.bottomPriceLabel}>TOTAL INVESTMENT</Text>
          <Text style={styles.bottomPriceValue}>{property.priceLabel}</Text>
        </View>
        <Pressable 
          style={styles.primaryCta}
          onPress={() => setIsContactSheetVisible(true)}
        >
          <Text style={styles.primaryCtaText}>GET IN TOUCH</Text>
        </Pressable>
      </View>

      {/* Contact Sheet */}
      <Modal
        visible={isContactSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsContactSheetVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsContactSheetVisible(false)}
        >
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CONTACT EXPERT</Text>
              <Pressable onPress={() => setIsContactSheetVisible(false)}>
                <Text style={styles.modalCloseText}>CLOSE</Text>
              </Pressable>
            </View>

            <View style={styles.contactOptions}>
              <Pressable 
                style={[styles.contactOption, { backgroundColor: "#25D366" + "15" }]}
                onPress={() => Alert.alert("WhatsApp", "Opening secure chat...")}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: "#25D366" }]}>
                  <Info size={20} color="#FFFFFF" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: "#25D366" }]}>WHATSAPP CHAT</Text>
                  <Text style={styles.contactSubLabel}>INSTANT ENGAGEMENT</Text>
                </View>
                <ChevronRight size={18} color="#25D366" />
              </Pressable>

              <Pressable 
                style={[styles.contactOption, { backgroundColor: colors.accent + "15" }]}
                onPress={() => Alert.alert("Call", "Initiating direct line...")}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: colors.accent }]}>
                  <Phone size={20} color="#FFFFFF" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: colors.accent }]}>DIRECT CALL</Text>
                  <Text style={styles.contactSubLabel}>TECHNICAL ADVICE</Text>
                </View>
                <ChevronRight size={18} color={colors.accent} />
              </Pressable>

              <Pressable 
                style={[styles.contactOption, { backgroundColor: colors.textPrimary + "10" }]}
                onPress={() => Alert.alert("Email", "Opening secure mail...")}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: colors.textPrimary }]}>
                  <Sparkles size={20} color={colors.background} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>EMAIL INQUIRY</Text>
                  <Text style={styles.contactSubLabel}>OFFICIAL DOCUMENTATION</Text>
                </View>
                <ChevronRight size={18} color={colors.textPrimary} />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Amenities Modal (Sheet) */}
      <Modal
        visible={isAmenitiesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAmenitiesModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsAmenitiesModalVisible(false)}
        >
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ALL AMENITIES</Text>
              <Pressable onPress={() => setIsAmenitiesModalVisible(false)}>
                <Text style={styles.modalCloseText}>CLOSE</Text>
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity) => (
                  <View key={amenity.id} style={[styles.amenityItem, { width: "100%", marginBottom: 8 }]}>
                    <View style={styles.amenityIconContainer}>
                      {getAmenityIcon(amenity.label)}
                    </View>
                    <Text style={styles.amenityText}>{amenity.label.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Description Modal (Sheet) */}
      <Modal
        visible={isDescriptionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDescriptionModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsDescriptionModalVisible(false)}
        >
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>DESCRIPTION</Text>
              <Pressable onPress={() => setIsDescriptionModalVisible(false)}>
                <Text style={styles.modalCloseText}>CLOSE</Text>
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fullDescriptionText}>{property.description}</Text>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  scroll: {
    flex: 1,
  },
  floatingHeader: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadows.calm,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 400,
    backgroundColor: colors.surfaceRaised,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 400,
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: "#FFFFFF",
  },
  mainContent: {
    paddingHorizontal: 8,
    paddingTop: 32,
    gap: 32,
  },
  pricingSection: {
    gap: 16,
  },
  priceHeader: {
    gap: 4,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  priceText: {
    fontSize: 38,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    letterSpacing: -1.5,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.success + "15",
    borderWidth: 1,
    borderColor: colors.success + "30",
  },
  matchBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.success,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.accent + "15",
    borderWidth: 1,
    borderColor: colors.accent + "30",
  },
  tagBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.accent,
  },
  contextSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  compoundBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compoundText: {
    fontSize: 13,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.accent,
    letterSpacing: 0.5,
  },
  developerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  developerLabel: {
    fontSize: 9,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  titleSection: {
    gap: 6,
  },
  titleText: {
    fontSize: 24,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  referenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  referenceLabel: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: colors.textMuted,
  },
  referenceValue: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  specsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  specItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    marginTop: 4,
  },
  specLabel: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
    color: colors.textSecondary,
    lineHeight: 24,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.accent,
  },
  aiCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent + "33",
    gap: 16,
    ...theme.shadows.calm,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiTitle: {
    fontSize: 12,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.accent,
    letterSpacing: 1.5,
  },
  aiBody: {
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
    color: colors.textPrimary,
    lineHeight: 22,
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  techItem: {
    width: (SCREEN_WIDTH - 64) / 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surfaceRaised,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  techLabel: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  techValue: {
    fontSize: 13,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  amenityItem: {
    width: (SCREEN_WIDTH - 60) / 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surfaceRaised,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amenityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  amenityText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: colors.textPrimary,
    flex: 1,
  },
  agencyBrokerCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...theme.shadows.calm,
  },
  agencyHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.surfaceRaised,
  },
  agencyLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  agencyInfo: {
    flex: 1,
    gap: 2,
  },
  agencyNameLarge: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  legalLabel: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  agencyDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  brokerSubCard: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  brokerAvatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
  },
  brokerInfo: {
    flex: 1,
    gap: 4,
  },
  brokerNameSmall: {
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
  },
  brokerRole: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: colors.accent,
    letterSpacing: 0.5,
  },
  recSection: {
    paddingVertical: 16,
  },
  recSectionTitle: {
    fontSize: 12,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    letterSpacing: 2,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  recListWrapper: {
    position: "relative",
  },
  recCard: {
    width: 180,
    marginRight: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadows.calm,
  },
  recImageContainer: {
    width: "100%",
    height: 140,
  },
  recImage: {
    width: "100%",
    height: "100%",
  },
  recHeart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  recContent: {
    padding: 12,
    gap: 6,
  },
  recPrice: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
  },
  recMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recMetaText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: colors.textSecondary,
  },
  recMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
  },
  recLocation: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textMuted,
    marginTop: 2,
  },
  edgeFade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 32,
    zIndex: 2,
  },
  edgeFadeLeft: {
    left: 0,
  },
  edgeFadeRight: {
    right: 0,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...theme.shadows.calm,
  },
  bottomPriceInfo: {
    gap: 2,
  },
  bottomPriceLabel: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  bottomPriceValue: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
  },
  primaryCta: {
    backgroundColor: colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "80%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  modalCloseText: {
    fontSize: 12,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.accent,
  },
  fullDescriptionText: {
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
    color: colors.textSecondary,
    lineHeight: 28,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  contactOptions: {
    gap: 12,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.textPrimary,
  },
  contactSubLabel: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
