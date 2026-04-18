import { Section } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@/lib/i18n";
import { Zap, Shield, LayoutGrid, BarChart3, Globe, Cpu, Layers } from "lucide-react";

export default async function FeaturesPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      <Section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-12">
          <div className="space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                <span className="text-xl leading-none -mt-1">★</span>
                Technical Infrastructure
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
              Platform Capabilities.
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
              From predictive analytics to seamless broker-developer coordination, Zane-ai provides the high-fidelity infrastructure required for modern institutional real estate.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-950/20 relative overflow-hidden">
        <div className="absolute top-1/4 start-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "AI Orchestration", icon: Cpu, desc: "Deep-learning models that analyze unit performance and predict market activity with precision." },
              { title: "Unified Workspace", icon: LayoutGrid, desc: "The connective tissue where developers and brokers synchronize inventory mapping and deal flows." },
              { title: "Demand Analytics", icon: BarChart3, desc: "Turn raw market metadata into actionable investment signals at global scale." },
              { title: "Identity Layer", icon: Shield, desc: "Secure, credentialed access for Institutional players and multi-region project stakeholders." },
              { title: "Instant Execution", icon: Zap, desc: "Automated workflows that turn signatures into successful transactions in minutes." },
              { title: "Universal Visibility", icon: Globe, desc: "Universal reach across localized markets with institutional-grade transparency." }
            ].map((f, i) => (
              <div key={i} className="p-6 sm:p-10 md:p-14 rounded-3xl md:rounded-[2.5rem] border border-border bg-white dark:bg-black shadow-sm flex flex-col group transition-all hover:border-primary/40 isolate [transform:translateZ(0)]">
                <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                    <f.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="space-y-3 md:space-y-4">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight" dir="auto">{f.title}</h3>
                    <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed" dir="auto">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-32 lg:py-40 bg-black text-white relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-primary/20 blur-[120px] md:blur-[180px] rounded-full" />
        </div>
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-10 md:space-y-16 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]" dir="auto">
                Ready to Initialize?
            </h2>
            <p className="text-base sm:text-lg md:text-2xl text-white/50 font-medium max-w-xl mx-auto leading-relaxed" dir="auto">
                Join the unified intelligence revolution today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 md:pt-8">
                <a href="/signin" className="inline-flex h-14 md:h-16 items-center justify-center rounded-full bg-primary px-8 md:px-10 text-sm md:text-base font-black text-white transition-all hover:bg-white hover:text-black active:scale-95">
                    Deploy Framework
                </a>
                <a href="/contact" className="inline-flex h-14 md:h-16 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-8 md:px-10 text-sm md:text-base font-bold text-white transition-all active:scale-95">
                    Talk to Support
                </a>
            </div>
        </div>
      </Section>
    </main>
  );
}
