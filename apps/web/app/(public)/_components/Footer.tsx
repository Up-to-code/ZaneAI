import Link from "next/link";
import { Hexagon } from "lucide-react";
import { getWebDictionary } from "@/lib/i18n";
import type { AppLocale } from "@/lib/locale";

/**
 * WHY:   Public pages need a consistent footer that stays SSR-only for performance and stability.
 * WHAT:  Renders the brand block, link columns, and legal/copyright line.
 * HOW:   Static markup using Next.js `Link`/`Image` only.
 */
export default function Footer({ locale = "ar" }: { locale?: AppLocale }) {
    const dictionary = getWebDictionary(locale);
    return (
        <footer className="border-t border-border bg-background px-6 pt-24 pb-12 dark:border-white/10 dark:bg-slate-950">
            <div className="max-w-5xl mx-auto space-y-24">

                {/* Top Section: Brand (Left) | Links (Right) */}
                <div className="flex flex-col lg:flex-row justify-between gap-16">
                    {/* Brand & Tagline */}
                    <div className="space-y-6 max-w-sm">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="inline-block">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10">
                                    <Hexagon className="h-7 w-7 text-foreground fill-foreground dark:text-white dark:fill-white" />
                                </div>
                            </Link>
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {dictionary.footer.bottomTagline}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 transition-opacity hover:opacity-100">
                        {dictionary.footer.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
