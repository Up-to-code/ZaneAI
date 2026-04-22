"use node";

type CortexMemoryStatus = "disabled" | "skipped" | "stored" | "searched" | "failed";

export type CortexMemoryHit = {
  content: string;
  score?: number;
  metadataJson?: string;
};

type CortexMemoryResult = {
  status: CortexMemoryStatus;
  reason?: string;
  memories: CortexMemoryHit[];
};

type CortexRememberInput = {
  authUserId: string;
  threadId: string;
  prompt: string;
  assistantText: string;
  route?: string;
};

type CortexSearchInput = {
  authUserId: string;
  threadId: string;
  prompt: string;
  recentPrompt?: string;
  limit?: number;
};

function isCortexEnabled() {
  return process.env.CORTEX_MEMORY_ENABLED === "1";
}

function getCortexConvexUrl() {
  return process.env.CORTEX_CONVEX_URL ?? process.env.CONVEX_URL ?? null;
}

function buildMemorySpaceId(authUserId: string) {
  return `zaneai:user:${authUserId}`;
}

function compactLine(value: string | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function buildSearchQuery(prompt: string, recentPrompt?: string) {
  const current = compactLine(prompt);
  const recent = compactLine(recentPrompt);
  if (!recent || current.toLowerCase().includes(recent.toLowerCase())) {
    return current;
  }
  return `${recent}\n${current}`;
}

async function createCortex() {
  const convexUrl = getCortexConvexUrl();
  if (!convexUrl) {
    return null;
  }

  const dynamicImport = new Function("specifier", "return import(specifier)") as (
    specifier: string,
  ) => Promise<typeof import("@cortexmemory/sdk")>;
  const { Cortex } = await dynamicImport("@cortexmemory/sdk");
  return new Cortex({ convexUrl });
}

function normalizeCortexError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function rememberCortexTurn(input: CortexRememberInput): Promise<CortexMemoryResult> {
  if (!isCortexEnabled()) {
    return { status: "disabled", reason: "cortex_memory_disabled", memories: [] };
  }

  const cortex = await createCortex();
  if (!cortex) {
    return { status: "skipped", reason: "missing_cortex_convex_url", memories: [] };
  }

  try {
    const result = await cortex.memory.remember({
      memorySpaceId: buildMemorySpaceId(input.authUserId),
      conversationId: input.threadId,
      userId: input.authUserId,
      userName: "ZaneAI user",
      agentId: "zaneai",
      participantId: "zaneai-orchestrator",
      userMessage: input.prompt,
      agentResponse: input.assistantText,
      skipLayers: ["facts", "graph"],
      importance: 60,
      tags: ["zaneai", "conversation", input.route ?? "unknown"],
    }, {
      extractFacts: false,
      beliefRevision: false,
    });

    return {
      status: "stored",
      memories: result.memories.map((memory) => ({
        content: memory.content,
        metadataJson: JSON.stringify({
          memoryId: memory.memoryId,
          conversationId: memory.conversationRef?.conversationId,
          messageIds: memory.conversationRef?.messageIds ?? [],
          tags: memory.tags,
        }),
      })),
    };
  } catch (error) {
    return { status: "failed", reason: normalizeCortexError(error), memories: [] };
  }
}

export async function searchCortexMemory(input: CortexSearchInput): Promise<CortexMemoryResult> {
  if (!isCortexEnabled()) {
    return { status: "disabled", reason: "cortex_memory_disabled", memories: [] };
  }

  const query = buildSearchQuery(input.prompt, input.recentPrompt);
  if (!query) {
    return { status: "skipped", reason: "empty_query", memories: [] };
  }

  const cortex = await createCortex();
  if (!cortex) {
    return { status: "skipped", reason: "missing_cortex_convex_url", memories: [] };
  }

  try {
    const results = await cortex.memory.search(buildMemorySpaceId(input.authUserId), query, {
      enrichConversation: true,
      userId: input.authUserId,
      limit: Math.min(input.limit ?? 4, 8),
    });

    return {
      status: "searched",
      memories: results.map((result) => {
        const enriched = result as {
          score?: number;
          memory?: { content?: string; memoryId?: string; conversationRef?: { conversationId?: string; messageIds?: string[] } };
          sourceMessages?: Array<{ role?: string; content?: string }>;
          content?: string;
          memoryId?: string;
          conversationRef?: { conversationId?: string; messageIds?: string[] };
        };
        const memory = enriched.memory ?? enriched;
        const sourceMessages = enriched.sourceMessages ?? [];
        const sourceText = sourceMessages
          .map((message) => `${message.role ?? "unknown"}: ${message.content ?? ""}`)
          .join("\n")
          .trim();
        const content = compactLine(sourceText || memory.content);
        return {
          content,
          ...(typeof enriched.score === "number" ? { score: enriched.score } : {}),
          metadataJson: JSON.stringify({
            memoryId: memory.memoryId,
            conversationId: memory.conversationRef?.conversationId,
            messageIds: memory.conversationRef?.messageIds ?? [],
          }),
        };
      }).filter((memory) => memory.content.length > 0),
    };
  } catch (error) {
    return { status: "failed", reason: normalizeCortexError(error), memories: [] };
  }
}
