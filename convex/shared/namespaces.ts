import type { Id } from "../_generated/dataModel";

export const PUBLIC_OWNER_KEY = "public";

export function profileOwnerKey(authUserId: string) {
  return `profile:${authUserId}`;
}

export function organizationOwnerKey(organizationId: Id<"organizations">) {
  return `organization:${organizationId}`;
}

export function ownerKeyForScope(args: {
  authUserId: string;
  organizationId?: Id<"organizations">;
  scope: "personal" | "organization" | "public";
}) {
  if (args.scope === "public") return PUBLIC_OWNER_KEY;
  if (args.scope === "organization" && args.organizationId) {
    return organizationOwnerKey(args.organizationId);
  }
  return profileOwnerKey(args.authUserId);
}
