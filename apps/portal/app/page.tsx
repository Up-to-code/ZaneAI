import { 
  PageHero, 
  MetricGrid, 
  Section, 
  FeatureCardGrid, 
  SectionLabel 
} from "@/components/ui/portal";
import { cookies } from "next/headers";
import { getWebDictionary, resolveLocale, WEB_LOCALE_COOKIE } from "@anan/ag-ui/anan";
import { BarChart3, Building2, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <Section className="relative overflow-hidden pb-10 pt-32 lg:pt-48">
        {/* Abstract Background Glow */}
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        
        <PageHero
          badge={
            <SectionLabel icon={Zap}>
              {dictionary.footer.brandTitle}
            </SectionLabel>
          }
          title={
            <span className="text-6xl font-black uppercase tracking-tight sm:text-8xl lg:text-[10rem] leading-[0.8] block">
              Real Estate <br />
              <span className="text-primary italic">Intelligence.</span>
            </span>
          }
          description={
            <p className="mx-auto mt-10 max-w-2xl text-lg font-bold leading-relaxed text-muted-foreground md:text-xl">
              {dictionary.hero.subtitle}
            </p>
          }
          contentClassName="mx-auto max-w-[1400px] space-y-12 px-6 text-center"
          actions={
            <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a
                href="/about"
                className="inline-flex min-w-[240px] items-center justify-center rounded-full bg-foreground px-12 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-background transition-all hover:bg-foreground/90 active:scale-95"
              >
                {dictionary.nav.about}
              </a>
              <a
                href="/download"
                className="inline-flex min-w-[240px] items-center justify-center rounded-full border border-border bg-background px-12 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-foreground transition-all hover:bg-muted active:scale-95"
              >
                {dictionary.cta.title}
              </a>
            </div>
          }
        />
      </Section>

      {/* Trust / Metric Grid */}
      <Section className="py-24 border-y border-border/40 bg-slate-50/50 dark:bg-white/[0.01] backdrop-blur-sm">
        <MetricGrid
          items={[
            { value: dictionary.status.active, label: dictionary.nav.workspaceLabel },
            { value: dictionary.status.developer, label: dictionary.nav.developer },
            { value: dictionary.status.broker, label: dictionary.nav.broker },
          ]}
          className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-3"
          itemClassName="text-center space-y-4"
          valueClassName="block text-6xl font-black text-foreground tracking-tighter"
          labelClassName="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground"
        />
      </Section>

      {/* Product Feature Grid */}
      <Section id="product" className="py-32 lg:py-48">
         <div className="mb-24 space-y-6 text-center">
            <SectionLabel icon={Cpu} className="mx-auto">Our Ecosystem</SectionLabel>
            <h2 className="text-5xl font-black uppercase tracking-tight sm:text-7xl">Built for Institutional <span className="text-primary italic">Scale.</span></h2>
         </div>
        <FeatureCardGrid
          items={[
            {
              title: dictionary.nav.developer,
              description: "Full-lifecycle management for development houses, from blueprint to final sale.",
              icon: Building2,
              variant: "accent",
            },
            {
              title: dictionary.nav.broker,
              description: "Unified infrastructure for independent brokers to access verified inventory and execute deals.",
              icon: Globe,
            },
            {
              title: dictionary.nav.overviewTitle,
              description: "Real-time analytics and predictive models for market performance and asset intelligence.",
              icon: BarChart3,
              variant: "dark",
            },
          ]}
          className="mx-auto grid max-w-[1400px] gap-10 px-6 md:grid-cols-3"
        />
      </Section>

      {/* CTA Section */}
      <Section bg="dark" className="border-t border-white/5 py-56 relative overflow-hidden">
         {/* Deep Glow */}
         <div className="absolute -bottom-24 left-1/2 h-[400px] w-full -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
         
         <div className="relative z-10 mx-auto max-w-5xl px-6 text-center space-y-16">
            <h2 className="text-5xl font-black uppercase tracking-tight sm:text-8xl italic">
               The future is <span className="text-primary italic">Unified.</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl font-bold text-white/50 leading-relaxed">
               Join the region's most advanced real estate intelligence ecosystem. 
               Built for architects of the future.
            </p>
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
               <a
                 href="/signin"
                 className="inline-flex min-w-[280px] items-center justify-center rounded-full bg-primary px-12 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-primary/90 active:scale-95 shadow-2xl shadow-primary/20"
               >
                 {dictionary.nav.getStarted}
               </a>
            </div>
         </div>
      </Section>
    </main>
  );
}
