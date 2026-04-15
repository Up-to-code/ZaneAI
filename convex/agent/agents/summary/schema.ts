import type { z } from "zod/v3";

import { buyerAssistantTurnSchema } from "../../../../packages/zayon-assistant-protocol/src/schemas";
import type { BuyerAssistantTurn } from "../../../../packages/zayon-assistant-protocol/src/types";

export const summarySchema: z.ZodType<BuyerAssistantTurn> = buyerAssistantTurnSchema;
