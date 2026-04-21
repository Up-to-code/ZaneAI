"use client";

import ProjectsPage from "./pages/ProjectsPage";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";

/**
 * WHY:   The projects root route should display the user's real project inventory.
 * WHAT:  Renders the projects workspace with live data from Convex.
 * HOW:   Queries partnerProperties.listWorkspaceProperties and passes results to the page component.
 */
export default function WorkspaceProjectsRoute() {
  const projects = useQuery(api.partnerProperties.listWorkspaceProperties);

  if (projects === undefined) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading projects…</div>
      </div>
    );
  }

  return (
    <ProjectsPage
      projects={projects ?? []}
    />
  );
}
