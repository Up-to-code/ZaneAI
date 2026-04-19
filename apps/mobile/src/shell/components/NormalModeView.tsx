import { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
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

import { EmptyPropertiesState } from "@/decision/components/EmptyPropertiesState";
import { PropertyCard } from "@/decision/components/PropertyCard";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { Text } from "@/foundation/primitives/Text";
import { useTranslation } from "@/foundation/localization";
import { useCandidateProperties } from "@/persistence/convex/usePropertyData";

const BANNER_HEIGHT = 320;
const BRAND_DOT_COLOR = "#EC2D35";

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
  }, [activeIndex, offset]);

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
  
  const [transaction, setTransaction] = useState<"buy" | "rent">("buy");
  const properties = useCandidateProperties();

  const containerPadding = 24 * 2;
  const contentWidth = windowWidth - containerPadding;

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
              <Pressable onPress={() => router.navigate("/(app)/listing")}>
                <Text style={viewStyles.viewAllText}>VIEW ALL</Text>
              </Pressable>
            </View>

            {properties.length === 0 ? (
              <EmptyPropertiesState
                title="No new properties"
                body="Fresh matches will show here as soon as ZaneAI finds them."
              />
            ) : (
              <View style={viewStyles.projectsList}>
                {properties.map((property, index) => (
                  <Animated.View
                    key={property.id}
                    entering={FadeInDown.delay(360 + index * 70).duration(350)}
                  >
                    <PropertyCard property={property} style={viewStyles.propertyCard} />
                  </Animated.View>
                ))}
              </View>
            )}
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
  projectsList: {
    gap: 20,
  },
  propertyCard: {
    marginHorizontal: 0,
    marginBottom: 0,
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
