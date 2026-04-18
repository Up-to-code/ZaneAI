import { Section } from "@/components/ui/portal";
import { MoveRight } from "lucide-react";
import { getWebDictionary, resolveLocale, WEB_LOCALE_COOKIE } from "@zaneai/ag-ui/zaneai";
import { cookies } from "next/headers";

export default async function HomePage() {
    const cookieStore = await cookies();
    const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
    const dictionary = getWebDictionary(locale);

    return (
        <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
            {/* ── Section 1: Hero ── */}
            <Section className="py-16 md:py-24" containerClassName="overflow-visible">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-start animate-zone-page-enter">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                            <span className="text-sm">★</span>
                            {dictionary.landing.heroBadge}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05] [text-wrap:balance]">
                            {dictionary.landing.heroTitle}
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed pt-2" dir="auto">
                            {dictionary.landing.heroDescription}
                        </p>

                        <div className="pt-4 md:pt-6 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <a href="/signin" className="inline-flex h-12 md:h-14 w-full sm:w-auto px-8 items-center justify-center rounded-full bg-black dark:bg-white text-sm md:text-base font-bold text-white dark:text-black transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-black/5">
                                {dictionary.landing.heroTryFree}
                            </a>
                            <a href="#architect" className="inline-flex h-12 md:h-14 w-full sm:w-auto px-8 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 border border-border/40 text-sm md:text-base font-bold text-foreground transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 active:scale-95">
                                {dictionary.landing.heroBookDemo}
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 w-full flex animate-zone-page-enter [animation-delay:200ms]">
                        <div className="relative w-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-14 overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-50 border border-border/20 dark:bg-zinc-950/50 isolate [transform:translateZ(0)]">
                            <img
                                src="/images/8DDFC0DA-D4B9-40EF-99B4-CA8BFBF18627.PNG"
                                alt="Zane AI Interface"
                                className="w-full h-auto aspect-square lg:aspect-auto object-contain transition-transform duration-1000 hover:scale-[1.01] shadow-2xl rounded-2xl md:rounded-3xl border border-black/5 dark:border-white/5"
                            />
                            <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] ring-1 ring-inset ring-black/5 dark:ring-white/10 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </Section>

            {/* ── Section 2: Institutional Scale ── */}
            <Section id="metrics" bg="none" className="py-12 md:py-20 border-y border-border/30 bg-slate-50/50 dark:bg-zinc-950/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{dictionary.landing.metricsTitle}</h2>
                        <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground/90">Validated Infrastructure.</p>
                    </div>

                    {[
                        { value: dictionary.landing.metricsAUMValue, label: dictionary.landing.metricsAUMText },
                        { value: dictionary.landing.metricsUsersValue, label: dictionary.landing.metricsUsersText },
                        { value: dictionary.landing.metricsCoverageValue, label: dictionary.landing.metricsCoverageText }
                    ].map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <div className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">{stat.value}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </Section>
            {/* ── Section 3: Core Operating Pillars ── */}
            <Section id="pillars" bg="white" className="py-24 md:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
                    {[
                        { title: dictionary.landing.pillarConnectTitle, desc: dictionary.landing.pillarConnectDesc, icon: "01" },
                        { title: dictionary.landing.pillarAutomateTitle, desc: dictionary.landing.pillarAutomateDesc, icon: "02" },
                        { title: dictionary.landing.pillarScaleTitle, desc: dictionary.landing.pillarScaleDesc, icon: "03" }
                    ].map((pillar, i) => (
                        <div key={i} className="space-y-6 md:space-y-8 animate-zone-page-enter" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="text-5xl md:text-6xl font-black text-primary/10 tracking-tighter leading-none">{pillar.icon}</div>
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{pillar.title}</h3>
                                <p className="text-base md:text-lg font-medium text-muted-foreground leading-relaxed" dir="auto">{pillar.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Section 4: Platform Architecture & Intelligent Layer ── */}
            <Section id="architect" bg="dark" className="py-40 md:py-60 overflow-hidden relative">
                <div className="absolute top-1/2 start-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full pointer-events-none opacity-30" />

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left Column: Institutional Intent */}
                    <div className="order-2 lg:order-1 space-y-8 md:space-y-12 animate-zone-page-enter">
                        <div className="space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary select-none">{dictionary.landing.archTitle}</h2>
                            <h3 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none">
                                {dictionary.landing.archSubtitle}
                            </h3>
                        </div>

                        <p className="text-xl md:text-2xl text-white/50 font-medium leading-relaxed max-w-xl" dir="auto">
                            {dictionary.landing.archDescription}
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                            <div className="space-y-1">
                                <div className="text-sm font-black uppercase tracking-widest text-white/30">Protocol</div>
                                <div className="text-lg font-bold text-white/90">Institutional Sync 2.0</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-black uppercase tracking-widest text-white/30">Latency</div>
                                <div className="text-lg font-bold text-white/90">&lt; 40ms Real-time</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Orbital Visual System */}
                    <div className="order-1 lg:order-2 relative group">
                        <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />

                        {/* Connective SVG Layer */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" viewBox="0 0 100 100">
                            <defs>
                                <linearGradient id="line-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#EC1B23" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#EC1B23" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#EC1B23" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Lines connecting labels to core */}
                            <path d="M 0,20 Q 20,20 40,40" stroke="url(#line-glow)" strokeWidth="0.5" fill="none" className="animate-glow-pulse" />
                            <path d="M 100,50 Q 80,50 60,60" stroke="url(#line-glow)" strokeWidth="0.5" fill="none" className="animate-glow-pulse" />
                            <path d="M 20,90 Q 30,70 45,65" stroke="url(#line-glow)" strokeWidth="0.5" fill="none" className="animate-glow-pulse" />
                        </svg>

                        {/* Floating High-Precision Labels */}
                        <div className="absolute -top-6 -left-4 md:-left-12 z-20 animate-float">
                            <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-fast" />
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white">Fragmented Silos</span>
                            </div>
                        </div>

                        <div className="absolute top-1/4 -right-4 md:-right-16 z-20 animate-float" style={{ animationDelay: "1.5s" }}>
                            <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white">Intelligence Mapping</span>
                            </div>
                        </div>

                        <div className="absolute -bottom-8 left-1/4 z-20 animate-float" style={{ animationDelay: "3s" }}>
                            <div className="bg-primary text-white px-6 py-3 rounded-full shadow-[0_20px_50px_rgba(236,27,35,0.4)] flex items-center gap-4">
                                <span className="text-xs md:text-sm font-black uppercase tracking-widest leading-none">Single Source of Truth</span>
                            </div>
                        </div>

                        {/* Central Architecture Visual */}
                        <div className="relative z-0 rounded-[3rem] md:rounded-[4.5rem] p-px bg-gradient-to-br from-white/20 to-transparent">
                            <div className="bg-black/40 rounded-[3rem] md:rounded-[4.5rem] overflow-hidden backdrop-blur-3xl p-4 md:p-8">
                                <img
                                    src="/images/8418DF5A-41A0-4F02-B80C-1E437569BC00.PNG"
                                    alt="Systems Architecture Visualization"
                                    className="w-full h-auto rounded-[2rem] md:rounded-[3.5rem] opacity-80 group-hover:opacity-100 transition-all duration-1000 grayscale-[0.5] group-hover:grayscale-0 scale-[1.01] group-hover:scale-100"
                                />
                            </div>

                            {/* Corner Brackets */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-[3rem] -translate-x-2 -translate-y-2" />
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-[3rem] translate-x-2 translate-y-2" />
                        </div>
                    </div>
                </div>

                {/* Section Technical Footer */}
                <div className="mt-32 md:mt-48 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">All Systems Operational</span>
                    </div>
                    <div className="h-4 w-px bg-white/20 hidden md:block" />
                    <div className="text-[10px] md:text-xs font-medium text-white/60 tracking-tighter max-w-sm">
                        ARCHITECTURE_VERSION: 1.0.4 // INFRASTRUCTURE: CONVEX_REALTIME_BUS // ORCHESTRATION: ZANE_INTELLIGENCE_LAYER
                    </div>
                </div>
            </Section>

            {/* ── Section 5: Detailed Feature Showcase ── */}
            <Section id="features" bg="white" className="py-32 md:py-48 border-t border-border/30">
                <div className="space-y-32">
                    {/* Feature 1: Structured Pipeline */}
                    <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                        <div className="flex-1 space-y-8">
                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <span className="font-bold text-lg">★</span>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-3xl md:text-5xl font-bold tracking-tighter">{dictionary.landing.pipelineTitle}</h3>
                                <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed" dir="auto">
                                    {dictionary.landing.pipelineDescription}
                                </p>
                            </div>
                            <ul className="space-y-4 pt-4">
                                {[dictionary.landing.truthTitle, dictionary.landing.reflowTitle].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex-1 w-full rounded-2xl md:rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/40 p-6 md:p-10 border border-border/20">
                            <img
                                src="/images/9B0598F5-0981-4D58-9861-A228FC19BE74.PNG"
                                alt="Pipeline Performance"
                                className="w-full h-auto rounded-xl md:rounded-2xl shadow-xl border border-border/10"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* ── Section 6: CTA Section ── */}
            <Section className="py-40 bg-black text-white relative overflow-hidden text-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[800px] h-[800px] bg-primary/20 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 space-y-12 md:space-y-16 max-w-4xl mx-auto px-4">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none">
                        {dictionary.landing.ctaTitle}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/50 font-medium leading-relaxed max-w-2xl mx-auto" dir="auto">
                        {dictionary.landing.ctaDescription}
                    </p>
                    <div>
                        <a href="/signin" className="inline-flex h-16 md:h-20 items-center justify-center rounded-full bg-primary px-10 md:px-14 text-base md:text-lg font-black text-white transition-all hover:bg-white hover:text-black active:scale-95 shadow-xl shadow-primary/20">
                            {dictionary.landing.ctaButton}
                            <MoveRight className="ms-4 h-6 w-6 rtl:rotate-180" />
                        </a>
                    </div>
                </div>
            </Section>
        </main>
    );
}
