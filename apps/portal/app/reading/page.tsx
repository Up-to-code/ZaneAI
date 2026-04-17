import { Section, SectionLabel } from "@/components/ui/portal";
import { Eye, ArrowRight, CheckCircle2, AlertCircle, Info, MoveDiagonal } from "lucide-react";

export default function ReadingPage() {
  return (
    <main className="bg-[#FAFAF8] dark:bg-[#0A0A0A] pt-24 md:pt-32 min-h-screen font-sans selection:bg-[#E8420A] selection:text-white">
      {/* High-Impact Editorial Header */}
      <Section className="py-24 border-b border-border/10">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8420A]/10">
              <Eye className="h-6 w-6 text-[#E8420A]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8420A]">
                The Manifesto
              </p>
              <h2 className="text-sm font-bold opacity-60">Zane-AI Architecture</h2>
            </div>
          </div>

          <h1 className="font-brand-sans text-5xl md:text-8xl font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 uppercase">
            The intelligent layer <br />
            <span className="text-[#E8420A] font-brand-serif italic normal-case lowercase tracking-normal font-bold">for real estate discovery.</span>
          </h1>

          <p className="font-brand-serif text-2xl md:text-3xl leading-relaxed text-muted-foreground italic lg:max-w-2xl">
            "Zane AI is an AI-native platform connecting buyers to properties through natural language — and giving developers and brokers the operating system to manage everything that follows."
          </p>
        </div>
      </Section>

      {/* Main Content Body */}
      <article className="mx-auto max-w-[800px] px-6 py-24 space-y-32">
        
        {/* Section: What We Are */}
        <section className="space-y-12">
          <SectionLabel className="bg-[#E8420A]/10 text-[#E8420A] border-none px-4 py-2">01 / Foundation</SectionLabel>
          <div className="space-y-8">
            <h2 className="font-brand-sans text-4xl font-extrabold uppercase tracking-tight">What we are</h2>
            <div className="p-8 md:p-12 bg-white dark:bg-slate-900 border border-border/10 rounded-[40px] shadow-sm">
                <p className="font-brand-serif text-2xl md:text-4xl leading-snug lg:leading-normal italic text-foreground">
                    Zane AI is the intelligent infrastructure for real estate — connecting people, properties, and data into one unified system.
                </p>
            </div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground">
              We are not a listings site. We are not a chat tool. We are not a CRM. We are the operating layer that lives underneath all of it — where intent becomes matched listings, where financing paths get modeled, where teams coordinate, and where nothing falls through the cracks between tools.
            </p>
          </div>
        </section>

        {/* Section: The Problem */}
        <section className="space-y-12">
          <SectionLabel className="bg-[#E8420A]/10 text-[#E8420A] border-none px-4 py-2">02 / Fragmentation</SectionLabel>
          <div className="space-y-8">
            <h2 className="font-brand-sans text-4xl font-extrabold uppercase tracking-tight">The Problem</h2>
            <p className="font-brand-serif text-2xl md:text-3xl italic text-foreground">
                "Real estate is still deeply fragmented."
            </p>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground">
              A buyer searches in one place, asks questions in another, reviews financing somewhere else, and then gets handed into a broker workflow where context has to be rebuilt from scratch. Every handoff is a loss.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                {[
                  { title: "Broken buyer journey", desc: "Search, compare, finance, and contact live in completely separate tools. No continuity." },
                  { title: "Lost financing context", desc: "Mortgage estimates and installment comparisons happen outside the property conversation." },
                  { title: "Broker drop-off", desc: "Brokers lose the thread between a buyer's first question and the actual follow-up." },
                  { title: "Scattered operations", desc: "Developers manage projects, offers, and CRM across chats, spreadsheets, and disconnected apps." }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-[32px] bg-slate-100/50 dark:bg-slate-900/50 border border-border/5">
                    <h4 className="text-lg font-black uppercase tracking-tight mb-2">{item.title}</h4>
                    <p className="text-base text-muted-foreground font-bold">{item.desc}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Section: Product Surface */}
        <section className="space-y-12">
          <SectionLabel className="bg-[#E8420A]/10 text-[#E8420A] border-none px-4 py-2">03 / Implementation</SectionLabel>
          <div className="space-y-8">
            <h2 className="font-brand-sans text-4xl font-extrabold uppercase tracking-tight">Two connected product surfaces</h2>
            
            <div className="grid grid-cols-1 gap-10 pt-8">
                <div className="p-10 md:p-14 rounded-[56px] border-2 border-[#E8420A] bg-white dark:bg-slate-950 relative overflow-hidden group">
                   <div className="flex justify-between items-start mb-10">
                      <div>
                        <span className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest bg-[#E8420A]/10 text-[#E8420A] rounded-full mb-4">Live Now</span>
                        <h3 className="font-brand-sans text-4xl md:text-5xl font-black tracking-tighter">The Buyer Assistant</h3>
                      </div>
                   </div>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Natural language property search", "AI-powered matching & filtering", "Side-by-side comparison", 
                        "Financing path modeling", "Bank offer comparison", "Neighborhood & market context", "Advisor and broker handoff"
                      ].map((li, i) => (
                        <li key={i} className="flex items-center gap-3 text-lg font-bold text-muted-foreground">
                          <CheckCircle2 className="h-5 w-5 text-[#E8420A] shrink-0" />
                          {li}
                        </li>
                      ))}
                   </ul>
                   <MoveDiagonal className="absolute -bottom-10 -right-10 h-64 w-64 text-[#E8420A] opacity-5 transform rotate-12" />
                </div>

                <div className="p-10 md:p-14 rounded-[56px] border border-border bg-slate-50 dark:bg-slate-900 opacity-80">
                   <div className="flex justify-between items-start mb-10">
                      <div>
                        <span className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-200 dark:bg-slate-800 text-muted-foreground rounded-full mb-4">Coming Next</span>
                        <h3 className="font-brand-sans text-4xl md:text-5xl font-black tracking-tighter text-slate-400">The Broker Workspace</h3>
                      </div>
                   </div>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Project & unit management", "Offer tracking & approvals", "CRM and client context", 
                        "Inbox & team collaboration", "Market activity visibility", "AI-assisted follow-ups"
                      ].map((li, i) => (
                        <li key={i} className="flex items-center gap-3 text-lg font-bold text-slate-400">
                          <Info className="h-5 w-5 text-slate-300 dark:text-slate-700 shrink-0" />
                          {li}
                        </li>
                      ))}
                   </ul>
                </div>
            </div>
          </div>
        </section>

        {/* Section: Tactical Position */}
        <section className="space-y-12">
          <SectionLabel className="bg-[#E8420A]/10 text-[#E8420A] border-none px-4 py-2">04 / Strategy</SectionLabel>
          <div className="space-y-12">
            <h2 className="font-brand-sans text-4xl font-extrabold uppercase tracking-tight">Strategic position</h2>
            
            <div className="space-y-16">
              {[
                { 
                  title: "AI as the engine, not the feature.", 
                  body: "The assistant is not a chatbot bolted onto a listings feed. It is the entry point, the qualification layer, and the handoff mechanism built into one flow." 
                },
                { 
                  title: "Demand and execution in one system.", 
                  body: "When buyer context carries into the broker workspace, every handoff preserves information instead of destroying it." 
                },
                { 
                  title: "Infrastructure, not inventory.", 
                  body: "We are not trying to win on the number of listings. We are building the connective layer that makes every listing, every deal, and every relationship work better." 
                }
              ].map((strat, i) => (
                <div key={i} className="group">
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#E8420A] mb-4">
                    {strat.title}
                  </h4>
                  <p className="text-2xl font-medium leading-[1.6] text-muted-foreground border-l-2 border-[#E8420A]/10 pl-8 group-hover:border-[#E8420A] transition-colors duration-500">
                    {strat.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Tagline */}
        <section className="py-32 text-center space-y-8 border-t border-border/10">
            <p className="font-brand-serif text-4xl md:text-7xl italic font-bold text-foreground tracking-tighter">
                Connect. <span className="text-[#E8420A]">Automate.</span> Scale.
            </p>
            <div className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                Zane AI — Intelligent infrastructure for real estate
            </div>
            <div className="pt-12">
                <a 
                    href="/signin" 
                    className="inline-flex h-20 px-16 items-center justify-center rounded-3xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-95 transition-all"
                >
                    Initialize Workspace
                </a>
            </div>
        </section>

      </article>
    </main>
  );
}
