import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { ensureProfile } from "./auth/profile";
import {
  assertWorkspaceRole,
  canManageOrganization,
  getDefaultMembership,
  getProfileByAuthUserId,
  normalizeEmail,
  requireProfile,
  requireWorkspace,
  sha256Hex,
} from "./core/lib";
import {
  getAudienceFromOrganizationType,
  getVisibleZoneKeys,
  slugifyOrganizationName,
  starterProjectSeed,
} from "./partnerWorkspace/lib";

const organizationTypeValidator = v.union(
  v.literal("brokerage"),
  v.literal("developer"),
  v.literal("zane_ai"),
  v.literal("broker"),
  v.literal("red"),
);
const membershipRoleValidator = v.union(
  v.literal("owner"),
  v.literal("manager"),
  v.literal("editor"),
  v.literal("viewer"),
);

function normalizeOrganizationType(type: "brokerage" | "developer" | "zane_ai" | "broker" | "red") {
  if (type === "broker") return "brokerage";
  if (type === "red") return "developer";
  return type;
}

async function getUniqueOrganizationSlug(ctx: Parameters<typeof getProfileByAuthUserId>[0], name: string) {
  const baseSlug = slugifyOrganizationName(name);
  let candidate = baseSlug;
  let suffix = 2;
  while (await ctx.db.query("organizations").withIndex("by_slug", (q) => q.eq("slug", candidate)).unique()) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function readInviteFromToken(ctx: Parameters<typeof getProfileByAuthUserId>[0], token: string) {
  const tokenHash = await sha256Hex(token);
  const invite = await ctx.db
    .query("organizationInvites")
    .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
    .unique();
  if (invite) return invite;

  const legacyInvite = await ctx.db
    .query("organizationInvites")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (legacyInvite) return legacyInvite;

  try {
    return await ctx.db.get(token as Id<"organizationInvites">);
  } catch {
    return null;
  }
}

export const getWorkspaceState = query({
  args: {},
  handler: async (ctx) => {
    const { authUser, profile } = await requireProfile(ctx);
    const membership = await getDefaultMembership(ctx, profile._id);
    const organization = membership ? await ctx.db.get(membership.organizationId) : null;
    const projects = organization
      ? await ctx.db
          .query("projects")
          .withIndex("by_organizationId_and_publicationState", (q) => q.eq("organizationId", organization._id))
          .take(100)
      : [];
    const pendingInvites = authUser.email
      ? await ctx.db
          .query("organizationInvites")
          .withIndex("by_email_and_status", (q) =>
            q.eq("email", normalizeEmail(authUser.email)).eq("status", "pending"),
          )
          .take(20)
      : [];
    const activePendingInvites = pendingInvites.filter((invite) => invite.expiresAt > Date.now());
    const inviteCount = organization
      ? (
          await ctx.db
            .query("organizationInvites")
            .withIndex("by_organizationId_and_status", (q) =>
              q.eq("organizationId", organization._id).eq("status", "pending"),
            )
            .take(100)
        ).length
      : 0;

    return {
      user: {
        id: authUser._id,
        name: authUser.name ?? null,
        email: authUser.email ?? null,
        image: null,
        username: null,
        organizationId: organization?._id ?? null,
        organizationSlug: organization?.slug ?? null,
        organizationRole: membership?.role ?? null,
        organizationPermissions:
          membership?.role === "owner" || membership?.role === "manager"
            ? ["properties:write", "offers:write", "members:write"]
            : membership?.role === "editor"
              ? ["properties:write", "offers:write"]
              : [],
        isActive: true,
      },
      audience: organization ? getAudienceFromOrganizationType(organization.type) : null,
      visibleZoneKeys: organization ? [...getVisibleZoneKeys()] : ["overview", "settings"],
      needsOrganization: !organization,
      suggestedOrganizationType:
        activePendingInvites[0]?.organizationId
          ? (((await ctx.db.get(activePendingInvites[0].organizationId))?.type ?? "brokerage") as
              | "brokerage"
              | "developer")
          : "brokerage",
      membershipRole: membership?.role ?? null,
      organization: organization
        ? {
            id: organization._id,
            name: organization.name,
            slug: organization.slug,
            type: organization.type,
            status: organization.status,
            description: organization.description ?? "",
            website: organization.website ?? "",
            contactEmail: organization.contactEmail ?? "",
            phone: organization.phone ?? "",
          }
        : null,
      metrics: {
        propertyCount: projects.length,
        publishedPropertyCount: projects.filter((project) => project.publicationState === "published").length,
        draftPropertyCount: projects.filter((project) => project.publicationState === "draft").length,
        inviteCount,
      },
      pendingInvites: await Promise.all(
        activePendingInvites.map(async (invite) => {
          const inviteOrganization = await ctx.db.get(invite.organizationId);
          const inviter = await ctx.db.get(invite.inviterProfileId);
          return {
            id: invite._id,
            token: invite._id,
            email: invite.email,
            role: invite.role,
            organizationName: inviteOrganization?.name ?? "Workspace",
            organizationType: inviteOrganization?.type === "developer" ? "developer" : "broker",
            inviterName: inviter?.name ?? "Workspace owner",
            expiresAt: invite.expiresAt,
          };
        }),
      ),
    };
  },
});

export const getInvitePreview = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await readInviteFromToken(ctx, args.token);
    if (!invite || invite.status !== "pending" || invite.expiresAt <= Date.now()) {
      return null;
    }
    const organization = await ctx.db.get(invite.organizationId);
    const inviter = await ctx.db.get(invite.inviterProfileId);
    return {
      token: args.token,
      email: invite.email,
      role: invite.role,
      organizationName: organization?.name ?? "Workspace",
      organizationType: organization?.type === "developer" ? "developer" : "broker",
      inviterName: inviter?.name ?? "Workspace owner",
      expiresAt: invite.expiresAt,
    };
  },
});

