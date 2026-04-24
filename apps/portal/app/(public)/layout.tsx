import PortalNavbar from "../../components/PortalNavbar";
import PortalFooter from "../../components/PortalFooter";

/**
 * WHY:   The portal public zone renders marketing and legal content.
 * WHAT:  Wraps public routes with branding for every marketing and legal page.
 * HOW:   Keeps the portal reachable even when a workspace session already exists.
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
