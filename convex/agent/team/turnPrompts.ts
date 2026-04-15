export function buildSearchTask(prompt: string) {
  return [
    "User goal:",
    prompt,
    "",
    "Use tools to inspect the current thread, profile memory, database properties, and web context when useful.",
    "Return the best candidate property ids, market notes, and citations.",
  ].join("\n");
}

export function buildPreferenceTask(prompt: string) {
  return [
    "Review this active-turn request for durable personal memory updates:",
    prompt,
    "",
    "Check profile memory first, then promote or update only if the fact should matter in future threads.",
  ].join("\n");
}

export function buildAnalysisTask(prompt: string, searchOutput: string) {
  return [
    "User goal:",
    prompt,
    "",
    "Search findings:",
    searchOutput,
    "",
    "Evaluate the shortlist for buyer fit, pricing posture, and risk notes.",
    "Return structured analysis only.",
  ].join("\n");
}

export function buildRankingTask(
  prompt: string,
  searchOutput: string,
  analysisOutput: string,
  preferenceOutput: string,
) {
  return [
    "User goal:",
    prompt,
    "",
    "Search findings:",
    searchOutput,
    "",
    "Analysis findings:",
    analysisOutput,
    "",
    "Preference findings:",
    preferenceOutput,
    "",
    "Return the final ranked shortlist, comparison points, and ranking rationale.",
  ].join("\n");
}

export function buildSummaryTask(
  prompt: string,
  searchOutput: string,
  analysisOutput: string,
  rankingOutput: string,
  preferenceOutput: string,
) {
  return [
    "User goal:",
    prompt,
    "",
    "Search findings:",
    searchOutput,
    "",
    "Analysis findings:",
    analysisOutput,
    "",
    "Ranking findings:",
    rankingOutput,
    "",
    "Preference findings:",
    preferenceOutput,
    "",
    "Return a complete buyer assistant turn JSON for mobile with cards, actions, and assistant text.",
  ].join("\n");
}
