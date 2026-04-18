"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { TypewriterText } from "./TypewriterText";

export function AuthBrandHeader() {
  return (
    <div className="flex w-full flex-col items-center justify-center pb-12 lg:w-1/2 lg:pb-0 lg:pr-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--zane-ai-deep)] dark:bg-white">
            <Eye className="h-10 w-10 text-white dark:text-black" />
          </div>
          <h1 className="mb-0 text-5xl font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] dark:text-white lg:text-7xl">
            Zane-ai
          </h1>
        </div>
        <TypewriterText
          phrases={[
            "The first unified real estate agent.",
            "Deep market analysis.",
            "Maximize profit and ROI.",
            "Smartest property insights.",
          ]}
        />
      </motion.div>
    </div>
  );
}
