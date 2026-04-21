import { LegalArticle, Section } from "@/components/ui/portal";

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-foreground transition-all dark:bg-black">
      <Section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Compliance</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tighter md:text-6xl">Trust and Listing Controls</h1>
          <p className="mt-6 text-sm font-medium text-muted-foreground">Last updated: April 21, 2026</p>
        </div>
      </Section>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-12 px-6 text-base font-medium leading-8 text-muted-foreground lg:px-10">
          <LegalArticle title="1. Listing Verification" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Published listings must carry a workspace owner, project or unit source record, compliance review status,
              license or registration metadata where available, and an audit trail. Zayon should block publication when
              required compliance fields are missing.
            </p>
          </LegalArticle>

          <LegalArticle title="2. Fraud and Duplicate Controls" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Egypt&apos;s official real estate platform direction emphasizes verified records, unique property identity,
              document review, and QR-based public verification. Zayon&apos;s MVP should preserve fields for ad license
              numbers, registration status, official references, and future QR/MLS identifiers.
            </p>
          </LegalArticle>

          <LegalArticle title="3. AI Guardrails" titleClassName="text-2xl font-bold text-foreground">
            <p>
              AI must ground property recommendations in published listings, avoid inventing inventory, avoid internal
              agent names in user-facing copy, and present financial or legal content as general guidance only.
            </p>
          </LegalArticle>

          <LegalArticle title="4. Operational Review" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Before public launch, Zayon should complete counsel review, PDPL readiness review, security testing,
              publish-flow audit, takedown workflow, data-retention schedule, and incident-response tabletop testing.
            </p>
          </LegalArticle>
        </div>
      </Section>
    </main>
  );
}
