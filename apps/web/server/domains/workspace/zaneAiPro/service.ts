import { requireSessionContext } from "@/server/auth/session";
import {
  convexZaneAiProRepository,
  type ZaneAiProRepository,
} from "@/server/infrastructure/convex/ai/zaneAiPro";
import type {
  ZaneAiProStreamEvent,
  SendZaneAiProMessageInput,
  TranscribeVoiceFromStorageInput,
} from "@/server/contracts/zaneAiPro";
import type { UploadedFileReference } from "@/server/contracts/files";

type ZaneAiProServiceDependencies = {
  requireSession: typeof requireSessionContext;
  repository: ZaneAiProRepository;
};

const defaultDependencies: ZaneAiProServiceDependencies = {
  requireSession: requireSessionContext,
  repository: convexZaneAiProRepository,
};

export async function getZaneAiProThread(
  threadId?: string,
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
) {
  const session = await dependencies.requireSession();
  return dependencies.repository.getThread(session.token, threadId);
}

export async function listZaneAiProThreads(
  limit = 6,
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
) {
  const session = await dependencies.requireSession();
  return dependencies.repository.listThreads(session.token, limit);
}

export async function sendZaneAiProMessage(
  input: SendZaneAiProMessageInput,
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
) {
  const session = await dependencies.requireSession();
  return dependencies.repository.sendMessage(session.token, input);
}

export async function listZaneAiProStreamEvents(
  input: { sessionId: string; afterSeq?: number; limit?: number },
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
): Promise<ZaneAiProStreamEvent[]> {
  const session = await dependencies.requireSession();
  return dependencies.repository.listStreamEvents(session.token, input);
}

export async function cancelZaneAiProStreamSession(
  sessionId: string,
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
) {
  const session = await dependencies.requireSession();
  return dependencies.repository.cancelStreamSession(session.token, sessionId);
}

export async function getZaneAiProVoiceUploadUrl(
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
) {
  const session = await dependencies.requireSession();
  return dependencies.repository.getVoiceUploadUrl(session.token);
}

export async function transcribeZaneAiProVoiceFromStorage(
  input: TranscribeVoiceFromStorageInput,
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
) {
  const session = await dependencies.requireSession();
  return dependencies.repository.transcribeVoiceFromStorage(session.token, input);
}

export async function finalizeZaneAiProUploadedFiles(
  input: {
    files: Array<{
      storageId: string;
      name: string;
      size?: number;
      mime?: string;
    }>;
  },
  dependencies: ZaneAiProServiceDependencies = defaultDependencies,
): Promise<UploadedFileReference[]> {
  const session = await dependencies.requireSession();
  return dependencies.repository.finalizeUploadedFiles(session.token, input);
}
