import { Section, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Check, CreditCard, MoveRight } from "lucide-react";

export default async function PricingPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  const plans = [
    {
      name: "Brokers",
      price: "0.00",
      description: "Standard access for independent brokers and agencies.",
      features: ["Inventory Access", "Direct Messaging", "Offer Submission", "Standard Analytics"],
      cta: "Join Infrastructure",
      variant: "default",
    },
    {
      name: "Developers",
      price: "Scale",
      description: "Full-stack inventory management and sales automation.",
      features: ["Unlimited Projects", "Advanced Analytics", "White-label Portals", "AI Scoring"],
      cta: "Contact Sales",
      variant: "accent",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Dedicated infrastructure and ecosystem integration.",
      features: ["Custom API Access", "SLA Guarantees", "Dedicated Manager", "On-premise Options"],
      cta: "Talk to Sales",
      variant: "dark",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 transition-all">
      <Section className="py-20 border-b border-border">
        <div className="mx-auto max-w-4xl px-6 space-y-10">
          <SectionLabel icon={CreditCard} className="bg-primary/5 text-primary border-primary/10 px-4 py-2">
            Institutional Plans
          </SectionLabel>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground uppercase leading-none">
              Transparent <br />
              <span className="text-primary">Operational Scale.</span>
            </h1>
            <p className="text-xl font-bold leading-relaxed text-muted-foreground max-w-2xl italic">
              From individual brokers to global development houses, find the plan that fits your operational requirements.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-24 bg-slate-50 dark:bg-zinc-950/20">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p, i) => (
              <div key={i} className={`flex flex-col rounded-[48px] border border-border p-12 space-y-12 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:scale-[1.02] ${p.variant === 'accent' ? 'ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}>
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{p.name}</span>
                  <div className="text-5xl font-black tracking-tighter uppercase">{p.price}</div>
                  <p className="text-sm font-bold text-muted-foreground italic h-10">{p.description}</p>
                </div>

                <div className="flex-1 space-y-6 pt-10 border-t border-border/50">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <a href="/signin" className={`h-16 w-full flex items-center justify-center rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 shadow-sm ${p.variant === 'dark' ? 'bg-black text-white hover:bg-zinc-900' : 'bg-primary text-white hover:bg-primary/90'}`}>
                    {p.cta}
                    <MoveRight className="ml-3 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
