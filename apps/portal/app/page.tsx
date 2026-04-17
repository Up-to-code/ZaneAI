import { 
  PageHero, 
  Section, 
  FeatureCardGrid, 
  SectionLabel 
} from "@/components/ui/portal";
import { ArrowRight, Eye, Layers, Building2, Globe, BarChart3, MoveRight } from "lucide-react";

export default async function HomePage() {
  return (
    <main className="bg-[#FFFFFF] dark:bg-[#000000]">
      {/* Premier Hero Section */}
      <Section className="relative overflow-hidden pt-36 lg:pt-56 pb-24">
        {/* Institutional Glow */}
        <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 overflow-hidden">
          <div className="absolute top-0 left-1/3 h-[700px] w-[700px] rounded-full bg-[#E8420A]/5 blur-[120px]" />
          <div className="absolute top-1/2 right-1/3 h-[500px] w-[500px] rounded-full bg-[#E8420A]/8 blur-[100px]" />
        </div>
        
        <PageHero
          badge={
            <SectionLabel icon={Eye} className="bg-[#E8420A]/5 text-[#E8420A] border-[#E8420A]/10 px-4 py-2">
              The Intelligent Layer
            </SectionLabel>
          }
          title={
            <h1 className="flex flex-col gap-4">
              <span className="font-brand-sans text-6xl font-black uppercase tracking-[-0.05em] sm:text-8xl lg:text-[11.5rem] leading-[0.82] text-foreground">
                The intelligent layer <br />
                <span className="text-[#E8420A] font-brand-serif italic normal-case lowercase tracking-normal font-bold">for real estate discovery.</span>
              </span>
            </h1>
          }
          description={
            <p className="mx-auto mt-14 max-w-2xl text-xl font-bold leading-relaxed text-muted-foreground md:text-2xl lg:max-w-4xl">
              Zane AI is an AI-native platform connecting buyers to properties through natural language — and giving developers and brokers the operating system to manage everything that follows.
            </p>
          }
          contentClassName="mx-auto max-w-[1500px] space-y-12 px-6 text-center"
          actions={
            <div className="mt-20 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a
                href="/signin"
                className="group inline-flex min-w-[300px] h-20 items-center justify-center rounded-3xl bg-foreground px-12 text-[11px] font-black uppercase tracking-[0.35em] text-background transition-all hover:opacity-90 active:scale-95 shadow-2xl shadow-foreground/5"
              >
                Access Framework
                <MoveRight className="ml-4 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </a>
              <a
                href="/reading"
                className="inline-flex min-w-[300px] h-20 items-center justify-center rounded-3xl border border-border bg-background px-12 text-[11px] font-black uppercase tracking-[0.35em] text-foreground transition-all hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95"
              >
                Read Manifesto
              </a>
            </div>
          }
        />
      </Section>

      {/* Manifesto Statement - Full Width Premium */}
      <Section className="py-48 bg-[#FAFAF8] dark:bg-white/[0.01] border-y border-border/10">
        <div className="mx-auto max-w-[1000px] px-6 text-center space-y-12">
            <SectionLabel className="mx-auto text-[#E8420A] bg-[#E8420A]/10 border-none">Unified System</SectionLabel>
            <h2 className="font-brand-serif text-4xl md:text-7xl font-bold italic leading-tight text-foreground tracking-tight">
                "Zane AI is the intelligent infrastructure for real estate — connecting people, properties, and data into one unified system."
            </h2>
            <div className="pt-8 flex justify-center">
                <div className="h-px w-24 bg-[#E8420A]" />
            </div>
            <p className="mx-auto max-w-2xl text-lg md:text-xl font-bold text-muted-foreground leading-relaxed">
                We are not a listings site. We are the operating layer that lives underneath all of it — where intent becomes matched listings, and where nothing falls through the cracks.
            </p>
        </div>
      </Section>

      {/* High-Impact Feature Grid */}
      <Section id="execution" className="py-32 lg:py-48">
         <div className="mx-auto max-w-5xl mb-32 space-y-10 text-center px-6">
            <SectionLabel icon={Layers} className="mx-auto">Connectivity</SectionLabel>
            <h2 className="font-brand-sans text-5xl font-black uppercase tracking-[-0.03em] sm:text-8xl">
               One Ledger. <br />
               <span className="text-[#E8420A] lg:font-brand-serif lg:italic lg:lowercase lg:tracking-tight lg:font-bold">Total Precision.</span>
            </h2>
         </div>
         
         <FeatureCardGrid
          items={[
            {
              title: "Unified Infrastructure",
              description: "The connective layer that makes every listing, every deal, and every relationship work better.",
              icon: Building2,
              variant: "accent",
            },
            {
              title: "Demand Intelligence",
              description: "When buyer context carries into the workspace, every handoff preserves information.",
              icon: Globe,
            },
            {
              title: "Execution Engine",
              description: "The entry point, the qualification layer, and the handoff mechanism built into one flow.",
              icon: BarChart3,
              variant: "dark",
            },
          ]}
          className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:px-12 md:grid-cols-3"
        />
      </Section>

      {/* Cinematic Dark CTA */}
      <Section bg="dark" className="border-t border-white/5 py-64 relative overflow-hidden bg-black">
         {/* Focal Deep Glow */}
         <div className="absolute -bottom-1/2 left-1/2 h-[800px] w-full -translate-x-1/2 rounded-full bg-[#E8420A]/15 blur-[180px]" />
         
         <div className="relative z-10 mx-auto max-w-6xl px-6 text-center space-y-24">
            <h2 className="font-brand-sans text-5xl font-black uppercase tracking-[-0.05em] sm:text-[11rem] leading-[0.8] text-white">
               Connect. <br />
               Automate. <br />
               <span className="text-[#E8420A] italic">Scale.</span>
            </h2>
            
            <p className="mx-auto max-w-3xl text-xl font-bold text-white/40 leading-relaxed md:text-3xl">
               Join the region's most advanced <br className="hidden md:block" /> 
               intelligent infrastructure for real estate.
            </p>

            <div className="flex flex-col items-center justify-center gap-10 sm:flex-row pt-12">
               <a
                 href="/signin"
                 className="inline-flex min-w-[340px] h-20 items-center justify-center rounded-3xl bg-[#E8420A] px-12 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-[#E8420A]/90 active:scale-95 shadow-3xl shadow-[#E8420A]/30 ring-8 ring-[#E8420A]/5"
               >
                 Initialize Workspace
               </a>
            </div>

            <div className="pt-24 opacity-30">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                    Zane AI — Intelligent infrastructure
                </span>
            </div>
         </div>
      </Section>
    </main>
  );
}
