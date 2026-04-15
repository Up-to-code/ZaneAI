import { updateThreadMetadata } from "@convex-dev/agent";
import { v } from "convex/values";

import type { MutationCtx } from "../../_generated/server";
import { internalMutation } from "../../_generated/server";
import type { Doc } from "../../_generated/dataModel";
import { agentComponent } from "../../agent/lib/component";
import { makeCacheScopeKey } from "../../llm/cache/client";
import { profileOwnerKey } from "../../shared/namespaces";

const ROLE_PRIORITY = {
  viewer: 0,
  member: 1,
  manager: 2,
} as const;

function mergeRole(
  left: Doc<"organizationMembers">["role"],
  right: Doc<"organizationMembers">["role"],
) {
  return ROLE_PRIORITY[left] >= ROLE_PRIORITY[right] ? left : right;
}

async function listThreadsForUser(ctx: MutationCtx, userId: string) {
  const threads: Array<{ _id: string }> = [];
  let cursor: string | null = null;

  while (true) {
    const result = await ctx.runQuery(agentComponent.threads.listThreadsByUserId, {
      userId,
      order: "desc",
      paginationOpts: { cursor, numItems: 100 },
    });
    threads.push(...result.page);

    if (result.isDone) {
      break;
    }

    cursor = result.continueCursor;
  }

  return threads;
}

async function getProfileByAuthUserId(ctx: MutationCtx, authUserId: string) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
    .unique();
}

