import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ensureProfile } from "./auth/profile";
import { requireAuthUser } from "./auth/requireAuth";
import { buildStarterProperties, getAudienceFromOrganizationType, getVisibleZoneKeys, normalizeEmail, slugifyOrganizationName } from "./partnerWorkspace/lib";

const organizationTypeValidator = v.union(v.literal("broker"), v.literal("red"));
const membershipRoleValidator = v.union(v.literal("manager"), v.literal("member"), v.literal("viewer"));

async function getProfileByAuthUserId(ctx: any, authUserId: string) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_authUserId", (q: any) => q.eq("authUserId", authUserId))
    .unique();
}

async function getCurrentMembership(ctx: any, profileId: any) {
  const memberships = await ctx.db
    .query("organizationMembers")
    .withIndex("by_profileId", (q: any) => q.eq("profileId", profileId))
    .collect();
  return memberships.find((membership: any) => membership.isDefault) ?? memberships[0] ?? null;
}

async function getUniqueOrganizationSlug(ctx: any, name: string) {
  const baseSlug = slugifyOrganizationName(name);
  let candidate = baseSlug;
  let suffix = 2;
  while (await ctx.db.query("organizations").withIndex("by_slug", (q: any) => q.eq("slug", candidate)).unique()) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export const getWorkspaceState = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx);
    const profile = await getProfileByAuthUserId(ctx, authUser._id);
    const membership = profile ? await getCurrentMembership(ctx, profile._id) : null;
    const organization = membership ? (await ctx.db.get(membership.organizationId)) as any : null;
    const properties = organization
      ? await ctx.db
          .query("workspaceProperties")
          .withIndex("by_organizationId", (q) => q.eq("organizationId", organization._id))
          .collect()
      : [];
    const pendingInvites = authUser.email
      ? await ctx.db
          .query("organizationInvites")
          .withIndex("by_email", (q) => q.eq("email", normalizeEmail(authUser.email)))
          .collect()
      : [];
    const visibleZoneKeys = organization ? [...getVisibleZoneKeys()] : ["overview", "settings"];
    const publishedCount = properties.filter((property) => property.publicationState === "published").length;

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
          membership?.role === "manager"
            ? ["properties:write", "offers:write", "members:write"]
            : membership?.role === "member"
              ? ["properties:write", "offers:write"]
              : [],
        isActive: true,
      },
      audience: organization ? getAudienceFromOrganizationType(organization.type) : null,
      visibleZoneKeys,
      needsOrganization: !organization,
      suggestedOrganizationType:
        pendingInvites[0]?.organizationId
          ? (((await ctx.db.get(pendingInvites[0].organizationId)) as any)?.type ?? "broker")
          : "broker",
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
        propertyCount: properties.length,
        publishedPropertyCount: publishedCount,
        draftPropertyCount: properties.filter((property) => property.publicationState === "draft").length,
        inviteCount: organization
          ? (
              await ctx.db
                .query("organizationInvites")
                .withIndex("by_organizationId", (q) => q.eq("organizationId", organization._id))
                .collect()
            ).filter((invite) => invite.status === "pending").length
          : 0,
      },
      pendingInvites: await Promise.all(
        pendingInvites
          .filter((invite) => invite.status === "pending" && invite.expiresAt > Date.now())
          .map(async (invite) => {
            const inviteOrganization = await ctx.db.get(invite.organizationId);
            const inviter = await ctx.db.get(invite.inviterProfileId);
            return {
              id: invite._id,
              token: invite.token,
              email: invite.email,
              role: invite.role,
              organizationName: (inviteOrganization as any)?.name ?? "Workspace",
              organizationType: (inviteOrganization as any)?.type === "red" ? "developer" : "broker",
              inviterName: inviter?.name ?? "Workspace owner",
              expiresAt: invite.expiresAt,
            };
          }),
      ),
    };
  },
});

