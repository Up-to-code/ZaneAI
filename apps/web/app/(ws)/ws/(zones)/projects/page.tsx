import ProjectsPage from "./pages/ProjectsPage";
import { demoProjects } from "../../_lib/demoData";

/**
 * WHY:   The projects root route should remain visually rich after removing the live property backend.
 * WHAT:  Renders the existing projects workspace with deterministic project fixtures.
 * HOW:   Supplies the same view-model shape as before, but sourced locally from demo data.
 */
export default function WorkspaceProjectsRoute() {
  return (
    <ProjectsPage
      projects={demoProjects}
    />
  );
}
