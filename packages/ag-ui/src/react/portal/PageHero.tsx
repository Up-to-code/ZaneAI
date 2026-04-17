import type { ReactNode } from "react";
import { cn } from "../../anan/utils";

interface PageHeroProps {
    badge?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    visual?: ReactNode;
    className?: string;
    contentClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    badgeWrapClassName?: string;
    titleTag?: "h1" | "div";
}

/**
 * WHY:   Public pages need a consistent hero layout that stays fully server-rendered for fast first paint.
 * WHAT:  Renders badge/title/description/actions plus an optional visual slot with flexible class overrides.
 * HOW:   Uses a dynamic tag for the title and plain JSX composition (no client hooks).
 */
export default function PageHero({
    badge,
    title,
    description,
    actions,
    visual,
    className,
    contentClassName,
    titleClassName,
    descriptionClassName,
    badgeWrapClassName,
    titleTag = "h1",
}: PageHeroProps) {
    const TitleTag = titleTag;

    const fadeUpStagger = "animate-in fade-in fill-mode-both slide-in-from-bottom-8 duration-1000";

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <div className={cn("mb-20 last:mb-0", contentClassName)}>
                {badge && (
                    <div
                        className={cn(badgeWrapClassName, fadeUpStagger)}
                        style={{ animationDelay: "100ms" }}
                    >
                        {badge}
                    </div>
                )}
                <TitleTag
                    className={cn(titleClassName, fadeUpStagger)}
                    style={{ animationDelay: "200ms" }}
                >
                    {title}
                </TitleTag>
                {description && (
                    <div
                        className={cn(descriptionClassName, fadeUpStagger)}
                        style={{ animationDelay: "300ms" }}
                    >
                        {description}
                    </div>
                )}
                {actions && (
                    <div
                        className={cn("w-full", fadeUpStagger)}
                        style={{ animationDelay: "400ms" }}
                    >
                        {actions}
                    </div>
                )}
            </div>
            {visual && (
                <div
                    className={cn(fadeUpStagger)}
                    style={{ animationDelay: "500ms" }}
                >
                    {visual}
                </div>
            )}
        </div>
    );
}
