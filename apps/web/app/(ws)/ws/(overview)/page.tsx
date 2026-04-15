"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, Mail, Sparkles, Users } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";

export const dynamic = "force-dynamic";

export default function WorkspacePage() {
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState, {});

  if (!workspaceState) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="text-xl font-black uppercase tracking-widest text-[var(--zayon-deep)] dark:text-white">Initialize Context</div>
          <div className="mt-4 h-1 w-12 bg-[var(--zayon-deep)] dark:bg-white animate-pulse" />
        </div>
      </div>
    );
  }

  const isDeveloper = workspaceState.audience === "developer";
  const headline = isDeveloper
    ? "Publish launch-ready inventory for your partner network."
    : "Coordinate partner inventory, offers, and broker follow-through.";
  const summary = isDeveloper
    ? "Developers manage source records, property publishing, and distribution readiness from one shared Workspace."
    : "Brokers manage inventory access, partner follow-up, and offer momentum from one shared Workspace.";

  const quickLinks = [
    {
      title: "Properties",
      description: "Create records, edit launch details, and publish.",
      href: "/ws/projects",
      icon: Building2,
    },
    {
      title: "Partners / CRM",
      description: "Track partner-side conversations and interactions.",
      href: "/ws/crm",
      icon: Users,
    },
    {
      title: "Inbox",
      description: "Invites, internal coordination, and messages.",
      href: "/ws/inbox",
      icon: Mail,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col px-6 py-10 lg:px-12 lg:py-16">
      
      {/* ── Main Operations Header ── */}
      <div className="mb-12 flex flex-col pt-8">
        <div className="mb-10 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--zayon-line)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zayon-text-muted)] dark:border-white/10 dark:text-white/50">
          <Sparkles className="h-4 w-4 text-[var(--zayon-accent)]" />
          Normal Mode Operation
        </div>
        <h1 className="max-w-4xl text-5xl lg:text-7xl font-black uppercase tracking-[0.1em] text-[var(--zayon-deep)] dark:text-white leading-[1.1]">
          {workspaceState.organization?.name}
        </h1>
        <div className="mt-8 grid max-w-4xl gap-4">
          <p className="text-xl lg:text-2xl font-black uppercase tracking-widest text-[var(--zayon-deep)] opacity-80 dark:text-white/80 leading-relaxed">
            {headline}
          </p>
          <p className="max-w-2xl text-xs font-black uppercase leading-relaxed tracking-[0.2em] text-[var(--zayon-text-muted)] dark:text-white/40">
            {summary}
          </p>
        </div>
      </div>

      {/* ── Architecture Grid ── */}
      <div className="grid lg:grid-cols-[1fr_300px] border-t border-[var(--zayon-line)] dark:border-white/10">
        
        {/* Left Column: Metrics */}
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--zayon-line)] dark:divide-white/10 border-b lg:border-b-0 border-[var(--zayon-line)] dark:border-white/10 lg:border-r">
          {[
            {
              label: "Properties",
              value: workspaceState.metrics.propertyCount,
              helper: `${workspaceState.metrics.publishedPropertyCount} live in app`,
            },
            {
              label: "Drafts",
              value: workspaceState.metrics.draftPropertyCount,
              helper: "In preparation phase",
            },
            {
              label: "Invites",
              value: workspaceState.metrics.inviteCount,
              helper: "Pending team joins",
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col justify-center px-6 py-12 lg:px-10 lg:py-20 group">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zayon-text-muted)] dark:text-white/40 group-hover:text-[var(--zayon-deep)] dark:group-hover:text-white transition-colors">
                {item.label}
              </div>
              <div className="mt-6 mb-4 text-7xl lg:text-8xl font-black text-[var(--zayon-deep)] dark:text-white leading-none tracking-tighter">
                {item.value}
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-[var(--zayon-accent)]">
                /// {item.helper}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Protocol Access */}
        <div className="flex flex-col px-6 py-12 lg:px-10 lg:py-20">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zayon-text-muted)] dark:text-white/40">Role Mode</div>
          <div className="mt-6 text-2xl font-black uppercase tracking-widest text-[var(--zayon-deep)] dark:text-white leading-tight">
            {isDeveloper ? "Developer Protocol" : "Broker Protocol"}
          </div>
          <p className="mt-8 mb-12 text-[10px] font-black uppercase leading-relaxed tracking-[0.2em] text-[var(--zayon-text-muted)] dark:text-white/40">
            {isDeveloper
              ? "Your landing defaults to property readiness and publishing alignment."
              : "Your landing defaults to inventory coordination and relationship motion."}
          </p>
          <div className="mt-auto">
            <Link
              href="/ws/projects"
              className="group flex w-full items-center justify-between border border-[var(--zayon-deep)] dark:border-white bg-transparent px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zayon-deep)] dark:text-white transition-all hover:bg-[var(--zayon-deep)] hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Enter Protocol
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

      </div>

      {/* ── Sub Navigation Tiers ── */}
      <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--zayon-line)] dark:divide-white/10 border-t border-[var(--zayon-line)] dark:border-white/10">
        {quickLinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group flex flex-col px-6 py-12 lg:px-10 lg:py-16 transition-colors hover:bg-[var(--zayon-surface)] dark:hover:bg-white/[0.02]"
          >
           <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--zayon-line)] bg-transparent text-[var(--zayon-deep)] dark:border-white/10 dark:text-white">
                <item.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h2 className="text-[13px] font-black uppercase tracking-[0.25em] text-[var(--zayon-deep)] dark:text-white">{item.title}</h2>
           </div>
            <p className="mt-8 flex-grow text-[10px] font-black uppercase leading-relaxed tracking-[0.2em] text-[var(--zayon-text-muted)] dark:text-white/40">{item.description}</p>
            <div className="mt-12 flex items-center text-[9px] font-black uppercase tracking-[0.3em] text-[var(--zayon-deep)] transition-colors dark:text-white">
              Initialize Context
              <div className="ml-4 h-px w-8 bg-[var(--zayon-line)] transition-all group-hover:w-16 group-hover:bg-[var(--zayon-deep)] dark:bg-white/20 dark:group-hover:bg-white" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
