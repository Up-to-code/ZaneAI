import { CACHE_KINDS } from "../../shared/types";

export function assertCacheKind(kind: string) {
  if (!CACHE_KINDS.includes(kind as (typeof CACHE_KINDS)[number])) {
    throw new Error(`Unsupported cache kind: ${kind}`);
  }
}

export function makeCacheScopeKey(authUserId: string, scope = "personal") {
  return `${scope}:${authUserId}`;
}
