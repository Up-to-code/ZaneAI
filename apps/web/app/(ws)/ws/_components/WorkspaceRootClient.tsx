"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Building2, LoaderCircle, ShieldCheck, Users } from "lucide-react";
import WorkspaceShell from "./WorkspaceShell";
import { getWorkspaceOrganizationDisplay } from "../_lib/organizationDisplay";
import { authClient } from "@/lib/auth/webAuthClient";
import { isWebAuthConfigured } from "@/lib/auth/runtime";
import { api } from "@/lib/convexApi";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";

type WorkspaceRootClientProps = {
  children: React.ReactNode;
};

function WorkspaceLoadingState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-foreground">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function WorkspaceOnboarding({
  pendingInvites,
  suggestedOrganizationType,
  onCreateOrganization,
  onAcceptInvite,
  pending,
  error,
}: {
  pendingInvites: Array<{
    id: string;
    token: string;
    email: string;
    role: string;
    organizationName: string;
    organizationType: string;
    inviterName: string;
    expiresAt: number;
  }>;
  suggestedOrganizationType: "broker" | "red";
  onCreateOrganization: (input: { name: string; type: "broker" | "red" }) => Promise<void>;
  onAcceptInvite: (token: string) => Promise<void>;
  pending: boolean;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"broker" | "red">(suggestedOrganizationType);

  const AUTH_TEXT_INPUT_CLASS_NAME =
    "w-full border-b border-[var(--zayon-line)] bg-transparent px-2 py-4 text-lg tracking-wide text-[var(--zayon-deep)] outline-none transition-all placeholder:text-[var(--zayon-text-muted)] focus:border-[var(--zayon-deep)] dark:border-white/20 dark:text-white dark:focus:border-white opacity-80 focus:opacity-100";
  const AUTH_PRIMARY_BUTTON_CLASS_NAME =
    "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--zayon-deep)] px-5 py-4 mt-6 text-[13px] tracking-[0.2em] font-black text-white transition-all hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-white dark:text-black uppercase";

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full items-center justify-center bg-[var(--zayon-background)] px-6 py-10 font-sans selection:bg-[var(--zayon-deep)]/20 dark:bg-black dark:selection:bg-white/20 sm:px-12">
      <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-2 lg:gap-24">
        
        {/* Brand & Content Section */}
        <section className="flex flex-col justify-center text-center lg:text-left" dir="ltr">
          <h1 className="mb-10 text-4xl font-black uppercase tracking-[0.24em] text-[var(--zayon-deep)] dark:text-white lg:text-5xl">
            Zane-ai
          </h1>
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--zayon-line)] bg-[var(--zayon-deep)]/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zayon-text-muted)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50">
            Workspace Protocol
          </div>
          <h2 className="text-3xl font-black uppercase tracking-widest text-[var(--zayon-deep)] dark:text-white sm:text-4xl">
            Initialize
            <br />
            Context
          </h2>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed tracking-widest text-[var(--zayon-text-muted)] dark:text-white/50">
            Establish the root infrastructure. As the genesis partner, you will dictate hierarchy, operations, and deployment parameters.
          </p>
        </section>

        {/* Interaction Canvas */}
        <section className="flex flex-col justify-center" dir="ltr">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            {error ? (
              <div className="mb-8 border-l-2 border-rose-500 py-2 pl-4 text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-500">
                {error}
              </div>
            ) : null}

            {pendingInvites.length > 0 ? (
              <div className="mb-12 space-y-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zayon-text-muted)] dark:text-white/40">Pending Invites</div>
                </div>
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="relative overflow-hidden border-b border-[var(--zayon-line)] pb-6 transition-colors dark:border-white/10">
                    <div className="text-xl font-black text-[var(--zayon-deep)] dark:text-white">{invite.organizationName}</div>
                    <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-[var(--zayon-text-muted)] dark:text-white/40">
                      Dispatched by {invite.inviterName} • <span className="text-[var(--zayon-deep)] dark:text-white/80">{invite.role}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void onAcceptInvite(invite.token)}
                      disabled={pending}
                      className={AUTH_PRIMARY_BUTTON_CLASS_NAME}
                    >
                      {pending ? "Authenticating..." : "Accept & Sync"}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <form
              className="flex flex-col space-y-8"
              onSubmit={(event) => {
                event.preventDefault();
                void onCreateOrganization({
                  name,
                  type,
                });
              }}
            >
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zayon-text-muted)] dark:text-white/40">Owner Genesis</div>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-widest text-[var(--zayon-deep)] dark:text-white">Create Org</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={AUTH_TEXT_INPUT_CLASS_NAME}
                    placeholder="Organization Moniker"
                  />
                </div>

                <div className="space-y-4">
                  <span className="block pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zayon-text-muted)] dark:text-white/40">Entity Type</span>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setType("red")}
                      className={`relative overflow-hidden border-b-2 px-2 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                        type === "red"
                          ? "border-[var(--zayon-deep)] text-[var(--zayon-deep)] dark:border-white dark:text-white"
                          : "border-transparent text-[var(--zayon-text-muted)]/50 hover:text-[var(--zayon-text-muted)] dark:border-transparent dark:text-white/40 dark:hover:text-white"
                      }`}
                    >
                      Developer
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("broker")}
                      className={`relative overflow-hidden border-b-2 px-2 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                        type === "broker"
                          ? "border-[var(--zayon-deep)] text-[var(--zayon-deep)] dark:border-white dark:text-white"
                          : "border-transparent text-[var(--zayon-text-muted)]/50 hover:text-[var(--zayon-text-muted)] dark:border-transparent dark:text-white/40 dark:hover:text-white"
                      }`}
                    >
                      Broker
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={pending || !name.trim()}
                className={AUTH_PRIMARY_BUTTON_CLASS_NAME}
              >
                {pending ? "Deploying..." : "Initialize Instance"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function WorkspaceRootClient({ children }: WorkspaceRootClientProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isWebAuthConfigured()) {
    return (
      <WorkspaceLoadingState
        title="Workspace auth is not configured"
        description="Add NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_AUTH_URL so partner sign-in can initialize."
      />
    );
  }

  if (!mounted) {
    return (
      <WorkspaceLoadingState
        title="Opening Workspace"
        description="Loading your organization, permissions, and partner routes."
      />
    );
  }

  return <WorkspaceRootClientInner>{children}</WorkspaceRootClientInner>;
}

