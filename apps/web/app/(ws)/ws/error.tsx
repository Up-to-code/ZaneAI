"use client";

import Link from "next/link";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { isRtlLocale } from "@/lib/i18n";
import { ShieldAlert, RotateCcw, Home, Terminal } from "lucide-react";
import { cn } from "@/lib/i18n";

/**
 * WHY:   System failures must be handled with the same precision as the primary UI.
 * WHAT:  Renders a high-fidelity diagnostic screen for workspace errors.
 * HOW:   Uses an architectural grid layout with clear recovery protocols.
 */
export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale, dictionary } = useWebLocale();
  const isRtl = isRtlLocale(locale);

  return (
    <div 
      className="flex min-h-svh flex-col items-center justify-center bg-[var(--zane-ai-background)] p-6 dark:bg-black" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[40px] border border-[var(--zane-ai-line)] bg-white/5 p-8 lg:p-16 dark:border-white/5 dark:bg-black/40">
        
        {/* Background Design Elements */}
        <div className="absolute -right-20 -top-20 opacity-5 dark:opacity-10">
          <ShieldAlert className="h-[400px] w-[400px] rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--zane-ai-line)] bg-white/10 dark:border-white/10 dark:bg-black">
            <ShieldAlert className="h-10 w-10 text-[var(--zane-ai-accent)]" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <div className="h-[1px] w-8 bg-[var(--zane-ai-accent)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-accent)]">Critical Fault Detected</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-6xl">
              {dictionary.errors.workspaceErrorTitle}
            </h1>
            <p className="max-w-xl text-[13px] font-medium leading-relaxed tracking-widest text-[var(--zane-ai-text-muted)] dark:text-white/50">
              {dictionary.errors.workspaceErrorDescription}
            </p>
          </div>

          {error?.message && (
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--zane-ai-line)] bg-white/5 p-6 dark:border-white/5">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--zane-ai-text-muted)] opacity-50">
                <Terminal className="h-3 w-3" />
                Error Stack Output
              </div>
              <code className="text-[11px] font-bold text-[var(--zane-ai-deep)] dark:text-white/80 break-words">
                {error.message}
              </code>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="group flex flex-1 items-center justify-between rounded-2xl bg-[var(--zane-ai-deep)] px-8 py-5 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-black"
            >
              {dictionary.errors.retry}
              <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <Link
              href="/ws"
              className="group flex flex-1 items-center justify-between rounded-2xl border border-[var(--zane-ai-line)] bg-transparent px-8 py-5 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] transition-all hover:bg-[var(--zane-ai-deep)] hover:text-white dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              {dictionary.errors.backToWorkspace}
              <Home className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

      </div>
      
      <div className="mt-12 text-[9px] font-black uppercase tracking-[0.4em] text-[var(--zane-ai-text-muted)] opacity-30">
        Infrastructure Node: Zane-ai / WS-DIAG-00
      </div>
    </div>
  );
}
