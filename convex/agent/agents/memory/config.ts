import { buildAgentConfig } from "../../lib/buildAgentConfig";
import { memoryPrompt } from "./prompt";
import { memorySchema } from "./schema";
import { memoryTools } from "./tools";

export function getMemoryAgentConfig() {
  return buildAgentConfig({
    role: "memory",
    name: "memory-agent",
    systemPrompt: memoryPrompt,
    outputSchema: memorySchema,
    tools: memoryTools,
  });
}
