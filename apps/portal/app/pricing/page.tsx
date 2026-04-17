import { PageHero, Section, FeatureCardGrid, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Check, CreditCard } from "lucide-react";

export default async function PricingPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  const plans = [
    {
      name: "Brokers",
      price: "Free",
      description: "Standard access for independent brokers and agencies.",
      features: [
        "Inventory Access",
        "Direct Messaging",
        "Offer Submission",
        "Market Intelligence (Standard)",
      ],
      cta: "Join Now",
      variant: "default",
    },
    {
      name: "Developers",
      price: "Institutional",
      description: "Full-stack inventory management and sales automation.",
      features: [
        "Unlimited Projects",
        "Advanced Analytics",
        "White-label Portals",
        "AI Lead Scoring",
        "Priority Support",
      ],
      cta: "Contact Sales",
      variant: "accent",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Dedicated infrastructure and ecosystem integration.",
      features: [
        "Custom API Access",
        "SLA Guarantees",
        "Dedicated Account Manager",
        "On-premise Options",
      ],
      cta: "Talk to Sales",
      variant: "dark",
    },
  ];

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="pb-0">
        <PageHero
          badge={
            <SectionLabel icon={CreditCard}>
              Institutional Plans
            </SectionLabel>
          }
          title={
            <span className="text-5xl font-black uppercase tracking-tight sm:text-7xl lg:text-8xl">
              Transparent <span className="text-primary">Scale.</span>
            </span>
          }
          description={
            <p className="mx-auto max-w-2xl text-lg font-bold text-muted-foreground md:text-xl">
              From individual brokers to global development houses, find the plan that fits your operational scale.
            </p>
          }
          contentClassName="mx-auto max-w-6xl space-y-12 px-6 text-center"
        />
      </Section>

      <Section className="py-32">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`flex flex-col rounded-[48px] border p-10 space-y-10 transition-all hover:scale-[1.02] ${
                plan.variant === "dark" 
                  ? "bg-slate-950 text-white border-white/10" 
                  : plan.variant === "accent"
                  ? "bg-primary/5 border-primary/20 text-foreground"
                  : "bg-background border-border text-foreground"
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">{plan.name}</h3>
                <div className="text-5xl font-black">{plan.price}</div>
                <p className="text-sm font-bold opacity-70">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-6">
                 {plan.features.map((feature) => (
                   <div key={feature} className="flex items-center gap-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold">{feature}</span>
                   </div>
                 ))}
              </div>

              <a
                href="/signin"
                className={`flex h-16 w-full items-center justify-center rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                  plan.variant === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-24 border-t border-border">
         <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-widest text-muted-foreground">Looking for something else?</h2>
            <p className="text-lg font-bold">Contact our partnership team for custom solutions and ecosystem integrations.</p>
         </div>
      </Section>
    </main>
  );
}
