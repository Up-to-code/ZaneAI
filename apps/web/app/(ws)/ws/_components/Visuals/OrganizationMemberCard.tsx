import { memo } from "react";
import { Mail } from "lucide-react";
import { cn } from "@/lib/i18n";
import type { OrganizationSummary } from "@/server/contracts/organizations";
import type { OrganizationMemberDisplay } from "../../_lib/entities";
import {
  getOrganizationMemberInitials,
  getOrganizationMemberRoleLabel,
  getOrganizationMemberTheme,
} from "../../_lib/organizationMembers";

/**
 * Institutional member card — High-precision row layout with technical typography and validated context indicators.
 */
const OrganizationMemberCardComponent = function OrganizationMemberCard({
  member,
  organizationType,
  footer,
  className,
}: {
  member: OrganizationMemberDisplay;
  organizationType: OrganizationSummary["type"] | null | undefined;
  footer?: React.ReactNode;
  className?: string;
}) {
  const theme = getOrganizationMemberTheme(organizationType);
  const roleLabel = getOrganizationMemberRoleLabel(member.role);
  const avatarLabel = getOrganizationMemberInitials(member.name);
  const isActive = member.statusLabel === "نشط";
  const usernameLabel = member.username ? `@${member.username}` : null;

  return (
    <article
      dir="rtl"
      className={cn(
        "group relative flex flex-col gap-5 rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-6 transition-all hover:bg-[var(--workspace-panel-hover)] shadow-sm shadow-black/5",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        {/* Profile Avatar & Precise Status Bit */}
        <div className="relative">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[18px] font-black uppercase text-white transition-transform duration-300 group-hover:scale-105",
              theme.avatarClassName,
            )}
          >
            {avatarLabel}
          </div>
          {isActive && (
            <div className="absolute -right-1 -top-1 ring-4 ring-[var(--workspace-panel)] rounded-full">
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--zane-ai-accent)]" />
            </div>
          )}
        </div>

        {/* Identity & Technical Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[18px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
              {member.name}
            </h3>
            {usernameLabel && (
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--zane-ai-text-muted)] opacity-40">
                {usernameLabel}
              </span>
            )}
          </div>
          
          <div className="mt-2.5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--zane-ai-text-muted)] dark:text-white/40" dir="ltr">
              <Mail className="h-3.5 w-3.5 opacity-60" />
              <span className="truncate">{member.email}</span>
            </div>
            
            <div className="hidden sm:block h-1 w-1 rounded-full bg-[color:var(--workspace-border)] opacity-60" />
            
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--zane-ai-accent)]">
                {roleLabel}
              </span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em]",
                theme.roleClassName
              )}>
                {theme.accentLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {footer && (
        <div className="mt-2 border-t border-[color:var(--workspace-border)] pt-5">
          {footer}
        </div>
      )}
    </article>
  );
};

export default memo(OrganizationMemberCardComponent);

