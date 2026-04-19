import { getWorkspaceLocaleContext } from "../../_lib/workspaceLocale";
import { getWorkspaceOrganizationTeam } from "../../_lib/organizationTeam";
import { getOrganizationMemberRoleLabel } from "../../_lib/organizationMembers";
import { formatWebCopy } from "@/lib/i18n";
import { listCurrentOrganizationApiKeysForCurrentUser } from "@/server/domains/auth/organizationApiKeys/service";
import { listAuthorizedAppsForCurrentOrganization } from "@/server/domains/auth/oauth/service";
import { getComplianceRulesetForCurrentOrg } from "@/server/domains/compliance/service";
import type { OrganizationApiKeySummary } from "@/server/contracts/organizationApiKeys";
import type { OAuthAuthorizedAppSummary } from "@/server/contracts/oauth";
import SettingsHeader from "./_components/SettingsHeader";
import SettingsTabs from "./_components/SettingsTabs";
import OrganizationSettingsWorkspace from "./_components/OrganizationSettingsWorkspace";
import MembersWorkspace from "./_components/MembersWorkspace";
import ApiKeysWorkspace from "./_components/ApiKeysWorkspace";
import OrganizationAppsWorkspace from "./_components/OrganizationAppsWorkspace";
import OrganizationVerificationWorkspace from "./_components/OrganizationVerificationWorkspace";
import {
  cancelOrganizationInviteAction,
  createOrganizationApiKeyAction,
  createOrganizationInviteAction,
  revokeOrganizationApiKeyAction,
  revokeOrganizationConnectedAppAction,
  saveOrganizationSettingsAction,
  searchOrganizationDirectoryAction,
  updateOrganizationMemberRoleAction,
} from "./actions";

const settingsTabs = [
  { key: "org", labelKey: "organization", icon: "building" },
  { key: "verification", labelKey: "verification", icon: "shield" },
  { key: "members", labelKey: "membersAndInvites", icon: "users" },
  { key: "apps", labelKey: "apps", icon: "plug" },
  { key: "api-keys", labelKey: "apiKeys", icon: "key" },
] as const;

type SettingsTabKey = (typeof settingsTabs)[number]["key"];
type SearchParams = Record<string, string | string[] | undefined>;

function readSearchParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function resolveTabKey(value: string | undefined): SettingsTabKey {
  return settingsTabs.some((tab) => tab.key === value) ? (value as SettingsTabKey) : "org";
}



function isManagerRole(role: string | null | undefined) {
  return role === "manager";
}

function isTenantOwner(role: string | null | undefined) {
  return role === "owner";
}

