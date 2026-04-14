import { useMemo } from "react";
import { useQuery } from "convex/react";

import { api } from "@convex/_generated/api";
import { useAuthSession } from "@/auth/useAuthSession";
import { resolveE2EPromptScenario } from "@/e2e/fixtures";
import { toPropertyCardVM } from "@/persistence/convex/propertyAdapter";
import { useAppStore } from "@/store";
import type { ConversationMessage } from "@/types/domain";

function getMessageText(message: any) {
  const content = message?.message?.content;
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("");
  }
  return "";
}

export function useThreads() {
  const { isAuthenticated } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eThreads = useAppStore((state) => state.e2eThreads);
  const rows = useQuery(
    api.agent.public.listThreads.listThreads,
    isAuthenticated && !e2eQaMode ? {} : "skip",
  );

  return e2eQaMode ? e2eThreads : rows ?? [];
}

export function useThreadMessages(threadId: string | null, pendingPrompt?: string | null) {
  const { isAuthenticated } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eThreads = useAppStore((state) => state.e2eThreads);
  const result = useQuery(
    api.agent.public.getThreadMessages.getThreadMessages,
    isAuthenticated && !e2eQaMode && threadId
      ? {
          threadId,
          paginationOpts: {
            numItems: 50,
            cursor: null,
          },
        }
      : "skip",
  );

  return useMemo(() => {
    if (e2eQaMode) {
      const thread = e2eThreads.find((item) => item._id === threadId);
      const messages = [...(thread?.messages ?? [])].sort((left, right) => left.createdAt - right.createdAt);

      if (pendingPrompt) {
        const scenario = resolveE2EPromptScenario(pendingPrompt);
        messages.push({
          id: "pending-assistant",
          sessionId: threadId ?? "threadless",
          role: "assistant",
          kind: scenario.kind ?? "property_bundle",
          text: "Zane-ai is searching your catalog and checking live market context.",
          streamState: "streaming",
          relatedPropertyIds: [],
          createdAt: Date.now(),
          runId: undefined,
          sourceMetadata: scenario.sources,
        });
      }

      return messages;
    }

    const page = result?.page ?? [];
    const messages: ConversationMessage[] = page.map((message: any) => ({
      id: message._id,
      sessionId: threadId ?? "threadless",
      role: message.message.role === "assistant" ? "assistant" : "user",
      kind: "text",
      text: getMessageText(message),
      streamState: "complete",
      relatedPropertyIds: [],
      createdAt: message._creationTime,
      runId: undefined,
      sourceMetadata: [],
    }));
    messages.sort((left, right) => left.createdAt - right.createdAt);

    if (pendingPrompt) {
      messages.push({
        id: "pending-assistant",
        sessionId: threadId ?? "threadless",
        role: "assistant",
        kind: "property_bundle",
        text: "Zane-ai is searching your catalog and checking live market context.",
        streamState: "streaming",
        relatedPropertyIds: [],
        createdAt: Date.now(),
        runId: undefined,
        sourceMetadata: [],
      });
    }

    return messages;
  }, [e2eQaMode, e2eThreads, pendingPrompt, result?.page, threadId]);
}

export function useRecommendationBatches(threadId: string | null) {
  const { isAuthenticated } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eThreads = useAppStore((state) => state.e2eThreads);
  const rows = useQuery(
    api.agent.public.listRecommendationsForThread.listRecommendationsForThread,
    isAuthenticated && !e2eQaMode && threadId ? { threadId } : "skip",
  );

  return useMemo(
    () => {
      if (e2eQaMode) {
        const thread = e2eThreads.find((item) => item._id === threadId);
        return thread?.recommendationBatches ?? [];
      }

      return (rows ?? []).map((row) => ({
        ...row,
        properties: row.properties.map(toPropertyCardVM),
      }));
    },
    [e2eQaMode, e2eThreads, rows, threadId],
  );
}
