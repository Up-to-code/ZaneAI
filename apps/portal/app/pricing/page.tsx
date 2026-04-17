import { PageHero, Section, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Check, CreditCard, MoveRight, Layers, ShieldCheck, Zap, ArrowRight, Shield } from "lucide-react";

export default async function PricingPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  const plans = [
    {
      name: "Regional Brokers",
      price: "0.00",
      symbol: "$",
      description: "Institutional-grade search and coordination for independent agencies.",
      features: [
        "Universal Inventory Access",
        "Direct Broker-Developer Sync",
        "AI Lead Qualifying",
        "Offer Management Layer",
      ],
      cta: "Join Infrastructure",
      variant: "default",
    },
    {
      name: "Institutional Developers",
      price: "Scale",
      symbol: "—",
      description: "Full-stack inventory orchestration and market demand analytics.",
      features: [
        "Unlimited Project Deployment",
        "Advanced Market Analytics",
        "Custom Workflow Automation",
        "Priority Asset Matching",
        "White-label Integration",
      ],
      cta: "Contact Architecture",
      variant: "accent",
    },
    {
      name: "Enterprise Ecosystem",
      price: "Custom",
      symbol: "!",
      description: "Dedicated infrastructure and cross-border API integrations.",
      features: [
        "Direct API Framework Access",
        "Custom Data Modeling",
        "On-premise Orchestration",
        "Dedicated Asset Manager",
      ],
      cta: "Talk to Sales",
      variant: "dark",
    },
  ];

  return (
    <main className="bg-background pt-24 md:pt-32 font-sans selection:bg-primary selection:text-white">
      {/* Premier Pricing Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="mx-auto max-w-[1400px] px-6 text-center space-y-12">
          <SectionLabel icon={Layers} className="mx-auto bg-primary/5 text-primary border-primary/10">
            Deployment Framework
          </SectionLabel>
          <h1 className="font-brand-sans text-6xl font-black leading-[0.9] text-foreground sm:text-7xl lg:text-[10rem] tracking-tight uppercase">
             Transparent <br />
             <span className="text-primary italic lg:font-brand-serif lg:capitalize lg:tracking-tighter lg:font-bold italic underline decoration-primary/20 underline-offset-[20px]">Intelligence.</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl font-bold leading-relaxed text-muted-foreground md:text-2xl px-4">
             Find the operational framework that fits your institutional scale. From regional agencies to global development houses.
          </p>
        </div>
      </Section>

      {/* Pricing Grid - Premier Styling */}
      <Section className="py-32 bg-[#FAFAF8] dark:bg-white/[0.01] border-y border-border/10">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:px-12 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div 
              key={plan.name}
              className={`group flex flex-col rounded-[56px] border border-border p-12 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                plan.variant === "dark" 
                  ? "bg-black text-white border-white/10" 
                  : plan.variant === "accent"
                  ? "bg-white dark:bg-slate-900 border-primary ring-4 ring-primary/5"
                  : "bg-white dark:bg-slate-950 border-border text-foreground"
              }`}
            >
              <div className="space-y-8 pb-10">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{plan.name}</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black opacity-30">{plan.symbol}</span>
                        <div className="text-6xl font-black tracking-tighter uppercase">{plan.price}</div>
                    </div>
                </div>
                <p className="text-base font-bold text-muted-foreground leading-relaxed italic">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-6 pt-10 border-t border-border/10">
                 {plan.features.map((feature) => (
                   <div key={feature} className="flex items-start gap-4">
                      <div className="flex h-6 w-6 shrink-0 mt-0.5 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold opacity-80">{feature}</span>
                   </div>
                 ))}
              </div>

              <div className="pt-12">
                <a
                  href="/signin"
                  className={`group/btn relative flex h-20 w-full items-center justify-center rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${
                    plan.variant === "dark"
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  <span className="z-10">{plan.cta}</span>
                  <MoveRight className="ml-3 h-4 w-4 z-10 transition-transform group-hover/btn:translate-x-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Enterprise / Philosophy Section */}
      <Section className="py-48 pb-64 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 h-96 w-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="mx-auto max-w-4xl px-6 text-center space-y-12 group">
             <SectionLabel icon={Shield} className="mx-auto">Security & Scale</SectionLabel>
             <h2 className="font-brand-sans text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
                Infrastructure <br />
                <span className="text-primary italic lg:font-brand-serif lg:capitalize lg:tracking-tighter lg:font-bold">Guaranteed.</span>
             </h2>
             <p className="text-xl md:text-2xl font-bold leading-relaxed text-muted-foreground border-l border-primary/10 pl-8 group-hover:border-primary transition-colors text-left md:text-center md:border-l-0 md:pl-0">
                Every institutional plan includes 99.9% uptime guarantees, direct technical support, and the highest standards of MENA region data compliance. Build on a substrate that was made to scale.
             </p>
             <div className="pt-8">
                <a href="/contact" className="inline-flex h-16 items-center gap-4 text-xs font-black uppercase tracking-[0.4em] hover:text-primary transition-colors">
                   Request Institutional Audit <ArrowRight className="h-4 w-4" />
                </a>
             </div>
        </div>
      </Section>
    </main>
  );
}
