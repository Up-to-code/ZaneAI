import { Section, ButtonLink } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@/lib/i18n";
import { ShieldCheck, FileText, Scale, Lock, ChevronRight } from "lucide-react";

export default async function LegalPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  const legalItems = [
    { title: dictionary.footer.terms, href: "/legal/terms", icon: FileText, desc: "Detailed terms and conditions for platform usage." },
    { title: dictionary.footer.privacy, href: "/legal/privacy", icon: ShieldCheck, desc: "How we protect and manage your institutional data." },
    { title: "Cookie Policy", href: "/legal/cookies", icon: Lock, desc: "Information about how we use cookies to improve experience." },
    { title: "Compliance", href: "/legal/compliance", icon: Scale, desc: "Our regulatory benchmarks and standards." },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      <Section className="py-20 lg:py-28 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-12">
          <div className="space-y-8 flex flex-col items-center">
             <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                 <span className="text-xl leading-none -mt-1">★</span>
                 {dictionary.footer.legal}
             </div>
             <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
                Transparency by <br/> Design.
             </h1>
             <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
                We believe in clear, institutional-grade standards for every interaction in the Zane-ai ecosystem.
             </p>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-950/20 relative overflow-hidden">
        <div className="absolute top-1/4 start-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {legalItems.map((item, i) => (
              <ButtonLink key={i} href={item.href} locale={locale} className="block group !p-0 !h-auto border-none">
                <div className="p-6 sm:p-10 flex flex-col justify-between h-full bg-white dark:bg-black border border-border rounded-3xl md:rounded-[2.5rem] shadow-sm group-hover:border-black/20 dark:group-hover:border-zinc-700 transition-all isolate [transform:translateZ(0)]">
                  <div className="space-y-6 md:space-y-8">
                    <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                        <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl md:text-2xl font-bold tracking-tight" dir="auto">{item.title}</h3>
                       <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed" dir="auto">{item.desc}</p>
                    </div>
                  </div>
                  <div className="pt-10 flex items-center justify-end">
                     <ChevronRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2 rtl:rotate-180" />
                  </div>
                </div>
              </ButtonLink>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
