import { MINUTE, HOUR, RateLimiter } from "@convex-dev/rate-limiter";

import { components } from "../_generated/api";

export const rateLimiter = new RateLimiter((components as any).rateLimiter, {
  sendMessage: { kind: "token bucket", rate: 12, period: MINUTE, capacity: 4 },
  messageTokens: { kind: "token bucket", rate: 30000, period: HOUR, shards: 10 },
  globalTokens: { kind: "token bucket", rate: 250000, period: HOUR, shards: 10 },
});
