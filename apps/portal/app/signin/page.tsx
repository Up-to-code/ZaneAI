import { redirect } from "next/navigation";
import { buildWorkspaceAppUrl } from "@/lib/workspaceApp";

/**
 * WHY:   Portal CTAs still point to `/signin`, but authentication lives in the workspace app.
 * WHAT:  Redirects portal visitors to the workspace sign-in entrypoint.
 * HOW:   Uses the configured web origin when available and falls back to the shared relative route in local dev.
 */
export default function PortalSigninPage() {
  redirect(buildWorkspaceAppUrl("/signin"));
}
