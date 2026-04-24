import { notFound } from "next/navigation";

/**
 * Offer detail routes still need a dedicated live loader.
 * Until that lands, show an honest unavailable state instead of synthetic data.
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
          Offer detail is not available in this route yet. No synthetic data is being shown.
        </p>
        <p className="text-xs text-muted-foreground/50 font-mono">{offerId}</p>
      </div>
    </div>
  );
}
