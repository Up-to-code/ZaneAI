import { buildAgentConfig } from "../../lib/buildAgentConfig";
import { preferencePrompt } from "./prompt";
import { preferenceSchema } from "./schema";
import { preferenceTools } from "./tools";

export function getPreferenceAgentConfig() {
  return buildAgentConfig({
    role: "preference",
    name: "preference-agent",
    systemPrompt: preferencePrompt,
    outputSchema: preferenceSchema,
    tools: preferenceTools,
  });
}
