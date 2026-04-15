"use client";

import { motion } from "framer-motion";
import { Hammer, ArrowLeft, LayoutGrid, Rocket } from "lucide-react";
import Link from "next/link";

interface AgComingSoonProps {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: React.ElementType;
}

export default function AgComingSoon({
  title,
  description,
  eyebrow = "تحديث قادم",
  icon: Icon = Hammer
}: AgComingSoonProps) {
  return (
    <div className="relative flex min-h-[60vh] w-full flex-col items-center justify-center px-6 text-center">
      {/* Background visual flair */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none opacity-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[var(--workspace-highlight)] to-transparent blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-w-2xl flex-col items-center"
      >
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-highlight)] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
          <Icon size={44} strokeWidth={1.5} />
        </div>

        <div className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-[var(--workspace-highlight)]">
          {eyebrow}
        </div>
        
        <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground lg:text-5xl">
          {title}
        </h1>
        
        <p className="mb-12 text-lg leading-relaxed text-[var(--workspace-muted)]">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4" dir="rtl">
          <Link 
            href="/ws"
            className="flex h-14 items-center gap-3 rounded-full bg-foreground px-8 text-[15px] font-black tracking-tight text-background shadow-xl shadow-foreground/10 transition-transform active:scale-95"
          >
            <LayoutGrid size={18} />
            العودة للوحة القيادة
          </Link>
          
          <button 
            type="button" 
            className="flex h-14 items-center gap-3 rounded-full border-2 border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-8 text-[15px] font-black tracking-tight text-foreground transition-all hover:border-foreground/20 active:scale-95"
          >
            <Rocket size={18} />
            أعلمني عند الإطلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
}
