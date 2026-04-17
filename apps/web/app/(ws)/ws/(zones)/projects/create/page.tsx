"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const } },
  tap: { scale: 0.97 },
};

export default function CreateSelectionPage() {
  const { dictionary } = useWebLocale();
  const router = useRouter();
  const [selected, setSelected] = useState<"project" | "unit" | null>(null);

  const handleContinue = () => {
    if (selected === "project") {
      router.push("/ws/projects/create/project");
    } else if (selected === "unit") {
      router.push("/ws/projects/create/unit");
    }
  };

  return (
    <div className="min-h-full bg-background/60 flex flex-col items-center justify-center p-6 pb-20">
      <motion.div
        className="w-full max-w-6xl mb-8 flex items-center justify-start"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link 
          href="/ws/projects" 
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--workspace-muted)] transition hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {dictionary.projects.eyebrow}
        </Link>
      </motion.div>

      <div className="w-full max-w-4xl text-right">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl font-black tracking-tight text-foreground lg:text-4xl">{dictionary.projects.createSelectionTitle}</h1>
          <p className="mt-4 text-[15px] font-semibold leading-relaxed text-[var(--workspace-muted)]">{dictionary.projects.createSelectionSubtitle}</p>
        </motion.div>
        
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Unit Card */}
          <motion.button
            onClick={() => setSelected("unit")}
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            animate={selected === "unit" ? { scale: 1, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`group relative overflow-hidden rounded-[32px] border p-8 text-right transition-colors duration-300 ${
              selected === "unit" 
                ? "border-foreground bg-foreground shadow-xl ring-4 ring-foreground/10" 
                : "border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] hover:border-foreground/30"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 ${
                selected === "unit" ? "bg-background text-foreground" : "bg-foreground/5 text-foreground"
              }`}>
                <Home className="h-8 w-8" />
              </div>
              <h2 className={`text-2xl font-black transition-colors duration-300 ${selected === "unit" ? "text-background" : "text-foreground"}`}>
                {dictionary.projects.createUnitType}
              </h2>
              <p className={`mt-3 text-[14px] leading-relaxed transition-colors duration-300 ${selected === "unit" ? "text-background/80" : "text-[var(--workspace-muted)]"}`}>
                {dictionary.projects.createUnitDesc}
              </p>
            </motion.div>
          </motion.button>

          {/* Project Card */}
          <motion.button
            onClick={() => setSelected("project")}
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            animate={selected === "project" ? { scale: 1, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`group relative overflow-hidden rounded-[32px] border p-8 text-right transition-colors duration-300 ${
              selected === "project" 
                ? "border-foreground bg-foreground shadow-xl ring-4 ring-foreground/10" 
                : "border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] hover:border-foreground/30"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 ${
                selected === "project" ? "bg-background text-foreground" : "bg-foreground/5 text-foreground"
              }`}>
                <Building2 className="h-8 w-8" />
              </div>
              <h2 className={`text-2xl font-black transition-colors duration-300 ${selected === "project" ? "text-background" : "text-foreground"}`}>
                {dictionary.projects.createProjectType}
              </h2>
              <p className={`mt-3 text-[14px] leading-relaxed transition-colors duration-300 ${selected === "project" ? "text-background/80" : "text-[var(--workspace-muted)]"}`}>
                {dictionary.projects.createProjectDesc}
              </p>
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              className="mt-12 flex justify-end"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-[13px] font-black uppercase tracking-[0.15em] text-background transition-colors"
              >
                {dictionary.projects.continueFlow}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
