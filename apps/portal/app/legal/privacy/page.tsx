import { Section } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      <Section className="py-20 lg:py-28 border-b border-border/50 bg-slate-50/20 dark:bg-zinc-950/20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white dark:bg-black px-4 py-1.5 text-xs font-bold text-foreground relative isolate [transform:translateZ(0)] shadow-sm">
             <span className="text-xl leading-none -mt-1 text-primary">★</span>
             {dictionary.footer.privacy}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
            Your Data. <br/> <span className="text-primary text-opacity-90">Encrypted.</span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground pt-4" dir="auto">Last updated: April 15, 2026</p>
        </div>
      </Section>

      <Section className="py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground" dir="auto">1. Data Sovereignty</h2>
              <p className="text-lg font-medium text-muted-foreground leading-relaxed" dir="auto">
                We utilize institutional-grade encryption for all data residing in the Zane-ai ecosystem. Your projects, communications, and client data are stored with absolute security at the core.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground" dir="auto">2. Information Collection</h2>
              <p className="text-lg font-medium text-muted-foreground leading-relaxed" dir="auto">
                We only collect data necessary for operational synchronization between developers and brokers. We never sell or share institutional data with third-party advertising networks.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
