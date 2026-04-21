import { LegalArticle, Section } from "@/components/ui/portal";

const updatedAt = "April 21, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-foreground transition-all dark:bg-black">
      <Section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Terms of Service</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tighter md:text-6xl">Zayon Egypt MVP Terms</h1>
          <p className="mt-6 text-sm font-medium text-muted-foreground">Last updated: {updatedAt}</p>
        </div>
      </Section>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-12 px-6 text-base font-medium leading-8 text-muted-foreground lg:px-10">
          <LegalArticle title="1. Platform Role" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Zayon is a real estate discovery, matching, and workflow platform. It is not a broker of record, developer,
              law firm, bank, valuation office, escrow service, or government registry. Listings are supplied by
              workspace organizations and must be verified before a buyer relies on them.
            </p>
          </LegalArticle>

          <LegalArticle title="2. Buyer Responsibilities" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Buyers are responsible for checking project status, ad license details, ownership documents, payment
              terms, fees, delivery dates, availability, and official records before reservation, payment, or contract
              signature. AI match scores and summaries are decision aids only.
            </p>
          </LegalArticle>

          <LegalArticle title="3. Partner Responsibilities" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Developers, brokers, and workspace users must submit accurate inventory, pricing, media, license numbers,
              compliance documents, and availability. They may not publish misleading, duplicate, unavailable,
              unlicensed, or unverifiable listings.
            </p>
          </LegalArticle>

          <LegalArticle title="4. AI Use" titleClassName="text-2xl font-bold text-foreground">
            <p>
              AI may search, summarize, rank, compare, and suggest next steps. AI does not approve listings, guarantee
              investment returns, create binding offers, schedule confirmed visits, or contact third parties without a
              user action and an authorized workflow.
            </p>
          </LegalArticle>

          <LegalArticle title="5. Account and Security" titleClassName="text-2xl font-bold text-foreground">
            <p>
              Users must keep account credentials secure and may not attempt to bypass role permissions, scrape private
              workspace data, reverse engineer platform services, submit malicious files, or use Zayon to distribute
              unlawful or deceptive advertising.
            </p>
          </LegalArticle>

          <LegalArticle title="6. Launch Notice" titleClassName="text-2xl font-bold text-foreground">
            <p>
              These MVP terms are a working product baseline. Final public terms, limitation of liability,
              dispute-resolution language, consumer notices, and jurisdiction clauses require counsel review before
              production launch.
            </p>
          </LegalArticle>
        </div>
      </Section>
    </main>
  );
}
