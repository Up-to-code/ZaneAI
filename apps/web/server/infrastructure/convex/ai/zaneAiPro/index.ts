import { fetchAction, fetchMutation, fetchQuery } from "convex/nextjs";
import { zaneAiProApi } from "./api";
import { mapThreadMessages, resolveThreadTitle } from "./mappers";
import type { ZaneAiProRepository, RawAssistantMessage, RawAssistantThread } from "./types";

export type { ZaneAiProRepository } from "./types";

async function fetchThreadMessages(token: string, threadId: string) {
  return (await fetchQuery(zaneAiProApi.listMessages as never, { threadId } as never, {
    token,
  })) as RawAssistantMessage[];
}

async function fetchThreadSummary(token: string, threadId: string) {
  return (await fetchQuery(zaneAiProApi.getThreadById as never, { threadId } as never, {
    token,
  })) as RawAssistantThread;
}

export const convexZaneAiProRepository: ZaneAiProRepository = {
  async getThread(token, threadId) {
    if (threadId) {
      const messages = await fetchThreadMessages(token, threadId);

      if (messages.length === 0) {
        const thread = await fetchThreadSummary(token, threadId);
        if (!thread?._id) {
          return null;
        }
        return {
          id: thread._id,
          title: thread.title ?? null,
          messages: [],
        };
      }

      return {
        id: threadId,
        title: resolveThreadTitle(messages),
        messages: mapThreadMessages(messages),
      };
    }

    const { thread } = (await fetchQuery(zaneAiProApi.getThreadSafe as never, {} as never, {
      token,
    })) as { thread: RawAssistantThread };

    if (!thread?._id) {
      return null;
    }

    const messages = await fetchThreadMessages(token, thread._id);

    return {
      id: thread._id,
      title: thread?.title ?? null,
      messages: mapThreadMessages(messages),
    };
  },

  async listThreads(token, limit = 6) {
    const threads = (await fetchQuery(zaneAiProApi.listThreads as never, { limit } as never, {
      token,
    })) as Array<{ _id: string; title?: string; updatedAt: number }>;

    return threads.map((thread) => ({
      id: thread._id,
      title: thread.title ?? null,
      updatedAt: thread.updatedAt,
    }));
  },

  async sendMessage(token, input) {
    const response = (await fetchAction(zaneAiProApi.sendMessage as never, input as never, {
      token,
    })) as { threadId: string };

    const messages = await fetchThreadMessages(token, response.threadId);

    return {
      id: response.threadId,
      title: messages[0]?.content.slice(0, 80) ?? "zane-ai workspace",
      messages: mapThreadMessages(messages),
    };
  },

  async listStreamEvents(token, input) {
    return fetchQuery(zaneAiProApi.listStreamEvents as never, input as never, {
      token,
    }) as ReturnType<ZaneAiProRepository["listStreamEvents"]>;
  },

  async cancelStreamSession(token, sessionId) {
    return fetchMutation(zaneAiProApi.cancelStreamSession as never, { sessionId } as never, {
      token,
    }) as ReturnType<ZaneAiProRepository["cancelStreamSession"]>;
  },

  async getVoiceUploadUrl(token) {
    return fetchMutation(zaneAiProApi.generateVoiceUploadUrl as never, {} as never, {
      token,
    }) as ReturnType<ZaneAiProRepository["getVoiceUploadUrl"]>;
  },

  async transcribeVoiceFromStorage(token, input) {
    return fetchAction(zaneAiProApi.transcribeVoiceFromStorage as never, input as never, {
      token,
    }) as ReturnType<ZaneAiProRepository["transcribeVoiceFromStorage"]>;
  },

  async finalizeUploadedFiles(token, input) {
    return fetchMutation(zaneAiProApi.finalizeUploadedFiles as never, input as never, {
      token,
    }) as ReturnType<ZaneAiProRepository["finalizeUploadedFiles"]>;
  },
};
