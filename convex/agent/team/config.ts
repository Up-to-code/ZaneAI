import { getAnalysisAgentConfig } from "../agents/analysis/config";
import { getPreferenceAgentConfig } from "../agents/preference/config";
import { getRankingAgentConfig } from "../agents/ranking/config";
import { getSearchAgentConfig } from "../agents/search/config";
import { getSummaryAgentConfig } from "../agents/summary/config";

export function getZaneAiTeamConfig() {
  return {
    name: "zane-ai-buyer-team",
    agents: [
      getSearchAgentConfig(),
      getAnalysisAgentConfig(),
      getRankingAgentConfig(),
      getPreferenceAgentConfig(),
      getSummaryAgentConfig(),
    ],
    memoryPolicy: "Thread history is isolated; only promoted profile facts cross threads.",
    orchestrationRules: [
      "Search and preference work start from the active turn only.",
      "Analysis evaluates the shortlist before ranking merges the final order.",
      "Summary is the only agent allowed to shape the buyer-facing UI turn.",
      "No agent may assume prior-thread conversational memory.",
    ],
  };
}
