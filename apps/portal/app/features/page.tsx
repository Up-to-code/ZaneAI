import { PageHero, Section, FeatureCardGrid, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Zap, Shield, LayoutGrid, BarChart3, Globe, Cpu } from "lucide-react";

export default async function FeaturesPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="pb-0">
        <PageHero
          badge={
            <SectionLabel icon={Zap}>
              Platform Capabilities
            </SectionLabel>
          }
          title={
            <span className="text-5xl font-black uppercase tracking-tight sm:text-7xl lg:text-8xl">
              Engineered for <span className="text-primary">Precision.</span>
            </span>
          }
          description={
            <p className="mx-auto max-w-3xl text-lg font-bold leading-relaxed text-muted-foreground md:text-xl">
              From predictive analytics to seamless broker-developer coordination, Zane-AI provides the institutional infrastructure for modern real estate.
            </p>
          }
          contentClassName="mx-auto max-w-6xl space-y-12 px-6 text-center"
        />
      </Section>

      <Section className="py-32">
        <FeatureCardGrid
          items={[
            {
              title: "AI Intelligence",
              description: "Deep-learning models that analyze market trends and predict asset performance with institutional accuracy.",
              icon: Cpu,
              variant: "accent",
            },
            {
              title: "Unified Workspace",
              description: "A single source of truth where developers and brokers collaborate on inventory and offers in real-time.",
              icon: LayoutGrid,
            },
            {
              title: "Market Signal",
              description: "Real-time tracking of demand patterns and competitor movement across global real estate markets.",
              icon: BarChart3,
            },
            {
              title: "Secure Operations",
              description: "Enterprise-grade encryption and access controls for sensitive institutional data and contracts.",
              icon: Shield,
              variant: "dark",
            },
            {
              title: "Global Reach",
              description: "Multi-region support with localized intelligence and cross-border transaction capabilities.",
              icon: Globe,
            },
            {
              title: "Instant Execution",
              description: "Automated workflows that turn signatures into successful transactions in minutes, not days.",
              icon: Zap,
            },
          ]}
          className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3"
        />
      </Section>

      <Section bg="slate" className="py-48 border-y border-border">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-12">
           <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Ready to upgrade your infrastructure?</h2>
           <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a
                href="/signin"
                className="inline-flex min-w-56 items-center justify-center rounded-full bg-primary px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-primary/90 active:scale-95"
              >
                Get Started
              </a>
              <a
                href="/contact"
                className="inline-flex min-w-56 items-center justify-center rounded-full border border-border bg-background px-10 py-5 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-muted active:scale-95"
              >
                Talk to Sales
              </a>
           </div>
        </div>
      </Section>
    </main>
  );
}
