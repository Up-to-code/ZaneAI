import { Section, SectionLabel } from "@/components/ui/portal";
import { Download, Smartphone, Layout, MoveDiagonal, Globe, MoveRight } from "lucide-react";

export default async function DownloadPage() {
  return (
    <main className="bg-background pt-24 md:pt-32 font-sans selection:bg-primary selection:text-white">
      {/* Cinematic Download Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Institutional Backdrop */}
        <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 overflow-hidden">
          <div className="absolute top-0 right-1/3 h-[700px] w-[700px] rounded-full bg-primary/5 blur-[140px]" />
          <div className="absolute top-1/2 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 space-y-16 text-center">
          <div className="space-y-10 max-w-4xl mx-auto">
             <SectionLabel icon={Smartphone} className="mx-auto bg-primary/5 text-primary border-primary/10">
                Cross-Platform Intelligence
             </SectionLabel>
             <h1 className="font-brand-sans text-6xl font-black md:text-8xl lg:text-[9rem] tracking-tight uppercase leading-[0.9]">
                Workspace on <br />
                <span className="text-primary italic lg:font-brand-serif lg:capitalize lg:tracking-tighter lg:font-bold">the Move.</span>
             </h1>
             <p className="mx-auto max-w-3xl text-xl font-bold leading-relaxed text-muted-foreground md:text-2xl">
                Take the entire power of Zane-AI with you. Instant notifications, live property updates, and direct broker-developer coordination in your pocket.
             </p>
          </div>

          {/* App Download Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12">
            {[
              { 
                name: "iOS Framework", 
                tag: "Official iPhone / iPad", 
                btn: "Coming Soon to App Store", 
                icon: Smartphone,
                rotate: "rotate-12"
              },
              { 
                name: "Android Engine", 
                tag: "Google Play Store", 
                btn: "Coming Soon to Play Store", 
                icon: Layout,
                rotate: "-rotate-12"
              }
            ].map((app, i) => (
              <div key={i} className="group relative rounded-[56px] border border-border bg-slate-50 dark:bg-slate-900/50 p-12 md:p-16 overflow-hidden flex flex-col justify-between min-h-[550px] transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="space-y-10 z-10 text-left">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
                    <Download className="h-8 w-8" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{app.tag}</p>
                    <h2 className="font-brand-sans text-5xl font-black uppercase tracking-tight">{app.name}</h2>
                    <p className="text-lg font-bold text-muted-foreground italic lg:max-w-xs">{`Download the high-fidelity native experience for ${app.name.split(' ')[0]} devices.`}</p>
                  </div>
                </div>
                <div className="pt-16 z-10">
                  <button className="inline-flex h-20 w-full items-center justify-center rounded-3xl bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:opacity-90 active:scale-95 shadow-2xl">
                    {app.btn}
                  </button>
                </div>
                <app.icon className={`absolute -bottom-24 -right-24 h-96 w-96 text-primary opacity-[0.03] group-hover:opacity-[0.08] transition-all transform ${app.rotate} group-hover:scale-110`} strokeWidth={0.5} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Profile & Assets Section */}
      <Section className="py-32 border-t border-border/10 pb-48">
        <div className="mx-auto max-w-7xl px-6">
          <div className="group rounded-[64px] border-2 border-primary/20 bg-background p-10 md:p-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/5 -skew-x-12 -z-10" />
            
            <div className="max-w-4xl space-y-10">
              <SectionLabel icon={Globe} className="bg-primary/5 text-primary border-primary/10">
                Institutional Profile
              </SectionLabel>
              <h2 className="font-brand-sans text-4xl font-black tracking-tight md:text-7xl uppercase leading-tight">
                Standalone <br />
                <span className="text-primary italic lg:font-brand-serif lg:capitalize lg:tracking-tighter lg:font-bold">Identity Profile.</span>
              </h2>
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground border-l-2 border-primary/10 pl-8 group-hover:border-primary transition-colors">
                Open the standalone Zane-AI profile page. This is the exact high-fidelity document used for brand positioning and investor relations — now accessible as a direct public resource.
              </p>
              
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center pt-8">
                <a
                  href="/zane-ai-profile.html"
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn inline-flex min-h-20 items-center justify-center rounded-3xl bg-foreground px-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-background transition-all hover:opacity-90 active:scale-95 shadow-xl"
                >
                  Launch Profile
                  <MoveRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
                <code className="rounded-2xl border border-border bg-slate-50 dark:bg-slate-900 px-6 py-4 text-sm font-bold text-muted-foreground">
                  portal.zane-ai.com/profile
                </code>
              </div>
            </div>
            
            <MoveDiagonal className="absolute -top-12 -right-12 h-64 w-64 text-primary opacity-[0.03] transform rotate-12" />
          </div>
        </div>
      </Section>
    </main>
  );
}
