import { Section, SectionLabel } from "@/components/ui/portal";
import { Download, Smartphone, Layout } from "lucide-react";

export default async function DownloadPage() {
  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="space-y-8 text-center max-w-3xl mx-auto">
             <SectionLabel icon={Smartphone} textClassName="text-xs font-black uppercase tracking-widest">
                Mobile Intelligence
             </SectionLabel>
             <h1 className="text-5xl font-black md:text-8xl tracking-tighter">
                Workspace on the <span className="text-primary">Move.</span>
             </h1>
             <p className="text-lg md:text-xl font-bold text-muted-foreground leading-relaxed">
                Take the entire power of Zane-AI with you. Instant notifications, live property updates, and direct broker chat in your pocket.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative rounded-[48px] border border-border bg-slate-50 dark:bg-slate-900 p-12 overflow-hidden flex flex-col justify-between min-h-[500px] transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
               <div className="space-y-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                     <Download className="h-6 w-6" />
                  </div>
                  <h2 className="text-4xl font-black">iOS App</h2>
                  <p className="text-lg font-bold text-muted-foreground">Download the native experience for iPhone and iPad.</p>
               </div>
               <div className="pt-12">
                  <button className="inline-flex h-16 w-full items-center justify-center rounded-3xl bg-foreground text-background font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95">
                     Coming Soon to App Store
                  </button>
               </div>
               <Smartphone className="absolute -bottom-24 -right-24 h-96 w-96 text-primary opacity-5 transform rotate-12" strokeWidth={0.5} />
            </div>

            <div className="group relative rounded-[48px] border border-border bg-slate-50 dark:bg-slate-900 p-12 overflow-hidden flex flex-col justify-between min-h-[500px] transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
               <div className="space-y-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                     <Download className="h-6 w-6" />
                  </div>
                  <h2 className="text-4xl font-black">Android</h2>
                  <p className="text-lg font-bold text-muted-foreground">Get the official Zane-AI app from the Google Play Store.</p>
               </div>
               <div className="pt-12">
                  <button className="inline-flex h-16 w-full items-center justify-center rounded-3xl bg-foreground text-background font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95">
                     Coming Soon to Play Store
                  </button>
               </div>
               <Layout className="absolute -bottom-24 -right-24 h-96 w-96 text-primary opacity-5 transform -rotate-12" strokeWidth={0.5} />
            </div>
          </div>

          <div className="rounded-[40px] border border-border bg-background p-8 md:p-12">
            <div className="max-w-3xl space-y-5">
              <SectionLabel icon={Layout} textClassName="text-xs font-black uppercase tracking-widest">
                Shareable profile
              </SectionLabel>
              <h2 className="text-3xl font-black tracking-tighter md:text-5xl">
                Open the standalone Zane-AI profile page.
              </h2>
              <p className="text-base font-bold leading-relaxed text-muted-foreground md:text-lg">
                This is the exact HTML profile page added to the portal as a direct public file, so you can open it quickly and share one clean link whenever you need help or feedback.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="/zane-ai-profile.html"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center rounded-3xl bg-foreground px-8 text-center text-sm font-black uppercase tracking-widest text-background transition-all hover:opacity-90 active:scale-95"
                >
                  Open profile page
                </a>
                <code className="rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm text-muted-foreground dark:bg-slate-900">
                  /zane-ai-profile.html
                </code>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
