import { Section, SectionLabel, Card, ButtonLink } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
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
    <main className="bg-background pt-24 md:pt-32">
      <Section className="py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="space-y-8">
             <SectionLabel icon={Scale} textClassName="text-xs font-black uppercase tracking-widest">
                {dictionary.footer.legal}
             </SectionLabel>
             <h1 className="text-5xl font-black md:text-8xl tracking-tighter">
                Transparency by <span className="text-primary">Design.</span>
             </h1>
             <p className="text-lg md:text-xl font-bold text-muted-foreground leading-relaxed max-w-2xl">
                We believe in clear, institutional-grade standards for every interaction in the Zane-AI ecosystem.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalItems.map((item, i) => (
              <ButtonLink key={i} href={item.href} locale={locale} className="block group !p-0 !h-auto border-none">
                <Card locale={locale} className="p-10 flex flex-col justify-between h-full group-hover:bg-slate-50 dark:group-hover:bg-slate-900 transition-colors">
                  <div className="space-y-6">
                    <item.icon className="h-8 w-8 text-primary" />
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black">{item.title}</h3>
                       <p className="text-sm font-bold text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="pt-8 flex items-center justify-end">
                     <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </ButtonLink>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
