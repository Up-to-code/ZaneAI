import { PageHero, Section, FeatureCardGrid, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Zap, Shield, LayoutGrid, BarChart3, Globe, Cpu, Layers } from "lucide-react";

export default async function FeaturesPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 transition-all">
      <Section className="py-20 border-b border-border">
        <div className="mx-auto max-w-4xl px-6 space-y-10">
          <SectionLabel icon={Layers} className="bg-primary/5 text-primary border-primary/10 px-4 py-2">
            Technical Infrastructure
          </SectionLabel>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground uppercase leading-none">
              Platform <br />
              <span className="text-primary">Capabilities.</span>
            </h1>
            <p className="text-xl font-bold leading-relaxed text-muted-foreground max-w-2xl italic">
              From predictive analytics to seamless broker-developer coordination, Zane-ai provides the high-fidelity infrastructure required for modern institutional real estate.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border rounded-[48px] overflow-hidden">
            {[
              { title: "AI Orchestration", icon: Cpu, desc: "Deep-learning models that analyze unit performance and predict market activity with precision." },
              { title: "Unified Workspace", icon: LayoutGrid, desc: "The connective tissue where developers and brokers synchronize inventory mapping and deal flows." },
              { title: "Demand Analytics", icon: BarChart3, desc: "Turn raw market metadata into actionable investment signals at global scale." },
              { title: "Identity Layer", icon: Shield, desc: "Secure, credentialed access for Institutional players and multi-region project stakeholders." },
              { title: "Instant Execution", icon: Zap, desc: "Automated workflows that turn signatures into successful transactions in minutes." },
              { title: "Universal Visibility", icon: Globe, desc: "Universal reach across localized markets with institutional-grade transparency." }
            ].map((f, i) => (
              <div key={i} className="p-12 border-r border-b border-border bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-zinc-950 transition-colors group">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground group-hover:text-primary transition-colors mb-8">
                    <f.icon className="h-5 w-5" />
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">{f.title}</h3>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-24 bg-black dark:bg-zinc-950 text-white">
        <div className="mx-auto max-w-4xl px-8 text-center space-y-12 py-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">Ready to Initialize?</h2>
            <p className="text-xl font-bold text-white/40 max-w-xl mx-auto italic">Join the unified intelligence revolution today.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <a href="/signin" className="h-16 px-12 flex items-center justify-center rounded-2xl bg-white text-black font-black uppercase text-[11px] tracking-widest shadow-xl transition-all active:scale-95">
                    Deploy Framework
                </a>
                <a href="/contact" className="h-16 px-12 flex items-center justify-center rounded-2xl border border-white/20 hover:bg-white/5 font-black uppercase text-[11px] tracking-widest transition-all active:scale-95">
                    Talk to Support
                </a>
            </div>
        </div>
      </Section>
    </main>
  );
}
