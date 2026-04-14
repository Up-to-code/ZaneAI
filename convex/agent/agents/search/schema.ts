import { z } from "zod";

export const searchSchema = z.object({
  summary: z.string(),
  propertyIds: z.array(z.string()).max(5),
  marketNotes: z.array(z.string()).max(4),
  followups: z.array(z.string()).max(3),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    snippet: z.string(),
  })).max(5),
});
