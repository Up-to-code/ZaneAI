import { LegalArticle, Section } from "@/components/ui/portal";

const updatedAt = "April 21, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-foreground transition-all dark:bg-black">
      <Section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Privacy Policy</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tighter md:text-6xl">Egypt Buyer Data Protection</h1>
          <p className="mt-6 text-sm font-medium text-muted-foreground">Last updated: {updatedAt}</p>
        </div>
      </Section>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-12 px-6 text-base font-medium leading-8 text-muted-foreground lg:px-10">
          <p>
            This policy explains how Zayon handles buyer, broker, developer, property, workspace, and assistant data for
            the Egypt MVP. It is product compliance guidance and must be reviewed by Egypt-qualified counsel before
            public launch.
          </p>

          <LegalArticle title="1. Data We Process" titleClassName="text-2xl font-bold text-foreground">
            <p>
              We process account details, authentication identifiers, buyer preferences, saved listings, contact and
              visit requests, assistant prompts, assistant responses, property interactions, device/session analytics,
              and workspace inventory records. We do not intentionally collect national ID numbers, bank account data,
              children&apos;s data, or sensitive personal data in the MVP.
            </p>
          </LegalArticle>

          <LegalArticle title="2. Why We Process Data" titleClassName="text-2xl font-bold text-foreground">
            <p>
              We use data to authenticate users, personalize real estate recommendations, save buyer decisions, route
              contact or visit requests, prevent duplicate and misleading listings, operate AI matching, secure the
              platform, and measure decision-funnel performance without raw PII in analytics payloads.
            </p>
          </LegalArticle>

          <LegalArticle title="3. Egypt PDPL Readiness" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Egypt&apos;s Personal Data Protection Law No. 151 of 2020 governs electronic personal data processing.
              2025 executive regulations brought the regime into operational focus, with enforcement preparation
              expected through 2026. Zayon&apos;s MVP should maintain a processing inventory, lawful-basis mapping, user
              rights workflow, breach response process, processor contracts, and cross-border transfer review.
            </p>
          </LegalArticle>

          <LegalArticle title="4. AI and Real Estate Decisions" titleClassName="text-2xl font-bold text-foreground">
            <p>
              AI outputs are recommendation support, not legal, financial, valuation, mortgage, or investment advice.
              Users should verify price, availability, licensing, ownership, payment plans, and project documents with
              the broker, developer, official registry, or a qualified advisor before making a transaction decision.
            </p>
          </LegalArticle>

          <LegalArticle title="5. Sharing and Retention" titleClassName="text-2xl font-bold text-foreground">
            <p>
              We share buyer intent only with the relevant listing organization or authorized platform operators.
              Assistant events, analytics, and audit logs are retained only as long as needed for product operation,
              dispute handling, security, compliance, and model-quality review. Users may request access, correction,
              or deletion through the contact channel published on Zayon.
            </p>
          </LegalArticle>

          <LegalArticle title="6. Reference Sources" titleClassName="text-2xl font-bold text-foreground">
            <p>
              This policy was prepared against public guidance from the Library of Congress summary of Egypt Law No.
              151/2020, Baker McKenzie&apos;s January 2026 PDPL executive-regulation update, and Kennedys&apos; March 2026
              enforcement-readiness note.
            </p>
          </LegalArticle>
        </div>
      </Section>
    </main>
  );
}
