import { Section } from "@/components/ui/portal";
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
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      <Section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-12">
          <div className="space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                <span className="text-xl leading-none -mt-1">★</span>
                Visual Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
              Brand Identity Framework.
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
              Explore the design language and technical foundations that power the Zane-ai operating layer—built for high-precision institutional property tech.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-24 bg-slate-50/50 dark:bg-zinc-950/20 border-b border-border/50 relative overflow-hidden">
        <div className="absolute top-1/4 start-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset, i) => (
              <div 
                key={i}
                className="group relative rounded-[2.5rem] border border-border bg-white dark:bg-black p-10 flex flex-col justify-between min-h-[420px] shadow-sm transition-all hover:border-primary/40 isolate [transform:translateZ(0)]"
              >
                <div className="space-y-6">
                  <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                    <asset.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight" dir="auto">{asset.title}</h2>
                    <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed mt-3 md:mt-4" dir="auto">
                        {asset.description}
                    </p>
                  </div>
                </div>
                <div className="pt-6 md:pt-10">
                  <a 
                    href={asset.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex h-12 md:h-14 w-full items-center justify-center gap-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm transition-all active:scale-95 hover:opacity-80 shadow-md"
                  >
                    Launch Document
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 lg:py-32">
         <div className="mx-auto max-w-4xl px-4 sm:px-8 p-8 sm:p-12 lg:p-16 rounded-3xl md:rounded-[3rem] bg-slate-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-center space-y-6 md:space-y-8 flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-foreground" dir="auto">Need technical assets?</h3>
            <p className="font-medium text-muted-foreground text-base md:text-lg max-w-lg mx-auto" dir="auto">
              Our branding kit is designed for modular integration. If you require vectorized logos or specific color tokens, please contact our support team.
            </p>
            <a href="/contact" className="inline-flex h-12 md:h-14 items-center justify-center rounded-full bg-white dark:bg-black px-8 md:px-10 text-sm font-bold text-foreground hover:opacity-80 transition-opacity active:scale-95 shadow-sm border border-border mt-4">
              Contact Support
            </a>
         </div>
      </Section>
    </main>
  );
}
