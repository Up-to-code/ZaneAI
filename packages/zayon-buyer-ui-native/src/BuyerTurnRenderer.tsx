import React, { Fragment, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { BuyerAction, BuyerAssistantTurn, BuyerCard } from "../../zayon-assistant-protocol/src";

type BuyerTurnRendererProps = {
  turn: BuyerAssistantTurn;
  renderPropertyPreview?: (propertyId: string) => React.ReactNode;
  onAction?: (action: BuyerAction, turn: BuyerAssistantTurn) => void | Promise<void>;
};

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const styles = useMemo(() => createStyles(), []);
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}

function PropertyFallback({ propertyId }: { propertyId: string }) {
  const styles = useMemo(() => createStyles(), []);
  return (
    <View style={styles.propertyFallback}>
      <Text style={styles.propertyFallbackText}>{propertyId}</Text>
    </View>
  );
}

function renderProperties(
  propertyIds: string[],
  renderPropertyPreview: BuyerTurnRendererProps["renderPropertyPreview"],
) {
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
  turn: BuyerAssistantTurn;
  onAction?: BuyerTurnRendererProps["onAction"];
}) {
  const styles = useMemo(() => createStyles(), []);
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

function RenderCard({
  card,
  turn,
  renderPropertyPreview,
  onAction,
}: {
  card: BuyerCard;
  turn: BuyerAssistantTurn;
  renderPropertyPreview?: BuyerTurnRendererProps["renderPropertyPreview"];
  onAction?: BuyerTurnRendererProps["onAction"];
}) {
  const styles = useMemo(() => createStyles(), []);

  switch (card.type) {
    case "shortlist":
      return <Section title={card.title}>{renderProperties(card.propertyIds, renderPropertyPreview)}</Section>;
    case "comparison":
      return (
        <Section title={card.title}>
          {renderProperties(card.propertyIds, renderPropertyPreview)}
          <View style={styles.bulletsWrap}>
            {card.points.map((point) => (
              <Text key={point} style={styles.bulletText}>• {point}</Text>
            ))}
          </View>
        </Section>
      );
    case "rationale":
      return (
        <Section title={card.title}>
          {card.bullets.map((bullet) => (
            <Text key={bullet} style={styles.bulletText}>• {bullet}</Text>
          ))}
        </Section>
      );
    case "market_sources":
      return (
        <Section title={card.title}>
          {card.sources.map((source) => (
            <View key={source.url} style={styles.sourceRow}>
              <Text style={styles.sourceTitle}>{source.title}</Text>
              <Text style={styles.sourceSnippet}>{source.snippet}</Text>
            </View>
          ))}
        </Section>
      );
    case "followup":
      return (
        <Section title={card.title}>
          <Text style={styles.bodyText}>{card.prompt}</Text>
          {card.suggestions?.length ? (
            <View style={styles.suggestionWrap}>
              {card.suggestions.map((suggestion) => (
                <View key={suggestion} style={styles.suggestionPill}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Section>
      );
    case "actions":
      return (
        <Section title={card.title}>
          <ActionButtons actionIds={card.actionIds} turn={turn} onAction={onAction} />
        </Section>
      );
    case "empty":
      return (
        <Section title={card.title}>
          <Text style={styles.bodyText}>{card.body}</Text>
          {card.suggestions?.length ? (
            <View style={styles.suggestionWrap}>
              {card.suggestions.map((suggestion) => (
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

export function BuyerTurnRenderer({
  turn,
  renderPropertyPreview,
  onAction,
}: BuyerTurnRendererProps) {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      {turn.cards.map((card) => (
        <RenderCard
          key={card.id}
          card={card}
          turn={turn}
          renderPropertyPreview={renderPropertyPreview}
          onAction={onAction}
        />
      ))}
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      marginTop: 12,
      gap: 12,
    },
    card: {
      marginHorizontal: 20,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: "#DBE4F1",
      backgroundColor: "#FFFFFF",
      padding: 16,
      gap: 10,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: "#173256",
    },
    bodyText: {
      fontSize: 14,
      lineHeight: 20,
      color: "#325078",
    },
    bulletsWrap: {
      gap: 8,
    },
    bulletText: {
      fontSize: 14,
      lineHeight: 20,
      color: "#325078",
    },
    sourceRow: {
      gap: 4,
      borderRadius: 16,
      backgroundColor: "#F7FAFF",
      padding: 12,
    },
    sourceTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: "#173256",
    },
    sourceSnippet: {
      fontSize: 12,
      lineHeight: 18,
      color: "#5D7599",
    },
    suggestionWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    suggestionPill: {
      borderRadius: 999,
      backgroundColor: "#EEF4FF",
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    suggestionText: {
      fontSize: 12,
      color: "#28548C",
      fontWeight: "600",
    },
    actionWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    actionButton: {
      borderRadius: 16,
      backgroundColor: "#173256",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    actionButtonPressed: {
      opacity: 0.82,
    },
    actionText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
    },
    propertyFallback: {
      minWidth: 160,
      borderRadius: 18,
      backgroundColor: "#F7FAFF",
      paddingHorizontal: 12,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: "#DBE4F1",
    },
    propertyFallbackText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#173256",
    },
  });
