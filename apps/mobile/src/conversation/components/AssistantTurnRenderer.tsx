import { Fragment, useMemo, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import type { AssistantAction, AssistantBlock, AssistantTurn } from "@/conversation/assistantProtocol";
import { Text } from "@/foundation/primitives/Text";
import { MarkdownText } from "@/foundation/primitives/MarkdownText";
import { isArabic } from "@/foundation/utils/rtl";
import { theme, radii } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { MessageActions } from "./MessageActions";

type AssistantTurnRendererProps = {
  turn: AssistantTurn;
  renderPropertyPreview?: (propertyId: string) => ReactNode;
  onAction?: (action: AssistantAction, turn: AssistantTurn) => void | Promise<void>;
};

function Section({
  title,
  tone,
  cardless,
  children,
}: {
  title?: string;
  tone: AssistantTurn["motion"]["preset"];
  cardless?: boolean;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[!cardless ? styles.card : styles.cardless, !cardless && styles[`card_${tone}`]]}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}

function PropertyFallback({ propertyId }: { propertyId: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.propertyFallback}>
      <Text style={styles.propertyFallbackText}>{propertyId}</Text>
    </View>
  );
}

function renderProperties(propertyIds: string[], renderPropertyPreview?: (propertyId: string) => ReactNode) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
      {propertyIds.map((propertyId) => (
        <Fragment key={propertyId}>
          {renderPropertyPreview ? renderPropertyPreview(propertyId) : <PropertyFallback propertyId={propertyId} />}
        </Fragment>
      ))}
    </ScrollView>
  );
}

