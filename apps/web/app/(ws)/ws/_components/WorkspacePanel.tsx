import { cn } from "@/lib/i18n";

type WorkspacePanelProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "dark" | "muted" | "warn";
};

const tones = {
  default: "border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-bubble-other-foreground)]",
  dark: "border border-white/10 bg-[var(--zane-ai-deep)] text-white",
  muted: "border border-[color:var(--workspace-border)] bg-[var(--workspace-elevated)] text-[var(--workspace-bubble-other-foreground)]",
  warn: "border border-[color:color-mix(in_srgb,var(--zane-ai-accent)_24%,transparent)] bg-[var(--workspace-accent-soft)] text-[var(--workspace-bubble-other-foreground)]",
};

export default function WorkspacePanel({
  children,
  className,
  tone = "default",
}: WorkspacePanelProps) {
  return (
    <section
      className={cn(
        "rounded-[24px] p-6",
        tones[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
