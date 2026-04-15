"use client";

/**
 * WHY:   Workspace top-bar badges still need deterministic counts in demo mode.
 * WHAT:  Returns the static counts provided by the server-rendered shell.
 * HOW:   Keeps the original hook interface so callers do not care whether the
 *        app is live-backed or fixture-backed.
 */
export function useWorkspaceSignalCounts(initialCounts: {
  notificationCount: number;
  inboxCount: number;
}) {
  return initialCounts;
}
