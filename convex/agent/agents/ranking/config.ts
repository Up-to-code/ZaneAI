import { buildAgentConfig } from "../../lib/buildAgentConfig";
import { rankingPrompt } from "./prompt";
import { rankingSchema } from "./schema";
import { rankingTools } from "./tools";

export function getRankingAgentConfig() {
  return buildAgentConfig({
    role: "ranking",
    name: "ranking-agent",
    systemPrompt: rankingPrompt,
    outputSchema: rankingSchema,
    tools: rankingTools,
  });
}
