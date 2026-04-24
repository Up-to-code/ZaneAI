import { redirect } from "next/navigation";
import { buildWorkspaceAppUrl } from "@/lib/workspaceApp";

/**
 * WHY:   Older portal flows and bookmarks still target `/ws` from the portal host.
 * WHAT:  Hands those requests off to the workspace app instead of leaving them on the marketing surface.
 * HOW:   Redirects to the configured web origin, with a relative fallback for local monorepo development.
 */
export default function PortalWorkspacePage() {
  redirect(buildWorkspaceAppUrl("/ws"));
}
