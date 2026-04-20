import { cn } from "@/lib/i18n";

/**
 * WHY:   Workspace settings should open with calm orientation copy instead of a loud dashboard hero.
 * WHAT:  Renders a high-precision, compact orientation strip for the settings surface.
 * HOW:   Removes the massive page title in favor of workspace-level section titles.
 */
export default function SettingsHeader({
  description,
  workspaceLabel,
  dir = "rtl",
}: {
  title?: string;
  description: string;
  workspaceLabel: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <header className="px-1" dir={dir}>
      <div className="flex flex-col gap-1.5">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--zane-ai-accent)]">
          {workspaceLabel}
        </div>
        <p className="max-w-3xl text-[12px] font-black uppercase tracking-tight text-[var(--zane-ai-text-muted)] dark:text-white/30">
          {description}
        </p>
      </div>
    </header>
  );
}
