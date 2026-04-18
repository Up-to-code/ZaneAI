import { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Search, Heart, Bed, Bath, Maximize } from "lucide-react-native";
import Animated, { 
  FadeIn, 
  FadeInDown, 
  Layout, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/foundation/theme/ThemeProvider";
import { Text } from "@/foundation/primitives/Text";
import { LogoMark } from "@/foundation/icons/LogoMark";
import { useTranslation } from "@/foundation/localization";

const BANNER_HEIGHT = 320;
const BRAND_DOT_COLOR = "#EC2D35";
const PROJECT_CARD_WIDTH = 260;

interface Project {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  status: string;
  beds: number;
  baths: number;
  area: number;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "The Iconic Penthouse",
    location: "Palm Jumeirah, Dubai",
    price: "$5,400,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800",
    status: "FOR SALE",
    beds: 4,
    baths: 5,
    area: 1250,
  },
  {
    id: "2",
    title: "Skyline Garden Villa",
    location: "Downtown Dubai",
    price: "$2,100,000",
    image: "https://images.unsplash.com/photo-1600607687940-477a284e68c8?auto=format&fit=crop&q=80&w=800",
    status: "READY",
    beds: 3,
    baths: 3,
    area: 840,
  },
  {
    id: "3",
    title: "Minimalist Desert Oasis",
    location: "Al Barari",
    price: "$3,250,000",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
    status: "PROJECT",
    beds: 5,
    baths: 6,
    area: 2100,
  },
];

function ProjectCard({ project, styles, isRTL, router }: { project: Project; styles: any, isRTL: boolean, router: any }) {
  return (
    <Pressable 
      style={styles.cardContainer}
      onPress={() => router.navigate(`/(app)/listing`)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: project.image }}
          style={styles.cardImage}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.cardOverlay} />
        <Pressable 
          style={[
            styles.favBtn, 
            isRTL ? { right: 12 } : { left: 12 }
          ]}
        >
          <Heart size={18} color="#EC2D35" fill="transparent" strokeWidth={2.5} />
        </Pressable>
        <View style={[styles.cardBadge, isRTL ? { left: 12 } : { right: 12 }]}>
          <View style={styles.badgeDot} />
          <Text style={styles.cardBadgeText}>{project.status}</Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <View style={[styles.priceRow, isRTL && { flexDirection: "row-reverse" }]}>
          <Text style={styles.cardPrice}>{project.price}</Text>
          <Text style={styles.pricePeriod}>/month</Text>
        </View>
        
        <View style={[styles.cardAttributes, isRTL && { flexDirection: "row-reverse" }]}>
          <View style={[styles.attrItem, isRTL && { flexDirection: "row-reverse" }]}>
            <Bed size={12} color="#71717A" strokeWidth={1.5} />
            <Text style={styles.attrText}>{project.beds}</Text>
          </View>
          <View style={[styles.attrItem, isRTL && { flexDirection: "row-reverse" }]}>
            <Bath size={12} color="#71717A" strokeWidth={1.5} />
            <Text style={styles.attrText}>{project.baths}</Text>
          </View>
          <View style={[styles.attrItem, isRTL && { flexDirection: "row-reverse" }]}>
            <Maximize size={12} color="#71717A" strokeWidth={1.5} />
            <Text style={styles.attrText}>{project.area} sqm</Text>
          </View>
        </View>

        <Text numberOfLines={1} style={[styles.cardTitle, isRTL && { textAlign: "right" }]}>
          {project.title.toUpperCase()}
        </Text>
        <Text numberOfLines={1} style={[styles.cardLocation, isRTL && { textAlign: "right" }]}>
          {project.location}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * SlidingIndicator for segmented controls
 */
