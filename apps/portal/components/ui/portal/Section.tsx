import type { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    id?: string;
    bg?: "white" | "slate" | "dark" | "primary" | "glass" | "gradient" | "none";
    border?: boolean;
}

/**
 * WHY:   Public pages and marketing surfaces need a consistent section wrapper without client-side JS.
 * WHAT:  Renders a themed `<section>` with a max-width container and optional background/border presets.
 * HOW:   Uses static class composition only (no hooks), so it can remain a Server Component for SSR performance.
 */
export default function Section({
    children,
    className = "",
    containerClassName = "",
    id,
    bg = "white",
    border = false
}: SectionProps) {
    const backgrounds = {
        white: "bg-background text-foreground",
        slate: "bg-slate-50 text-foreground dark:bg-slate-950 dark:text-slate-100",
        dark: "bg-slate-950 text-white dark:bg-[#050c17] dark:text-slate-50",
        primary: "bg-primary text-primary-foreground",
        glass: "border-y border-white/30 bg-white/72 text-foreground backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100",
        gradient: "bg-slate-50 text-foreground dark:bg-slate-950 dark:text-slate-100", // Simplified gradient to prevent Tailwind parsing issues
        none: ""
    };

    return (
        <section
            id={id}
            className={`px-6 py-32 transition-colors md:py-48 ${backgrounds[bg]} ${border ? "border-b border-border dark:border-white/10" : ""} ${className}`}
        >
            <div className={`max-w-[1400px] mx-auto ${containerClassName}`}>
                {children}
            </div>
        </section>
    );
}
