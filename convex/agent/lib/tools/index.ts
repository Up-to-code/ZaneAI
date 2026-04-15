"use node";

import type { ToolRuntime } from "../runtimeTypes";
import { getThreadContextTool } from "./getThreadContext";
import { listSavedPropertiesTool } from "./listSavedProperties";
import { promoteProfileFactTool } from "./promoteProfileFact";
import { searchProfileMemoryTool } from "./searchProfileMemory";
import { searchPropertiesTool } from "./searchProperties";
import { searchWebTool } from "./searchWeb";
import { updateProfileFactTool } from "./updateProfileFact";

export function buildSearchTools(runtime: ToolRuntime) {
  return [searchPropertiesTool(runtime), searchProfileMemoryTool(runtime), searchWebTool(runtime), getThreadContextTool(runtime)];
}

export function buildAnalysisTools(runtime: ToolRuntime) {
  return [getThreadContextTool(runtime)];
}

export function buildRankingTools(runtime: ToolRuntime) {
  return [listSavedPropertiesTool(runtime), searchProfileMemoryTool(runtime), getThreadContextTool(runtime)];
}

export function buildPreferenceTools(runtime: ToolRuntime) {
  return [searchProfileMemoryTool(runtime), promoteProfileFactTool(runtime), updateProfileFactTool(runtime), getThreadContextTool(runtime)];
}

export function buildSummaryTools(runtime: ToolRuntime) {
  return [getThreadContextTool(runtime)];
}
