import { Section } from "@/components/ui/portal";
import { BookOpen, Cpu, Shield, Zap, Target, ArrowDown } from "lucide-react";

export default async function ReadingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      {/* Manifesto Title Layer */}
      <Section className="py-20 lg:py-28 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-12">
            <div className="space-y-8 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                    <span className="text-xl leading-none -mt-1">★</span>
                    Infrastructure Manifesto
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
                    Zane-ai: The Intelligent <br/> Infrastructure.
                </h1>
                <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
                   The Unified Canvas for the future of Real Estate.
                </p>
            </div>
            <div className="pt-8 flex justify-center">
                <ArrowDown className="h-6 w-6 text-primary/40 animate-bounce" />
            </div>
        </div>
      </Section>

      {/* Primary Narrative: The Unified Canvas */}
      <Section className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-slate-50/20 dark:bg-zinc-950/20">
        <div className="absolute top-1/4 start-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 space-y-16 sm:space-y-24">
            <div className="space-y-10 group">
                <p className="text-sm font-bold text-primary px-4 py-1.5 rounded-full bg-primary/5 w-fit border border-primary/10" dir="auto">Who we are.</p>
                <div className="space-y-6 sm:space-y-8 text-xl sm:text-2xl md:text-3xl font-bold leading-[1.5] text-foreground tracking-tight" dir="auto">
                    <p className="text-foreground/90">
                        For decades, the real estate industry has operated on a fractured canvas. Listings are scattered, communication is siloed, and data exists in isolation. 
                    </p>
                    <p className="text-foreground/80">
                        We’ve been forced to navigate a maze of disconnected tools, comparing fragments by hand, and losing the signal in the noise.
                    </p>
                    <div className="border-s-4 border-primary ps-6 sm:ps-8 py-2 md:py-4">
                        <p className="text-base sm:text-xl md:text-2xl font-medium text-foreground/80 leading-relaxed italic" dir="auto">
                            "We believe that the next generation of real estate won’t be built on another marketplace. It will be built on infrastructure."
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-10 sm:space-y-16">
                <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter" dir="auto">An AI-Native Foundation.</h3>
                    <p className="text-base md:text-lg font-medium text-muted-foreground leading-relaxed max-w-2xl" dir="auto">
                        Zane-ai is the intelligent layer powering the future of real estate. We are building the unified system that connects people, properties, and data into a single, high-fidelity ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {[
                        { title: "Connected", icon: Zap, text: "Intent, operations, and intelligence act as one living infrastructure." },
                        { title: "Precision", icon: Target, text: "Describe a vision in natural language and receive high-fidelity matches." },
                        { title: "Automated", icon: Cpu, text: "AI-powered operating system that automates follow-ups and workflows." },
                        { title: "Focused", icon: Shield, text: "An Institutional foundation built for architects of the future." }
                    ].map((item, i) => (
                        <div key={i} className="p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-border bg-white dark:bg-black space-y-4 sm:space-y-6 shadow-sm transition-all hover:border-black/20 dark:hover:border-zinc-700 isolate [transform:translateZ(0)]">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-primary/5 text-primary">
                                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold tracking-tight" dir="auto">{item.title}</h4>
                            <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed" dir="auto">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-8 sm:space-y-10 pt-10 sm:pt-16 border-t border-border/50">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-foreground tracking-tight" dir="auto">
                    At Zane-ai, we aren't just building another platform. We are building the infrastructure behind modern real estate businesses.
                </p>
                <div className="space-y-6 bg-slate-50 dark:bg-zinc-900 p-6 sm:p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-border isolate [transform:translateZ(0)]">
                    <p className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-foreground" dir="auto">
                        Connect. <br />
                        Automate. <br />
                        Scale.
                    </p>
                </div>
            </div>
        </div>
      </Section>

      {/* Institutional MVP Badge Section */}
      <Section className="py-16 md:py-24 border-t border-border bg-white dark:bg-black relative overflow-hidden">
        <div className="absolute top-0 end-0 h-64 w-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
            <div className="p-8 sm:p-12 lg:p-16 rounded-3xl md:rounded-[3rem] border border-border bg-slate-50 dark:bg-zinc-900 text-center space-y-6 md:space-y-8 flex flex-col items-center isolate [transform:translateZ(0)] shadow-sm">
                <div className="inline-flex px-4 py-1.5 items-center rounded-full bg-primary/10 text-primary font-bold text-xs" dir="auto">
                    🚀 Available Now
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter" dir="auto">Launching Institutional MVP</h3>
                <p className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground max-w-xl mx-auto leading-relaxed" dir="auto">
                    A focused, disciplined foundation built for architects of the future. We are starting with the core discovery and management layers.
                </p>
                <div className="pt-2 md:pt-4">
                    <a href="/signin" className="inline-flex h-12 md:h-14 px-8 md:px-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm transition-all active:scale-95 shadow-sm hover:opacity-90">
                        Access MVP
                    </a>
                </div>
            </div>
        </div>
      </Section>
    </main>
  );
}
