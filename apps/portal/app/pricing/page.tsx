import { Section } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@zaneai/ag-ui/zaneai";
import { Check, MoveRight } from "lucide-react";

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
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      <Section className="py-20 lg:py-28 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-12">
          <div className="space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                <span className="text-xl leading-none -mt-1">★</span>
                Institutional Plans
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
              Transparent Operational Scale.
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
              From individual brokers to global development houses, find the plan that fits your operational requirements.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-950/20 relative overflow-hidden">
        <div className="absolute top-1/4 start-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {plans.map((p, i) => (
              <div key={i} className={`flex flex-col rounded-3xl md:rounded-[2.5rem] border border-border p-6 sm:p-10 md:p-14 space-y-8 md:space-y-10 bg-white dark:bg-black shadow-sm transition-all hover:border-black/20 dark:hover:border-zinc-700 isolate [transform:translateZ(0)] ${p.variant === 'accent' ? 'ring-2 ring-primary/20 bg-blue-50/10 dark:bg-primary/[0.02]' : ''}`}>
                <div className="space-y-3 md:space-y-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-zinc-800 px-3 py-1 text-xs font-bold text-foreground w-fit mb-3 md:mb-4">{p.name}</span>
                  <div className="text-4xl md:text-5xl font-black tracking-tighter" dir="auto">{p.price}</div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground h-auto md:h-10" dir="auto">{p.description}</p>
                </div>

                <div className="flex-1 space-y-5 pt-8 border-t border-border/50">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-foreground" dir="auto">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 md:pt-6">
                  <a href="/signin" className={`inline-flex h-12 md:h-14 w-full items-center justify-center rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm border ${p.variant === 'dark' ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80' : p.variant === 'accent' ? 'bg-primary text-white border-primary hover:bg-primary/90' : 'bg-white dark:bg-black text-foreground border-border hover:bg-slate-50 dark:hover:bg-zinc-900'}`}>
                    {p.cta}
                    <MoveRight className="ms-2 h-4 w-4 rtl:rotate-180" />
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
