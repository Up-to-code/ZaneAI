"use client";

import type { ReactNode } from "react";
import { User } from "lucide-react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn, formatWebCopy } from "@/lib/i18n";
import type { OrganizationMemberDisplay } from "../../_lib/entities";
import type { OrganizationSummary } from "@/server/contracts/organizations";

/**
 * WHY:   Organization members need a shared, high-precision visual representation in lists and management views.
 * WHAT:  Renders a member's identity (avatar, name, email) with optional metadata and footer actions.
 * HOW:   Follows the "Pure Canvas" edge-to-edge row philosophy with technical typography and institutional brand tokens.
 */
export default function OrganizationMemberCard({
  member,
  organizationType,
  footer,
}: {
  member: OrganizationMemberDisplay;
  organizationType: OrganizationSummary["type"] | null | undefined;
  footer?: ReactNode;
}) {
  const { direction, dictionary } = useWebLocale();
  const m = dictionary.members;
  const organizationRole = organizationType === "red" ? m.developer : m.broker;

  return (
    <article
      className="group relative flex flex-col gap-6 py-6 px-1 border-b border-[color:var(--workspace-border)] transition-all hover:bg-[var(--workspace-shell)]/5"
      dir={direction}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-6">
          {/* Avatar / Initials */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--workspace-border)] bg-[var(--workspace-shell)]/20 text-lg font-black uppercase text-[var(--zane-ai-deep)] dark:text-white shadow-lg shadow-black/5">
            {member.name ? member.name[0] : <User className="h-5 w-5 opacity-30" />}
            {member.role === "manager" && (
              <div className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--zane-ai-accent)] text-[7px] font-black text-white ring-2 ring-[var(--workspace-panel)]">
                {m.managerBadge}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
                {member.name || m.unnamedUser}
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-accent)]">
                  {member.role}
                </div>
                <span className="h-1 w-1 rounded-full bg-[var(--workspace-border)] opacity-30" />
                <div className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--zane-ai-text-muted)] dark:text-white/60 tabular-nums" dir="ltr">
                  {member.email}
                </div>
              </div>
            </div>

            {/* Technical Metadata Strip (Member Specific) */}
            <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-[var(--zane-ai-text-muted)] dark:text-white/40">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--zane-ai-accent)]" />
                {formatWebCopy(m.joinedAt, { date: member.joinedAtLabel })}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--zane-ai-accent)]" />
                {formatWebCopy(m.roleAccess, { role: organizationRole })}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--zane-ai-accent)]" />
                ID: {member.id.split("_").pop()?.toUpperCase() ?? member.id}
              </span>
            </div>
          </div>
        </div>

        {/* Action Slot */}
        <div className="flex shrink-0 items-center gap-4 pt-1 lg:pt-0">
          {footer}
        </div>
      </div>
    </article>
  );
}
