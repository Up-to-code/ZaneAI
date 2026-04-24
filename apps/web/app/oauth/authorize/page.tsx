import Link from "next/link";

type AuthorizePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OAuthAuthorizePage({ searchParams }: AuthorizePageProps) {
  const params = await searchParams;
  const clientId = Array.isArray(params.client_id) ? params.client_id[0] : params.client_id;
  const state = Array.isArray(params.state) ? params.state[0] : params.state;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-3xl items-center px-6 py-20">
      <section className="w-full rounded-[32px] border border-border/60 bg-card p-8 text-right shadow-sm">
        <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
          OAuth Preview
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground">صفحة معاينة لتفويض OAuth</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          مسار OAuth التفاعلي غير مفعّل حالياً في واجهة الويب. نحافظ على هذه الصفحة كمرجع انتقال مؤقت حتى تبقى الروابط القديمة واضحة.
        </p>
        <dl className="mt-8 grid gap-3 rounded-[24px] border border-border/60 bg-muted/10 p-5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="font-bold text-muted-foreground">Client ID</dt>
            <dd className="font-mono text-foreground">{clientId ?? "missing-client-id"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-bold text-muted-foreground">State</dt>
            <dd className="font-mono text-foreground">{state ?? "missing-state"}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <Link
            href="/signin"
            className="inline-flex items-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
          >
            العودة إلى تسجيل الدخول
          </Link>
          <Link
            href="/ws"
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:bg-foreground/90"
          >
            فتح مساحة العمل
          </Link>
        </div>
      </section>
    </main>
  );
}
