import { Section, SectionLabel, LegalArticle } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@zaneai/ag-ui/zaneai";
import { ShieldCheck } from "lucide-react";

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="py-24">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
          <SectionLabel icon={ShieldCheck} textClassName="text-xs font-black uppercase tracking-widest">
             {dictionary.footer.privacy}
          </SectionLabel>
          <h1 className="text-4xl font-black md:text-7xl tracking-tighter">Your Data. <span className="text-primary">Encrypted.</span></h1>
          <p className="text-sm font-bold text-muted-foreground">Last updated: April 15, 2026</p>
          
          <div className="space-y-16 pt-12">
            <LegalArticle title="1. Data Sovereignty" titleClassName="text-2xl font-black mb-4">
              <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                We utilize institutional-grade encryption for all data residing in the Zane-ai ecosystem. Your projects, communications, and client data are stored with absolute security at the core.
              </p>
            </LegalArticle>

            <LegalArticle title="2. Information Collection" titleClassName="text-2xl font-black mb-4">
              <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                We only collect data necessary for operational synchronization between developers and brokers. We never sell or share institutional data with third-party advertising networks.
              </p>
            </LegalArticle>
          </div>
        </div>
      </Section>
    </main>
  );
}
