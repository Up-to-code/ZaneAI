import { getDecisionAgentConfig } from "../agents/decision/config";
import { getMemoryAgentConfig } from "../agents/memory/config";
import { getSearchAgentConfig } from "../agents/search/config";

export function getZaneAiTeamConfig() {
  return {
    name: "zane-ai-real-work-team",
    agents: [getSearchAgentConfig(), getDecisionAgentConfig(), getMemoryAgentConfig()],
    memoryPolicy: "Thread history is isolated; only promoted profile facts cross threads.",
    orchestrationRules: [
      "Search and memory run from the active turn only.",
      "Decision synthesizes from search outputs plus explicit tools.",
      "No agent may assume prior-thread conversational memory.",
    ],
  };
}
