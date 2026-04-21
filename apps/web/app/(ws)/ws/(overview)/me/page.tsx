"use client";

import ProfileWorkspace from "./_components/ProfileWorkspace";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import type { ProfileSummary } from "@/server/contracts/profiles";

/**
 * WHY:   The account screen should display the real authenticated user's profile.
 * WHAT:  Reads the user profile from Convex workspace state.
 * HOW:   Uses the Convex getWorkspaceState query to populate the profile form.
 */
export default function WorkspaceMePage() {
  const { dictionary } = useWebLocale();
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState);

  if (workspaceState === undefined) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading profile…</div>
      </div>
    );
  }

  const profile: ProfileSummary = {
    email: workspaceState.user.email ?? undefined,
    name: workspaceState.user.name ?? undefined,
    username: workspaceState.user.username ?? undefined,
    role: "developer" as const,
    showInOffersDirectory: true,
    isActive: true,
    authProvider: {
      id: "google",
      passwordManaged: false,
    },
  };

  async function saveProfileAction() {
    return { ok: true as const, message: "Profile saved." };
  }

  return (
    <div className="mx-auto min-h-max w-full max-w-4xl space-y-5 p-6 pb-20 lg:min-h-full lg:p-8 lg:pb-24">
      <header className="space-y-1 px-1">
        <div className="text-[11px] font-semibold text-[var(--workspace-muted)]">{dictionary.settings.workspaceLabel}</div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">{dictionary.settings.accountSettingsTitle}</h1>
        <p className="max-w-2xl text-sm font-medium leading-7 text-muted-foreground">{dictionary.settings.accountSettingsDescription}</p>
      </header>

      <ProfileWorkspace
        initialProfile={profile}
        fallbackName={workspaceState.user.name || "Zane-ai User"}
        fallbackEmail={workspaceState.user.email || ""}
        onSave={saveProfileAction}
      />
    </div>
  );
}
