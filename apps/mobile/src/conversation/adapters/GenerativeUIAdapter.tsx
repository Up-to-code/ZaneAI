import { useMemo } from "react";
import { View } from "react-native";

import type { BuyerAction } from "@/conversation/buyerProtocol";
import { extractBuyerTurnPropertyIds } from "@/conversation/buyerProtocol";
import { BuyerTurnRenderer } from "@/conversation/components/BuyerTurnRenderer";
import { PropertyCard } from "@/decision/components/PropertyCard";
import { usePropertiesByIds } from "@/persistence/convex/usePropertyData";
import type { ConversationMessage, PropertyCardVM } from "@/types/domain";

type GenerativeUIAdapterProps = {
  message: ConversationMessage;
  onAction: (action: BuyerAction, message: ConversationMessage) => void | Promise<void>;
};

export function GenerativeUIAdapter({ message, onAction }: GenerativeUIAdapterProps) {
  const turn = message.uiTurn;
  const propertyIds = turn ? extractBuyerTurnPropertyIds(turn) : [];
  const properties = usePropertiesByIds(propertyIds);
  const propertyMap = useMemo(
    () => new Map<string, PropertyCardVM>(properties.map((property: PropertyCardVM) => [property.id, property])),
    [properties],
  );

  if (!turn) {
    return null;
  }

  return (
    <BuyerTurnRenderer
      turn={turn}
      onAction={(action) => onAction(action, message)}
      renderPropertyPreview={(propertyId) => {
        const property = propertyMap.get(propertyId);
        if (!property) {
          return <View />;
        }

        return (
          <View style={{ width: 280 }}>
            <PropertyCard property={property} compact />
          </View>
        );
      }}
    />
  );
}

export const isGenerativeUIEnabled = true;
