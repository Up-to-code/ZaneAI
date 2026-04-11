/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentRuns from "../agentRuns.js";
import type * as ai from "../ai.js";
import type * as aiNode from "../aiNode.js";
import type * as analytics from "../analytics.js";
import type * as chat from "../chat.js";
import type * as home from "../home.js";
import type * as lib_fixtures from "../lib/fixtures.js";
import type * as lib_summary from "../lib/summary.js";
import type * as preferences from "../preferences.js";
import type * as properties from "../properties.js";
import type * as saved from "../saved.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentRuns: typeof agentRuns;
  ai: typeof ai;
  aiNode: typeof aiNode;
  analytics: typeof analytics;
  chat: typeof chat;
  home: typeof home;
  "lib/fixtures": typeof lib_fixtures;
  "lib/summary": typeof lib_summary;
  preferences: typeof preferences;
  properties: typeof properties;
  saved: typeof saved;
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

export declare const components: {};
