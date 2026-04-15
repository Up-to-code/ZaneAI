import { z } from "zod/v3";

export const decisionSchema = z.object({
  summary: z.string(),
  rankingRationale: z.string(),
  propertyIds: z.array(z.string()).max(3),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    snippet: z.string(),
  })).max(5),
});
