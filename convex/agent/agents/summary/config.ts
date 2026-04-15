import { buildAgentConfig } from "../../lib/buildAgentConfig";
import { summaryPrompt } from "./prompt";
import { summarySchema } from "./schema";
import { summaryTools } from "./tools";

export function getSummaryAgentConfig() {
  return buildAgentConfig({
    role: "summary",
    name: "summary-agent",
    systemPrompt: summaryPrompt,
    outputSchema: summarySchema,
    tools: summaryTools,
  });
}
