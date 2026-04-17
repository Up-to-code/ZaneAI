import { Section, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Activity, Globe, Heart, ShieldCheck, Zap, Eye, Target, Sparkles, Building, Briefcase } from "lucide-react";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background pt-24 md:pt-32 font-sans selection:bg-primary selection:text-white">
      {/* Institutional About Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Cinematic Flourish */}
        <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 overflow-hidden">
          <div className="absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[1400px] px-6 text-center space-y-12">
          <SectionLabel icon={Eye} className="mx-auto bg-primary/5 text-primary border-primary/10">
            Institutional Identity
          </SectionLabel>
          <h1 className="font-brand-sans text-5xl font-black leading-[0.9] text-foreground sm:text-7xl lg:text-[10rem] tracking-tight uppercase">
             One Mission. <br />
             <span className="text-primary italic lg:font-brand-serif lg:capitalize lg:tracking-tighter lg:font-bold">Total Connectivity.</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl font-bold leading-relaxed text-muted-foreground md:text-2xl px-4">
             Zane-AI exists to bridge the gap between physical real estate and high-precision digital intelligence. We provide the infrastructure that turns fragmented markets into unified ecosystems.
          </p>
        </div>
      </Section>

      {/* The Manifesto Narrative */}
      <Section className="py-32 md:py-64 bg-[#FAFAF8] dark:bg-white/[0.01] border-y border-border/10">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="flex flex-col md:flex-row gap-16 md:gap-32 items-start">
            <div className="md:sticky md:top-32 w-full md:w-1/3">
               <SectionLabel icon={Target} className="text-primary border-none p-0 mb-6">Our Core Purpose</SectionLabel>
               <h2 className="font-brand-sans text-4xl font-black uppercase tracking-tight leading-none">
                  Defeating <br />
                  <span className="text-primary italic">Fragmentation.</span>
               </h2>
            </div>
            
            <div className="w-full md:w-2/3 space-y-12">
               <div className="p-10 md:p-14 bg-white dark:bg-black border border-border/10 rounded-[48px] shadow-sm">
                  <p className="font-brand-serif text-3xl md:text-5xl leading-tight italic text-foreground tracking-tight">
                    "Every handoff is a loss of intelligence. We build the substrate where and Deal data carries forward automatically."
                  </p>
               </div>
               <p className="text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground border-l-2 border-primary/10 pl-8">
                  We started with a simple observation: real estate is the largest asset class in the world, yet it is managed through the most fragmented tools. Our mission is to build the first universal operating layer that connects every stakeholder — from the first query to the final signature.
               </p>
            </div>
          </div>
        </div>
      </Section>

      {/* The Operating Pillars */}
      <Section className="py-48">
        <div className="mx-auto max-w-7xl px-6 space-y-32">
           <div className="text-center space-y-8 max-w-4xl mx-auto">
              <SectionLabel icon={Sparkles} className="mx-auto">The Framework</SectionLabel>
              <h2 className="font-brand-sans text-5xl font-black md:text-8xl tracking-tighter uppercase leading-[0.9]">
                 The Substrate for <br />
                 <span className="text-primary italic lg:font-brand-serif lg:lowercase lg:tracking-tighter lg:font-bold">Deal Flow.</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { 
                  title: "Regional Intelligence", 
                  icon: Globe, 
                  desc: "Built to handle the specific complexities of the MENA real estate market with global institutional standards.",
                  color: "bg-blue-500/10 text-blue-600"
                },
                { 
                  title: "Unified Inventory", 
                  icon: Building, 
                  desc: "A single, high-fidelity ledger for developers to manage units and for brokers to discover inventory.",
                  color: "bg-primary/10 text-primary" 
                },
                { 
                  title: "Persistent Context", 
                  icon: Briefcase, 
                  desc: "No context is ever lost. Buyer intent carries from the first AI interaction into the broker workspace.",
                  color: "bg-emerald-500/10 text-emerald-600"
                }
              ].map((item, i) => (
                <div key={i} className="group rounded-[48px] border border-border p-12 space-y-10 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 overflow-hidden relative">
                   <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} transition-all group-hover:scale-110 group-hover:rotate-3`}>
                      <item.icon className="h-8 w-8" />
                   </div>
                   <div className="space-y-6">
                      <h3 className="font-brand-sans text-3xl font-black uppercase tracking-tight">{item.title}</h3>
                      <p className="text-lg font-bold text-muted-foreground leading-relaxed italic border-l-2 border-border/10 pl-6 group-hover:border-primary transition-colors">
                        {item.desc}
                      </p>
                   </div>
                   <Activity className="absolute -bottom-12 -right-12 h-48 w-48 text-primary opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
                </div>
              ))}
           </div>
        </div>
      </Section>

      {/* Institutional Banner */}
      <Section bg="dark" className="bg-black py-48 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/10 blur-[150px] -z-10" />
        <div className="mx-auto max-w-5xl px-6 text-center space-y-12">
            <p className="font-brand-sans text-xs font-black uppercase tracking-[0.5em] text-white/40">Zane-AI Strategy</p>
            <h2 className="font-brand-sans text-5xl md:text-8xl font-black text-white leading-none uppercase tracking-[-0.04em]">
                Scale with <br />
                <span className="text-primary italic">Precision.</span>
            </h2>
            <div className="pt-10">
                <a href="/reading" className="inline-flex h-20 px-16 items-center justify-center rounded-3xl bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/90 active:scale-95 transition-all shadow-2xl shadow-white/10">
                   Explore Manifesto
                </a>
            </div>
        </div>
      </Section>
    </main>
  );
}
