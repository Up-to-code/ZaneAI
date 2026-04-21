import { notFound } from "next/navigation";

/**
 * WHY:   Offer detail routes need real data from the backend.
 * WHAT:  Currently shows a placeholder until a real offers query is built.
 * HOW:   Displays a "coming soon" state for offer details.
 */
export default async function WorkspaceOfferDetailRoute({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  if (!offerId) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
      <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm space-y-3">
        <div className="text-2xl font-black text-foreground">Offer Detail</div>
        <p className="text-sm text-muted-foreground">
          Offer data will load from your workspace backend. No mock data is being displayed.
        </p>
        <p className="text-xs text-muted-foreground/50 font-mono">{offerId}</p>
      </div>
    </div>
  );
}