export default async function WorkspaceSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const [{ locale, dictionary }, resolvedSearchParams, team] = await Promise.all([
    getWorkspaceLocaleContext(),
    searchParams ?? Promise.resolve({}),
    getWorkspaceOrganizationTeam(),
  ]);

  const activeTab = resolveTabKey(readSearchParam(resolvedSearchParams, "tab"));
  const currentTab = settingsTabs.find((tab) => tab.key === activeTab) ?? settingsTabs[0];
  const tabs = settingsTabs.map((tab) => ({
    key: tab.key,
    label: dictionary.settings[tab.labelKey],
    icon: tab.icon,
  }));
  const organization = team.organization;
  const members = team.members;
  const invites = team.invites;
  const canManage = isManagerRole(team.currentMembershipRole) || isTenantOwner(team.currentTenantRole);
  const canViewApiKeys = canManage;
  const canCreateApiKeys = isTenantOwner(team.currentTenantRole);
  const canRevokeApiKeys = canManage;
  const showLegacyNotice = readSearchParam(resolvedSearchParams, "source") === "legacy-account-apps";

  let apiKeys: OrganizationApiKeySummary[] = [];
  try {
    apiKeys = activeTab === "api-keys" ? await listCurrentOrganizationApiKeysForCurrentUser() : [];
  } catch (error) {
    console.error("API Keys fetch failed:", error);
  }

  let apps: OAuthAuthorizedAppSummary[] = [];
  try {
    apps = activeTab === "apps" ? await listAuthorizedAppsForCurrentOrganization() : [];
  } catch (error) {
    console.error("Apps fetch failed:", error);
  }

  let complianceRuleset = null;
  try {
    complianceRuleset = activeTab === "verification" ? await getComplianceRulesetForCurrentOrg() : null;
  } catch (error) {
    console.error("Compliance fetch failed:", error);
  }

  const roleLabel =
    team.currentMembershipRole === "manager" ||
    team.currentMembershipRole === "member" ||
    team.currentMembershipRole === "viewer"
      ? getOrganizationMemberRoleLabel(team.currentMembershipRole)
      : team.currentMembershipRole ?? dictionary.settings.unavailable;

  const content =
    activeTab === "members" ? (
      <MembersWorkspace
        initialMembers={members}
        invites={invites}
        canManage={canManage}
        hasOrganization={Boolean(organization)}
        organizationType={organization?.type}
        onCreateInvite={createOrganizationInviteAction}
        onCancelInvite={cancelOrganizationInviteAction}
        onSearchDirectory={searchOrganizationDirectoryAction}
        onUpdateRole={updateOrganizationMemberRoleAction}
      />
    ) : activeTab === "api-keys" ? (
      <div className="relative min-h-[400px]">
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[var(--workspace-shell)]/40 backdrop-blur-xl transition-all">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--zane-ai-deep)] dark:text-white">
              {locale === "ar" ? "قادم قريباً" : "Coming Soon"}
            </span>
            <div className="h-0.5 w-12 bg-[var(--zane-ai-accent)]" />
          </div>
        </div>
        <div className="pointer-events-none select-none opacity-50 contrast-75 saturate-50">
          <ApiKeysWorkspace
            initialKeys={apiKeys}
            canCreate={canCreateApiKeys}
            canRevoke={canRevokeApiKeys}
            canView={canViewApiKeys}
            hasOrganization={Boolean(organization)}
            onCreateKey={createOrganizationApiKeyAction}
            onRevokeKey={revokeOrganizationApiKeyAction}
          />
        </div>
      </div>
    ) : activeTab === "apps" ? (
      <div className="relative min-h-[400px]">
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[var(--workspace-shell)]/40 backdrop-blur-xl transition-all">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--zane-ai-deep)] dark:text-white">
              {locale === "ar" ? "قادم قريباً" : "Coming Soon"}
            </span>
            <div className="h-0.5 w-12 bg-[var(--zane-ai-accent)]" />
          </div>
        </div>
        <div className="pointer-events-none select-none opacity-50 contrast-75 saturate-50">
          <OrganizationAppsWorkspace
            initialApps={apps}
            canManage={canManage}
            hasOrganization={Boolean(organization)}
            showLegacyNotice={showLegacyNotice}
            onRevokeApp={revokeOrganizationConnectedAppAction}
          />
        </div>
      </div>
    ) : activeTab === "verification" ? (
      <OrganizationVerificationWorkspace
        organization={organization}
        verificationSummary={organization?.verificationSummary}
        ruleset={complianceRuleset}
        canManage={canManage}
        membersCount={members.length}
      />
    ) : (
      <OrganizationSettingsWorkspace
        organization={organization}
        canManage={canManage}
        onSave={saveOrganizationSettingsAction}
      />
    );

  return (
    <div className="flex w-full flex-col p-6 lg:p-10 animate-in fade-in duration-500 gap-6">
      <SettingsHeader
        title={dictionary.settings.title}
        description={formatWebCopy(dictionary.settings.membersSummary, {
          members: members.length,
          invites: invites.length,
          roleLabel,
        })}
        workspaceLabel={dictionary.settings.workspaceLabel}
        dir={locale === "ar" ? "rtl" : "ltr"}
      />
      <SettingsTabs tabs={tabs} defaultTab="org" />

      <div className="min-h-0">{content}</div>
    </div>
  );
}
