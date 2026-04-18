import { cn } from "@/lib/i18n";
import { Eye, Bell, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import WebLocaleSwitcher from "./WebLocaleSwitcher";
import { getWebDictionary } from "@/lib/i18n";
import type { AppLocale } from "@/lib/i18n";

export default function Navbar({ locale = "ar" }: { locale?: AppLocale }) {
    const dictionary = getWebDictionary(locale);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white dark:bg-black transition-colors">
            <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-10">
                    <a
                        href="/"
                        className="flex items-center gap-3 transition-all active:scale-95 group"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20">
                            <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold tracking-tight text-foreground hidden sm:block">
                            Zane Platform
                        </span>
                    </a>
                    
                    <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 border border-border rounded-lg bg-slate-50 dark:bg-zinc-900/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            Node: WS-OP-01
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        {["Manifesto", "Features", "Pricing", "Brand"].map((link) => (
                            <a 
                                key={link}
                                href={`/${link.toLowerCase()}`} 
                                className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 pr-4 border-r border-border mr-1">
                        <WebLocaleSwitcher />
                        <ThemeToggle className="h-9 w-9 rounded-xl border-border bg-transparent text-foreground hover:bg-muted dark:text-white" />
                        <button className="h-9 w-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">
                            <Bell className="h-4.5 w-4.5" />
                        </button>
                    </div>
                    
                    <a
                        href="/signin"
                        className="h-10 px-5 flex items-center justify-center rounded-xl bg-black dark:bg-white text-white dark:text-black text-[11px] font-bold transition-all active:scale-95 shadow-sm"
                    >
                        {dictionary.nav.workspaceSignIn}
                    </a>
                    
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-foreground">
                        <User className="h-4.5 w-4.5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
