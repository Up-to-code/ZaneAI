"use client";

import { motion } from "framer-motion";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { isRtlLocale } from "@/lib/i18n";

/**
 * WHY:   Workspace transitions should feel like the system is preparing its context.
 * WHAT:  Renders a high-fidelity shimmer/pulse loading state at the workspace root.
 * HOW:   Uses an architectural pulse and subtle background shimmer in brand colors.
 */
export default function WorkspaceLoading() {
  const { locale, dictionary } = useWebLocale();
  const isRtl = isRtlLocale(locale);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--zane-ai-background)] dark:bg-black">
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute h-12 w-12 rounded-full bg-primary/20 blur-xl" />
        
        {/* Spinning Brand Icon */}
        <motion.img 
          src="/brand-logo.svg" 
          alt="Loading..." 
          className="relative h-8 w-8 object-contain"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
