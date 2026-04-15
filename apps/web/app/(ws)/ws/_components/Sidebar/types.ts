import type { SessionUser } from "@/lib/serverSession";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";
import type { ZaneAiProThreadSummary } from "@/server/contracts/zaneAiPro";
import type { WorkspaceOrganizationDisplay } from "../../_lib/organizationDisplay";

export type SidebarMode = "desktop" | "drawer";
export type SidebarVariant = "default" | "assistant";

export type SidebarUser = Pick<SessionUser, "name" | "email" | "image">;

export type SidebarProps = {
  user: SidebarUser;
  organization: WorkspaceOrganizationDisplay;
  visibleZoneKeys?: WorkspaceZoneKey[];
  recentAssistantThreads?: ZaneAiProThreadSummary[];
  allAssistantThreads?: ZaneAiProThreadSummary[];
  mode?: SidebarMode;
  variant?: SidebarVariant;
  headerAction?: React.ReactNode;
  className?: string;
  titleId?: string;
  onNavigate?: () => void;
};
