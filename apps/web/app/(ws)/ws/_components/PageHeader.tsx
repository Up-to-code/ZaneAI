import { memo } from "react"
import { cn } from "@/lib/i18n";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
};

const PageHeaderComponent = function PageHeader({
  eyebrow,
  title,
  description,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <header className={cn("flex items-start justify-between gap-4 border-b border-[color:var(--workspace-border)] pb-6", className)}>
      <div className="space-y-3">
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-accent)]">
          {eyebrow}
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-3xl">
          {title}
        </h1>
        {description && (
          <div className="max-w-xl text-[12px] font-medium leading-relaxed tracking-wider text-[var(--zane-ai-text-muted)] dark:text-white/50">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex shrink-0">{actions}</div>}
    </header>
  );
}

export default memo(PageHeaderComponent)
