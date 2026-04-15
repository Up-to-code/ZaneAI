import type {
  ZaneAiProStreamEvent,
  ZaneAiProThread,
  ZaneAiProThreadSummary,
  SendZaneAiProMessageInput,
  TranscribeVoiceFromStorageInput,
  TranscribeVoiceFromStorageResult,
} from "@/server/contracts/zaneAiPro";
import type { UploadedFileReference } from "@/server/contracts/files";

export type RawAssistantThread = {
  _id: string;
  title?: string;
  updatedAt: number;
} | null;

export type RawAssistantMessage = {
  _id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: {
    uiTurn?: unknown;
    meta?: unknown;
    inputMode?: "text" | "voice" | "attachment";
    attachments?: UploadedFileReference[];
  };
  createdAt: number;
};

export type ZaneAiProRepository = {
  getThread(token: string, threadId?: string): Promise<ZaneAiProThread | null>;
  listThreads(token: string, limit?: number): Promise<ZaneAiProThreadSummary[]>;
  sendMessage(token: string, input: SendZaneAiProMessageInput): Promise<ZaneAiProThread>;
  listStreamEvents(
    token: string,
    input: { sessionId: string; afterSeq?: number; limit?: number },
  ): Promise<ZaneAiProStreamEvent[]>;
  cancelStreamSession(token: string, sessionId: string): Promise<{ ok: true; sessionId: string }>;
  getVoiceUploadUrl(token: string): Promise<string>;
  transcribeVoiceFromStorage(
    token: string,
    input: TranscribeVoiceFromStorageInput,
  ): Promise<TranscribeVoiceFromStorageResult>;
  finalizeUploadedFiles(
    token: string,
    input: {
      files: Array<{
        storageId: string;
        name: string;
        size?: number;
        mime?: string;
      }>;
    },
  ): Promise<UploadedFileReference[]>;
};
