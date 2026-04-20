"use client";

import { use } from "react";
import UnitDetailPage from "../../../pages/UnitDetailPage";

/**
 * WHY:   The unit detail route allows property managers to deep-dive into specific assets.
 * WHAT:  Next.js Page component for /ws/projects/[projectId]/units/[unitId].
 * HOW:   Bridging the dynamic route params to the high-precision UnitDetailPage component.
 */
export default function WorkspaceUnitDetailRoute({
  params,
}: {
  params: Promise<{ projectId: string; unitId: string }>;
}) {
  const { projectId, unitId } = use(params);

  // In a real scenario, we'd fetch the unit data here.
  // For this UI phase, the UnitDetailPage will handle local unit finding or mock state.
  return <UnitDetailPage projectId={projectId} unitId={unitId} />;
}
