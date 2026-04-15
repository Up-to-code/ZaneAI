"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { 
  Building2, 
  Users, 
  Globe, 
  Mail, 
  Phone, 
  UserPlus, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ExternalLink,
  Save,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      description: settingsState.organization.description || "",
      website: settingsState.organization.website || "",
      contactEmail: settingsState.organization.contactEmail || "",
      phone: settingsState.organization.phone || "",
    });
  }, [settingsState?.organization]);

  if (!settingsState) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--zane-ai-accent)]" />
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)]">Synchronizing Infrastructure</div>
        </div>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    manager: "Infrastructure Manager",
    member: "Standard Operator",
    viewer: "Limited Observer",
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col px-6 py-10 lg:px-16 lg:py-20">
      
      {/* ── Header: Organization Archetype ───────────────────── */}
      <header className="mb-12 flex flex-col gap-8 lg:mb-16">
        <div className="flex items-center gap-4">
           <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--zane-ai-line)] bg-white/5 dark:border-white/10 dark:bg-black">
              <Building2 className="h-6 w-6 text-[var(--zane-ai-accent)]" />
           </div>
           <div className="flex flex-col">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-text-muted)]">Configuration / Settings</div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-5xl">{settingsState.organization.name}</h1>
           </div>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
           <p className="max-w-3xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/50">
             Manage your organization's digital identity, contact channels, and team access credentials. 
             Changes made here propagate across the entire Zane-AI partner network globally.
           </p>
           <div className="flex items-center gap-3 rounded-2xl border border-[var(--zane-ai-accent-soft)] bg-[var(--zane-ai-accent-soft)]/20 px-5 py-3 dark:border-[var(--zane-ai-accent)]/20">
              <ShieldCheck className="h-4 w-4 text-[var(--zane-ai-accent)]" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--zane-ai-text-muted)]">Access Level</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--zane-ai-accent)]">{roleLabels[settingsState.currentMembershipRole] || settingsState.currentMembershipRole}</span>
              </div>
           </div>
        </div>
      </header>

      {/* ── Status Feedback ───────────────────────────────────── */}
      {(error || message) && (
        <div className="mb-10 flex flex-col gap-3">
          {error && (
             <div className="rounded-2xl border border-rose-200 bg-rose-50/50 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400">
               Error: {error}
             </div>
          )}
          {message && (
             <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400">
               Success: {message}
             </div>
          )}
        </div>
      )}

      {/* ── Main Settings Grid ────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_450px]">
        
        {/* Left: Identity Infrastructure */}
        <section className="flex flex-col gap-8">
          <div className="rounded-[40px] border border-[var(--zane-ai-line)] bg-white/5 p-8 lg:p-12 dark:border-white/10 dark:bg-black/20">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)]">Section 01</div>
                <h2 className="text-xl font-black uppercase tracking-widest text-[var(--zane-ai-deep)] dark:text-white">Organization Identity</h2>
              </div>
              <Building2 className="h-6 w-6 text-[var(--zane-ai-line)] dark:text-white/20" />
            </div>

            <form
              className="grid gap-8"
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
                  .then(() => setMessage("Organization profile updated successfully."))
                  .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to synchronize profile update."))
                  .finally(() => setPending(false));
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="flex flex-col gap-2.5">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/50">
                    Organization Name
                  </span>
                  <input
                    type="text"
                    required
                    value={organizationForm.name}
                    onChange={(e) => setOrganizationForm(f => ({ ...f, name: e.target.value }))}
                    className="h-14 w-full rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-5 text-[13px] font-bold text-[var(--zane-ai-deep)] outline-none transition-all focus:border-[var(--zane-ai-accent)] dark:border-white/10 dark:text-white dark:focus:border-white"
                  />
                </label>
                <label className="flex flex-col gap-2.5">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/50">
                    Website Protocol
                  </span>
                  <input
                    type="url"
                    value={organizationForm.website}
                    onChange={(e) => setOrganizationForm(f => ({ ...f, website: e.target.value }))}
                    placeholder="https://yourdomain.com"
                    className="h-14 w-full rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-5 text-[13px] font-bold text-[var(--zane-ai-deep)] outline-none transition-all focus:border-[var(--zane-ai-accent)] dark:border-white/10 dark:text-white dark:focus:border-white"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="flex flex-col gap-2.5">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/50">
                    Contact Email
                  </span>
                  <input
                    type="email"
                    value={organizationForm.contactEmail}
                    onChange={(e) => setOrganizationForm(f => ({ ...f, contactEmail: e.target.value }))}
                    className="h-14 w-full rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-5 text-[13px] font-bold text-[var(--zane-ai-deep)] outline-none transition-all focus:border-[var(--zane-ai-accent)] dark:border-white/10 dark:text-white dark:focus:border-white"
                  />
                </label>
                <label className="flex flex-col gap-2.5">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/50">
                    Phone Communication
                  </span>
                  <input
                    type="tel"
                    value={organizationForm.phone}
                    onChange={(e) => setOrganizationForm(f => ({ ...f, phone: e.target.value }))}
                    className="h-14 w-full rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-5 text-[13px] font-bold text-[var(--zane-ai-deep)] outline-none transition-all focus:border-[var(--zane-ai-accent)] dark:border-white/10 dark:text-white dark:focus:border-white"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2.5">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/50">
                  Business Description
                </span>
                <textarea
                  value={organizationForm.description}
                  onChange={(e) => setOrganizationForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-5 py-4 text-[13px] font-bold text-[var(--zane-ai-deep)] outline-none transition-all focus:border-[var(--zane-ai-accent)] dark:border-white/10 dark:text-white dark:focus:border-white"
                />
              </label>

              <button
                type="submit"
                disabled={pending}
                className="mt-4 flex max-w-fit items-center gap-3 rounded-2xl bg-[var(--zane-ai-deep)] px-8 py-5 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 dark:bg-white dark:text-black"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {pending ? "Synchronizing..." : "Commit Update"}
              </button>
            </form>
          </div>
        </section>

        {/* Right: Team Infrastructure */}
        <aside className="flex flex-col gap-6">
          
          {/* Invite Hub */}
          <section className="rounded-[40px] border border-[var(--zane-ai-line)] bg-white/5 p-8 dark:border-white/10 dark:bg-black/20">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)]">Section 02</div>
                <h2 className="text-lg font-black uppercase tracking-wide text-[var(--zane-ai-deep)] dark:text-white">Team Access</h2>
              </div>
              <UserPlus className="h-5 w-5 text-[var(--zane-ai-line)] dark:text-white/20" />
            </div>

            <form
              className="grid gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                setPending(true);
                setError(null);
                setMessage(null);
                void createInvite(inviteForm)
                  .then((result) => {
                    const inviteUrl = `${window.location.origin}/signin?mode=signup&invite=${result.token}`;
                    setMessage(`Invite generated. Resource URI: ${inviteUrl}`);
                    setInviteForm({ email: "", role: "member" });
                  })
                  .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to generate invite token."))
                  .finally(() => setPending(false));
              }}
            >
              <label className="flex flex-col gap-2.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/50">Operator Email</span>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="operator@domain.com"
                  className="h-12 w-full rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-4 text-[12px] font-bold text-[var(--zane-ai-deep)] outline-none transition-all focus:border-[var(--zane-ai-accent)] dark:border-white/10 dark:text-white dark:focus:border-white"
                />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/50">Credential Level</span>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(f => ({ ...f, role: e.target.value as any }))}
                  className="h-12 w-full rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-4 text-[12px] font-bold text-[var(--zane-ai-deep)] outline-none transition-all dark:border-white/10 dark:bg-black dark:text-white"
                >
                  <option value="manager" className="dark:bg-black">Manager</option>
                  <option value="member" className="dark:bg-black">Member</option>
                  <option value="viewer" className="dark:bg-black">Viewer</option>
                </select>
              </label>
              <button
                type="submit"
                disabled={pending}
                className="group flex w-full items-center justify-between rounded-2xl border border-[var(--zane-ai-deep)] bg-transparent px-6 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-deep)] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Generate Invite
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </section>

          {/* Members List */}
          <section className="flex flex-col gap-4">
             <div className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">Active Directory</div>
             <div className="flex flex-col gap-3">
               {settingsState.members.map((member: any) => (
                 <div key={member.id} className="flex items-center gap-4 rounded-[28px] border border-[var(--zane-ai-line)] bg-white/5 p-5 dark:border-white/5 dark:bg-black/10">
                   <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--zane-ai-surface)] text-[12px] font-black text-[var(--zane-ai-deep)] dark:bg-white/5 dark:text-white">
                     {member.name.charAt(0)}
                   </div>
                   <div className="flex min-w-0 flex-1 flex-col">
                     <div className="truncate text-[12px] font-black text-[var(--zane-ai-deep)] dark:text-white">{member.name}</div>
                     <div className="truncate text-[10px] font-medium text-[var(--zane-ai-text-muted)] dark:text-white/30">{member.email}</div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                     <span className="rounded-full bg-[var(--zane-ai-accent-soft)]/20 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-[var(--zane-ai-accent)]">{member.role}</span>
                     <span className="text-[7px] font-bold uppercase tracking-widest text-[var(--zane-ai-text-muted)]">{member.status}</span>
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Pending Requests */}
          <section className="flex flex-col gap-4">
             <div className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">Pending Operations</div>
             <div className="flex flex-col gap-3">
               {settingsState.invites.filter((invite: any) => invite.status === "pending").length > 0 ? (
                 settingsState.invites
                   .filter((invite: any) => invite.status === "pending")
                   .map((invite: any) => (
                     <div key={invite.id} className="flex items-center justify-between rounded-[28px] border border-dashed border-[var(--zane-ai-line)] bg-transparent p-5 dark:border-white/5">
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] font-black text-[var(--zane-ai-deep)]/60 dark:text-white/60">{invite.email}</div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--zane-ai-text-muted)]">{invite.role} · Token Sent</div>
                        </div>
                        <Clock className="h-4 w-4 text-[var(--zane-ai-text-muted)] opacity-30" />
                     </div>
                   ))
               ) : (
                 <div className="rounded-[28px] border border-dashed border-[var(--zane-ai-line)] bg-transparent px-6 py-10 text-center dark:border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-50">No Active Invitation Streams</span>
                 </div>
               )}
             </div>
          </section>

        </aside>

      </div>
    </div>
  );
}
