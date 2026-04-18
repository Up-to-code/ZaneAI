"use client";

import { motion } from "framer-motion";

type AuthStatusViewProps = {
  isRedirecting: boolean;
};

export function AuthStatusView({ isRedirecting }: AuthStatusViewProps) {
  const statusLabel = isRedirecting ? "Redirecting to workspace…" : "Verifying session…";

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--zane-ai-background)] px-6 py-12 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-10"
      >
        {/* Pulsing brand wordmark */}
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-3xl font-black uppercase tracking-[0.28em] text-[var(--zane-ai-deep)] dark:text-white select-none"
        >
          Zane-ai
        </motion.span>

        {/* Shimmer bar */}
        <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[var(--zane-ai-deep)] dark:bg-white"
            animate={{ x: ["-100%", "288px"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Status label */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--zane-ai-text-muted)] dark:text-white/40"
        >
          {statusLabel}
        </motion.p>
      </motion.div>
    </main>
  );
}
