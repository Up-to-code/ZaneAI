import { 
  PageHero, 
  MetricGrid, 
  Section, 
  FeatureCardGrid, 
  SectionLabel 
} from "@/components/ui/portal";
import { cookies } from "next/headers";
import { getWebDictionary, resolveLocale, WEB_LOCALE_COOKIE } from "@anan/ag-ui/anan";
import { BarChart3, Building2, ShieldCheck, Zap, Globe, Cpu, ArrowRight, Eye, Layers } from "lucide-react";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background">
      {/* Cinematic Hero Section */}
      <Section className="relative overflow-hidden pt-32 lg:pt-48 pb-24">
        {/* Cinematic Backdrop */}
        <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[140px]" />
          <div className="absolute top-1/2 right-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        
        <PageHero
          badge={
            <SectionLabel icon={Eye} className="bg-primary/5 text-primary border-primary/10">
              {dictionary.footer.brandTitle} — Unified Operating Layer
            </SectionLabel>
          }
          title={
            <span className="flex flex-col gap-2">
              <span className="font-brand-sans text-6xl font-black uppercase tracking-[-0.04em] sm:text-8xl lg:text-[11rem] leading-[0.85] text-foreground">
                Intelligent <br />
                <span className="text-primary italic">Infrastructure.</span>
              </span>
            </span>
          }
          description={
            <p className="mx-auto mt-12 max-w-2xl text-lg font-bold leading-relaxed text-muted-foreground md:text-xl lg:max-w-3xl">
              The next-generation operating system for real estate. We bridge the gap between physical assets and digital intelligence, orchestrating high-precision data with institutional-grade scale.
            </p>
          }
          contentClassName="mx-auto max-w-[1400px] space-y-12 px-6 text-center"
          actions={
            <div className="mt-20 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a
                href="/signin"
                className="group inline-flex min-w-[280px] h-20 items-center justify-center rounded-3xl bg-foreground px-12 text-[10px] font-black uppercase tracking-[0.3em] text-background transition-all hover:bg-foreground/90 active:scale-95 shadow-2xl shadow-foreground/5"
              >
                Enter Workspace
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/brand"
                className="inline-flex min-w-[280px] h-20 items-center justify-center rounded-3xl border border-border bg-background px-12 text-[10px] font-black uppercase tracking-[0.3em] text-foreground transition-all hover:bg-muted active:scale-95"
              >
                Explore Brand Document
              </a>
            </div>
          }
        />
      </Section>

      {/* Institutional Metrics */}
      <Section className="py-24 border-y border-border/40 bg-slate-50/50 dark:bg-white/[0.01] backdrop-blur-sm">
        <MetricGrid
          items={[
            { value: "01", label: "Unified Intelligence" },
            { value: "50K+", label: "Property Units" },
            { value: "100%", label: "Real-time Sync" },
          ]}
          className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-3"
          itemClassName="text-center space-y-6 group"
          valueClassName="block font-brand-sans text-8xl font-black text-foreground tracking-tighter transition-all group-hover:text-primary group-hover:scale-105 duration-500"
          labelClassName="block text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground"
        />
      </Section>

      {/* High-Contrast Feature Grid */}
      <Section id="intelligence" className="py-32 lg:py-48">
         <div className="mx-auto max-w-5xl mb-24 space-y-8 text-center px-6">
            <SectionLabel icon={Layers} className="mx-auto">Orchestration Layer</SectionLabel>
            <h2 className="font-brand-sans text-5xl font-black uppercase tracking-[-0.03em] sm:text-8xl">
               One Ledger. <br />
               <span className="text-primary lg:font-brand-serif lg:italic lg:lowercase lg:tracking-tight lg:font-bold">Total Control.</span>
            </h2>
            <p className="text-lg md:text-xl font-bold text-muted-foreground leading-relaxed">
               Zane-AI is more than just management software. It is the intelligent substrate that connects developers, brokers, and assets into a single, high-fidelity ecosystem.
            </p>
         </div>
         
         <FeatureCardGrid
          items={[
            {
              title: "Institutional Scale",
              description: "Engineered to handle complex portfolios with trillions of data points in millisecond latency.",
              icon: Building2,
              variant: "accent",
            },
            {
              title: "Global Intelligence",
              description: "Unified cross-border inventory mapping with AI-driven market prediction models.",
              icon: Globe,
            },
            {
              title: "Asset Performance",
              description: "Deep analytics that turn property metadata into actionable alpha for investment houses.",
              icon: BarChart3,
              variant: "dark",
            },
          ]}
          className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:px-12 md:grid-cols-3"
        />
      </Section>

      {/* Final Call to Action - Cinematic Dark */}
      <Section bg="dark" className="border-t border-white/5 py-64 relative overflow-hidden bg-black">
         {/* Deep Brand Glow */}
         <div className="absolute -bottom-1/2 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/20 blur-[160px]" />
         
         <div className="relative z-10 mx-auto max-w-6xl px-6 text-center space-y-20">
            <h2 className="font-brand-sans text-5xl font-black uppercase tracking-[-0.04em] sm:text-[10rem] leading-none text-white">
               THE FUTURE <br />
               <span className="text-primary italic">ORCHESTRATED.</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl font-bold text-white/40 leading-relaxed md:text-2xl">
               Deploy the most advanced real estate technology ever built. <br className="hidden md:block" />
               Join the institutional intelligence revolution.
            </p>
            <div className="flex flex-col items-center justify-center gap-10 sm:flex-row pt-8">
               <a
                 href="/signin"
                 className="inline-flex min-w-[320px] h-20 items-center justify-center rounded-3xl bg-primary px-12 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-primary/90 active:scale-95 shadow-2xl shadow-primary/40 ring-4 ring-primary/10"
               >
                 Initialize Workspace
               </a>
               <a
                 href="/pricing"
                 className="inline-flex min-w-[320px] h-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-12 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white/10 active:scale-95 backdrop-blur-md"
               >
                 View Framework Details
               </a>
            </div>
         </div>
      </Section>
    </main>
  );
}
