"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { WorkspaceProject } from "../../types/projectTypes";
import type { ProjectAnalyticsEventType } from "@/server/contracts/properties";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import type { WebDictionary } from "@/lib/i18n";

type ProjectPortfolioCardProps = {
  project: WorkspaceProject;
  onTrackProjectEvent?: (input: {
    id: string;
    eventType: ProjectAnalyticsEventType;
    source: string;
  }) => Promise<{ ok: true }>;
};

function getProjectTypeLabel(projectType: string | undefined, dictionary: WebDictionary): string {
  switch (projectType) {
    case "villas": return dictionary.projects.types.villas;
    case "apartments": return dictionary.projects.types.apartments;
    case "land_plots": return dictionary.projects.types.land_plots;
    case "mixed": return dictionary.projects.types.mixed;
    case "custom": return dictionary.projects.types.custom;
    default: return dictionary.projects.types.fallback;
  }
}

export default function ProjectPortfolioCard({
  project,
  onTrackProjectEvent,
}: ProjectPortfolioCardProps) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const projectTypeLabel = getProjectTypeLabel(project.projectType, dictionary);
  
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
      dir={isRtl ? "rtl" : "ltr"}
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
          <div className={`min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
            <h2 className="truncate text-[18px] font-black tracking-tight leading-tight text-foreground">{project.title}</h2>
            <p className="mt-1.5 text-[13px] font-semibold text-[var(--workspace-muted)]">{project.location}</p>
          </div>
          <div className={`flex flex-col ${isRtl ? "items-end" : "items-start"}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--workspace-muted)]">{dictionary.projects.averagePrice}</span>
            <div className="text-[17px] font-black text-foreground">{project.priceLabel}</div>
          </div>
        </div>

        {project.shortDescription || project.summary ? (
          <p className={`line-clamp-2 text-[13px] leading-6 text-[var(--workspace-muted)] ${isRtl ? "text-right" : "text-left"}`}>
            {project.shortDescription || project.summary}
          </p>
        ) : null}

        {/* Compound-Specific Spec Chips */}
        <div className={`flex flex-wrap ${isRtl ? "justify-end" : "justify-start"} gap-2`}>
          {typeof project.expectedUnits === "number" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="flex flex-col items-center rounded-xl border border-[color:var(--workspace-border)] bg-background/50 px-3 py-2 min-w-[72px]"
            >
              <span className="text-[10px] font-bold text-[var(--workspace-muted)] uppercase tracking-widest">{dictionary.projects.totalUnits}</span>
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
              <span className="text-[10px] font-bold text-[var(--workspace-muted)] uppercase tracking-widest">{dictionary.projects.installments}</span>
              <span className="text-[15px] font-black text-foreground">{dictionary.projects.years.replace("{count}", String(project.installmentYears))}</span>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className={`flex items-center ${isRtl ? "flex-row-reverse" : "flex-row"} justify-between gap-3 border-t border-[color:var(--workspace-border)] pt-4`}>
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
              {dictionary.projects.analyze}
            </motion.span>
          </Link>

          <Link href={`/ws/projects/${project.id}`}>
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--workspace-border)] bg-transparent px-5 py-2.5 text-[12px] font-black tracking-tight text-foreground transition-colors hover:bg-foreground/5"
            >
              {dictionary.projects.openDetails}
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
