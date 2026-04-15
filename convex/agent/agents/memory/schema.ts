import { z } from "zod/v3";

export const memorySchema = z.object({
  summary: z.string(),
  savedKeys: z.array(z.string()).max(6),
  skipped: z.array(z.string()).max(4),
});
