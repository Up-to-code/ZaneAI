import { notFound } from "next/navigation";

/**
 * WHY:   Partner directory routes should display real organization profiles from the backend.
 * WHAT:  Currently shows a placeholder until a real organization profile query is built.
 * HOW:   Displays a minimal empty state for the directory profile page.
 */
export default async function OrganizationProfilePageRoute({
  params,
}: {
  params: Promise<{ type: "broker" | "developer"; slug: string }>;
}) {
  const { type, slug } = await params;

  if (!slug) notFound();

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-12">
      <div className="rounded-[32px] border border-border/60 bg-card p-8 text-center shadow-sm space-y-3">
        <div className="text-2xl font-black text-foreground capitalize">{type} Profile</div>
        <p className="text-sm text-muted-foreground">
          Organization profile is not available in this route yet. No synthetic data is being shown.
        </p>
        <p className="text-xs text-muted-foreground/50 font-mono">{slug}</p>
      </div>
    </div>
  );
}
