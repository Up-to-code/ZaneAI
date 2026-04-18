"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import ThemeToggle from "./ui/portal/ThemeToggle";
import WebLocaleSwitcher from "./ui/portal/WebLocaleSwitcher";

export default function PortalNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Manifesto", href: "/reading" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Brand", href: "/brand" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <>
            {/* ── Main Navbar ── fully opaque so nothing bleeds through */}
            <nav className="fixed top-0 left-0 right-0 z-[9999] border-b border-border/30 bg-white dark:bg-black transition-colors">
                <div className="mx-auto flex h-14 sm:h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
                    <div className="flex items-center gap-8 lg:gap-12">
                        <a href="/" className="flex items-center transition-opacity hover:opacity-80 active:scale-95">
                            <img src="/brand-logo.svg" alt="Zane AI" className="h-6 sm:h-7 w-auto object-contain" />
                        </a>
                        
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.slice(0, 4).map((link) => (
                                <a 
                                    key={link.name}
                                    href={link.href} 
                                    className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 border-r border-border/20 pe-3 sm:pe-4 me-1">
                            <WebLocaleSwitcher className="opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-900" />
                            <ThemeToggle className="opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-900" />
                        </div>
                        <a href="/signin" className="hidden sm:inline-flex text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                            Sign In
                        </a>
                        
                        <a
                            href="/signin"
                            className="hidden sm:inline-flex h-9 px-5 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-[13px] transition-all shadow-sm hover:opacity-90 active:scale-95"
                        >
                            Get Started
                        </a>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border/50 transition-colors active:scale-95"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            <Menu className={`h-[16px] w-[16px] text-foreground transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'} absolute`} />
                            <X className={`h-[16px] w-[16px] text-foreground transition-all duration-200 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Menu Overlay ── */}
            <div 
                className={`fixed inset-0 z-[9998] bg-white dark:bg-black transition-all duration-300 ease-out ${
                    isMobileMenuOpen 
                        ? "opacity-100 pointer-events-auto" 
                        : "opacity-0 pointer-events-none"
                }`}
                style={{ paddingTop: "3.5rem" }}
            >
                {/* Scrollable content area */}
                <div className="flex flex-col h-full overflow-y-auto overscroll-contain">
                    {/* Nav Links */}
                    <div className="flex-1 px-4 sm:px-6 pt-2 pb-4">
                        {navLinks.map((link, i) => (
                            <a 
                                key={link.name}
                                href={link.href} 
                                className="flex items-center justify-between py-3.5 border-b border-border/20 group"
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ 
                                    transitionDelay: isMobileMenuOpen ? `${i * 30}ms` : "0ms",
                                    opacity: isMobileMenuOpen ? 1 : 0,
                                    transform: isMobileMenuOpen ? "translateY(0)" : "translateY(8px)",
                                    transition: "opacity 250ms ease, transform 250ms ease"
                                }}
                            >
                                <span className="text-[15px] font-medium text-foreground">{link.name}</span>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-active:text-foreground transition-colors rtl:rotate-180" />
                            </a>
                        ))}
                    </div>

                    {/* Bottom CTA — always visible, pinned at the bottom of scroll area */}
                    <div className="px-4 sm:px-6 py-4 space-y-4 border-t border-border/20 bg-white dark:bg-black"
                        style={{
                            opacity: isMobileMenuOpen ? 1 : 0,
                            transform: isMobileMenuOpen ? "translateY(0)" : "translateY(8px)",
                            transition: "opacity 300ms ease 150ms, transform 300ms ease 150ms"
                        }}
                    >
                        <div className="flex items-center justify-between p-1.5 rounded-full bg-slate-50 dark:bg-zinc-900/50 border border-border/30">
                            <span className="ps-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Appearance & Language</span>
                            <div className="flex items-center gap-1">
                                <WebLocaleSwitcher className="bg-white dark:bg-zinc-800 border-border/40 shadow-sm" />
                                <ThemeToggle className="bg-white dark:bg-zinc-800 border-border/40 shadow-sm" />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <a 
                                href="/signin" 
                                className="flex h-11 w-full items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 border border-border/30 font-medium text-foreground text-[13px] transition-colors active:scale-[0.98]"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </a>
                            <a 
                                href="/signin" 
                                className="flex h-11 w-full items-center justify-center rounded-full bg-primary text-white font-medium text-[13px] transition-colors active:scale-[0.98]"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Access Workspace
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
