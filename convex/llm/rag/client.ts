import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";

import { components } from "../../_generated/api";
import { getEmbeddingModel } from "../../shared/env";

export const rag = new RAG((components as any).rag, {
  textEmbeddingModel: openai.embedding(getEmbeddingModel()),
  embeddingDimension: 1536,
});
