import { buildAgentConfig } from "../../lib/buildAgentConfig";
import { decisionPrompt } from "./prompt";
import { decisionSchema } from "./schema";
import { decisionTools } from "./tools";

export function getDecisionAgentConfig() {
  return buildAgentConfig({
    role: "decision",
    name: "decision-agent",
    systemPrompt: decisionPrompt,
    outputSchema: decisionSchema,
    tools: decisionTools,
  });
}
