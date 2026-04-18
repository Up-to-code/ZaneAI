export default function PortalFooter() {
    return (
        <footer className="border-t border-border bg-white dark:bg-black px-4 sm:px-6 py-12 sm:py-20 pb-20 sm:pb-32 transition-colors">
            <div className="max-w-[1400px] mx-auto space-y-16">
                
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8">
                    {/* Brand */}
                    <div className="space-y-6 max-w-sm">
                        <div className="flex items-center gap-4">
                            <a href="/" className="inline-block">
                                <img src="/brand-logo.svg" alt="Zane AI" className="h-8 w-auto object-contain" />
                            </a>
                            <div className="space-y-1">
                                <div className="text-[11px] font-bold uppercase tracking-widest text-primary">Zane-ai Platform</div>
                                <div className="text-lg font-bold tracking-tight text-foreground leading-tight">Intelligent Real Estate Infrastructure</div>
                            </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-muted-foreground/80">
                            The definitive operating system bridging the gap between property intent, institutional assets, and intelligence mapping.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16 pt-2">
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Platform</h4>
                            <div className="flex flex-col gap-4 text-sm font-medium">
                                <a href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
                                <a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                                <a href="/download" className="text-muted-foreground hover:text-primary transition-colors">Download Apps</a>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Company</h4>
                            <div className="flex flex-col gap-4 text-sm font-medium">
                                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a>
                                <a href="/team" className="text-muted-foreground hover:text-primary transition-colors">Our Team</a>
                                <a href="/brand" className="text-muted-foreground hover:text-primary transition-colors">Brand Assets</a>
                                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
                            </div>
                        </div>
                        <div className="space-y-6 col-span-2 sm:col-span-1">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Legal</h4>
                            <div className="flex flex-col gap-4 text-sm font-medium">
                                <a href="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                                <a href="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                                <a href="/reading" className="text-muted-foreground hover:text-primary transition-colors">Manifesto</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/50 pt-10">
                    <div className="flex items-center gap-3 px-4 py-2 border border-border rounded-full bg-slate-50 dark:bg-zinc-900 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground">Systems Operational</span>
                    </div>
                    
                    <p className="text-xs font-semibold text-muted-foreground/60 transition-opacity hover:opacity-100">
                        © {new Date().getFullYear()} Zane-ai Operations. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
