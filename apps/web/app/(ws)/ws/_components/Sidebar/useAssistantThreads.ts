"use client";

import { useMemo } from "react";
import type { ZaneAiProThreadSummary } from "@/server/contracts/zaneAiPro";

type UseAssistantThreadsArgs = {
  serverThreads: ZaneAiProThreadSummary[];
  limit: number;
};

export function useAssistantThreads({ serverThreads, limit }: UseAssistantThreadsArgs) {
  const threads = useMemo<ZaneAiProThreadSummary[]>(
    () =>
      serverThreads.slice(0, limit).map((thread) => ({
        id: String("_id" in thread ? thread._id : thread.id),
        title: ("title" in thread ? thread.title : null) ?? null,
        updatedAt: thread.updatedAt,
      })),
    [limit, serverThreads],
  );

  return { threads };
}
