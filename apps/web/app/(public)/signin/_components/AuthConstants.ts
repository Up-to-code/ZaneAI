export const AUTH_TEXT_INPUT_CLASS_NAME =
  "w-full border-b border-[var(--zane-ai-line)] bg-transparent px-4 py-5 text-lg tracking-wide text-[var(--zane-ai-deep)] outline-none transition-all placeholder:text-[var(--zane-ai-text-muted)] focus:border-[var(--zane-ai-deep)] dark:border-white/10 dark:text-white dark:focus:border-white focus:bg-slate-50/10 dark:focus:bg-white/5 opacity-80 focus:opacity-100 rounded-t-lg font-medium";

export const AUTH_PRIMARY_BUTTON_CLASS_NAME =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-5 mt-6 text-[13px] tracking-[0.25em] font-bold text-white transition-all hover:scale-[1.01] hover:bg-[color-mix(in_srgb,black,white_10%)] active:scale-95 shadow-xl shadow-black/10 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-white dark:text-black dark:shadow-white/5 dark:hover:bg-zinc-100 uppercase";

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: any = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -4, filter: "blur(2px)", transition: { duration: 0.3 } },
};
