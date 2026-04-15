import { z } from "zod/v3";

export const preferenceSchema = z.object({
  summary: z.string(),
  savedKeys: z.array(z.string()).max(6),
  inferredNeeds: z.array(z.string()).max(4),
  suggestedFollowups: z.array(z.string()).max(4),
});
