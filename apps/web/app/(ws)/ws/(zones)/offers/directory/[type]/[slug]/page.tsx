import { requireWorkspaceData } from "../../../../../_lib/workspaceData";
import { getDemoOrganizationProfile } from "../../../../../_lib/demoData";
import { notFound } from "next/navigation";
import OrganizationProfileUI from "./OrganizationProfileUI";

/**
 * WHY:   Partner directory routes should remain useful after removing the live organizations service.
 * WHAT:  Renders a deterministic organization profile using local demo data.
 * HOW:   Keeps the original route structure and UI component while swapping the data source.
 */
export default async function OrganizationProfilePageRoute({
  params,
}: {
  params: Promise<{ type: "broker" | "developer"; slug: string }>;
}) {
  const { type, slug } = await params;
  await requireWorkspaceData(`/ws/offers/directory/${type}/${slug}`);

  const profile = getDemoOrganizationProfile(type, slug);
  if (!profile) notFound();

  return <OrganizationProfileUI profile={profile} type={type} />;
}