function ActionButtons({
  actionIds,
  turn,
  onAction,
}: {
  actionIds: string[];
  turn: AssistantTurn;
  onAction?: AssistantTurnRendererProps["onAction"];
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const actions = turn.actions.filter((action) => actionIds.includes(action.id));
  const isArabicTurn = isArabic(turn.assistantText);

  if (!actions.length) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.actionRow, isArabicTurn ? styles.actionRowRtl : null]}
    >
      {actions.map((action) => (
        <Pressable
          key={action.id}
          onPress={() => void onAction?.(action, turn)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.actionLinkWrap,
            pressed ? styles.actionButtonPressed : null,
          ]}
        >
          <Text style={[styles.actionText, isArabicTurn ? styles.actionTextRtl : null]}>
            {action.title}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function RenderBlock({
  block,
  turn,
  renderPropertyPreview,
  onAction,
}: {
  block: AssistantBlock;
  turn: AssistantTurn;
  renderPropertyPreview?: AssistantTurnRendererProps["renderPropertyPreview"];
  onAction?: AssistantTurnRendererProps["onAction"];
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  switch (block.type) {
    case "text":
      return (
        <Section title={block.title} tone={turn.motion.preset} cardless>
          <MarkdownText text={block.body} tone="secondary" style={styles.bodyText} />
        </Section>
      );
    case "property_list":
      return (
        <Section title={block.title} tone={turn.motion.preset}>
          {block.subtitle ? <Text style={styles.subtleText}>{block.subtitle}</Text> : null}
          {renderProperties(block.propertyIds, renderPropertyPreview)}
        </Section>
      );
    case "comparison":
      return (
        <Section title={block.title} tone={turn.motion.preset}>
          {renderProperties(block.propertyIds, renderPropertyPreview)}
          <View style={styles.bulletsWrap}>
            {block.points.map((point) => (
              <Text key={point} style={styles.bulletText}>• {point}</Text>
            ))}
          </View>
        </Section>
      );
    case "sources":
      return (
        <Section title={block.title} tone={turn.motion.preset}>
          {block.sources.map((source) => (
            <View key={source.url} style={styles.sourceRow}>
              <Text style={styles.sourceTitle}>{source.title}</Text>
              <Text style={styles.sourceSnippet}>{source.snippet}</Text>
            </View>
          ))}
        </Section>
      );
    case "followup":
      return (
        <Section title={block.title} tone={turn.motion.preset} cardless>
          <MarkdownText text={block.prompt} tone="secondary" style={styles.bodyText} />
          {block.suggestions?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionRow}
            >
              {block.suggestions.map((suggestion) => (
                <View key={suggestion} style={styles.suggestionPill}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </ScrollView>
          ) : null}
        </Section>
      );
    case "funding_options":
      return (
        <Section title={block.title} tone={turn.motion.preset}>
          <Text style={styles.bodyText}>{block.summary}</Text>
          <View style={styles.bulletsWrap}>
            {block.options.map((option) => (
              <Text key={option} style={styles.bulletText}>• {option}</Text>
            ))}
          </View>
          {block.disclaimers?.length ? (
            <View style={styles.disclaimerWrap}>
              {block.disclaimers.map((disclaimer) => (
                <Text key={disclaimer} style={styles.disclaimerText}>{disclaimer}</Text>
              ))}
            </View>
          ) : null}
        </Section>
      );
    case "advisor_note":
      return (
        <Section title={block.title} tone={turn.motion.preset} cardless>
          <MarkdownText text={block.body} tone="secondary" style={styles.bodyText} />
          {block.bullets?.length ? (
            <View style={styles.bulletsWrap}>
              {block.bullets.map((bullet) => (
                <Text key={bullet} style={styles.bulletText}>• {bullet}</Text>
              ))}
            </View>
          ) : null}
        </Section>
      );
    case "actions":
      return (
        <Section tone={turn.motion.preset} cardless>
          <ActionButtons actionIds={block.actionIds} turn={turn} onAction={onAction} />
        </Section>
      );
    case "empty":
      return (
        <Section title={block.title} tone={turn.motion.preset} cardless>
          <MarkdownText text={block.body} tone="secondary" style={styles.bodyText} />
          {block.suggestions?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionRow}
            >
              {block.suggestions.map((suggestion) => (
                <View key={suggestion} style={styles.suggestionPill}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </ScrollView>
          ) : null}
        </Section>
      );
    default:
      return null;
  }
}

export function AssistantTurnRenderer({
  turn,
  renderPropertyPreview,
  onAction,
}: AssistantTurnRendererProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const fullText = useMemo(() => {
    return turn.blocks
      .map((b) => {
        if (b.type === "text" || b.type === "advisor_note" || b.type === "empty") return b.body;
        if (b.type === "followup") return b.prompt;
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }, [turn.blocks]);

  const isAr = isArabic(fullText);

  return (
    <View style={styles.container}>
      {turn.blocks.map((block) => (
        <View key={block.id} style={isAr && { alignItems: "flex-end" }}>
          <RenderBlock
            block={block}
            turn={turn}
            renderPropertyPreview={renderPropertyPreview}
            onAction={onAction}
          />
        </View>
      ))}

      <View style={[styles.actionsContainer, isAr && { alignItems: "flex-end" }]}>
        <MessageActions text={fullText} isArabic={isAr} />
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: 4,
      gap: 4,
    },
    card: {
      marginHorizontal: theme.spacing.xl,
      borderRadius: radii.md,
      borderWidth: 1,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    cardless: {
      paddingHorizontal: theme.spacing.xl,
      gap: 2,
      borderWidth: 0,
      backgroundColor: "transparent",
    },
    card_assistant: {
      borderColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    card_advisor: {
      borderColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    card_property: {
      borderColor: colors.accent,
      backgroundColor: colors.surfaceRaised,
    },
    card_funding: {
      borderColor: colors.border,
      backgroundColor: colors.backgroundSoft,
    },
    cardTitle: {
      fontSize: 16,
      fontFamily: "Manrope_700Bold",
      color: colors.textPrimary,
    },
    bodyText: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
      fontFamily: "Manrope_500Medium",
    },
    subtleText: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
      fontFamily: "Manrope_500Medium",
    },
    bulletsWrap: {
      gap: theme.spacing.xs,
    },
    bulletText: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
      fontFamily: "Manrope_500Medium",
    },
    sourceRow: {
      gap: theme.spacing.xs,
      borderRadius: 16,
      backgroundColor: colors.backgroundSoft,
      padding: theme.spacing.md,
    },
    sourceTitle: {
      fontSize: 13,
      fontFamily: "Manrope_700Bold",
      color: colors.textPrimary,
    },
    sourceSnippet: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
      fontFamily: "Manrope_500Medium",
    },
    suggestionRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
    },
    suggestionPill: {
      borderRadius: radii.pill || 999,
      backgroundColor: colors.surfaceRaised,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    suggestionText: {
      fontSize: 13,
      color: colors.textPrimary,
      fontFamily: "Manrope_600SemiBold",
    },
    disclaimerWrap: {
      gap: theme.spacing.xs,
      paddingTop: theme.spacing.xs,
    },
    disclaimerText: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
      fontFamily: "Manrope_500Medium",
    },
    actionRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
      alignItems: "center",
    },
    actionRowRtl: {
      flexDirection: "row-reverse",
    },
    actionLinkWrap: {
      paddingVertical: 2,
      paddingHorizontal: 2,
    },
    actionButtonPressed: {
      opacity: 0.65,
    },
    actionText: {
      color: colors.accent,
      fontSize: 13,
      fontFamily: "Manrope_600SemiBold",
      textDecorationLine: "underline",
    },
    actionTextRtl: {
      textAlign: "right",
      writingDirection: "rtl",
    },
    propertyFallback: {
      minWidth: 160,
      borderRadius: 18,
      backgroundColor: colors.backgroundSoft,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    propertyFallbackText: {
      fontSize: 13,
      fontFamily: "Manrope_600SemiBold",
      color: colors.textPrimary,
    },
    actionsContainer: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: 2,
      paddingBottom: 4,
    },
  });
