import { LegalArticle, Section } from "@/components/ui/portal";

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-foreground transition-all dark:bg-black">
      <Section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Cookie Policy</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tighter md:text-6xl">Cookies and Local Storage</h1>
          <p className="mt-6 text-sm font-medium text-muted-foreground">Last updated: April 21, 2026</p>
        </div>
      </Section>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-12 px-6 text-base font-medium leading-8 text-muted-foreground lg:px-10">
          <LegalArticle title="1. Essential Storage" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Zayon uses essential cookies and local storage for authentication, session continuity, locale, theme,
              workspace routing, and security controls. These are required for the product to work.
            </p>
          </LegalArticle>

          <LegalArticle title="2. Analytics" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Analytics should measure product decisions such as screen views, assistant prompts, impressions, saves,
              compares, contact requests, and visit requests. Analytics payloads must not include raw phone numbers,
              national IDs, full message transcripts, or unnecessary personal data.
            </p>
          </LegalArticle>

          <LegalArticle title="3. Choices" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Browser settings may block non-essential cookies. Blocking essential storage can prevent login, workspace
              access, saved preferences, or assistant continuity from working correctly.
            </p>
          </LegalArticle>
        </div>
      </Section>
    </main>
  );
}