export const createOrganization = mutation({
  args: {
    name: v.string(),
    type: organizationTypeValidator,
  },
  handler: async (ctx, args) => {
    const { authUser } = await requireProfile(ctx);
    const profile = await ensureProfile(ctx, {
      _id: authUser._id,
      email: authUser.email ?? "",
      name: authUser.name ?? authUser.email ?? "Zane-ai user",
      kind: "professional",
    });
    const existingMembership = await getDefaultMembership(ctx, profile._id);
    if (existingMembership) {
      throw new Error("You already belong to a workspace organization.");
    }
    const now = Date.now();
    const type = normalizeOrganizationType(args.type);
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name.trim(),
      slug: await getUniqueOrganizationSlug(ctx, args.name),
      ownerProfileId: profile._id,
      type,
      status: "active",
      defaultKnowledgeScope: "workspace",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("organizationMembers", {
      organizationId,
      profileId: profile._id,
      role: "owner",
      isDefault: true,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(profile._id, {
      kind: "professional",
      primaryOrganizationId: organizationId,
      updatedAt: now,
    });
    await ctx.db.insert(
      "projects",
      starterProjectSeed({
        organizationId,
        createdByProfileId: profile._id,
        organizationType: type,
        now,
      }),
    );
    return { organizationId };
  },
});

export const acceptInvite = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { authUser } = await requireProfile(ctx);
    const invite = await readInviteFromToken(ctx, args.token);
    if (!invite || invite.status !== "pending" || invite.expiresAt <= Date.now()) {
      throw new Error("This invite is no longer available.");
    }
    if (normalizeEmail(invite.email) !== normalizeEmail(authUser.email ?? "")) {
      throw new Error("This invite was issued for a different email address.");
    }
    const profile = await ensureProfile(ctx, {
      _id: authUser._id,
      email: authUser.email ?? invite.email,
      name: authUser.name ?? invite.email,
      kind: "professional",
    });
    const existing = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_and_profileId", (q) =>
        q.eq("organizationId", invite.organizationId).eq("profileId", profile._id),
      )
      .unique();
    const now = Date.now();
    if (!existing) {
      await ctx.db.insert("organizationMembers", {
        organizationId: invite.organizationId,
        profileId: profile._id,
        role: invite.role,
        isDefault: true,
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
    }
    await ctx.db.patch(invite._id, {
      status: "accepted",
      acceptedAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(profile._id, {
      kind: "professional",
      primaryOrganizationId: invite.organizationId,
      updatedAt: now,
    });
    return { ok: true };
  },
});

export const getOrganizationSettingsState = query({
  args: {},
  handler: async (ctx) => {
    const { membership, organization } = await requireWorkspace(ctx);
    const members = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_and_status", (q) =>
        q.eq("organizationId", organization._id).eq("status", "active"),
      )
      .take(100);
    const invites = await ctx.db
      .query("organizationInvites")
      .withIndex("by_organizationId_and_status", (q) =>
        q.eq("organizationId", organization._id).eq("status", "pending"),
      )
      .take(100);

    return {
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
        type: organization.type,
        status: organization.status,
        description: organization.description ?? "",
        website: organization.website ?? "",
        contactEmail: organization.contactEmail ?? "",
        phone: organization.phone ?? "",
      },
      currentMembershipRole: membership.role,
      members: await Promise.all(
        members.map(async (member) => {
          const memberProfile = await ctx.db.get(member.profileId);
          return {
            id: member._id,
            authUserId: memberProfile?.authUserId ?? "",
            name: memberProfile?.name ?? "Workspace member",
            email: memberProfile?.email ?? "",
            role: member.role,
            status: member.status,
          };
        }),
      ),
      invites: invites.map((invite) => ({
        id: invite._id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        token: invite._id,
        expiresAt: invite.expiresAt,
      })),
    };
  },
});

export const createOrganizationInvite = mutation({
  args: {
    email: v.string(),
    role: membershipRoleValidator,
  },
  handler: async (ctx, args) => {
    const { profile, membership } = await requireWorkspace(ctx);
    if (!canManageOrganization(membership.role)) {
      throw new Error("Only organization owners and managers can invite new members.");
    }
    const normalizedEmail = normalizeEmail(args.email);
    const duplicate = await ctx.db
      .query("organizationInvites")
      .withIndex("by_email_and_status", (q) => q.eq("email", normalizedEmail).eq("status", "pending"))
      .take(20);
    const existing = duplicate.find((invite) => invite.organizationId === membership.organizationId);
    if (existing) {
      return { inviteId: existing._id, token: existing._id };
    }
    const now = Date.now();
    const token = crypto.randomUUID();
    const inviteId = await ctx.db.insert("organizationInvites", {
      organizationId: membership.organizationId,
      inviterProfileId: profile._id,
      email: normalizedEmail,
      role: args.role,
      tokenHash: await sha256Hex(token),
      status: "pending",
      expiresAt: now + 1000 * 60 * 60 * 24 * 7,
      createdAt: now,
      updatedAt: now,
    });
    return { inviteId, token };
  },
});

export const updateOrganizationProfile = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireWorkspace(ctx);
    assertWorkspaceRole(membership.role, ["owner", "manager"]);
    await ctx.db.patch(membership.organizationId, {
      name: args.name.trim(),
      description: args.description?.trim() || undefined,
      website: args.website?.trim() || undefined,
      contactEmail: args.contactEmail?.trim() || undefined,
      phone: args.phone?.trim() || undefined,
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});
