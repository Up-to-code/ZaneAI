"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";

export default function WorkspaceSettingsPage() {
  const settingsState = useQuery(api.partnerWorkspace.getOrganizationSettingsState, {}) as any;
  const createInvite = useMutation(api.partnerWorkspace.createOrganizationInvite);
  const updateOrganization = useMutation(api.partnerWorkspace.updateOrganizationProfile);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [organizationForm, setOrganizationForm] = useState({
    name: "",
    description: "",
    website: "",
    contactEmail: "",
    phone: "",
  });
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member" as "manager" | "member" | "viewer",
  });

  useEffect(() => {
    if (!settingsState?.organization) {
      return;
    }
    setOrganizationForm({
      name: settingsState.organization.name,
      description: settingsState.organization.description,
      website: settingsState.organization.website,
      contactEmail: settingsState.organization.contactEmail,
      phone: settingsState.organization.phone,
    });
  }, [settingsState?.organization]);

  if (!settingsState) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="text-2xl font-black text-foreground">Loading organization settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-8 lg:py-10">
      <section className="rounded-[32px] border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Organization settings</div>
            <h1 className="mt-2 text-3xl font-black text-foreground">{settingsState.organization.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-muted-foreground">
              Owners and managers handle team invites, organization profile details, and partner workspace access here.
            </p>
          </div>
          <div className="rounded-[24px] border border-border/60 bg-background/70 px-4 py-3 text-sm font-medium text-muted-foreground">
            Your role: <span className="font-black text-foreground">{settingsState.currentMembershipRole}</span>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
        <section className="rounded-[28px] border border-border/60 bg-card p-6 shadow-sm">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Profile</div>
            <h2 className="mt-2 text-xl font-black text-foreground">Organization identity</h2>
          </div>
          <form
            className="mt-5 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setPending(true);
              setError(null);
              setMessage(null);
              void updateOrganization({
                name: organizationForm.name,
                description: organizationForm.description || undefined,
                website: organizationForm.website || undefined,
                contactEmail: organizationForm.contactEmail || undefined,
                phone: organizationForm.phone || undefined,
              })
                .then(() => setMessage("Organization profile updated."))
                .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to update organization."))
                .finally(() => setPending(false));
            }}
          >
            {[
              ["name", "Organization name"],
              ["description", "Description"],
              ["website", "Website"],
              ["contactEmail", "Contact email"],
              ["phone", "Phone"],
            ].map(([key, label]) => (
              <label key={key} className="block space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</span>
                {key === "description" ? (
                  <textarea
                    value={organizationForm[key as keyof typeof organizationForm]}
                    onChange={(event) => setOrganizationForm((current) => ({ ...current, [key]: event.target.value }))}
                    rows={4}
                    className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={organizationForm[key as keyof typeof organizationForm]}
                    onChange={(event) => setOrganizationForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none"
                  />
                )}
              </label>
            ))}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center rounded-[22px] bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save organization"}
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-border/60 bg-card p-6 shadow-sm">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Team</div>
              <h2 className="mt-2 text-xl font-black text-foreground">Invite members</h2>
            </div>
            <form
              className="mt-5 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                setPending(true);
                setError(null);
                setMessage(null);
                void createInvite(inviteForm)
                  .then((result) => {
                    const inviteUrl = `${window.location.origin}/signin?mode=signup&invite=${result.token}`;
                    setMessage(`Invite created. Share this link: ${inviteUrl}`);
                    setInviteForm({ email: "", role: "member" });
                  })
                  .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to create invite."))
                  .finally(() => setPending(false));
              }}
            >
              <label className="block space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Email</span>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(event) => setInviteForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none"
                  placeholder="member@partner.com"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Role</span>
                <select
                  value={inviteForm.role}
                  onChange={(event) => setInviteForm((current) => ({ ...current, role: event.target.value as typeof inviteForm.role }))}
                  className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none"
                >
                  <option value="manager">Manager</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
              </label>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center rounded-[22px] bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {pending ? "Sending..." : "Create invite"}
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-border/60 bg-card p-6 shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Members</div>
            <div className="mt-4 space-y-3">
              {settingsState.members.map((member: any) => (
                <div key={member.id} className="rounded-[22px] border border-border/60 bg-background/70 p-4">
                  <div className="text-sm font-black text-foreground">{member.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{member.email}</div>
                  <div className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    {member.role} · {member.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border/60 bg-card p-6 shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Pending invites</div>
            <div className="mt-4 space-y-3">
              {settingsState.invites.filter((invite: any) => invite.status === "pending").length > 0 ? (
                settingsState.invites
                  .filter((invite: any) => invite.status === "pending")
                  .map((invite: any) => (
                    <div key={invite.id} className="rounded-[22px] border border-dashed border-border/60 bg-background/70 p-4">
                      <div className="text-sm font-black text-foreground">{invite.email}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{invite.role}</div>
                    </div>
                  ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-border/60 bg-background/70 px-4 py-8 text-center text-sm font-medium text-muted-foreground">
                  No pending invites yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
