import { cookies } from "next/headers";
import { 
  Navbar, 
  Footer, 
  PageHero, 
  MetricGrid, 
  FeatureCardGrid, 
  ActionRow, 
  ButtonLink,
  Section,
  SectionLabel
} from "@/components/ui/portal";
import { 
  getWebDictionary, 
  resolveLocale, 
  WEB_LOCALE_COOKIE 
} from "@zaneai/ag-ui/zaneai";
import { LayoutGrid, Shield, Zap, Globe, Cpu, BarChart3 } from "lucide-react";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <Navbar locale={locale} />
      
      {/* Abstract Background Glow */}
      <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-full -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[140px]" />

      {/* Hero Section */}
      <Section className="pb-10 pt-40 lg:pt-56">
        <PageHero
          badge={
            <SectionLabel icon={Cpu}>
              {dictionary.nav.aiMode}
            </SectionLabel>
          }
          title={
            <span className="text-6xl font-black uppercase tracking-tighter sm:text-8xl lg:text-[10rem] leading-[0.8] block">
              Zane <span className="text-primary italic">AI.</span>
            </span>
          }
          description={
            <p className="mx-auto mt-12 max-w-2xl text-lg font-bold leading-relaxed text-muted-foreground md:text-xl">
              {dictionary.hero.subtitle}
            </p>
          }
          contentClassName="mx-auto max-w-[1400px] px-6 text-center"
          actions={
            <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row">
              <ButtonLink
                href="/signin"
                variant="primary"
                locale={locale}
                className="h-18 min-w-[280px] text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-primary/20"
              >
                {dictionary.nav.getStarted}
              </ButtonLink>
              <ButtonLink
                href="/signin"
                variant="outline"
                locale={locale}
                className="h-18 min-w-[280px] text-[10px] font-black uppercase tracking-[0.25em]"
              >
                {dictionary.nav.workspaceSignIn}
              </ButtonLink>
            </div>
          }
        />
      </Section>

      {/* Trust / Metric Grid */}
      <Section className="py-24 border-y border-border/40 bg-slate-50/50 dark:bg-white/[0.01] backdrop-blur-sm">
        <MetricGrid
          items={[
            { value: "01", label: dictionary.about.metricsUnified },
            { value: "02", label: dictionary.about.metricsAudience },
            { value: "24/7", label: dictionary.about.metricsAvailability },
            { value: "100%", label: dictionary.about.metricsClarity },
          ]}
          className="mx-auto grid max-w-[1400px] grid-cols-2 gap-16 px-6 sm:grid-cols-4 lg:px-10"
          itemClassName="text-center space-y-4"
          valueClassName="text-5xl font-black uppercase tracking-tighter sm:text-7xl"
          labelClassName="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground"
        />
      </Section>

      {/* Feature Section */}
      <Section id="features" className="py-32 lg:py-56">
        <div className="mb-32 space-y-8 text-center">
            <SectionLabel icon={Zap} className="mx-auto">Features</SectionLabel>
            <h2 className="text-5xl font-black uppercase tracking-tight sm:text-8xl">Unified Real Estate <span className="text-primary italic">Ops.</span></h2>
        </div>
        <FeatureCardGrid 
            items={[
              {
                title: dictionary.projects.title,
                description: dictionary.projects.description,
                icon: LayoutGrid,
              },
              {
                title: dictionary.market.title,
                description: dictionary.market.description,
                icon: Globe,
                variant: "accent",
              },
              {
                title: dictionary.offers.title,
                description: dictionary.offers.description,
                icon: Zap,
                variant: "dark",
              },
            ]}
            className="mx-auto grid max-w-[1400px] gap-10 px-6 md:grid-cols-3 lg:px-10" 
        />
      </Section>

      {/* Action Row / Footer CTA */}
      <ActionRow className="pb-32 lg:pb-56 px-6 lg:px-10">
        <div className="relative overflow-hidden mx-auto flex max-w-[1400px] flex-col items-center gap-12 rounded-[64px] border border-border/40 bg-card px-8 py-24 text-center shadow-2xl lg:px-24 lg:py-40">
          {/* Subtle Glow */}
          <div className="absolute -top-24 left-1/2 -z-10 h-[300px] w-full -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
          
          <SectionLabel icon={BarChart3}>Scale with Zane-ai</SectionLabel>
          <h2 className="text-6xl font-black uppercase tracking-tighter sm:text-8xl lg:text-9xl leading-[0.8]">
            {dictionary.cta.title}
          </h2>
          <p className="max-w-2xl text-xl font-bold leading-relaxed text-muted-foreground md:text-2xl mt-4">
            {dictionary.cta.subtitle}
          </p>
          <ButtonLink 
            href="/signin" 
            variant="dark" 
            locale={locale}
            className="h-20 min-w-[320px] text-[10px] font-black uppercase tracking-[0.3em] mt-8"
          >
            {dictionary.nav.getStarted}
          </ButtonLink>
        </div>
      </ActionRow>

      <Footer locale={locale} />
    </main>
  );
}
