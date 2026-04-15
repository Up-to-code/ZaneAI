import { z } from "zod/v3";

export const analysisSchema = z.object({
  summary: z.string(),
  propertyInsights: z.array(z.object({
    propertyId: z.string(),
    strengths: z.array(z.string()).max(3),
    risks: z.array(z.string()).max(2),
    pricingNote: z.string(),
  })).max(5),
  marketSignal: z.string(),
});
