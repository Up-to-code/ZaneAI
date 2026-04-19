import { getWorkspaceLocaleContext } from "../../_lib/workspaceLocale";
import { getWorkspaceOrganizationTeam } from "../../_lib/organizationTeam";
import { getOrganizationMemberRoleLabel } from "../../_lib/organizationMembers";
import { formatWebCopy } from "@/lib/i18n";
import { listCurrentOrganizationApiKeysForCurrentUser } from "@/server/domains/auth/organizationApiKeys/service";
import { listAuthorizedAppsForCurrentOrganization } from "@/server/domains/auth/oauth/service";
import { getComplianceRulesetForCurrentOrg } from "@/server/domains/compliance/service";
import SettingsHeader from "./_components/SettingsHeader";
import SettingsTabs from "./_components/SettingsTabs";
import SettingsOverviewStrip from "./_components/SettingsOverviewStrip";
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

function getOverviewLabels(locale: "ar" | "en" | "fr") {
  if (locale === "fr") {
    return {
      currentSection: "Section",
      members: "Membres",
      invites: "Invitations",
      currentRole: "Role actuel",
    };
  }

  if (locale === "en") {
    return {
      currentSection: "Current section",
      members: "Members",
      invites: "Invites",
      currentRole: "Current role",
    };
  }

  return {
    currentSection: "القسم الحالي",
    members: "الأعضاء",
    invites: "الدعوات",
    currentRole: "الدور الحالي",
  };
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

  const apiKeys = activeTab === "api-keys" ? await listCurrentOrganizationApiKeysForCurrentUser() : [];
  const apps = activeTab === "apps" ? await listAuthorizedAppsForCurrentOrganization() : [];
  const complianceRuleset = activeTab === "verification" ? await getComplianceRulesetForCurrentOrg() : null;

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
      <ApiKeysWorkspace
        initialKeys={apiKeys}
        canCreate={canCreateApiKeys}
        canRevoke={canRevokeApiKeys}
        canView={canViewApiKeys}
        hasOrganization={Boolean(organization)}
        onCreateKey={createOrganizationApiKeyAction}
        onRevokeKey={revokeOrganizationApiKeyAction}
      />
    ) : activeTab === "apps" ? (
      <OrganizationAppsWorkspace
        initialApps={apps}
        canManage={canManage}
        hasOrganization={Boolean(organization)}
        showLegacyNotice={showLegacyNotice}
        onRevokeApp={revokeOrganizationConnectedAppAction}
      />
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
      <SettingsOverviewStrip
        currentTabLabel={dictionary.settings[currentTab.labelKey]}
        membersCount={members.length}
        invitesCount={invites.length}
        roleLabel={roleLabel}
        labels={getOverviewLabels(locale)}
      />
      <div className="min-h-0">{content}</div>
    </div>
  );
}
