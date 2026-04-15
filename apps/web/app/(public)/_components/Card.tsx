import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface CardProps {
    title?: ReactNode;
    description?: ReactNode;
    icon?: LucideIcon;
    variant?: "default" | "dark" | "accent";
    className?: string;
    children?: ReactNode;
}

/**
 * WHY:   Public surfaces need a consistent card primitive that can be rendered server-side for speed.
 * WHAT:  Displays an optional icon, title/description, and an optional children slot with variant styling.
 * HOW:   Pure presentational component (no interactivity), so it remains SSR-friendly.
 */
export default function Card({
    title,
    description,
    icon: Icon,
    variant = "default",
    className = "",
    children
}: CardProps) {
    const variants = {
        default: "border border-border bg-card text-card-foreground hover:border-primary dark:border-white/10 dark:bg-slate-900/88",
        dark: "border border-white/10 bg-slate-950 text-white dark:bg-slate-950",
        accent: "border border-primary/20 bg-primary/5 text-foreground hover:border-primary dark:bg-primary/10"
    };

    return (
        <div className={`group space-y-6 rounded-[28px] p-8 transition-all md:p-10 ${variants[variant]} ${className}`}>
            {Icon && (
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${variant === "dark" ? "bg-white/10" : "bg-primary/10"}`}>
                    <Icon className={`h-6 w-6 ${variant === "dark" ? "text-white" : "text-primary"}`} />
                </div>
            )}
            {(title || description) && (
                <div className="space-y-3">
                    {title && (
                        <h3 className={`text-xl font-black leading-[1.15] tracking-[-0.02em] ${variant === "dark" ? "text-white" : "text-foreground dark:text-slate-100"}`}>
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className={`text-sm font-bold leading-relaxed ${variant === "dark" ? "text-slate-400" : "text-muted-foreground dark:text-slate-300"}`}>
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children && <div className="pt-4">{children}</div>}
        </div>
    );
}
