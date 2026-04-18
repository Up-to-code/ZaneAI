import { Section } from "@/components/ui/portal";
import { Smartphone, Layout, Globe, ArrowUpRight } from "lucide-react";

export default async function DownloadPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      <Section className="py-20 lg:py-28 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-12">
            <div className="space-y-8 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                    <span className="text-xl leading-none -mt-1">★</span>
                    Cross-Platform Intelligence
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
                    Workspace on <br/> the Move.
                </h1>
                <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
                   Take the entire power of Zane-ai with you. Infrastructure right in your pocket.
                </p>
            </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-950/20 relative overflow-hidden">
        <div className="absolute top-1/4 start-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {[
              { 
                name: "iOS Framework", 
                tag: "Official iPhone / iPad", 
                desc: "The native Apple experience for institutional mobility.",
                btn: "Coming Soon to App Store", 
                icon: Smartphone
              },
              { 
                name: "Android Engine", 
                tag: "Google Play Store", 
                desc: "High-performance android deployment for teams.",
                btn: "Coming Soon to Play Store", 
                icon: Layout
              }
            ].map((app, i) => (
              <div key={i} className="group relative rounded-3xl md:rounded-[2.5rem] border border-border bg-white dark:bg-black p-6 sm:p-10 md:p-14 overflow-hidden flex flex-col justify-between min-h-[300px] md:min-h-[420px] shadow-sm transition-all hover:border-black/20 dark:hover:border-zinc-700 isolate [transform:translateZ(0)]">
                <div className="space-y-6 md:space-y-8 relative z-10">
                  <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                    <app.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-xs font-bold text-primary" dir="auto">{app.tag}</p>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight" dir="auto">{app.name}</h2>
                    <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed max-w-sm" dir="auto">{app.desc}</p>
                  </div>
                </div>
                <div className="pt-8 md:pt-12 relative z-10">
                  <button className="inline-flex h-12 md:h-14 w-full items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 text-foreground font-bold text-sm transition-all shadow-sm opacity-50 cursor-not-allowed">
                    {app.btn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 p-8 sm:p-12 lg:p-16 rounded-3xl md:rounded-[3rem] bg-black dark:bg-zinc-950 text-center space-y-8 md:space-y-10 relative overflow-hidden shadow-xl isolate [transform:translateZ(0)]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-primary/20 blur-[100px] md:blur-[150px] rounded-full" />
            </div>
            
            <div className="relative z-10 space-y-6 md:space-y-8 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white">
                    <Globe className="h-3.5 w-3.5" />
                    Institutional Assets
                </div>
                
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white" dir="auto">Access Brand Profile.</h3>
                <p className="text-sm sm:text-base md:text-lg font-medium text-white/60 max-w-xl mx-auto leading-relaxed" dir="auto">
                   The exact high-fidelity document used for brand positioning and investor relations — now accessible as a direct public resource.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-8 w-full sm:w-auto">
                    <a
                      href="/zane-ai-profile.html"
                      target="_blank"
                      className="inline-flex h-12 md:h-14 items-center justify-center gap-2 rounded-full bg-primary text-white px-8 font-bold text-sm transition-all active:scale-95 shadow-md hover:bg-white hover:text-black"
                    >
                      Launch Profile
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
      </Section>
    </main>
  );
}