export const getInvitePreview = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("organizationInvites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!invite || invite.status !== "pending" || invite.expiresAt <= Date.now()) {
      return null;
    }
    const organization = (await ctx.db.get(invite.organizationId)) as any;
    const inviter = await ctx.db.get(invite.inviterProfileId);
    return {
      token: invite.token,
      email: invite.email,
      role: invite.role,
      organizationName: organization?.name ?? "Workspace",
      organizationType: organization?.type === "red" ? "developer" : "broker",
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
    const authUser = await requireAuthUser(ctx);
    const profile = await ensureProfile(ctx, {
      _id: authUser._id,
      email: authUser.email ?? "",
      name: authUser.name ?? authUser.email ?? "Workspace user",
    });
    const existingMembership = await getCurrentMembership(ctx, profile._id);
    if (existingMembership) {
      throw new Error("You already belong to a workspace organization.");
    }
    const now = Date.now();
    const slug = await getUniqueOrganizationSlug(ctx, args.name);
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name.trim(),
      slug,
      ownerProfileId: profile._id,
      type: args.type,
      status: "active",
      defaultKnowledgeScope: "workspace",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("organizationMembers", {
      organizationId,
      profileId: profile._id,
      role: "manager",
      isDefault: true,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(profile._id, {
      primaryOrganizationId: organizationId,
      updatedAt: now,
    });
    for (const property of buildStarterProperties({
      organizationId,
      createdByProfileId: profile._id,
      organizationName: args.name.trim(),
      organizationType: args.type,
      now,
    })) {
      await ctx.db.insert("workspaceProperties", property);
    }
    return { organizationId };
  },
});

export const acceptInvite = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx);
    const invite = await ctx.db
      .query("organizationInvites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
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
      primaryOrganizationId: invite.organizationId,
      updatedAt: now,
    });
    return { ok: true };
  },
});

export const getOrganizationSettingsState = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx);
    const profile = await getProfileByAuthUserId(ctx, authUser._id);
    if (!profile) {
      return null;
    }
    const membership = await getCurrentMembership(ctx, profile._id);
    if (!membership) {
      return null;
    }
    const organization = (await ctx.db.get(membership.organizationId)) as any;
    if (!organization) {
      return null;
    }
    const members = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", organization._id))
      .collect();
    const invites = await ctx.db
      .query("organizationInvites")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", organization._id))
      .collect();

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
        token: invite.token,
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
    const authUser = await requireAuthUser(ctx);
    const profile = await ensureProfile(ctx, {
      _id: authUser._id,
      email: authUser.email ?? "",
      name: authUser.name ?? authUser.email ?? "Workspace user",
    });
    const membership = await getCurrentMembership(ctx, profile._id);
    if (!membership || membership.role !== "manager") {
      throw new Error("Only organization managers can invite new members.");
    }
    const now = Date.now();
    const existing = await ctx.db
      .query("organizationInvites")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", membership.organizationId))
      .collect();
    const normalizedEmail = normalizeEmail(args.email);
    const duplicate = existing.find(
      (invite) => invite.status === "pending" && normalizeEmail(invite.email) === normalizedEmail,
    );
    if (duplicate) {
      return { inviteId: duplicate._id, token: duplicate.token };
    }
    const inviteId = await ctx.db.insert("organizationInvites", {
      organizationId: membership.organizationId,
      inviterProfileId: profile._id,
      email: normalizedEmail,
      role: args.role,
      token: crypto.randomUUID(),
      status: "pending",
      expiresAt: now + 1000 * 60 * 60 * 24 * 7,
      createdAt: now,
      updatedAt: now,
    });
    const invite = await ctx.db.get(inviteId);
    return { inviteId, token: invite?.token ?? "" };
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
    const authUser = await requireAuthUser(ctx);
    const profile = await ensureProfile(ctx, {
      _id: authUser._id,
      email: authUser.email ?? "",
      name: authUser.name ?? authUser.email ?? "Workspace user",
    });
    const membership = await getCurrentMembership(ctx, profile._id);
    if (!membership || membership.role !== "manager") {
      throw new Error("Only organization managers can update organization settings.");
    }
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
