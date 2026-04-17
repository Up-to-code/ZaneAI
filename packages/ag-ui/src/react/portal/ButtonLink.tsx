import { cn } from "../../zaneai/utils";
import type { AppLocale } from "../../zaneai/locale";
import type { ReactNode } from "react";

export default function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
  prefetch,
  locale = "ar",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "outline" | "ghost" | "dark" | "white";
  className?: string;
  prefetch?: boolean;
  locale?: AppLocale;
}) {
  const baseStyles = cn(
    "inline-flex items-center justify-center rounded-full font-black transition-all active:scale-[0.98]",
    locale !== "ar" && "uppercase tracking-[0.18em]"
  );
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-[color:color-mix(in_srgb,var(--primary)_88%,black)] px-8 py-3 text-xs",
    outline:
      "border border-border bg-transparent text-foreground hover:border-primary hover:bg-primary/5 px-10 py-4 text-sm dark:text-white dark:hover:bg-primary/10",
    ghost:
      "border border-transparent px-6 py-3 text-xs text-foreground hover:border-border hover:bg-white/70 dark:text-slate-100 dark:hover:bg-slate-900",
    dark:
      "bg-foreground text-background hover:bg-slate-800 px-10 py-4 text-sm dark:bg-slate-900 dark:text-white",
    white:
      "bg-white text-foreground hover:bg-slate-50 px-10 py-4 text-sm dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800",
  } as const;

  return (
    <a
      href={href}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      data-analytics-event="web_cta_clicked"
      data-analytics-location="public_button_link"
      data-analytics-href={href}
      data-analytics-variant={variant}
    >
      <span className="flex items-center gap-3">{children}</span>
    </a>
  );
}
