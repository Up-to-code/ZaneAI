type SettingsOverviewStripProps = {
  currentTabLabel: string;
  membersCount: number;
  invitesCount: number;
  roleLabel: string;
  labels: {
    currentSection: string;
    members: string;
    invites: string;
    currentRole: string;
  };
};

/**
 * WHY:   The settings page needs a compact orientation strip so users can understand where they are without relying on oversized hero cards.
 * WHAT:  Renders the active section label plus a few low-noise workspace stats.
 * HOW:   Keeps the content in one flat bordered row that wraps gracefully across RTL and LTR layouts.
 */
export default function SettingsOverviewStrip({
  currentTabLabel,
  membersCount,
  invitesCount,
  roleLabel,
  labels,
}: SettingsOverviewStripProps) {
  const items = [
    { label: labels.currentSection, value: currentTabLabel },
    { label: labels.members, value: String(membersCount) },
    { label: labels.invites, value: String(invitesCount) },
    { label: labels.currentRole, value: roleLabel },
  ];

  return (
    <section className="border-t border-b border-[color:var(--workspace-border)] bg-transparent py-6 px-1">
      <div className="flex flex-wrap items-center gap-16">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--zane-ai-text-muted)] opacity-50">
              {item.label}
            </div>
            <div className="mt-2 text-[13px] font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
