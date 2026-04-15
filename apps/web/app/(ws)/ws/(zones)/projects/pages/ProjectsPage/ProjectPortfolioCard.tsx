"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { WorkspaceProject } from "../../types/projectTypes";
import type { ProjectAnalyticsEventType } from "@/server/contracts/properties";

type ProjectPortfolioCardProps = {
  project: WorkspaceProject;
  onTrackProjectEvent?: (input: {
    id: string;
    eventType: ProjectAnalyticsEventType;
    source: string;
  }) => Promise<{ ok: true }>;
};

function getProjectTypeLabel(projectType?: string): string {
  switch (projectType) {
    case "villas": return "فلل";
    case "apartments": return "شقق";
    case "land_plots": return "أراضي";
    case "mixed": return "مجمع مختلط";
    case "custom": return "مخصص";
    default: return "مشروع عقاري";
  }
}

export default function ProjectPortfolioCard({
  project,
  onTrackProjectEvent,
}: ProjectPortfolioCardProps) {
  const projectTypeLabel = getProjectTypeLabel(project.projectType);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 40px -10px rgba(0,0,0,0.14)",
        transition: { duration: 0.25 },
      }}
      className="overflow-hidden rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] w-full transition-colors hover:border-foreground/20"
    >
      {/* Image Hero */}
      <div className="relative h-48 overflow-hidden bg-muted/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-md"
        >
          {projectTypeLabel}
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-right">
            <h2 className="truncate text-[17px] font-black tracking-tight leading-tight text-foreground">{project.title}</h2>
            <p className="mt-1.5 text-[13px] font-semibold text-[var(--workspace-muted)]">{project.location}</p>
          </div>
          <div className="shrink-0 text-[14px] font-black text-foreground">{project.priceLabel}</div>
        </div>

        {project.shortDescription || project.summary ? (
          <p className="line-clamp-2 text-[13px] leading-6 text-[var(--workspace-muted)]">
            {project.shortDescription || project.summary}
          </p>
        ) : null}

        {/* Compound-Specific Spec Chips */}
        <div className="flex flex-wrap justify-end gap-2">
          {typeof project.expectedUnits === "number" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="flex flex-col items-center rounded-xl border border-[color:var(--workspace-border)] bg-background/50 px-3 py-2 min-w-[72px]"
            >
              <span className="text-[10px] font-bold text-[var(--workspace-muted)] uppercase tracking-widest">الوحدات</span>
              <span className="text-[15px] font-black text-foreground">{project.expectedUnits}</span>
            </motion.div>
          )}
          {typeof project.installmentYears === "number" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.3 }}
              className="flex flex-col items-center rounded-xl border border-[color:var(--workspace-border)] bg-background/50 px-3 py-2 min-w-[72px]"
            >
              <span className="text-[10px] font-bold text-[var(--workspace-muted)] uppercase tracking-widest">التقسيط</span>
              <span className="text-[15px] font-black text-foreground">{project.installmentYears} سنة</span>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--workspace-border)] pt-4">
          <Link
            href={`/ws/projects/${project.id}/analytics`}
            onClick={() => {
              void onTrackProjectEvent?.({
                id: project.id,
                eventType: "project_analyze_click",
                source: "projects_list_card",
              });
            }}
          >
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-[12px] font-black tracking-tight text-background transition-colors"
            >
              تحليل
            </motion.span>
          </Link>

          <Link href={`/ws/projects/${project.id}`}>
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--workspace-border)] bg-transparent px-5 py-2.5 text-[12px] font-black tracking-tight text-foreground transition-colors hover:bg-foreground/5"
            >
              فتح التفاصيل
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
