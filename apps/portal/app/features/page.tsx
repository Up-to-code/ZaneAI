import { PageHero, Section, FeatureCardGrid, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Zap, Shield, LayoutGrid, BarChart3, Globe, Cpu, MoveRight, Layers, Fingerprint, Database } from "lucide-react";

export default async function FeaturesPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="relative overflow-hidden pb-12">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        
        <PageHero
          badge={
            <SectionLabel icon={Layers} className="bg-primary/5 text-primary border-primary/10">
              Technical Infrastructure
            </SectionLabel>
          }
          title={
            <h1 className="font-brand-sans text-5xl font-black uppercase tracking-[-0.03em] sm:text-7xl lg:text-9xl text-foreground">
              Engineered for <br />
              <span className="text-primary lg:font-brand-serif lg:italic lg:lowercase lg:tracking-tighter lg:font-bold italic">Persistence.</span>
            </h1>
          }
          description={
            <p className="mx-auto mt-12 max-w-3xl text-lg font-bold leading-relaxed text-muted-foreground md:text-xl">
              From predictive analytics to seamless broker-developer coordination, Zane-AI provides the high-fidelity infrastructure required for modern institutional real estate.
            </p>
          }
          contentClassName="mx-auto max-w-7xl space-y-12 px-6 text-center"
        />
      </Section>

      <Section className="py-32 bg-[#FAFAF8] dark:bg-white/[0.01]">
        <FeatureCardGrid
          items={[
            {
              title: "AI Orchestration",
              description: "Deep-learning models that analyze unit performance and predict market activity with 99.8% precision.",
              icon: Cpu,
              variant: "accent",
            },
            {
              title: "Unified Workspace",
              description: "The connective tissue where developers and brokers synchronize inventory mapping and deal flows.",
              icon: LayoutGrid,
            },
            {
              title: "Demand Analytics",
              description: "Turn raw market metadata into actionable investment signals at global scale.",
              icon: BarChart3,
            },
            {
              title: "Identity Management",
              description: "Secure, credentialed access for Institutional players and multi-region project stakeholders.",
              icon: Fingerprint,
              variant: "dark",
            },
            {
              title: "Sync Intelligence",
              description: "Cross-border database synchronization with sub-millisecond latency for live unit updates.",
              icon: Database,
            },
            {
              title: "Global Visibility",
              description: "Universal reach across localized markets with institutional-grade transparency.",
              icon: Globe,
            },
          ]}
          className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:px-12 md:grid-cols-2 lg:grid-cols-3"
        />
      </Section>

      {/* Narrative Section - The Operating Layer */}
      <Section className="py-48 border-y border-border/10 overflow-hidden relative">
         <div className="absolute -left-24 top-1/2 h-96 w-96 bg-primary/10 blur-[100px] rounded-full" />
         
         <div className="mx-auto max-w-4xl px-6 text-center space-y-10 group">
            <h2 className="font-brand-sans text-4xl md:text-6xl font-extrabold uppercase tracking-tight">
               Built. Not <span className="text-primary italic">Assembled.</span>
            </h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground border-l border-primary/10 pl-8 transition-colors group-hover:border-primary duration-500 text-left md:text-center md:border-l-0 md:pl-0">
               Every line of the Zane-AI operating layer is proprietary code. We don't rely on generic aggregators; we build the core intelligence ourselves to ensure every handoff between buyer and broker is architecturally sound.
            </p>
         </div>
      </Section>

      <Section bg="dark" className="py-64 relative bg-black overflow-hidden border-t border-white/5">
        <div className="absolute -bottom-24 left-1/2 h-[400px] w-full -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center space-y-16">
           <h2 className="font-brand-sans text-5xl font-black uppercase tracking-tight sm:text-7xl lg:text-8xl text-white">Scale the <span className="text-primary italic uppercase">Alpha.</span></h2>
           <p className="mx-auto max-w-2xl text-xl font-bold text-white/40 leading-relaxed md:text-2xl">
              Initialize your institutional framework today and join the unified intelligence revolution.
           </p>
           <div className="flex flex-col items-center justify-center gap-8 sm:flex-row pt-8">
              <a
                href="/signin"
                className="group inline-flex min-w-[280px] h-20 items-center justify-center rounded-3xl bg-primary px-12 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-primary/90 active:scale-95 shadow-2xl shadow-primary/20"
              >
                Initialize Now
                <MoveRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/contact"
                className="inline-flex min-w-[280px] h-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-12 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white/10 active:scale-95 backdrop-blur-md"
              >
                Framework Consultation
              </a>
           </div>
        </div>
      </Section>
    </main>
  );
}
