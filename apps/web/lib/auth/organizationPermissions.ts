export const OAUTH_SCOPE_IDS = ["clients:read", "properties:read", "offers:read"] as const;

export const OAUTH_SCOPE_CATALOG = [
  { id: "clients:read", label: "Read clients", arabicLabel: "قراءة العملاء" },
  { id: "properties:read", label: "Read projects", arabicLabel: "قراءة المشاريع" },
  { id: "offers:read", label: "Read offers", arabicLabel: "قراءة العروض" },
] as const;

export const ORGANIZATION_API_KEY_RESOURCE_CATALOG = [
  { resource: "clients", label: "Clients", arabicLabel: "العملاء" },
  { resource: "properties", label: "Projects", arabicLabel: "المشاريع" },
  { resource: "deals", label: "Deals", arabicLabel: "الصفقات" },
  { resource: "brokers", label: "Brokers", arabicLabel: "الوسطاء" },
] as const;

export const ORGANIZATION_API_KEY_ACTION_CATALOG = [
  { action: "read", label: "Read", arabicLabel: "قراءة" },
  { action: "create", label: "Create", arabicLabel: "إنشاء" },
  { action: "update", label: "Update", arabicLabel: "تعديل" },
  { action: "delete", label: "Delete", arabicLabel: "حذف" },
] as const;

export const ORGANIZATION_API_KEY_RESOURCES = ["clients", "properties", "deals", "brokers"] as const;
export const ORGANIZATION_API_KEY_ACTIONS = ["read", "create", "update", "delete"] as const;

export type OrganizationOAuthScopeId = (typeof OAUTH_SCOPE_IDS)[number];
export type OrganizationApiKeyResource = (typeof ORGANIZATION_API_KEY_RESOURCES)[number];
export type OrganizationApiKeyAction = (typeof ORGANIZATION_API_KEY_ACTIONS)[number];
export type OrganizationApiKeyPermission = {
  resource: OrganizationApiKeyResource;
  action: OrganizationApiKeyAction;
};

export const ORGANIZATION_API_KEY_ALLOWED_PERMISSIONS: OrganizationApiKeyPermission[] =
  ORGANIZATION_API_KEY_RESOURCE_CATALOG.flatMap((resource) =>
    ORGANIZATION_API_KEY_ACTION_CATALOG.map((action) => ({
      resource: resource.resource,
      action: action.action,
    })),
  );

export function isOrganizationApiKeyPermissionAllowed(permission: OrganizationApiKeyPermission) {
  return ORGANIZATION_API_KEY_ALLOWED_PERMISSIONS.some(
    (entry) => entry.resource === permission.resource && entry.action === permission.action,
  );
}

export function listOrganizationApiKeyAllowedActions(resource: OrganizationApiKeyResource) {
  return ORGANIZATION_API_KEY_ALLOWED_PERMISSIONS.filter((entry) => entry.resource === resource).map(
    (entry) => entry.action,
  );
}
