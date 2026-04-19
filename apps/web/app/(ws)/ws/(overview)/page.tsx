import OperationalDashboard from "./_components/OperationalDashboard";
import {
  demoPrimaryOrganization,
  demoProjects,
  demoWorkspaceBehavior,
} from "../_lib/demoData";

export default function WorkspacePage() {
  const workspaceState = {
    audience: demoWorkspaceBehavior.audience,
    organization: demoPrimaryOrganization,
    metrics: {
      propertyCount: demoProjects.length,
      publishedPropertyCount: demoProjects.filter((project) => project.publicationState === "published").length,
      draftPropertyCount: demoProjects.filter((project) => project.publicationState === "draft").length,
    },
  };

  return <OperationalDashboard workspaceState={workspaceState} />;
}
