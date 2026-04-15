import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  LayoutGrid,
  MessageSquareQuote,
  Settings2,
  Mail,
} from "lucide-react";
import { getWebDictionary } from "@/lib/i18n";
import type { AppLocale } from "@/lib/locale";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";

export type WorkspaceRole = string | null | undefined;

export type ZoneNavItem = {
  label: string;
  href?: string;
  disabled?: boolean;
};

export type ZoneDescriptor = {
  key: WorkspaceZoneKey;
  label: string;
  href: string;
  description: string;
  icon: typeof LayoutGrid;
  roles: WorkspaceRole[];
  localNav: ZoneNavItem[];
  comingSoon?: boolean;
};

export type ZoneShellData = Pick<ZoneDescriptor, "key" | "label" | "description" | "localNav" | "comingSoon">;

const zoneDescriptors: ZoneDescriptor[] = [
  {
    key: "overview",
    label: "Dashboard",
    href: "/ws",
    description: "Role-aware landing for the current partner organization.",
    icon: LayoutGrid,
    roles: ["developer", "RED", "broker", "admin", null, undefined],
    localNav: [],
  },
  {
    key: "inbox",
    label: "Inbox",
    href: "/ws/inbox",
    description: "Messages, invites, and partner coordination in one place.",
    icon: Mail,
    roles: ["developer", "RED", "broker"],
    localNav: [],
    comingSoon: true,
  },
  {
    key: "crm",
    label: "Partners / CRM",
    href: "/ws/crm",
    description: "Partner relationships, leads, and active follow-through.",
    icon: MessageSquareQuote,
    roles: ["developer", "RED", "broker"],
    localNav: [
      { label: "CRM", href: "/ws/crm" },
      { label: "Clients", href: "/ws/crm/clients" },
    ],
    comingSoon: true,
  },
  {
    key: "projects",
    label: "Properties",
    href: "/ws/projects",
    description: "Create, edit, and publish partner properties into the app.",
    icon: Building2,
    roles: ["developer", "RED", "broker"],
    localNav: [{ label: "Properties", href: "/ws/projects" }],
  },
  {
    key: "offers",
    label: "Offers / Leads",
    href: "/ws/offers",
    description: "Offer activity and downstream lead movement.",
    icon: BriefcaseBusiness,
    roles: ["developer", "RED", "broker"],
    localNav: [{ label: "Offers", href: "/ws/offers" }],
    comingSoon: true,
  },
  {
    key: "market",
    label: "ذكاء السوق",
    href: "/ws/market",
    description: "تحليل الطلب والأسعار وسرعة البيع على مستوى المدن والأحياء.",
    icon: BarChart3,
    roles: ["developer", "RED", "broker", "admin", null, undefined],
    localNav: [
      { label: "المدن", href: "/ws/market/cities" },
      { label: "الأحياء", href: "/ws/market/areas" },
      { label: "الفرص", href: "/ws/market/opportunities" },
      { label: "البحث والكلمات", href: "/ws/market/research" },
    ],
    comingSoon: true,
  },
  {
    key: "settings",
    label: "Organization",
    href: "/ws/settings",
    description: "Organization profile, members, invitations, and access.",
    icon: Settings2,
    roles: ["developer", "RED", "broker", "admin"],
    localNav: [],
  },
];

function localizeZone(zone: ZoneDescriptor, locale: AppLocale): ZoneDescriptor {
  const dictionary = getWebDictionary(locale);
  switch (zone.key) {
    case "overview":
      return { ...zone, label: "Dashboard" };
    case "market":
      return {
        ...zone,
        label: dictionary.market.title,
        description: dictionary.market.description,
      };
    case "crm":
      return {
        ...zone,
        label: dictionary.crm.title,
        description: dictionary.crm.clientsDescription,
        localNav: [{ label: dictionary.crm.title, href: "/ws/crm" }],
      };
    case "projects":
      return {
        ...zone,
        label: dictionary.projects.title,
        description: dictionary.projects.description,
        localNav: [{ label: dictionary.projects.title, href: "/ws/projects" }],
      };
    case "offers":
      return {
        ...zone,
        label: dictionary.offers.title,
        description: dictionary.offers.description,
        localNav: [{ label: dictionary.offers.title, href: "/ws/offers" }],
      };
    case "inbox":
      return { ...zone, label: dictionary.nav.inbox };
    case "settings":
      return {
        ...zone,
        label: dictionary.nav.workspaceSettings,
        description: dictionary.settings.description,
      };
    default:
      return zone;
  }
}

function isVisibleToRole(zone: ZoneDescriptor, role: WorkspaceRole) {
  return zone.roles.includes(role);
}

/**
 * WHY:   Workspace navigation should be driven by one role-aware source of truth across shells and zone pages.
 * WHAT:  Returns the workspace zones visible to the supplied session role.
 * HOW:   Filters the static zone descriptor list by the descriptor role visibility rules.
 */
export function getWorkspaceZones(role: WorkspaceRole, locale: AppLocale = "ar") {
  return zoneDescriptors
    .filter((zone) => isVisibleToRole(zone, role))
    .map((zone) => localizeZone(zone, locale));
}

/**
 * WHY:   The server behavior model now decides zone visibility and the client needs a key-based lookup.
 * WHAT:  Returns the zone descriptors matching the supplied server-approved zone keys.
 * HOW:   Filters the static descriptor list against a `Set` of allowed keys.
 */
export function getWorkspaceZonesForKeys(keys: WorkspaceZoneKey[], locale: AppLocale = "ar") {
  const keySet = new Set(keys);
  return zoneDescriptors
    .filter((zone) => keySet.has(zone.key))
    .map((zone) => localizeZone(zone, locale));
}

/**
 * WHY:   Zone layouts need a stable lookup for their current descriptor and local navigation metadata.
 * WHAT:  Returns one visible zone descriptor for the supplied key and role, or null when hidden.
 * HOW:   Reuses the shared visible-zone list and performs a simple key match.
 */
export function getWorkspaceZone(
  role: WorkspaceRole,
  key: ZoneDescriptor["key"],
  locale: AppLocale = "ar",
) {
  return getWorkspaceZones(role, locale).find((zone) => zone.key === key) ?? null;
}

/**
 * WHY:   Server layouts must pass serializable data into client zone-shell components.
 * WHAT:  Narrows a full zone descriptor to the plain-object subset used by the zone shell.
 * HOW:   Drops non-serializable fields such as icon component references and role metadata.
 */
export function toZoneShellData(zone: ZoneDescriptor): ZoneShellData {
  return {
    key: zone.key,
    label: zone.label,
    description: zone.description,
    localNav: zone.localNav,
    comingSoon: zone.comingSoon,
  };
}