function SlidingIndicator({ 
  activeIndex, 
  itemsCount, 
  containerWidth, 
  resolvedColorScheme,
  colors
}: { 
  activeIndex: number; 
  itemsCount: number;
  containerWidth: number;
  resolvedColorScheme: string;
  colors: any;
}) {
  const itemWidth = (containerWidth - 8) / itemsCount; // 8 is total horizontal padding (4 on each side)
  const offset = useSharedValue(activeIndex);
  
  useEffect(() => {
    offset.value = withSpring(activeIndex, { damping: 25, stiffness: 220, mass: 0.5 });
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: itemWidth,
    transform: [{ translateX: offset.value * itemWidth }],
  }));

  const indicatorColor = colors.textPrimary;

  return (
    <Animated.View style={[styles.indicator, animatedStyle, { backgroundColor: indicatorColor }]} />
  );
}

export function NormalModeView() {
  const router = useRouter();
  const { colors, resolvedColorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { t, isRTL } = useTranslation();
  
  const [category, setCategory] = useState<"ready" | "projects">("ready");
  const [transaction, setTransaction] = useState<"buy" | "rent">("buy");

  const containerPadding = 24 * 2;
  const contentWidth = windowWidth - containerPadding;
  const pillMaxWidth = Math.min(contentWidth, 280);

  const viewStyles = createStyles(colors, insets, isRTL, resolvedColorScheme);

  return (
    <Animated.View 
      entering={FadeIn.duration(300)} 
      style={viewStyles.container}
    >
      <ScrollView 
        contentContainerStyle={viewStyles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <View style={viewStyles.bannerWrapper}>
          <Image
            source={require("../../../assets/banner_search.png")}
            style={viewStyles.bannerImage}
            contentFit="cover"
            transition={1000}
          />
          <View style={viewStyles.bannerOverlay} />
        </View>

        {/* Search Interaction Layer */}
        <View style={viewStyles.contentBlock}>
          
          {/* Main Search Component (Composer Style) */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(300)}
            layout={Layout.springify()}
            style={viewStyles.composerContainer}
          >
            {/* Unified Search Bar (Matches AI Composer Dock) */}
            <View style={viewStyles.unifiedBar}>
              <Pressable 
                style={[viewStyles.actionButton, { backgroundColor: "#EC2D35" }]}
                onPress={() => router.navigate("/(app)/listing")}
              >
                <Search size={20} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>

              <View style={viewStyles.inputField}>
                <TextInput
                  placeholder={t.homeSearch.placeholder}
                  placeholderTextColor={colors.textMuted}
                  style={viewStyles.input}
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>
            </View>

            {/* Inner Transaction Toggle (Buy vs Rent) - Now UNDER Search */}
            <View style={viewStyles.transactionRow}>
              <SlidingIndicator 
                activeIndex={transaction === "rent" ? 0 : 1} 
                itemsCount={2} 
                containerWidth={contentWidth} // No padding needed as it's separate
                resolvedColorScheme={resolvedColorScheme}
                colors={colors}
              />
              <Pressable 
                onPress={() => setTransaction("rent")}
                style={viewStyles.transactionBtn}
              >
                <View style={viewStyles.btnContent}>
                  <Text style={[viewStyles.transactionText, transaction === "rent" && viewStyles.transactionTextActive]}>
                    {t.homeSearch.rent}
                  </Text>
                  {transaction === "rent" && <View style={viewStyles.brandDot} />}
                </View>
              </Pressable>
              <Pressable 
                onPress={() => setTransaction("buy")}
                style={viewStyles.transactionBtn}
              >
                <View style={viewStyles.btnContent}>
                  <Text style={[viewStyles.transactionText, transaction === "buy" && viewStyles.transactionTextActive]}>
                    {t.homeSearch.buy}
                  </Text>
                  {transaction === "buy" && <View style={viewStyles.brandDot} />}
                </View>
              </Pressable>
            </View>
          </Animated.View>

          {/* Spacer between search pill and projects */}
          <View style={{ height: 48 }} />

          {/* Latest Projects Section */}
          <Animated.View 
            entering={FadeInDown.delay(300).duration(400)}
            style={viewStyles.projectsSection}
          >
            <View style={viewStyles.sectionHeader}>
              <Text style={viewStyles.sectionTitle}>LATEST PROJECTS</Text>
              <Pressable>
                <Text style={viewStyles.viewAllText}>VIEW ALL</Text>
              </Pressable>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={viewStyles.projectsScroll}
              decelerationRate="fast"
              snapToInterval={PROJECT_CARD_WIDTH + 16}
            >
              {MOCK_PROJECTS.map((project) => (
                <ProjectCard key={project.id} project={project} styles={viewStyles} isRTL={isRTL} router={router} />
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const createStyles = (colors: any, insets: any, isRTL: boolean, colorScheme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerWrapper: {
    height: BANNER_HEIGHT,
    width: "100%",
    position: "relative",
    backgroundColor: colors.background,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.85,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  contentBlock: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: -84, // Centers the 40px transaction selector exactly on the banner's baseline (Search bar is 52px + 12px gap + 20px half-toggle = 84px)
  },
  categoryPillContainer: {
    flexDirection: "row",
    backgroundColor: colors.surfaceRaised,
    borderRadius: 32,
    padding: 3,
    width: "100%",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    position: "relative",
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  btnContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  brandDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: BRAND_DOT_COLOR,
    position: "absolute",
    bottom: -6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#52525B",
    fontFamily: isRTL ? "Cairo_700Bold" : "Manrope_800ExtraBold",
  },
  categoryTextActive: {
    color: colors.background,
  },
  composerContainer: {
    width: "100%",
    gap: 12,
  },
  transactionRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceRaised,
    borderRadius: 16,
    padding: 2, 
    width: "100%",
    height: 40, // Slimmer, more professional profile
    borderWidth: 1,
    borderColor: colors.divider,
    position: "relative",
    alignItems: "center",
  },
  transactionBtn: {
    flex: 1,
    height: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  transactionText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#52525B",
    fontFamily: isRTL ? "Cairo_700Bold" : "Manrope_800ExtraBold",
  },
  transactionTextActive: {
    color: colors.background,
  },
  unifiedBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 52, // Slightly more compact
    borderRadius: 26,
    backgroundColor: colors.surfaceRaised,
    paddingLeft: 6,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  inputField: {
    flex: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    height: "100%",
    paddingLeft: 8,
  },
  searchIcon: {
    [isRTL ? "marginLeft" : "marginRight"]: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: isRTL ? "Cairo_600SemiBold" : "Manrope_600SemiBold",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 12, // Matches transactionBtn radius
    zIndex: 1,
  },
  projectsSection: {
    width: "100%",
    marginTop: 0, // Handled by spacer View above
  },
  sectionHeader: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 1.5,
    fontFamily: "Manrope_800ExtraBold",
  },
  viewAllText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 1,
    fontFamily: "Manrope_700Bold",
  },
  projectsScroll: {
    paddingRight: 24, // Allow last card to be seen fully
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  cardContainer: {
    width: PROJECT_CARD_WIDTH,
    borderRadius: 20,
    marginRight: 16,
    overflow: "hidden",
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  imageWrapper: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  favBtn: {
    position: "absolute",
    bottom: 12,
    backgroundColor: colors.surface,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBadge: {
    position: "absolute",
    top: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  badgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BRAND_DOT_COLOR,
  },
  cardBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 1,
    fontFamily: "Manrope_800ExtraBold",
  },
  cardInfo: {
    padding: 16,
    paddingTop: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 10,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    fontFamily: "Manrope_800ExtraBold",
  },
  pricePeriod: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: "Manrope_600SemiBold",
  },
  cardAttributes: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 14,
    opacity: 0.8,
  },
  attrItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  attrText: {
    fontSize: 11,
    color: "#52525B",
    fontFamily: "Manrope_700Bold",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
    fontFamily: "Manrope_800ExtraBold",
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardLocation: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 0.5,
  },
});

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    left: 3,
    top: 3,
    bottom: 3,
    borderRadius: 28,
    zIndex: 1,
  },
});
