import { Section, SectionLabel } from "@/components/ui/portal";
import { Download, Smartphone, Layout, Globe, Cpu } from "lucide-react";

export default async function DownloadPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 transition-all pb-32">
      {/* Infrastructure Node Hero */}
      <Section className="py-24 border-b border-border">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
            <div className="space-y-6">
                <SectionLabel icon={Smartphone} className="bg-primary/5 text-primary border-primary/10 px-4 py-2">
                    Cross-Platform Intelligence
                </SectionLabel>
                <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-[0.95] uppercase">
                    Workspace on <br />
                    <span className="text-primary italic">the Move.</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold text-muted-foreground border-l-2 border-primary/20 pl-8 italic">
                   Take the entire power of Zane-ai with you. Infrastructure in your pocket.
                </p>
            </div>
        </div>
      </Section>

      {/* App Protocol Grid */}
      <Section className="py-24 bg-slate-50 dark:bg-zinc-950/20">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
              <div key={i} className="group relative rounded-[40px] border border-border bg-white dark:bg-zinc-950 p-12 overflow-hidden flex flex-col justify-between min-h-[480px] shadow-sm transition-all hover:scale-[1.02]">
                <div className="space-y-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground group-hover:text-primary transition-colors font-mono text-[9px] font-black">
                    NODE_{i+1}
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{app.tag}</p>
                    <h2 className="text-3xl font-black uppercase tracking-tight leading-tight">{app.name}</h2>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed italic opacity-70">{app.desc}</p>
                  </div>
                </div>
                <div className="pt-16">
                  <button className="h-16 w-full flex items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-md">
                    {app.btn}
                  </button>
                </div>
                <app.icon className="absolute -bottom-16 -right-16 h-64 w-64 text-primary opacity-[0.02] transform rotate-12 transition-all group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Institutional Assets Section */}
      <Section className="py-32">
        <div className="mx-auto max-w-4xl px-8 p-12 rounded-[48px] border border-border bg-white dark:bg-zinc-950 text-center space-y-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 h-1.5 w-full bg-primary/10">
                <div className="w-1/4 h-full bg-primary group-hover:w-full transition-all duration-1000" />
            </div>
            
            <div className="space-y-6">
                <SectionLabel icon={Globe} className="mx-auto">Institutional Assets</SectionLabel>
                <h3 className="text-3xl font-black uppercase tracking-tight">Access Brand Profile.</h3>
                <p className="text-lg font-bold text-muted-foreground italic max-w-xl mx-auto">
                   The exact high-fidelity document used for brand positioning and investor relations — now accessible as a direct public resource.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 font-mono">
                <a
                  href="/zane-ai-profile.html"
                  target="_blank"
                  className="h-16 px-12 flex items-center justify-center rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  Launch Profile
                </a>
                <div className="flex items-center justify-center h-16 px-8 rounded-2xl border border-border text-[9px] font-black text-muted-foreground opacity-40">
                   ZANE-IDENTITY / WS-PROFILE-00
                </div>
            </div>
        </div>
      </Section>
    </main>
  );
}
