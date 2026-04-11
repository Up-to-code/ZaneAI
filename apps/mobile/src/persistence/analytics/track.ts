import type { AnalyticsEventName } from "@/types/domain";

export function track(eventName: AnalyticsEventName, payload: Record<string, unknown> = {}) {
  if (__DEV__) {
    // Keep analytics visible in dev until Convex persistence is connected.
    console.log(`[analytics] ${eventName}`, payload);
  }
}
