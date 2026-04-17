import { Section, SectionLabel } from "@/components/ui/portal";
import { FileText, Zap, User, ExternalLink } from "lucide-react";

export default function BrandIdentityPage() {
  const assets = [
    {
      title: "Brand Document",
      description: "Comprehensive documentation detailing the core identity, typography, and color systems of Zane-AI.",
      href: "/zane_ai_brand_document.html",
      icon: FileText,
      tag: "CORE IDENTITY",
    },
    {
      title: "Bold Brand Document",
      description: "The high-impact variation of the Zane-AI brand, designed for premium institutional presentation.",
      href: "/zane_ai_bold_brand.html",
      icon: Zap,
      tag: "HIGH IMPACT",
    },
    {
      title: "Operational Profile",
      description: "The standalone profile highlighting the future of property technology and intelligent orchestration.",
      href: "/zane-ai-profile.html",
      icon: User,
      tag: "PROFILE",
    },
  ];

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-20">
          <div className="space-y-8 text-center max-w-3xl mx-auto">
            <SectionLabel icon={Zap} textClassName="text-xs font-black uppercase tracking-widest">
              Visual Intelligence
            </SectionLabel>
            <h1 className="text-5xl font-black md:text-8xl tracking-tighter">
              Brand <span className="text-primary">Identity.</span>
            </h1>
            <p className="text-lg md:text-xl font-bold text-muted-foreground leading-relaxed">
              Explore the design language and technical foundations that power the Zane-AI operating layer—built for high-precision institutional property tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <div 
                key={asset.title}
                className="group relative rounded-[48px] border border-border bg-slate-50 dark:bg-slate-900 p-10 overflow-hidden flex flex-col justify-between min-h-[480px] transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="space-y-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                    <asset.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest uppercase text-primary mb-2">
                       {asset.tag}
                    </p>
                    <h2 className="text-3xl font-black mb-4">{asset.title}</h2>
                    <p className="text-base font-bold text-muted-foreground leading-relaxed">
                        {asset.description}
                    </p>
                  </div>
                </div>
                <div className="pt-10">
                  <a 
                    href={asset.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-3xl bg-foreground text-background font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 group/btn"
                  >
                    Open Document
                    <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </a>
                </div>
                <asset.icon 
                  className="absolute -bottom-16 -right-16 h-64 w-64 text-primary opacity-[0.03] transform rotate-12 transition-all group-hover:scale-110 group-hover:rotate-6" 
                  strokeWidth={0.5} 
                />
              </div>
            ))}
          </div>

          <div className="rounded-[40px] border border-border bg-background p-8 md:p-12 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
               <h3 className="text-2xl font-black">Need custom assets?</h3>
               <p className="font-bold text-muted-foreground">
                  Our branding kit is designed for modular integration. If you require vectorized logos or specific color tokens for institutional use, please contact our implementation team.
               </p>
               <a href="/contact" className="inline-flex h-14 items-center justify-center rounded-2xl border border-border px-8 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  Contact Support
               </a>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
