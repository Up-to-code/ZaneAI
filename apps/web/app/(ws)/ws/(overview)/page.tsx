"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, Mail, Sparkles, Users, MessageSquare, ArrowRight, Zap, ShieldCheck, Globe, LifeBuoy } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function WorkspacePage() {
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState, {});

  if (!workspaceState) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="text-xl font-black uppercase tracking-[0.2em] text-[var(--zane-ai-deep)] dark:text-white">Initialize Context</div>
          <div className="mt-8 h-[2px] w-24 bg-gradient-to-r from-transparent via-[var(--zane-ai-deep)] to-transparent dark:via-white animate-pulse" />
        </div>
      </div>
    );
  }

  const isDeveloper = workspaceState.audience === "developer";
  const headline = isDeveloper
    ? "Distribute high-fidelity inventory across the partner network."
    : "Coordinate inventory, manage offers, and accelerate partner momentum.";
  const summary = isDeveloper
    ? "Technical founders and developers manage source records, publishing pipelines, and distribution integrity from one unified workspace."
    : "Real estate brokers and teams coordinate inventory access, relationship movement, and automated offer sequences in real-time.";

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col px-6 py-12 lg:px-16 lg:py-24">
      
      {/* ── Meta-Information Header ───────────────────────────── */}
      <div className="mb-16 flex flex-col items-start gap-8 lg:mb-24">
        <div className="inline-flex items-center gap-3 rounded-full border border-[var(--zane-ai-line)] bg-white/5 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-accent)] dark:border-white/10 dark:bg-black/40">
          <Zap className="h-3.5 w-3.5 fill-current" />
          {isDeveloper ? "Developer Protocol v4.0" : "Broker Protocol v4.0"}
        </div>
        
        <div className="flex flex-col gap-6 lg:gap-10">
          <h1 className="text-6xl font-black uppercase tracking-[-0.02em] text-[var(--zane-ai-deep)] dark:text-white sm:text-7xl lg:text-[120px] leading-[0.9] transition-all">
            {workspaceState.organization?.name}
          </h1>
          <div className="flex max-w-5xl flex-col items-start gap-8 lg:flex-row lg:items-center">
            <p className="flex-1 text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white/90 lg:text-3xl lg:leading-tight">
              {headline}
            </p>
            <div className="hidden h-[1px] w-12 bg-[var(--zane-ai-line)] dark:bg-white/20 lg:block" />
            <p className="flex-1 text-[11px] font-medium leading-relaxed tracking-widest text-[var(--zane-ai-text-muted)] dark:text-white/40">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {/* ── Operational Grid: Metrics & Intelligence ───────────── */}
      <div className="grid border-y border-[var(--zane-ai-line)] dark:border-white/10 lg:grid-cols-[1fr_400px]">
        
        {/* Left: Metric Architecture */}
        <div className="grid divide-y divide-[var(--zane-ai-line)] dark:divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            {
              label: "Portfolio Intelligence",
              value: workspaceState.metrics.propertyCount,
              sub: "Total Managed Units",
              status: "Operational",
            },
            {
              label: "Network Readiness",
              value: workspaceState.metrics.publishedPropertyCount,
              sub: "Live In App",
              status: "Published",
            },
            {
              label: "Pipeline Growth",
              value: workspaceState.metrics.draftPropertyCount,
              sub: "Pending Launch",
              status: "Drafting",
            },
          ].map((item) => (
            <div key={item.label} className="group flex flex-col p-8 lg:p-12 transition-colors hover:bg-[var(--zane-ai-surface)] dark:hover:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">{item.label}</span>
                <span className="flex h-2 w-2 rounded-full bg-[var(--zane-ai-accent)]" />
              </div>
              <div className="mt-12 text-7xl font-black tracking-tighter text-[var(--zane-ai-deep)] dark:text-white lg:text-8xl">
                {item.value}
              </div>
              <div className="mt-6 flex flex-col gap-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--zane-ai-deep)] dark:text-white">{item.sub}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--zane-ai-text-muted)] dark:text-white/30">Status: {item.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Security & Identity */}
        <div className="flex flex-col border-t border-[var(--zane-ai-line)] p-8 dark:border-white/10 lg:border-l lg:border-t-0 lg:p-12">
           <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-3xl border border-[var(--zane-ai-line)] bg-white/5 dark:border-white/10 dark:bg-black">
              <ShieldCheck className="h-6 w-6 text-[var(--zane-ai-accent)]" strokeWidth={1.5} />
           </div>
           <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] dark:text-white/40">Credential Status</div>
           <div className="mt-4 text-2xl font-black uppercase tracking-widest text-[var(--zane-ai-deep)] dark:text-white leading-tight">
             Verified {workspaceState.audience}
           </div>
           <p className="mt-8 text-[11px] font-medium leading-relaxed tracking-widest text-[var(--zane-ai-text-muted)] dark:text-white/40">
             Your workspace is authenticated within the Zane-AI partner network. All communications and property updates are encrypted and recorded.
           </p>
           <div className="mt-auto pt-12">
             <Link
               href="/ws/settings"
               className="group flex w-full items-center justify-between rounded-2xl border border-[var(--zane-ai-deep)] bg-transparent px-6 py-5 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-deep)] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
             >
               Manage Identity
               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
             </Link>
           </div>
        </div>

      </div>

      {/* ── Active Hubs ────────────────────────────────────────── */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Properties",
            id: "PR-2022",
            desc: "The core unit of your operations. Manage every listing detail.",
            href: "/ws/projects",
            icon: Building2,
          },
          {
            title: "Settings",
            id: "OR-CONF",
            desc: "Infrastructure controls, team access, and organization identity.",
            href: "/ws/settings",
            icon: Globe,
          },
          {
            title: "Support",
            id: "HELP-X",
            desc: "Zane-AI partner support and technical documentation access.",
            href: "/ws/help",
            icon: LifeBuoy,
            isComingSoon: true,
          },
        ].map((item) => {
          const Content = (
            <div className="flex flex-col gap-10">
              <div className="flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--zane-ai-line)] bg-white/5 dark:border-white/10 dark:bg-black">
                  <item.icon className="h-6 w-6 text-[var(--zane-ai-deep)] dark:text-white" strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-deep)] dark:text-white">{item.title}</div>
                  <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.24em] text-[var(--zane-ai-text-muted)]">ID: {item.id}</div>
                </div>
              </div>
              <div className="relative">
                <p className="text-[11px] font-bold uppercase leading-relaxed tracking-[0.18em] text-[var(--zane-ai-text-muted)] dark:text-white/40">
                  {item.desc}
                </p>
                {item.isComingSoon && (
                  <span className="mt-4 inline-block rounded-full bg-[var(--zane-ai-surface)] px-3 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:bg-white/5 dark:text-white/30">
                    Offline / Coming Soon
                  </span>
                )}
              </div>
            </div>
          );

          if (item.isComingSoon) {
             return (
               <div key={item.title} className="rounded-[40px] border border-[var(--zane-ai-line)] bg-transparent p-10 opacity-50 dark:border-white/5">
                 {Content}
               </div>
             );
          }

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative rounded-[40px] border border-[var(--zane-ai-line)] bg-transparent p-10 transition-all hover:bg-[var(--zane-ai-deep)] dark:border-white/10 dark:hover:bg-white"
            >
              <div className="transition-colors group-hover:text-white dark:group-hover:text-black">
                {Content}
                <div className="mt-12 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em]">
                  Initialize Entry
                  <div className="h-px w-10 bg-[var(--zane-ai-line)] transition-all group-hover:w-20 group-hover:bg-white dark:group-hover:bg-black" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
