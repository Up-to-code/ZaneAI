import { Section, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Activity, Globe, Heart, ShieldCheck, Zap } from "lucide-react";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);
  const { about } = dictionary;

  return (
    <main className="bg-background pt-24 md:pt-32">
      {/* Title Hero */}
      <Section className="py-24 text-center">
        <div className="mx-auto max-w-4xl space-y-8 px-6">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            {about.badge}
          </div>
          <h1 className="text-5xl font-black leading-[1.1] text-foreground dark:text-white md:text-8xl tracking-tight">
            {about.title} <span className="text-primary">{about.titleAccent}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-bold leading-relaxed text-muted-foreground md:text-xl">
            {about.description}
          </p>
        </div>
      </Section>

      {/* Mission / Vision Section */}
      <Section className="border-t border-border py-32 md:py-48 bg-slate-50 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <SectionLabel icon={Heart} textClassName="text-xs font-black uppercase tracking-widest">
                 {about.missionTitle}
              </SectionLabel>
              <h2 className="text-4xl font-black text-foreground dark:text-white leading-tight">
                {about.missionDescription.split('.')[0]}.
              </h2>
              <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                {about.missionDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[32px] border border-border bg-background p-8 space-y-4">
                 <Zap className="h-8 w-8 text-primary" />
                 <h3 className="font-black text-xl">{about.workStyleTitle}</h3>
                 <p className="text-sm font-bold text-muted-foreground">{about.workStyleDescription}</p>
              </div>
              <div className="rounded-[32px] border border-border bg-primary p-8 space-y-4 text-white">
                 <ShieldCheck className="h-8 w-8 text-white" />
                 <h3 className="font-black text-xl">{about.valuesTitle}</h3>
                 <p className="text-sm font-bold text-white/80">{about.valuesDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Identity / Why Zane-AI */}
      <Section className="py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 space-y-24">
           <div className="text-center space-y-8 max-w-3xl mx-auto">
              <h2 className="text-5xl font-black md:text-7xl tracking-tighter">
                 {about.whyTitle} <span className="text-primary">{about.whyAccent}</span>
              </h2>
              <p className="text-lg md:text-xl font-bold text-muted-foreground">
                 {about.whyDescriptionPrimary}
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: dictionary.nav.developer, icon: Activity, desc: about.developerSpace },
                { title: dictionary.nav.broker, icon: Globe, desc: about.metricsUnified },
                { title: about.identityTitle, icon: Heart, desc: about.metricsAudience }
              ].map((item, i) => (
                <div key={i} className="group rounded-[32px] border border-border p-10 space-y-8 transition-all hover:bg-slate-50 dark:hover:bg-slate-900">
                   <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary">
                      <item.icon className="h-6 w-6 text-primary group-hover:text-white" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-2xl font-black">{item.title}</h3>
                      <p className="text-base font-bold text-muted-foreground">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </Section>
    </main>
  );
}
