import { Section } from "@/components/ui/portal";
import { MoveRight, Zap, Target, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      {/* Short Pitch Section */}
      <Section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 space-y-12 text-center">
            <div className="space-y-8 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                    <span className="text-xl leading-none -mt-1">★</span>
                    Institutional Identity
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
                    Intelligent Infrastructure.
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed pt-2" dir="auto">
                   Unifying the people, properties, and data powering modern real estate.
                </p>
            </div>
            
            <div className="p-6 sm:p-10 md:p-16 rounded-3xl md:rounded-[3rem] border border-black/5 dark:border-zinc-800 bg-blue-50/50 dark:bg-zinc-900/50 shadow-sm relative overflow-hidden group isolate [transform:translateZ(0)]">
                 <p className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-foreground tracking-tight" dir="auto">
                    "Zane-ai is the intelligent infrastructure that unifies the real estate market. By automating communication and workflows at the core, we replace fragmented tools with one smart, unified system."
                 </p>
                 <div className="absolute inset-0 rounded-3xl md:rounded-[3rem] ring-1 ring-inset ring-black/5 dark:ring-white/10 pointer-events-none" />
            </div>
        </div>
      </Section>

      {/* Conflict vs Resolution Framework */}
      <Section className="py-16 md:py-24 lg:py-32 bg-slate-50 dark:bg-zinc-950/30 border-t border-border relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 end-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="text-center max-w-3xl mx-auto space-y-6 md:space-y-8 mb-12 md:mb-24">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground" dir="auto">
                    The Problem → The Solution
                </h2>
                <div className="h-1.5 w-16 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Conflict Column */}
                <div className="rounded-3xl md:rounded-[2.5rem] border border-border bg-white dark:bg-black shadow-sm flex flex-col p-6 sm:p-10 md:p-14 space-y-6 md:space-y-8 group transition-all hover:border-black/20 dark:hover:border-zinc-700 isolate [transform:translateZ(0)]">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-foreground w-fit">
                        <AlertCircle className="h-4 w-4" />
                        The Conflict
                    </div>
                    <div className="space-y-4 md:space-y-6">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight" dir="auto">Deep Fragmentation.</h3>
                        <p className="text-base md:text-lg font-medium text-muted-foreground leading-relaxed" dir="auto">
                            Real estate is currently a series of disconnected islands. Tools don't talk, communication leaks through the cracks, and market signals are delayed by manual friction.
                        </p>
                    </div>
                </div>

                {/* Resolution Column */}
                <div className="rounded-3xl md:rounded-[2.5rem] border border-border bg-white dark:bg-black shadow-sm flex flex-col p-6 sm:p-10 md:p-14 space-y-6 md:space-y-8 group transition-all hover:border-primary/40 isolate [transform:translateZ(0)]">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-bold w-fit">
                        <CheckCircle2 className="h-4 w-4" />
                        The Resolution
                    </div>
                    <div className="space-y-6 md:space-y-8">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight" dir="auto">Zane-ai Infrastructure.</h3>
                        <div className="space-y-6">
                            {[
                                { title: "Connected Data", text: "One source of truth for properties and people." },
                                { title: "Automated Orchestration", text: "AI agents that handle leads, follow-ups, and workflows." },
                                { title: "Real-Time Intelligence", text: "Turning raw information into institutional-grade insights." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-2 w-2 min-w-[8px] rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground mb-1" dir="auto">{item.title}</h4>
                                        <p className="text-sm font-medium text-muted-foreground leading-relaxed" dir="auto">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Section>

      {/* Positioning Section */}
      <Section className="py-20 md:py-32 lg:py-40 bg-black text-white relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-primary/20 blur-[120px] md:blur-[180px] rounded-full" />
        </div>
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-10 md:space-y-16 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]" dir="auto">
                Powering the modern <br /> real estate lifecycle.
            </h2>
            <p className="text-base sm:text-lg md:text-2xl text-white/50 font-medium max-w-2xl mx-auto leading-relaxed" dir="auto">
                "We are building a hyper-connected network where every property transaction is linked, and AI is the engine that runs at the core."
            </p>
            
            <div className="pt-4 md:pt-8">
                <div className="mx-auto max-w-3xl p-6 sm:p-10 md:p-12 rounded-3xl md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm text-base sm:text-lg md:text-2xl font-medium leading-relaxed tracking-tight" dir="auto">
                    Zane-ai is the intelligent infrastructure for real estate — connecting people, properties, and data into one unified system.
                </div>
            </div>
        </div>
      </Section>
    </main>
  );
}
