"use client";

import { motion } from "framer-motion";

type AuthPillProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export function AuthPill({ active, onClick, children }: AuthPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-[var(--zane-ai-deep)] dark:hover:text-white ${
        active
          ? "text-[var(--zane-ai-deep)] dark:text-white"
          : "text-[var(--zane-ai-text-muted)] dark:text-white/40"
      }`}
    >
      {active && (
        <motion.div
          layoutId="pill-indicator"
          className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--zane-ai-deep)] dark:bg-white"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {children}
    </button>
  );
}
