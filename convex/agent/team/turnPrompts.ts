export function buildSearchTask(prompt: string) {
  return [
    "User goal:",
    prompt,
    "",
    "Use tools to inspect the current thread, profile memory, database properties, and web context when useful.",
    "Return the best candidate property ids, market notes, and citations.",
  ].join("\n");
}

export function buildMemoryTask(prompt: string) {
  return [
    "Review this active-turn request for durable personal memory updates:",
    prompt,
    "",
    "Check profile memory first, then promote or update only if the fact should matter in future threads.",
  ].join("\n");
}

export function buildDecisionTask(prompt: string, searchOutput: string) {
  return [
    "User goal:",
    prompt,
    "",
    "Search findings:",
    searchOutput,
    "",
    "Use the active thread, saved properties, and profile memory tools if needed.",
    "Return the final recommendation, rationale, top property ids, and citations.",
  ].join("\n");
}
