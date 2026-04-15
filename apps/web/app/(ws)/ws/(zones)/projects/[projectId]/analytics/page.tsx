import { notFound } from "next/navigation";
import Link from "next/link";
import { BarChart3, Eye, MessageSquareMore, TrendingUp } from "lucide-react";
import { getDemoProject } from "../../../../_lib/demoData";

/**
 * WHY:   Project analytics routes should still demonstrate the intended information architecture in static mode.
 * WHAT:  Renders a lightweight analytics showcase for a demo project.
 * HOW:   Uses fixed KPI cards and narrative notes instead of querying live analytics services.
 */
export default async function WorkspaceProjectAnalyticsRoute({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getDemoProject(projectId);
  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
      <section className="rounded-[28px] border border-border/60 bg-card p-6 text-right shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Analytics Demo</div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">{project.title}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              هذه الصفحة توضح كيف ستظهر مؤشرات الأداء الرئيسية بعد فصل نسخة الويب عن مصادر البيانات المباشرة.
            </p>
          </div>
          <Link
            href={`/ws/projects/${projectId}`}
            className="inline-flex items-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
          >
            العودة إلى المشروع
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Views", value: "12.4k", icon: Eye },
          { label: "Qualified leads", value: "84", icon: TrendingUp },
          { label: "Offer conversations", value: "19", icon: MessageSquareMore },
        ].map((item) => (
          <div key={item.label} className="rounded-[24px] border border-border/60 bg-card p-5 text-right shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
            </div>
            <div className="mt-5 text-3xl font-black text-foreground">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-border/60 bg-card p-6 text-right shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          Demo narrative
        </div>
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          يحتفظ هذا العرض ببنية صفحة التحليلات، لكنه يستبدل جلب الأحداث والقراءات المباشرة بقيم ثابتة. الهدف هو إبقاء المسار، التسلسل البصري، والعرض التنفيذي واضحين دون أي اعتماد على خدمات خلفية.
        </p>
      </section>
    </div>
  );
}
