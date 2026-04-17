import { convexOrganizationsRepository } from "@/server/infrastructure/convex/organizations";
import type { OrganizationsRepository } from "@/server/infrastructure/convex/organizations";

/**
 * WHY:   The web app is now fully Convex-backed for organization state.
 * WHAT:  Preserve the Clerk repository import surface while delegating to the Convex implementation.
 * HOW:   Avoids a hard runtime dependency on `@clerk/nextjs` during builds and deployments.
 */
export const clerkOrganizationsRepository: OrganizationsRepository = convexOrganizationsRepository;
