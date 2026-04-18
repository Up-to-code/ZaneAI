import { redirect } from "next/navigation";
import PortalNavbar from "../../components/PortalNavbar";
import PortalFooter from "../../components/PortalFooter";
import { getAuthenticatedSession } from "@/lib/serverSession";

/**
 * WHY:   The portal public zone renders marketing and legal content.
 * WHAT:  Wraps public routes with branding and handles automatic redirect to /ws.
 * HOW:   Uses a server-side session check to ensure authenticated persistence skips landing pages.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthenticatedSession();

  // If the user is authenticated, skip the landing/public pages and go to workspace
  if (session.token) {
    redirect("/ws");
  }

  return (
    <>
      <PortalNavbar />
      {children}
      <PortalFooter />
    </>
  );
}
