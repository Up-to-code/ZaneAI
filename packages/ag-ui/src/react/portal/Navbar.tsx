import { cn } from "../../zaneai";
import { Eye } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import WebLocaleSwitcher from "./WebLocaleSwitcher";
import { getWebDictionary } from "../../zaneai/i18n";
import type { AppLocale } from "../../zaneai/locale";

export default function Navbar({ locale = "ar" }: { locale?: AppLocale }) {
    const dictionary = getWebDictionary(locale);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/82 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/90">
            <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">
                <div className="flex items-center gap-12">
                    <a
                        href="/"
                        className="flex h-12 w-12 items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        data-analytics-event="web_nav_clicked"
                        data-analytics-location="navbar"
                        data-analytics-href="/"
                    >
                        <img src="/logo.svg" alt="Zane-ai Brand" className="h-8 w-auto" />
                    </a>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                    <WebLocaleSwitcher />
                    <ThemeToggle className="h-10 w-10 rounded-2xl border-border bg-white/88 text-foreground hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800" />
                    <a
                        href="/signin"
                        className={cn(
                            "hidden text-xs font-bold text-foreground transition-colors hover:text-primary dark:text-white sm:block",
                            locale !== "ar" && "uppercase tracking-[0.18em]"
                        )}
                    >
                        {dictionary.nav.workspaceSignIn}
                    </a>
                    <a
                        href="/signin"
                        className={cn(
                            "rounded-full border-none bg-primary px-6 py-3 text-[10px] font-black text-primary-foreground transition-all hover:bg-[color:color-mix(in_srgb,var(--primary)_88%,black)] active:scale-95 sm:px-10 sm:text-xs",
                            locale !== "ar" && "uppercase tracking-[0.2em]"
                        )}
                        data-analytics-event="web_primary_cta_clicked"
                        data-analytics-location="navbar"
                        data-analytics-href="/signin"
                    >
                        {dictionary.nav.getStarted}
                    </a>
                </div>
            </div>
        </nav>
    );
}