function WorkspaceRootClientInner({ children }: WorkspaceRootClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = authClient.useSession();
  const workspaceState = useQuery(
    api.partnerWorkspace.getWorkspaceState,
    session.data?.session ? {} : "skip",
  ) as any;
  const createOrganization = useMutation(api.partnerWorkspace.createOrganization);
  const acceptInvite = useMutation(api.partnerWorkspace.acceptInvite);
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isWebAuthConfigured()) {
      return;
    }
    if (session.isPending) {
      return;
    }
    if (!session.data?.session) {
      const params = new URLSearchParams();
      params.set("returnTo", `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`);
      const inviteToken = searchParams.get("invite");
      if (inviteToken) {
        params.set("invite", inviteToken);
      }
      router.replace(`/signin?${params.toString()}`);
    }
  }, [pathname, router, searchParams, session.data?.session, session.isPending]);

  useEffect(() => {
    const inviteToken = searchParams.get("invite");
    if (!inviteToken || !workspaceState?.needsOrganization) {
      return;
    }
    const matchingInvite = workspaceState.pendingInvites.find((invite: any) => invite.token === inviteToken);
    if (!matchingInvite) {
      return;
    }
    setPending(true);
    setActionError(null);
    void acceptInvite({ token: inviteToken })
      .then(() => {
        router.replace("/ws");
        router.refresh();
      })
      .catch((cause) => {
        setActionError(cause instanceof Error ? cause.message : "Unable to accept invite.");
      })
      .finally(() => setPending(false));
  }, [acceptInvite, router, searchParams, workspaceState]);

  const organizationDisplay = useMemo(() => {
    if (!workspaceState?.organization) {
      return null;
    }
    return getWorkspaceOrganizationDisplay({
      name: workspaceState.organization.name,
      type: workspaceState.organization.type,
      status: workspaceState.organization.status,
      logoUrl: null,
      isVerified: workspaceState.organization.status === "active",
      locale: "en",
    });
  }, [workspaceState?.organization]);

  if (!isWebAuthConfigured()) {
    return (
      <WorkspaceLoadingState
        title="Workspace auth is not configured"
        description="Add NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_AUTH_URL so partner sign-in can initialize."
      />
    );
  }

  if (session.isPending || (session.data?.session && workspaceState === undefined)) {
    return (
      <WorkspaceLoadingState
        title="Opening Workspace"
        description="Loading your organization, permissions, and partner routes."
      />
    );
  }

  if (!session.data?.session) {
    return null;
  }

  if (!workspaceState) {
    return (
      <WorkspaceLoadingState
        title="Workspace is synchronizing"
        description="Finalizing your session and loading the partner workspace."
      />
    );
  }

  if (workspaceState.needsOrganization) {
    return (
      <WorkspaceOnboarding
        pendingInvites={workspaceState.pendingInvites}
        suggestedOrganizationType={workspaceState.suggestedOrganizationType}
        pending={pending}
        error={actionError}
        onAcceptInvite={async (token) => {
          setPending(true);
          setActionError(null);
          try {
            await acceptInvite({ token });
            router.replace("/ws");
            router.refresh();
          } catch (cause) {
            setActionError(cause instanceof Error ? cause.message : "Unable to accept invite.");
          } finally {
            setPending(false);
          }
        }}
        onCreateOrganization={async (input) => {
          setPending(true);
          setActionError(null);
          try {
            await createOrganization(input);
            router.replace("/ws");
            router.refresh();
          } catch (cause) {
            setActionError(cause instanceof Error ? cause.message : "Unable to create organization.");
          } finally {
            setPending(false);
          }
        }}
      />
    );
  }

  if (!organizationDisplay) {
    return children;
  }

  return (
    <WorkspaceShell
      user={workspaceState.user}
      visibleZoneKeys={workspaceState.visibleZoneKeys as WorkspaceZoneKey[]}
      organization={organizationDisplay}
      recentAssistantThreads={[]}
      allAssistantThreads={[]}
      signalCounts={{ notificationCount: 0, inboxCount: 0 }}
      complianceBanner={null}
    >
      {children}
    </WorkspaceShell>
  );
}
