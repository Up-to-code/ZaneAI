import { cn } from "@anan/ag-ui/anan";
import { Eye } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import WebLocaleSwitcher from "./WebLocaleSwitcher";
import { getWebDictionary } from "@anan/ag-ui/anan";
import type { AppLocale } from "@anan/ag-ui/anan";

export default function Navbar({ locale = "ar" }: { locale?: AppLocale }) {
    const dictionary = getWebDictionary(locale);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/82 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/90">
            <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">
                <div className="flex items-center gap-10">
                    <a
                        href="/"
                        className="flex items-center gap-4 transition-all active:scale-95"
                        data-analytics-event="web_nav_clicked"
                        data-analytics-location="navbar"
                        data-analytics-href="/"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background dark:bg-white dark:text-black">
                           <Eye className="h-6 w-6" />
                        </div>
                        <span className="hidden text-xl font-black uppercase tracking-tighter sm:block">Zane-ai</span>
                    </a>

                    <div className="hidden lg:flex items-center gap-8 border-l border-border pl-10 ml-4">
                        <a href="/#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Features</a>
                        <a href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Enterprise</a>
                        <a href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Vision</a>
                    </div>
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
