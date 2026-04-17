import { AlertCircle, ArrowLeft, Home, Search } from "lucide-react";
import { cookies } from "next/headers";
import { ButtonLink, Footer, Navbar, Section } from "@/components/ui/portal";
import { getWebDictionary, isRtlLocale, resolveLocale, WEB_LOCALE_COOKIE, cn } from "@anan/ag-ui/anan";

/**
 * WHY:   Missing routes must render with the same premium quality as the core application.
 * WHAT:  Renders an architectural 404 page for missing endpoints.
 * HOW:   Uses bold typography, airy spacing, and recovery CTAs.
 */
export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);
  const isRtl = isRtlLocale(locale);

  return (
    <main 
      className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--zane-ai-background)] font-sans text-[var(--zane-ai-deep)] selection:bg-[var(--zane-ai-accent)] selection:text-white dark:bg-black dark:text-white" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background Architectural Text */}
      <div className="pointer-events-none absolute -left-20 -top-20 select-none opacity-[0.03] dark:opacity-[0.05]">
        <h1 className="text-[500px] font-black leading-none tracking-tighter">404</h1>
      </div>

      <Navbar />

      <Section className="relative z-10 flex flex-1 items-center justify-center py-20 lg:py-32">
        <div className="flex w-full max-w-4xl flex-col items-center gap-12 text-center lg:gap-16">
          
          <div className="flex h-24 w-24 items-center justify-center rounded-[32px] border border-[var(--zane-ai-line)] bg-white/5 dark:border-white/10 dark:bg-black sm:h-32 sm:w-32">
            <Search className="h-10 w-10 text-[var(--zane-ai-accent)] sm:h-12 sm:w-12" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl">
              {dictionary.errors.notFoundTitle}
            </h2>
            <p className="mx-auto max-w-xl text-[13px] font-medium leading-relaxed tracking-[0.2em] text-[var(--zane-ai-text-muted)] dark:text-white/40 sm:text-base">
              {dictionary.errors.notFoundDescription}
            </p>
          </div>

          <div className="flex w-full flex-col justify-center gap-6 pt-8 sm:flex-row lg:gap-8">
            <ButtonLink 
              href="/" 
              variant="primary"
              locale={locale}
              className="group flex items-center justify-center gap-4 rounded-2xl bg-[var(--zane-ai-deep)] px-10 py-5 text-[11px] font-black uppercase tracking-[0.24em] text-white dark:bg-white dark:text-black"
            >
              <Home className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
              {dictionary.errors.backHome}
            </ButtonLink>
            <ButtonLink 
              href="/ws" 
              variant="outline"
              locale={locale}
              className="group flex items-center justify-center gap-4 rounded-2xl border border-[var(--zane-ai-line)] px-10 py-5 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] dark:border-white/20 dark:text-white"
            >
              <ArrowLeft className={cn("h-4 w-4 transition-transform", isRtl ? "group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
              {dictionary.errors.backToWorkspace || "Workspace Hub"}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Footer locale={locale} />
    </main>
  );
}
