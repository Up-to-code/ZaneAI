/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agent_agents_analysis_config from "../agent/agents/analysis/config.js";
import type * as agent_agents_analysis_prompt from "../agent/agents/analysis/prompt.js";
import type * as agent_agents_analysis_tools from "../agent/agents/analysis/tools.js";
import type * as agent_agents_decision_config from "../agent/agents/decision/config.js";
import type * as agent_agents_decision_prompt from "../agent/agents/decision/prompt.js";
import type * as agent_agents_decision_tools from "../agent/agents/decision/tools.js";
import type * as agent_agents_memory_config from "../agent/agents/memory/config.js";
import type * as agent_agents_memory_prompt from "../agent/agents/memory/prompt.js";
import type * as agent_agents_memory_tools from "../agent/agents/memory/tools.js";
import type * as agent_agents_preference_config from "../agent/agents/preference/config.js";
import type * as agent_agents_preference_prompt from "../agent/agents/preference/prompt.js";
import type * as agent_agents_preference_tools from "../agent/agents/preference/tools.js";
import type * as agent_agents_ranking_config from "../agent/agents/ranking/config.js";
import type * as agent_agents_ranking_prompt from "../agent/agents/ranking/prompt.js";
import type * as agent_agents_ranking_tools from "../agent/agents/ranking/tools.js";
import type * as agent_agents_search_config from "../agent/agents/search/config.js";
import type * as agent_agents_search_prompt from "../agent/agents/search/prompt.js";
import type * as agent_agents_search_tools from "../agent/agents/search/tools.js";
import type * as agent_agents_summary_config from "../agent/agents/summary/config.js";
import type * as agent_agents_summary_prompt from "../agent/agents/summary/prompt.js";
import type * as agent_agents_summary_tools from "../agent/agents/summary/tools.js";
import type * as agent_internal_assistantTurns from "../agent/internal/assistantTurns.js";
import type * as agent_internal_debug from "../agent/internal/debug.js";
import type * as agent_internal_events from "../agent/internal/events.js";
import type * as agent_internal_orchestrate from "../agent/internal/orchestrate.js";
import type * as agent_internal_recommendations from "../agent/internal/recommendations.js";
import type * as agent_internal_runMultiAgent from "../agent/internal/runMultiAgent.js";
import type * as agent_internal_runs from "../agent/internal/runs.js";
import type * as agent_internal_usage from "../agent/internal/usage.js";
import type * as agent_lib_buildAgentConfig from "../agent/lib/buildAgentConfig.js";
import type * as agent_lib_component from "../agent/lib/component.js";
import type * as agent_lib_runtimeTypes from "../agent/lib/runtimeTypes.js";
import type * as agent_lib_threadAccess from "../agent/lib/threadAccess.js";
import type * as agent_lib_tools_audit from "../agent/lib/tools/audit.js";
import type * as agent_lib_tools_createAgent from "../agent/lib/tools/createAgent.js";
import type * as agent_lib_tools_getThreadContext from "../agent/lib/tools/getThreadContext.js";
import type * as agent_lib_tools_index from "../agent/lib/tools/index.js";
import type * as agent_lib_tools_listSavedProperties from "../agent/lib/tools/listSavedProperties.js";
import type * as agent_lib_tools_promoteProfileFact from "../agent/lib/tools/promoteProfileFact.js";
import type * as agent_lib_tools_result from "../agent/lib/tools/result.js";
import type * as agent_lib_tools_searchProfileMemory from "../agent/lib/tools/searchProfileMemory.js";
import type * as agent_lib_tools_searchProperties from "../agent/lib/tools/searchProperties.js";
import type * as agent_lib_tools_searchWeb from "../agent/lib/tools/searchWeb.js";
import type * as agent_lib_tools_updateProfileFact from "../agent/lib/tools/updateProfileFact.js";
import type * as agent_public_getRunStageFeed from "../agent/public/getRunStageFeed.js";
import type * as agent_public_getRunStatus from "../agent/public/getRunStatus.js";
import type * as agent_public_getRuntimeHealth from "../agent/public/getRuntimeHealth.js";
import type * as agent_public_getThreadMessages from "../agent/public/getThreadMessages.js";
import type * as agent_public_listRecommendationsForThread from "../agent/public/listRecommendationsForThread.js";
import type * as agent_public_listThreads from "../agent/public/listThreads.js";
import type * as agent_public_sendUserMessage from "../agent/public/sendUserMessage.js";
import type * as agent_public_startThread from "../agent/public/startThread.js";
import type * as agent_public_stopRun from "../agent/public/stopRun.js";
import type * as agent_team_config from "../agent/team/config.js";
import type * as agent_team_structured from "../agent/team/structured.js";
import type * as agent_team_turnPrompts from "../agent/team/turnPrompts.js";
import type * as analytics_public_trackEvent from "../analytics/public/trackEvent.js";
import type * as auth_client from "../auth/client.js";
import type * as auth_createAuth from "../auth/createAuth.js";
import type * as auth_createAuthOptions from "../auth/createAuthOptions.js";
import type * as auth_internal_anonymousLink from "../auth/internal/anonymousLink.js";
import type * as auth_profile from "../auth/profile.js";
import type * as auth_requireAuth from "../auth/requireAuth.js";
import type * as http from "../http.js";
import type * as llm_cache_client from "../llm/cache/client.js";
import type * as llm_cache_hash from "../llm/cache/hash.js";
import type * as llm_cache_internal from "../llm/cache/internal.js";
import type * as llm_internal_facts from "../llm/internal/facts.js";
import type * as llm_lib_factText from "../llm/lib/factText.js";
import type * as llm_lib_upsertFact from "../llm/lib/upsertFact.js";
import type * as llm_public_listProfileFacts from "../llm/public/listProfileFacts.js";
import type * as llm_public_promoteProfileFact from "../llm/public/promoteProfileFact.js";
import type * as llm_public_updateProfileFact from "../llm/public/updateProfileFact.js";
import type * as llm_rag_client from "../llm/rag/client.js";
import type * as llm_rag_sync from "../llm/rag/sync.js";
import type * as llm_rateLimiter from "../llm/rateLimiter.js";
import type * as partnerProperties from "../partnerProperties.js";
import type * as partnerWorkspace from "../partnerWorkspace.js";
import type * as partnerWorkspace_lib from "../partnerWorkspace/lib.js";
import type * as property_internal_listCandidateProperties from "../property/internal/listCandidateProperties.js";
import type * as property_internal_listSavedProperties from "../property/internal/listSavedProperties.js";
import type * as property_internal_searchProperties from "../property/internal/searchProperties.js";
import type * as property_lib_catalog from "../property/lib/catalog.js";
import type * as property_lib_search from "../property/lib/search.js";
import type * as property_public_getById from "../property/public/getById.js";
import type * as property_public_listByIds from "../property/public/listByIds.js";
import type * as property_public_listCandidateProperties from "../property/public/listCandidateProperties.js";
import type * as property_public_listSavedProperties from "../property/public/listSavedProperties.js";
import type * as property_public_searchProperties from "../property/public/searchProperties.js";
import type * as property_public_toggleSavedProperty from "../property/public/toggleSavedProperty.js";
import type * as schema_agent from "../schema/agent.js";
import type * as schema_index from "../schema/index.js";
import type * as schema_knowledge from "../schema/knowledge.js";
import type * as schema_organizations from "../schema/organizations.js";
import type * as schema_profile from "../schema/profile.js";
import type * as schema_properties from "../schema/properties.js";
import type * as schema_usage from "../schema/usage.js";
import type * as schema_workspaceProperties from "../schema/workspaceProperties.js";
import type * as schema_workspaceUnits from "../schema/workspaceUnits.js";
import type * as shared_demoProperties from "../shared/demoProperties.js";
import type * as shared_env from "../shared/env.js";
import type * as shared_namespaces from "../shared/namespaces.js";
import type * as shared_types from "../shared/types.js";
import type * as workspaceUnits from "../workspaceUnits.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agent/agents/analysis/config": typeof agent_agents_analysis_config;
  "agent/agents/analysis/prompt": typeof agent_agents_analysis_prompt;
  "agent/agents/analysis/tools": typeof agent_agents_analysis_tools;
  "agent/agents/decision/config": typeof agent_agents_decision_config;
  "agent/agents/decision/prompt": typeof agent_agents_decision_prompt;
  "agent/agents/decision/tools": typeof agent_agents_decision_tools;
  "agent/agents/memory/config": typeof agent_agents_memory_config;
  "agent/agents/memory/prompt": typeof agent_agents_memory_prompt;
  "agent/agents/memory/tools": typeof agent_agents_memory_tools;
  "agent/agents/preference/config": typeof agent_agents_preference_config;
  "agent/agents/preference/prompt": typeof agent_agents_preference_prompt;
  "agent/agents/preference/tools": typeof agent_agents_preference_tools;
  "agent/agents/ranking/config": typeof agent_agents_ranking_config;
  "agent/agents/ranking/prompt": typeof agent_agents_ranking_prompt;
  "agent/agents/ranking/tools": typeof agent_agents_ranking_tools;
  "agent/agents/search/config": typeof agent_agents_search_config;
  "agent/agents/search/prompt": typeof agent_agents_search_prompt;
  "agent/agents/search/tools": typeof agent_agents_search_tools;
  "agent/agents/summary/config": typeof agent_agents_summary_config;
  "agent/agents/summary/prompt": typeof agent_agents_summary_prompt;
  "agent/agents/summary/tools": typeof agent_agents_summary_tools;
  "agent/internal/assistantTurns": typeof agent_internal_assistantTurns;
  "agent/internal/debug": typeof agent_internal_debug;
  "agent/internal/events": typeof agent_internal_events;
  "agent/internal/orchestrate": typeof agent_internal_orchestrate;
  "agent/internal/recommendations": typeof agent_internal_recommendations;
  "agent/internal/runMultiAgent": typeof agent_internal_runMultiAgent;
  "agent/internal/runs": typeof agent_internal_runs;
  "agent/internal/usage": typeof agent_internal_usage;
  "agent/lib/buildAgentConfig": typeof agent_lib_buildAgentConfig;
  "agent/lib/component": typeof agent_lib_component;
  "agent/lib/runtimeTypes": typeof agent_lib_runtimeTypes;
  "agent/lib/threadAccess": typeof agent_lib_threadAccess;
  "agent/lib/tools/audit": typeof agent_lib_tools_audit;
  "agent/lib/tools/createAgent": typeof agent_lib_tools_createAgent;
  "agent/lib/tools/getThreadContext": typeof agent_lib_tools_getThreadContext;
  "agent/lib/tools/index": typeof agent_lib_tools_index;
  "agent/lib/tools/listSavedProperties": typeof agent_lib_tools_listSavedProperties;
  "agent/lib/tools/promoteProfileFact": typeof agent_lib_tools_promoteProfileFact;
  "agent/lib/tools/result": typeof agent_lib_tools_result;
  "agent/lib/tools/searchProfileMemory": typeof agent_lib_tools_searchProfileMemory;
  "agent/lib/tools/searchProperties": typeof agent_lib_tools_searchProperties;
  "agent/lib/tools/searchWeb": typeof agent_lib_tools_searchWeb;
  "agent/lib/tools/updateProfileFact": typeof agent_lib_tools_updateProfileFact;
  "agent/public/getRunStageFeed": typeof agent_public_getRunStageFeed;
  "agent/public/getRunStatus": typeof agent_public_getRunStatus;
  "agent/public/getRuntimeHealth": typeof agent_public_getRuntimeHealth;
  "agent/public/getThreadMessages": typeof agent_public_getThreadMessages;
  "agent/public/listRecommendationsForThread": typeof agent_public_listRecommendationsForThread;
  "agent/public/listThreads": typeof agent_public_listThreads;
  "agent/public/sendUserMessage": typeof agent_public_sendUserMessage;
  "agent/public/startThread": typeof agent_public_startThread;
  "agent/public/stopRun": typeof agent_public_stopRun;
  "agent/team/config": typeof agent_team_config;
  "agent/team/structured": typeof agent_team_structured;
  "agent/team/turnPrompts": typeof agent_team_turnPrompts;
  "analytics/public/trackEvent": typeof analytics_public_trackEvent;
  "auth/client": typeof auth_client;
  "auth/createAuth": typeof auth_createAuth;
  "auth/createAuthOptions": typeof auth_createAuthOptions;
  "auth/internal/anonymousLink": typeof auth_internal_anonymousLink;
  "auth/profile": typeof auth_profile;
  "auth/requireAuth": typeof auth_requireAuth;
  http: typeof http;
  "llm/cache/client": typeof llm_cache_client;
  "llm/cache/hash": typeof llm_cache_hash;
  "llm/cache/internal": typeof llm_cache_internal;
  "llm/internal/facts": typeof llm_internal_facts;
  "llm/lib/factText": typeof llm_lib_factText;
  "llm/lib/upsertFact": typeof llm_lib_upsertFact;
  "llm/public/listProfileFacts": typeof llm_public_listProfileFacts;
  "llm/public/promoteProfileFact": typeof llm_public_promoteProfileFact;
  "llm/public/updateProfileFact": typeof llm_public_updateProfileFact;
  "llm/rag/client": typeof llm_rag_client;
  "llm/rag/sync": typeof llm_rag_sync;
  "llm/rateLimiter": typeof llm_rateLimiter;
  partnerProperties: typeof partnerProperties;
  partnerWorkspace: typeof partnerWorkspace;
  "partnerWorkspace/lib": typeof partnerWorkspace_lib;
  "property/internal/listCandidateProperties": typeof property_internal_listCandidateProperties;
  "property/internal/listSavedProperties": typeof property_internal_listSavedProperties;
  "property/internal/searchProperties": typeof property_internal_searchProperties;
  "property/lib/catalog": typeof property_lib_catalog;
  "property/lib/search": typeof property_lib_search;
  "property/public/getById": typeof property_public_getById;
  "property/public/listByIds": typeof property_public_listByIds;
  "property/public/listCandidateProperties": typeof property_public_listCandidateProperties;
  "property/public/listSavedProperties": typeof property_public_listSavedProperties;
  "property/public/searchProperties": typeof property_public_searchProperties;
  "property/public/toggleSavedProperty": typeof property_public_toggleSavedProperty;
  "schema/agent": typeof schema_agent;
  "schema/index": typeof schema_index;
  "schema/knowledge": typeof schema_knowledge;
  "schema/organizations": typeof schema_organizations;
  "schema/profile": typeof schema_profile;
  "schema/properties": typeof schema_properties;
  "schema/usage": typeof schema_usage;
  "schema/workspaceProperties": typeof schema_workspaceProperties;
  "schema/workspaceUnits": typeof schema_workspaceUnits;
  "shared/demoProperties": typeof shared_demoProperties;
  "shared/env": typeof shared_env;
  "shared/namespaces": typeof shared_namespaces;
  "shared/types": typeof shared_types;
  workspaceUnits: typeof workspaceUnits;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
  rag: import("@convex-dev/rag/_generated/component.js").ComponentApi<"rag">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
};
