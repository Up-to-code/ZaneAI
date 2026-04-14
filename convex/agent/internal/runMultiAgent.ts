"use node";

import type { AgentRunResult } from "@jackchen_me/open-multi-agent";
import { AgentPool } from "@jackchen_me/open-multi-agent";

import type { TeamTurnResult, ToolRuntime, WebSource } from "../lib/runtimeTypes";
import { decisionSchema } from "../agents/decision/schema";
import { createAgent } from "../lib/tools/createAgent";
import { buildDecisionTools, buildMemoryTools, buildSearchTools } from "../lib/tools";
import { getDecisionAgentConfig } from "../agents/decision/config";
import { getMemoryAgentConfig } from "../agents/memory/config";
import { memorySchema } from "../agents/memory/schema";
import { getSearchAgentConfig } from "../agents/search/config";
import { searchSchema } from "../agents/search/schema";
import { getZaneAiTeamConfig } from "../team/config";
import { requireStructured, tokenUnits } from "../team/structured";
import { buildDecisionTask, buildMemoryTask, buildSearchTask } from "../team/turnPrompts";

type SearchOutput = import("../lib/runtimeTypes").StructuredResult<typeof searchSchema>;
type DecisionOutput = import("../lib/runtimeTypes").StructuredResult<typeof decisionSchema>;
type MemoryOutput = import("../lib/runtimeTypes").StructuredResult<typeof memorySchema>;

const PARALLEL_AGENT_LIMIT = 2;

export async function runMultiAgent(runtime: ToolRuntime, prompt: string): Promise<TeamTurnResult> {
  const { team, search, decision, memory, pool } = createTeamAgents(runtime);

  try {
    const { searchResult, searchOutput, memoryResult, memoryOutput } = await runSupportAgents({
      pool,
      search,
      memory,
      prompt,
    });

    const decisionResult = await decision.run(
      buildDecisionTask(prompt, buildDecisionSearchContext(searchResult, searchOutput)),
    );
    const finalOutput = requireStructured<DecisionOutput>(decisionResult, decision.name);

    return {
      summary: finalOutput.summary,
      rankingRationale: finalOutput.rankingRationale,
      propertyIds: finalOutput.propertyIds,
      sources: dedupeSources([...searchOutput.sources, ...finalOutput.sources]),
      diagnostics: buildDiagnostics(team.name, memoryOutput, searchOutput),
      tokenUnits: tokenUnits(searchResult, memoryResult, decisionResult),
    };
  } finally {
    await pool.shutdown();
    decision.reset();
  }
}

function createTeamAgents(runtime: ToolRuntime) {
  const team = getZaneAiTeamConfig();
  const search = createAgent(getSearchAgentConfig(), buildSearchTools(runtime));
  const decision = createAgent(getDecisionAgentConfig(), buildDecisionTools(runtime));
  const memory = createAgent(getMemoryAgentConfig(), buildMemoryTools(runtime));
  const pool = new AgentPool(PARALLEL_AGENT_LIMIT);

  pool.add(search);
  pool.add(memory);

  return { team, search, decision, memory, pool };
}

async function runSupportAgents({
  pool,
  search,
  memory,
  prompt,
}: {
  pool: AgentPool;
  search: ReturnType<typeof createAgent>;
  memory: ReturnType<typeof createAgent>;
  prompt: string;
}) {
  const parallelResults = await pool.runParallel([
    { agent: search.name, prompt: buildSearchTask(prompt) },
    { agent: memory.name, prompt: buildMemoryTask(prompt) },
  ]);

  const searchResult = getRequiredResult(parallelResults.get(search.name), search.name);
  const memoryResult = getRequiredResult(parallelResults.get(memory.name), memory.name);

  return {
    searchResult,
    searchOutput: requireStructured<SearchOutput>(searchResult, search.name),
    memoryResult,
    memoryOutput: requireStructured<MemoryOutput>(memoryResult, memory.name),
  };
}

function getRequiredResult(result: AgentRunResult | undefined, agentName: string) {
  if (!result) {
    throw new Error(`${agentName} did not return a result.`);
  }

  return result;
}

function buildDecisionSearchContext(searchResult: AgentRunResult, searchOutput: SearchOutput) {
  // Prefer the search agent's free-form output because it can include ranking nuance
  // and tool context that we intentionally do not force into the strict schema.
  if (searchResult.output) {
    return searchResult.output;
  }

  return [
    `Summary: ${searchOutput.summary}`,
    `Candidate property ids: ${joinOrNone(searchOutput.propertyIds)}`,
    `Market notes: ${joinOrNone(searchOutput.marketNotes)}`,
    `Suggested follow-ups: ${joinOrNone(searchOutput.followups)}`,
  ].join("\n");
}

function buildDiagnostics(teamName: string, memoryOutput: MemoryOutput, searchOutput: SearchOutput) {
  // Memory work is usually side-effect driven through tools, so diagnostics track what was
  // actually promoted while the final user answer stays grounded in the decision agent output.
  return [
    `team:${teamName}`,
    `memory:${memoryOutput.savedKeys.length}`,
    `market:${searchOutput.marketNotes.length}`,
  ];
}

function joinOrNone(values: string[]) {
  return values.length > 0 ? values.join(", ") : "none";
}

function dedupeSources(sources: WebSource[]): WebSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}
