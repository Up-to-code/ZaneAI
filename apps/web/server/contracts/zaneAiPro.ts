import { z } from "zod";
import type { AgUiConversationTurn } from "@anan/ag-ui";
import { uploadedFileReferenceSchema } from "@/server/contracts/files";

export const zaneAiProInputModeSchema = z.enum(["text", "voice", "attachment"]);

export const zaneAiProMessageMetadataSchema = z.object({
  uiTurn: z.any().optional(),
  meta: z.any().optional(),
  inputMode: zaneAiProInputModeSchema.optional(),
  attachments: z.array(uploadedFileReferenceSchema).optional(),
});

export const zaneAiProMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  uiTurn: zaneAiProMessageMetadataSchema.shape.uiTurn,
  meta: zaneAiProMessageMetadataSchema.shape.meta,
  inputMode: zaneAiProMessageMetadataSchema.shape.inputMode,
  attachments: zaneAiProMessageMetadataSchema.shape.attachments,
  createdAt: z.number(),
});

export const zaneAiProThreadSchema = z.object({
  id: z.string().min(1),
  title: z.string().nullable().optional(),
  messages: z.array(zaneAiProMessageSchema),
});

export const zaneAiProThreadSummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().nullable().optional(),
  updatedAt: z.number(),
});

export const sendZaneAiProMessageInputSchema = z.object({
  message: z.string(),
  threadId: z.string().min(1).optional(),
  startNewThread: z.boolean().optional(),
  inputMode: zaneAiProInputModeSchema.optional(),
  attachments: z.array(uploadedFileReferenceSchema).optional(),
  streamSessionId: z.string().min(1).optional(),
  regenerate: z.boolean().optional(),
  regenerateMessageId: z.string().min(1).optional(),
}).superRefine((value, ctx) => {
  const hasMessage = value.message.trim().length > 0;
  const hasAttachments = (value.attachments?.length ?? 0) > 0;
  if (!hasMessage && !hasAttachments) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Message text or at least one attachment is required.",
      path: ["message"],
    });
  }
});

export const zaneAiProStreamPhaseSchema = z.enum([
  "intent_started",
  "intent_done",
  "team_started",
  "team_done",
  "merge_started",
  "merge_done",
  "action_started",
  "action_done",
  "persist_started",
  "persist_done",
]);

export const zaneAiProStreamStageEventSchema = z.object({
  seq: z.number(),
  phase: zaneAiProStreamPhaseSchema,
  status: z.enum(["running", "completed", "failed"]).optional(),
  teamId: z.string().optional(),
  agentName: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.number(),
});

export const zaneAiProStreamEventSchema = z.object({
  seq: z.number(),
  eventType: z.enum(["stage", "delta", "assistant_meta", "thread", "lifecycle", "error"]),
  phase: zaneAiProStreamPhaseSchema.optional(),
  status: z.enum(["running", "completed", "failed", "cancelled"]).optional(),
  teamId: z.string().optional(),
  agentName: z.string().optional(),
  delta: z.string().optional(),
  threadId: z.string().optional(),
  title: z.string().optional(),
  meta: z.unknown().optional(),
  message: z.string().optional(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.number(),
});

export const transcribeVoiceFromStorageInputSchema = z.object({
  storageId: z.string().min(1),
});

export const transcribeVoiceFromStorageResultSchema = z.object({
  text: z.string().min(1),
  languageCode: z.string().optional(),
});

export type ZaneAiProMessage = z.infer<typeof zaneAiProMessageSchema>;
export type ZaneAiProThread = z.infer<typeof zaneAiProThreadSchema>;
export type ZaneAiProThreadSummary = z.infer<typeof zaneAiProThreadSummarySchema>;
export type SendZaneAiProMessageInput = z.infer<typeof sendZaneAiProMessageInputSchema>;
export type ZaneAiProInputMode = z.infer<typeof zaneAiProInputModeSchema>;
export type TranscribeVoiceFromStorageInput = z.infer<typeof transcribeVoiceFromStorageInputSchema>;
export type TranscribeVoiceFromStorageResult = z.infer<typeof transcribeVoiceFromStorageResultSchema>;
export type ZaneAiProStreamStageEvent = z.infer<typeof zaneAiProStreamStageEventSchema>;
export type ZaneAiProStreamEvent = z.infer<typeof zaneAiProStreamEventSchema>;

export type ZaneAiProUiTurn = AgUiConversationTurn;
