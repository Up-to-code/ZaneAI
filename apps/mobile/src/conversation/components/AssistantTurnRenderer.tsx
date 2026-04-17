import { Fragment, useMemo, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import type { AssistantAction, AssistantBlock, AssistantTurn } from "@/conversation/assistantProtocol";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type AssistantTurnRendererProps = {
  turn: AssistantTurn;
  renderPropertyPreview?: (propertyId: string) => ReactNode;
  onAction?: (action: AssistantAction, turn: AssistantTurn) => void | Promise<void>;
};

function Section({
  title,
  tone,
  children,
}: {
  title?: string;
  tone: AssistantTurn["motion"]["preset"];
  children: ReactNode;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.card, styles[`card_${tone}`]]}>
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

  if (!actions.length) {
    return null;
  }

  return (
    <View style={styles.actionWrap}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          onPress={() => void onAction?.(action, turn)}
          style={({ pressed }) => [
            styles.actionButton,
            pressed ? styles.actionButtonPressed : null,
          ]}
        >
          <Text style={styles.actionText}>{action.title}</Text>
        </Pressable>
      ))}
    </View>
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
        <Section title={block.title} tone={turn.motion.preset}>
          <Text style={styles.bodyText}>{block.body}</Text>
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
        <Section title={block.title} tone={turn.motion.preset}>
          <Text style={styles.bodyText}>{block.prompt}</Text>
          {block.suggestions?.length ? (
            <View style={styles.suggestionWrap}>
              {block.suggestions.map((suggestion) => (
                <View key={suggestion} style={styles.suggestionPill}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
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
        <Section title={block.title} tone={turn.motion.preset}>
          <Text style={styles.bodyText}>{block.body}</Text>
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
        <Section title={block.title} tone={turn.motion.preset}>
          <ActionButtons actionIds={block.actionIds} turn={turn} onAction={onAction} />
        </Section>
      );
    case "empty":
      return (
        <Section title={block.title} tone={turn.motion.preset}>
          <Text style={styles.bodyText}>{block.body}</Text>
          {block.suggestions?.length ? (
            <View style={styles.suggestionWrap}>
              {block.suggestions.map((suggestion) => (
                <View key={suggestion} style={styles.suggestionPill}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
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

  return (
    <View style={styles.container}>
      {turn.blocks.map((block) => (
        <RenderBlock
          key={block.id}
          block={block}
          turn={turn}
          renderPropertyPreview={renderPropertyPreview}
          onAction={onAction}
        />
      ))}
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.md,
    },
    card: {
      marginHorizontal: theme.spacing.xl,
      borderRadius: 24,
      borderWidth: 1,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
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
    suggestionWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    suggestionPill: {
      borderRadius: 999,
      backgroundColor: colors.backgroundSoft,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    suggestionText: {
      fontSize: 12,
      color: colors.textSecondary,
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
    actionWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    actionButton: {
      borderRadius: 16,
      backgroundColor: colors.textPrimary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    actionButtonPressed: {
      opacity: 0.82,
    },
    actionText: {
      color: colors.background,
      fontSize: 13,
      fontFamily: "Manrope_700Bold",
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
  });
