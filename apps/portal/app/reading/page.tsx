import { Section, SectionLabel } from "@/components/ui/portal";
import { BookOpen, Cpu, Shield, Zap, Target, ArrowDown } from "lucide-react";

export default async function ReadingPage() {
  return (
    <main className="min-h-screen bg-[#FFF] dark:bg-[#000] pt-24 transition-all selection:bg-primary selection:text-white pb-32">
      {/* Manifesto Title Layer */}
      <Section className="py-24 border-b border-border">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
            <div className="space-y-6">
                <SectionLabel icon={BookOpen} className="bg-primary/5 text-primary border-primary/10 px-4 py-2">
                    Infrastructure Manifesto
                </SectionLabel>
                <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-[0.95] uppercase">
                    Zane AI: The Intelligent <br />
                    <span className="text-primary italic">Infrastructure.</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold text-muted-foreground border-l-2 border-primary/20 pl-8 italic">
                   The Unified Canvas for the future of Real Estate.
                </p>
            </div>
            <div className="pt-8">
                <ArrowDown className="h-10 w-10 text-primary/20 animate-bounce" />
            </div>
        </div>
      </Section>

      {/* Primary Narrative: The Unified Canvas */}
      <Section className="py-32">
        <div className="mx-auto max-w-3xl px-6 space-y-24">
            <div className="space-y-10 group">
                <p className="text-xl font-bold text-primary italic uppercase tracking-widest">Hi, we are Zane AI.</p>
                <div className="space-y-8 text-2xl md:text-3xl font-bold leading-[1.4] text-foreground tracking-tight">
                    <p className="opacity-90">
                        For decades, the real estate industry has operated on a fractured canvas. Listings are scattered, communication is siloed, and data exists in isolation. 
                    </p>
                    <p className="opacity-90">
                        We’ve been forced to navigate a maze of disconnected tools, comparing fragments by hand, and losing the signal in the noise.
                    </p>
                    <p className="border-l-4 border-primary pl-10 py-4 bg-primary/2.5 rounded-r-3xl italic">
                        "We believe that the next generation of real estate won’t be built on another marketplace. It will be built on infrastructure."
                    </p>
                </div>
            </div>

            <div className="space-y-16">
                <div className="space-y-8">
                    <h3 className="text-3xl font-black uppercase tracking-tight">An AI-Native Foundation.</h3>
                    <p className="text-lg font-bold text-muted-foreground leading-relaxed italic">
                        Zane AI is the intelligent layer powering the future of real estate. We are building the unified system that connects people, properties, and data into a single, high-fidelity ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: "Connected", icon: Zap, text: "Intent, operations, and intelligence act as one living infrastructure." },
                        { title: "Precision", icon: Target, text: "Describe a vision in natural language and receive high-fidelity matches." },
                        { title: "Automated", icon: Cpu, text: "AI-powered operating system that automates follow-ups and workflows." },
                        { title: "Focused", icon: Shield, text: "An Institutional foundation built for architects of the future." }
                    ].map((item, i) => (
                        <div key={i} className="p-10 rounded-3xl border border-border bg-slate-50 dark:bg-zinc-950/20 space-y-4 shadow-sm">
                            <item.icon className="h-6 w-6 text-primary" />
                            <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
                            <p className="text-sm font-bold text-muted-foreground leading-relaxed italic opacity-80">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-12 pt-12 border-t border-border">
                <p className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground tracking-tight">
                    At Zane AI, we aren't just building another platform. We are building the infrastructure behind modern real estate businesses.
                </p>
                <div className="space-y-6">
                    <div className="h-1 w-24 bg-primary" />
                    <p className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-foreground">
                        Connect. <br />
                        Automate. <br />
                        Scale.
                    </p>
                </div>
            </div>
        </div>
      </Section>

      {/* Institutional MVP Badge Section */}
      <Section className="py-24 border-y border-border bg-slate-50 dark:bg-black">
        <div className="mx-auto max-w-4xl px-8 p-16 rounded-[48px] border border-border bg-white dark:bg-zinc-950 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 blur-[40px] rounded-full" />
            <div className="space-y-8 text-center">
                <div className="inline-flex h-12 px-6 items-center rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest">
                    Available Now
                </div>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Lauching Institutional MVP</h3>
                <p className="text-lg font-bold text-muted-foreground italic max-w-2xl mx-auto">
                    A focused, disciplined foundation built for architects of the future. We are starting with the core discovery and management layers.
                </p>
                <div className="pt-6">
                    <a href="/signin" className="inline-flex h-16 px-12 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[11px] tracking-widest transition-all active:scale-95">
                        Access MVP
                    </a>
                </div>
            </div>
        </div>
      </Section>
    </main>
  );
}
