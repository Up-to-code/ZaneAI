import { Section, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { getWebDictionary, resolveLocale, WEB_LOCALE_COOKIE } from "@zaneai/ag-ui/zaneai";
import { 
    LayoutGrid,
    ClipboardList,
    MessageSquare,
    Cpu,
    Target,
    Zap,
    MoveRight,
    CheckCircle2,
    XCircle
} from "lucide-react";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-16 transition-all selection:bg-primary selection:text-white">
      {/* Hero Section - Centered Marketing Style */}
      <Section className="py-32 md:py-48 border-b border-border">
        <div className="mx-auto max-w-5xl px-6 space-y-12 text-center md:text-left flex flex-col md:items-start items-center">
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-center md:justify-start gap-3 text-primary font-bold text-sm">
                    <Cpu className="h-5 w-5" />
                    <span className="uppercase tracking-widest text-[11px]">Layer 02 · Operator</span>
                </div>
                <h1 className="text-5xl md:text-9xl font-black tracking-tight text-foreground leading-[0.85] uppercase">
                    Broker & <br className="hidden md:block" /> developer <br />
                    <span className="text-primary italic">workspace.</span>
                </h1>
                <p className="text-xl md:text-3xl font-bold text-muted-foreground border-l-4 border-primary/20 pl-8 italic max-w-2xl mx-auto md:mx-0">
                    The operating system for teams. <br />
                    <span className="text-foreground not-italic">Coming next.</span>
                </p>
            </div>
        </div>
      </Section>

      {/* Product Matrix Section */}
      <Section className="py-32 bg-slate-50 dark:bg-zinc-950/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border rounded-[48px] overflow-hidden bg-white dark:bg-black shadow-sm">
            {[
              { title: "Project & unit management", icon: LayoutGrid, desc: "High-precision control of listings, inventory, and architectural metadata." },
              { title: "Offer pipeline and CRM", icon: ClipboardList, desc: "End-to-end deal flow management with integrated institutional CRM." },
              { title: "AI-assisted follow-up", icon: Zap, desc: "Automate lead nurturing with context-aware intelligence that never sleeps." },
              { title: "Inbox and collaboration", icon: MessageSquare, desc: "Unified communication substrate for brokers, developers, and clients." },
              { title: "Demand intelligence", icon: Target, desc: "Unlocking real-time market signals directly from the intent source." },
              { title: "Connective Layer", icon: Cpu, desc: "The operating layer where demand, ops, and data act as one unified node." }
            ].map((f, i) => (
              <div key={i} className="p-12 border-r border-b border-border hover:bg-slate-50 dark:hover:bg-zinc-950 transition-colors group">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground group-hover:text-primary transition-colors mb-8">
                    <f.icon className="h-5 w-5" />
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">{f.title}</h3>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed italic opacity-70">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Connects Workflow */}
      <Section className="py-48">
        <div className="mx-auto max-w-5xl px-6 space-y-24">
            <div className="space-y-6 text-center">
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">How it connects.</h2>
                <div className="h-1.5 w-24 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                    { 
                        step: "1", 
                        title: "Buyer opens the assistant", 
                        desc: "Describes what they're looking for in plain language. Zane surfaces precise matches, not a generic feed." 
                    },
                    { 
                        step: "2", 
                        title: "Intent becomes structured data", 
                        desc: "The assistant captures budget, location preference, financing readiness, and decision timeline — automatically." 
                    },
                    { 
                        step: "3", 
                        title: "Context passes to the operator layer", 
                        desc: "Brokers and developers receive a warm lead with full context attached — no manual rebuilding." 
                    },
                    { 
                        step: "4", 
                        title: "Execution happens inside Zane", 
                        desc: "Offers, follow-up, CRM, and project tracking all run through the same system that captured the lead." 
                    }
                ].map((item, i) => (
                    <div key={i} className="flex gap-10 items-start p-12 rounded-[40px] border border-border bg-white dark:bg-zinc-950 group hover:border-primary/30 transition-all shadow-sm">
                        <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded-3xl bg-black dark:bg-white text-white dark:text-black font-black text-xs group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                            {item.step}
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black uppercase tracking-tight leading-tight">{item.title}</h4>
                            <p className="text-base font-bold text-muted-foreground leading-relaxed italic">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Section>

      {/* Comparison Section: "What Zane is not" */}
      <Section className="py-48 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/5 blur-[150px] -z-10" />
        <div className="mx-auto max-w-6xl px-6 space-y-32 py-24">
            <div className="text-center space-y-8">
                <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none">What Zane <br /> <span className="text-primary italic">is not.</span></h2>
                <p className="text-xl md:text-2xl font-bold text-white/40 italic">Infrastructure vs. Traditional SaaS.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-32 gap-y-20">
                {[
                    { not: "Just a chatbot", is: "AI infrastructure layer" },
                    { not: "A listing marketplace", is: "Intent-to-execution system" },
                    { not: "Another CRM", is: "Unified operating model" },
                    { not: "A financing tool", is: "End-to-end workflow" },
                    { not: "A broker SaaS", is: "Connected ecosystem" },
                    { not: "One user type", is: "Buyers + brokers + devs" }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-6 group">
                        <div className="flex items-center justify-between text-base font-black uppercase tracking-widest border-b border-white/10 pb-6 group-hover:border-primary transition-colors">
                            <div className="flex items-center gap-4 text-white/40 group-hover:text-white/60">
                                <XCircle className="h-5 w-5" />
                                {item.not}
                            </div>
                            <div className="flex items-center gap-4 text-primary">
                                <CheckCircle2 className="h-5 w-5" />
                                {item.is}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Section>

      {/* Closing Statement */}
      <Section className="py-64 border-t border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-primary/2.5 blur-[150px] -z-10" />
        
        <div className="mx-auto max-w-4xl px-8 text-center space-y-20">
            <p className="text-2xl md:text-4xl font-bold leading-tight italic text-foreground text-center border-l-4 border-primary/20 md:border-l-0 pl-8 md:pl-0 mx-auto">
                "Zane-ai is the connective layer real estate has never had — where buyer demand, team operations, and market intelligence act as one."
            </p>
            <div className="space-y-10">
                <div className="h-1.5 w-24 bg-primary mx-auto" />
                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground">Built to own the path from interest to execution.</p>
            </div>
            <div className="pt-10">
                <a href="/signin" className="inline-flex h-20 px-20 items-center justify-center rounded-[32px] bg-black dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-95 transition-all shadow-2xl shadow-black/20">
                    Access Infrastructure
                    <MoveRight className="ml-5 h-5 w-5" />
                </a>
            </div>
        </div>
      </Section>
    </main>
  );
}
