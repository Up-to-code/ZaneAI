import { notFound } from "next/navigation";

type WorkspaceCrmClientDetailRouteProps = {
  params: Promise<{ clientId: string }>;
};

/**
 * WHY:   Client detail routes need real data from the CRM backend.
 * WHAT:  Currently shows a placeholder until a real CRM Convex query is built.
 * HOW:   Displays a minimal empty state for the client detail page.
 */
export default async function WorkspaceCrmClientDetailRoute({
  params,
}: WorkspaceCrmClientDetailRouteProps) {
  const { clientId } = await params;

  if (!clientId) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
      <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm space-y-3">
        <div className="text-2xl font-black text-foreground">Client Detail</div>
        <p className="text-sm text-muted-foreground">
          CRM data will load from the backend once the CRM query is implemented.
        </p>
        <p className="text-xs text-muted-foreground/50 font-mono">{clientId}</p>
      </div>
    </div>
  );
}
