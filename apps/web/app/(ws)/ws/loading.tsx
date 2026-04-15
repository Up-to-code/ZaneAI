"use client";

import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { isRtlLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * WHY:   Workspace transitions should feel like the system is preparing its context.
 * WHAT:  Renders a high-fidelity shimmer/pulse loading state at the workspace root.
 * HOW:   Uses an architectural pulse and subtle background shimmer in brand colors.
 */
export default function WorkspaceLoading() {
  const { locale, dictionary } = useWebLocale();
  const isRtl = isRtlLocale(locale);

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-[var(--zane-ai-background)] p-6 dark:bg-black"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative flex flex-col items-center gap-12">
        {/* Architectural Pulse Element */}
        <div className="relative flex h-48 w-48 items-center justify-center lg:h-64 lg:w-64">
          <div className="absolute inset-0 animate-ping rounded-full border border-[var(--zane-ai-accent)]/20 shadow-[0_0_100px_rgba(var(--zane-ai-accent-rgb),0.1)]" />
          <div className="absolute inset-8 animate-pulse rounded-full border border-[var(--zane-ai-accent)]/40 shadow-inner" />
          <div className="h-6 w-6 rounded-full bg-[var(--zane-ai-accent)] shadow-[0_0_30px_var(--zane-ai-accent)]" />
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-2xl font-black uppercase tracking-[0.5em] text-[var(--zane-ai-deep)] dark:text-white lg:text-4xl">
            {(dictionary.nav as any).initializingContext || "Initializing"}
          </div>
          <div className="h-[2px] w-48 overflow-hidden bg-[var(--zane-ai-line)] dark:bg-white/10 lg:w-64">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-[var(--zane-ai-accent)] to-transparent" />
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-50">
            Secure Infrastructure Handshake
          </p>
        </div>
      </div>

      {/* Background Grid Shimmer */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,var(--zane-ai-accent)_0,transparent_70%)] blur-[100px]" />
      </div>
    </div>
  );
}
