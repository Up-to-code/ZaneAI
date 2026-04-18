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
        <div className="flex flex-col items-center gap-10">
          <div className="relative flex items-center justify-center">
            {/* Logo Glow Backdrop */}
            <div className="absolute h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            
            <img 
              src="/brand-logo.svg" 
              alt="Zane AI Logo" 
              className="relative h-24 w-auto object-contain transition-transform duration-700 hover:scale-110" 
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="mb-0 text-5xl font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] dark:text-white lg:text-7xl">
              Zane-ai
            </h1>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