export const linkAnonymousAccount = internalMutation({
  args: {
    anonymousAuthUserId: v.string(),
    newAuthUserId: v.string(),
    newUserName: v.string(),
    newUserEmail: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.anonymousAuthUserId === args.newAuthUserId) {
      return { ok: true, transferredThreadCount: 0 };
    }

    const anonymousThreads = await listThreadsForUser(ctx, args.anonymousAuthUserId);
    for (const thread of anonymousThreads) {
      await updateThreadMetadata(ctx, agentComponent, {
        threadId: thread._id,
        patch: { userId: args.newAuthUserId },
      });
    }

    const anonymousProfile = await getProfileByAuthUserId(ctx, args.anonymousAuthUserId);
    const currentProfile = await getProfileByAuthUserId(ctx, args.newAuthUserId);

    let targetProfileId = currentProfile?._id ?? anonymousProfile?._id;

    if (!anonymousProfile && !currentProfile) {
      targetProfileId = await ctx.db.insert("profiles", {
        authUserId: args.newAuthUserId,
        email: args.newUserEmail,
        name: args.newUserName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    if (anonymousProfile && currentProfile) {
      for await (const organization of ctx.db
        .query("organizations")
        .withIndex("by_ownerProfileId", (q) => q.eq("ownerProfileId", anonymousProfile._id))) {
        await ctx.db.patch(organization._id, {
          ownerProfileId: currentProfile._id,
          updatedAt: Date.now(),
        });
      }

      for await (const member of ctx.db
        .query("organizationMembers")
        .withIndex("by_profileId", (q) => q.eq("profileId", anonymousProfile._id))) {
        const existingMember = await ctx.db
          .query("organizationMembers")
          .withIndex("by_organizationId_and_profileId", (q) =>
            q.eq("organizationId", member.organizationId).eq("profileId", currentProfile._id),
          )
          .unique();

        if (existingMember) {
          await ctx.db.patch(existingMember._id, {
            role: mergeRole(existingMember.role, member.role),
            isDefault: existingMember.isDefault || member.isDefault,
            status:
              existingMember.status === "active" || member.status === "active"
                ? "active"
                : "inactive",
            updatedAt: Date.now(),
          });
          await ctx.db.delete(member._id);
          continue;
        }

        await ctx.db.patch(member._id, {
          profileId: currentProfile._id,
          updatedAt: Date.now(),
        });
      }

      for await (const invite of ctx.db
        .query("organizationInvites")
        .withIndex("by_inviterProfileId", (q) => q.eq("inviterProfileId", anonymousProfile._id))) {
        await ctx.db.patch(invite._id, {
          inviterProfileId: currentProfile._id,
          updatedAt: Date.now(),
        });
      }

      for await (const workspaceProperty of ctx.db
        .query("workspaceProperties")
        .withIndex("by_createdByProfileId", (q) => q.eq("createdByProfileId", anonymousProfile._id))) {
        await ctx.db.patch(workspaceProperty._id, {
          createdByProfileId: currentProfile._id,
          updatedAt: Date.now(),
        });
      }

      await ctx.db.patch(currentProfile._id, {
        primaryOrganizationId:
          currentProfile.primaryOrganizationId ?? anonymousProfile.primaryOrganizationId,
        updatedAt: Date.now(),
      });
      await ctx.db.delete(anonymousProfile._id);
      targetProfileId = currentProfile._id;
    } else if (anonymousProfile) {
      await ctx.db.patch(anonymousProfile._id, {
        authUserId: args.newAuthUserId,
        email: args.newUserEmail,
        name: args.newUserName,
        updatedAt: Date.now(),
      });
      targetProfileId = anonymousProfile._id;
    } else if (currentProfile) {
      await ctx.db.patch(currentProfile._id, {
        email: currentProfile.email || args.newUserEmail,
        name: currentProfile.name || args.newUserName,
        updatedAt: Date.now(),
      });
      targetProfileId = currentProfile._id;
    }

    for await (const savedProperty of ctx.db
      .query("savedProperties")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.anonymousAuthUserId))) {
      const existingSavedProperty = await ctx.db
        .query("savedProperties")
        .withIndex("by_authUserId_and_propertyExternalId", (q) =>
          q.eq("authUserId", args.newAuthUserId).eq("propertyExternalId", savedProperty.propertyExternalId),
        )
        .unique();

      if (existingSavedProperty) {
        if (savedProperty.savedAt < existingSavedProperty.savedAt) {
          await ctx.db.patch(existingSavedProperty._id, { savedAt: savedProperty.savedAt });
        }
        await ctx.db.delete(savedProperty._id);
        continue;
      }

      await ctx.db.patch(savedProperty._id, { authUserId: args.newAuthUserId });
    }

    for await (const run of ctx.db
      .query("agentRuns")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.anonymousAuthUserId))) {
      await ctx.db.patch(run._id, { authUserId: args.newAuthUserId, updatedAt: Date.now() });
    }

    for await (const turn of ctx.db
      .query("assistantTurns")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.anonymousAuthUserId))) {
      await ctx.db.patch(turn._id, { authUserId: args.newAuthUserId, updatedAt: Date.now() });
    }

    for await (const batch of ctx.db
      .query("recommendationBatches")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.anonymousAuthUserId))) {
      await ctx.db.patch(batch._id, { authUserId: args.newAuthUserId });
    }

    for await (const usageRow of ctx.db
      .query("usageLedger")
      .withIndex("by_authUserId_and_quotaKey", (q) => q.eq("authUserId", args.anonymousAuthUserId))) {
      await ctx.db.patch(usageRow._id, { authUserId: args.newAuthUserId });
    }

    for await (const event of ctx.db
      .query("analyticsEvents")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.anonymousAuthUserId))) {
      await ctx.db.patch(event._id, { authUserId: args.newAuthUserId });
    }

    const nextOwnerKey = profileOwnerKey(args.newAuthUserId);
    for await (const fact of ctx.db
      .query("knowledgeFacts")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.anonymousAuthUserId))) {
      const existingFact = await ctx.db
        .query("knowledgeFacts")
        .withIndex("by_ownerKey_and_key", (q) => q.eq("ownerKey", nextOwnerKey).eq("key", fact.key))
        .unique();

      if (existingFact) {
        await ctx.db.patch(existingFact._id, {
          importance: Math.max(existingFact.importance, fact.importance),
          summary: existingFact.summary || fact.summary,
          value: existingFact.value || fact.value,
          updatedAt: Date.now(),
        });
        await ctx.db.delete(fact._id);
        continue;
      }

      await ctx.db.patch(fact._id, {
        authUserId: args.newAuthUserId,
        ownerKey: nextOwnerKey,
        updatedAt: Date.now(),
      });
    }

    const nextScopeKey = makeCacheScopeKey(args.newAuthUserId);
    for await (const cacheEntry of ctx.db
      .query("llmCacheEntries")
      .withIndex("by_scopeKey_and_kind_and_model_and_inputHash", (q) =>
        q.eq("scopeKey", makeCacheScopeKey(args.anonymousAuthUserId)),
      )) {
      const existingCacheEntry = await ctx.db
        .query("llmCacheEntries")
        .withIndex("by_scopeKey_and_kind_and_model_and_inputHash", (q) =>
          q
            .eq("scopeKey", nextScopeKey)
            .eq("kind", cacheEntry.kind)
            .eq("model", cacheEntry.model)
            .eq("inputHash", cacheEntry.inputHash),
        )
        .unique();

      if (existingCacheEntry) {
        await ctx.db.delete(cacheEntry._id);
        continue;
      }

      await ctx.db.patch(cacheEntry._id, {
        scopeKey: nextScopeKey,
        updatedAt: Date.now(),
      });
    }

    return {
      ok: true,
      transferredThreadCount: anonymousThreads.length,
      targetProfileId,
    };
  },
});
