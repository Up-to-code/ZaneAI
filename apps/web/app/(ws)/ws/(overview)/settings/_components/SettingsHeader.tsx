/**
 * WHY:   Workspace settings should open with calm orientation copy instead of a loud dashboard hero.
 * WHAT:  Renders a compact text-only header for the settings surface.
 * HOW:   Keeps hierarchy typographic first and lets the surrounding page handle structure and chrome.
 */
export default function SettingsHeader({
  title,
  description,
  workspaceLabel,
  dir = "rtl",
}: {
  title: string;
  description: string;
  workspaceLabel: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <header className="px-1" dir={dir}>
      <div className="flex flex-col">
        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--zane-ai-accent)]">
          {workspaceLabel}
        </div>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
          {description}
        </p>
      </div>
    </header>
  );
}
