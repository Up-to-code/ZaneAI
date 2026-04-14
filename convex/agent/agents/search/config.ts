import { buildAgentConfig } from "../../lib/buildAgentConfig";
import { searchPrompt } from "./prompt";
import { searchSchema } from "./schema";
import { searchTools } from "./tools";

export function getSearchAgentConfig() {
  return buildAgentConfig({
    role: "search",
    name: "search-agent",
    systemPrompt: searchPrompt,
    outputSchema: searchSchema,
    tools: searchTools,
  });
}
