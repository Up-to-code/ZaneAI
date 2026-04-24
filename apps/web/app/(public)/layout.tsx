import PortalNavbar from "../../components/PortalNavbar";
import PortalFooter from "../../components/PortalFooter";

/**
 * WHY:   Public routes must stay reachable even while browser auth is still hydrating.
 * WHAT:  Wraps marketing and onboarding pages with the shared public chrome.
 * HOW:   Leaves auth-aware redirects to client/session-aware surfaces instead of guessing from cookies.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalNavbar />
      {children}
      <PortalFooter />
    </>
  );
}
