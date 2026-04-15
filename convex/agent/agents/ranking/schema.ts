import { z } from "zod/v3";

export const rankingSchema = z.object({
  summary: z.string(),
  propertyIds: z.array(z.string()).max(5),
  rankingRationale: z.string(),
  comparisonPoints: z.array(z.string()).max(5),
});
