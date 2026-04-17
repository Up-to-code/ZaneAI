import { Section, SectionLabel, LegalArticle } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { FileText } from "lucide-react";

export default async function TermsPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="py-24">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
          <SectionLabel icon={FileText} textClassName="text-xs font-black uppercase tracking-widest">
             {dictionary.footer.terms}
          </SectionLabel>
          <h1 className="text-4xl font-black md:text-7xl tracking-tighter">Platform Terms of <span className="text-primary">Service.</span></h1>
          <p className="text-sm font-bold text-muted-foreground">Last updated: April 15, 2026</p>
          
          <div className="space-y-16 pt-12">
            <LegalArticle title="1. Agreement to Terms" titleClassName="text-2xl font-black mb-4">
              <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                By accessing or using the Zane-ai portal and Zane-ai workspace, you agree to be bound by these legal terms. These terms govern your institutional access to our real estate intelligence platform.
              </p>
            </LegalArticle>

            <LegalArticle title="2. Intellectual Property" titleClassName="text-2xl font-black mb-4">
              <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                The "Pure Canvas" design system, brand graphics, and proprietary intelligence models are the exclusive property of Zane-ai Digital Solutions. Unauthorized reproduction is strictly prohibited.
              </p>
            </LegalArticle>

            <LegalArticle title="3. Institutional Usage" titleClassName="text-2xl font-black mb-4">
              <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                Access to the workspace is strictly for certified real estate developers and licensed brokers. Zane-ai reserves the right to revoke access for non-compliance with regional regulatory standards.
              </p>
            </LegalArticle>
          </div>
        </div>
      </Section>
    </main>
  );
}
