import { Eye } from "lucide-react";
import { cn } from "../../anan/utils";
import { getWebDictionary } from "../../anan/i18n";
import type { AppLocale } from "../../anan/locale";

/**
 * WHY:   Public pages need a consistent footer that stays SSR-only for performance and stability.
 * WHAT:  Renders the brand block, link columns, and legal/copyright line.
 * HOW:   Static markup using Next.js `Link`/`Image` only.
 */
export default function Footer({ locale = "ar" }: { locale?: AppLocale }) {
    const dictionary = getWebDictionary(locale);
    return (
        <footer className="border-t border-border bg-background px-6 pt-32 pb-16 dark:border-white/10 dark:bg-slate-950">
            <div className="max-w-[1400px] mx-auto space-y-32">

                {/* Top Section: Brand (Left) | Links (Right) */}
                <div className="flex flex-col lg:flex-row justify-between gap-16">
                    {/* Brand & Tagline */}
                    <div className="space-y-6 max-w-sm">
                        <div className="flex items-center gap-4">
                            <a href="/" className="inline-block">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 transition-all hover:bg-primary/10 dark:bg-white/5">
                                    <Eye className="h-8 w-8 text-primary fill-none contrast-125" />
                                </div>
                            </a>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary">Zane-ai</div>
                                <div className="text-sm font-black text-foreground dark:text-white leading-[1.1]">{dictionary.footer.brandTitle}</div>
                            </div>
                        </div>
                        <p className="max-w-xs text-sm font-bold leading-relaxed text-muted-foreground dark:text-slate-400">
                            {dictionary.footer.description}
                        </p>
                    </div>

                    {/* Minimal empty space where links used to be */}
                    <div className="hidden md:block"></div>
                </div>

                {/* Bottom Section: Tagline (Left) | Copyright (Right) */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 dark:border-white/10 md:flex-row">
                    <p className={cn(
                        "text-[10px] font-black text-muted-foreground",
                        locale !== "ar" && "uppercase tracking-widest"
                    )}>
                        {dictionary.footer.bottomTagline}
                    </p>
                    <p className={cn(
                        "text-[10px] font-black text-muted-foreground opacity-60 transition-opacity hover:opacity-100",
                        locale !== "ar" && "uppercase tracking-widest"
                    )}>
                        {dictionary.footer.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
