import { cn } from "@/lib/i18n";
import type { AppLocale } from "@/lib/i18n";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface CardProps {
    title?: ReactNode;
    description?: ReactNode;
    icon?: LucideIcon;
    variant?: "default" | "dark" | "accent";
    className?: string;
    children?: ReactNode;
    locale?: AppLocale;
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
    children,
    locale = "ar"
}: CardProps) {
    const variants = {
        default: "border border-border/80 bg-card text-card-foreground hover:border-primary/50 dark:border-white/5 dark:bg-[#0A0A0A]",
        dark: "border border-white/5 bg-[#050505] text-white",
        accent: "border border-primary/20 bg-primary/5 text-foreground hover:border-primary/40 dark:bg-primary/5"
    };

    return (
        <div className={`group space-y-8 rounded-[40px] p-10 transition-all hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)] md:p-12 ${variants[variant]} ${className}`}>
            {Icon && (
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${variant === "dark" ? "bg-white/10" : "bg-primary/10"}`}>
                    <Icon className={`h-6 w-6 ${variant === "dark" ? "text-white" : "text-primary"}`} />
                </div>
            )}
            {(title || description) && (
                <div className="space-y-3">
                    {title && (
                        <h3 className={cn(
                            "text-xl font-black leading-[1.15]",
                            locale !== "ar" && "tracking-[-0.02em]",
                            variant === "dark" ? "text-white" : "text-foreground dark:text-slate-100"
                        )}>
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
