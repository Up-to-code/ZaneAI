import { buildAgentConfig } from "../../lib/buildAgentConfig";
import { analysisPrompt } from "./prompt";
import { analysisSchema } from "./schema";
import { analysisTools } from "./tools";

export function getAnalysisAgentConfig() {
  return buildAgentConfig({
    role: "analysis",
    name: "analysis-agent",
    systemPrompt: analysisPrompt,
    outputSchema: analysisSchema,
    tools: analysisTools,
  });
}
