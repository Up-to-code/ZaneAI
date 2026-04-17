import { Section, SectionLabel } from "@/components/ui/portal";
import { Shield, Zap, Target, ArrowRightCircle, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 transition-all selection:bg-primary selection:text-white">
      {/* Short Pitch Section */}
      <Section className="py-24 border-b border-border">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
            <div className="space-y-6">
                <SectionLabel icon={Shield} className="bg-primary/5 text-primary border-primary/10 px-4 py-2">
                    Institutional Identity
                </SectionLabel>
                <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-[0.95] uppercase">
                    Intelligent <br />
                    <span className="text-primary italic">Infrastructure.</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold text-muted-foreground border-l-2 border-primary/20 pl-8 italic">
                   Unifying the people, properties, and data powering modern real estate.
                </p>
            </div>
            
            <div className="p-10 rounded-[40px] border border-border bg-slate-50 dark:bg-zinc-950/20 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 h-full w-1.5 bg-primary/20 group-hover:bg-primary transition-all" />
                 <p className="text-xl md:text-2xl font-bold leading-relaxed text-foreground tracking-tight">
                    "Zane AI is the intelligent infrastructure that unifies the real estate market. By automating communication and workflows at the core, we replace fragmented tools with one smart, unified system."
                 </p>
            </div>
        </div>
      </Section>

      {/* Conflict vs Resolution Framework */}
      <Section className="py-32 bg-slate-50 dark:bg-zinc-950/20">
        <div className="mx-auto max-w-5xl px-6 space-y-20">
            <div className="space-y-6 text-center">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">The Problem → The Solution</h2>
                <div className="h-1 w-24 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-[48px] overflow-hidden">
                {/* Conflict Column */}
                <div className="bg-white dark:bg-black p-12 md:p-16 space-y-10 border-r border-border">
                    <div className="flex items-center gap-3 text-muted-foreground font-black uppercase text-[10px] tracking-widest bg-muted h-10 px-6 rounded-full w-fit">
                        <AlertCircle className="h-4 w-4" />
                        The Conflict
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black uppercase tracking-tight">Deep Fragmentation.</h3>
                        <p className="text-lg font-bold text-muted-foreground leading-relaxed italic border-l-2 border-border pl-6 opacity-60">
                            Real estate is currently a series of disconnected islands. Tools don't talk, communication leaks through the cracks, and market signals are delayed by manual friction.
                        </p>
                    </div>
                </div>

                {/* Resolution Column */}
                <div className="bg-white dark:bg-black p-12 md:p-16 space-y-10 relative">
                    <div className="absolute top-0 right-0 p-8">
                        <ArrowRightCircle className="h-8 w-8 text-primary/20" />
                    </div>
                    <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/5 h-10 px-6 rounded-full w-fit">
                        <CheckCircle2 className="h-4 w-4" />
                        The Resolution
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black uppercase tracking-tight">Zane AI Infrastructure.</h3>
                        <div className="space-y-6">
                            {[
                                { title: "Connected Data", text: "One source of truth for properties and people." },
                                { title: "Automated Orchestration", text: "AI agents that handle leads, follow-ups, and workflows." },
                                { title: "Real-Time Intelligence", text: "Turning raw information into institutional-grade insights." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-primary">— {item.title}</h4>
                                    <p className="text-base font-bold text-foreground leading-relaxed italic">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Section>

      {/* Positioning Section */}
      <Section className="py-48 pb-64">
        <div className="mx-auto max-w-4xl px-6">
            <div className="group rounded-[48px] border-2 border-primary/20 bg-white dark:bg-zinc-950 p-12 md:p-20 relative overflow-hidden text-center space-y-12">
                <div className="absolute top-0 left-0 h-full w-1 border-primary bg-primary" />
                <div className="space-y-8">
                    <SectionLabel icon={Zap} className="mx-auto">Creative Positioning</SectionLabel>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                        Powering the modern <br />
                        <span className="text-primary italic">real estate lifecycle.</span>
                    </h2>
                    <p className="text-lg md:text-xl font-bold text-muted-foreground leading-relaxed italic max-w-2xl mx-auto">
                        "We are building a hyper-connected network where every property transaction is linked, and AI is the engine that runs at the core."
                    </p>
                </div>
                <div className="pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 mb-10">Premium One-Liner</p>
                    <div className="p-10 rounded-3xl border border-border bg-slate-50 dark:bg-black font-sans text-xl md:text-2xl font-black leading-relaxed tracking-tight border-b-4 border-b-primary shadow-xl">
                        Zane AI is the intelligent infrastructure for real estate — connecting people, properties, and data into one unified system.
                    </div>
                </div>
            </div>
        </div>
      </Section>
    </main>
  );
}
