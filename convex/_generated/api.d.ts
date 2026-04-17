/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agent_internal_assistantTurns from "../agent/internal/assistantTurns.js";
import type * as agent_internal_debug from "../agent/internal/debug.js";
import type * as agent_internal_events from "../agent/internal/events.js";
import type * as agent_internal_runs from "../agent/internal/runs.js";
import type * as agent_internal_usage from "../agent/internal/usage.js";
import type * as agent_lib_component from "../agent/lib/component.js";
import type * as agent_lib_legacyAgentEvents from "../agent/lib/legacyAgentEvents.js";
import type * as agent_lib_legacyAssistantTurns from "../agent/lib/legacyAssistantTurns.js";
import type * as agent_lib_threadAccess from "../agent/lib/threadAccess.js";
import type * as agent_orchestrator_api from "../agent/orchestrator/api.js";
import type * as agent_orchestrator_registry from "../agent/orchestrator/registry.js";
import type * as agent_orchestrator_runtime from "../agent/orchestrator/runtime.js";
import type * as agent_orchestrator_worker from "../agent/orchestrator/worker.js";
import type * as agent_public_getRunStageFeed from "../agent/public/getRunStageFeed.js";
import type * as agent_public_getRunStatus from "../agent/public/getRunStatus.js";
import type * as agent_public_getRuntimeHealth from "../agent/public/getRuntimeHealth.js";
import type * as agent_public_getThreadMessages from "../agent/public/getThreadMessages.js";
import type * as agent_public_listThreads from "../agent/public/listThreads.js";
import type * as agent_public_sendUserMessage from "../agent/public/sendUserMessage.js";
import type * as agent_public_startThread from "../agent/public/startThread.js";
import type * as agent_public_stopRun from "../agent/public/stopRun.js";
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
import type * as migrations from "../migrations.js";
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
  "agent/internal/assistantTurns": typeof agent_internal_assistantTurns;
  "agent/internal/debug": typeof agent_internal_debug;
  "agent/internal/events": typeof agent_internal_events;
  "agent/internal/runs": typeof agent_internal_runs;
  "agent/internal/usage": typeof agent_internal_usage;
  "agent/lib/component": typeof agent_lib_component;
  "agent/lib/legacyAgentEvents": typeof agent_lib_legacyAgentEvents;
  "agent/lib/legacyAssistantTurns": typeof agent_lib_legacyAssistantTurns;
  "agent/lib/threadAccess": typeof agent_lib_threadAccess;
  "agent/orchestrator/api": typeof agent_orchestrator_api;
  "agent/orchestrator/registry": typeof agent_orchestrator_registry;
  "agent/orchestrator/runtime": typeof agent_orchestrator_runtime;
  "agent/orchestrator/worker": typeof agent_orchestrator_worker;
  "agent/public/getRunStageFeed": typeof agent_public_getRunStageFeed;
  "agent/public/getRunStatus": typeof agent_public_getRunStatus;
  "agent/public/getRuntimeHealth": typeof agent_public_getRuntimeHealth;
  "agent/public/getThreadMessages": typeof agent_public_getThreadMessages;
  "agent/public/listThreads": typeof agent_public_listThreads;
  "agent/public/sendUserMessage": typeof agent_public_sendUserMessage;
  "agent/public/startThread": typeof agent_public_startThread;
  "agent/public/stopRun": typeof agent_public_stopRun;
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
  migrations: typeof migrations;
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
  convexOrchestrator: import("@akshatgiri/convex-orchestrator/_generated/component.js").ComponentApi<"convexOrchestrator">;
  migrations: import("@convex-dev/migrations/_generated/component.js").ComponentApi<"migrations">;
  rag: import("@convex-dev/rag/_generated/component.js").ComponentApi<"rag">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
};
