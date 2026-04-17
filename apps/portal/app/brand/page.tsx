import { Section, SectionLabel } from "@/components/ui/portal";
import { FileText, Zap, User, ExternalLink } from "lucide-react";

export default function BrandIdentityPage() {
  const assets = [
    {
      title: "Identity Layer",
      description: "Comprehensive documentation detailing the core identity, typography, and color systems.",
      href: "/zane_ai_brand_document.html",
      icon: FileText,
      tag: "CORE IDENTITY",
    },
    {
      title: "Bold Framework",
      description: "High-impact variation designed for premium institutional presentation.",
      href: "/zane_ai_bold_brand.html",
      icon: Zap,
      tag: "HIGH IMPACT",
    },
    {
      title: "Operational Profile",
      description: "The standalone profile highlighting the future of intelligent property orchestration.",
      href: "/zane-ai-profile.html",
      icon: User,
      tag: "PROFILE",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 transition-all">
      <Section className="py-20 border-b border-border">
        <div className="mx-auto max-w-4xl px-6 space-y-10">
          <SectionLabel icon={Zap} className="bg-primary/5 text-primary border-primary/10 px-4 py-2">
            Visual Intelligence
          </SectionLabel>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground uppercase leading-none">
              Brand <br />
              <span className="text-primary italic">Identity Framework.</span>
            </h1>
            <p className="text-xl font-bold leading-relaxed text-muted-foreground max-w-2xl italic">
              Explore the design language and technical foundations that power the Zane-ai operating layer—built for high-precision institutional property tech.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-24 bg-slate-50 dark:bg-zinc-950/20 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {assets.map((asset, i) => (
              <div 
                key={i}
                className="group relative rounded-[40px] border border-border bg-white dark:bg-zinc-950 p-10 overflow-hidden flex flex-col justify-between min-h-[420px] shadow-sm transition-all hover:scale-[1.02]"
              >
                <div className="space-y-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground group-hover:text-primary transition-colors">
                    <asset.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-2">
                       {asset.tag}
                    </p>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-tighter">{asset.title}</h2>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed italic mt-4">
                        {asset.description}
                    </p>
                  </div>
                </div>
                <div className="pt-10">
                  <a 
                    href={asset.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-md"
                  >
                    Launch Document
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20">
         <div className="mx-auto max-w-4xl px-8 p-12 rounded-[40px] bg-white dark:bg-zinc-950 border border-border text-center space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight">Need technical assets?</h3>
            <p className="font-bold text-muted-foreground text-sm max-w-lg mx-auto italic">
              Our branding kit is designed for modular integration. If you require vectorized logos or specific color tokens, please contact our support team.
            </p>
            <a href="/contact" className="inline-flex h-14 items-center justify-center rounded-xl border border-border px-10 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors">
              Contact Support
            </a>
         </div>
      </Section>
    </main>
  );
}
