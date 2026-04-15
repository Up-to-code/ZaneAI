import Link from "next/link";
import { Hexagon } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";
import WebLocaleSwitcher from "@/app/_components/WebLocaleSwitcher";
import { getWebDictionary } from "@/lib/i18n";
import type { AppLocale } from "@/lib/locale";

export default function Navbar({ locale = "ar" }: { locale?: AppLocale }) {
    const dictionary = getWebDictionary(locale);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/82 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/90">
            <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-6">
                <div className="flex items-center gap-12">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition hover:bg-primary/20"
                        data-analytics-event="web_nav_clicked"
                        data-analytics-location="navbar"
                        data-analytics-href="/"
                    >
                        <Hexagon className="h-6 w-6 text-primary fill-primary" />
                    </Link>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                    <WebLocaleSwitcher />
                    <ThemeToggle className="h-10 w-10 rounded-2xl border-border bg-white/88 text-foreground hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800" />
                    <Link href="/signin" className="hidden text-xs font-bold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary dark:text-white sm:block">{dictionary.nav.workspaceSignIn}</Link>
                    <Link
                        href="/signin"
                        className="rounded-full border-none bg-primary px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-[color:color-mix(in_srgb,var(--primary)_88%,black)] active:scale-95 sm:px-10 sm:text-xs"
                        data-analytics-event="web_primary_cta_clicked"
                        data-analytics-location="navbar"
                        data-analytics-href="/signin"
                    >
                        {dictionary.nav.getStarted}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
