import { memo } from "react";
import { motion } from "framer-motion";
import { Building2, BedDouble, Bath, Square, Ruler } from "lucide-react";
import type { UnitType, UnitStatus } from "@/app/(ws)/ws/_lib/entities";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";

export type AgUnitCardProps = {
  id: string;
  label: string;
  unitType: UnitType;
  floor?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  area?: string;
  priceLabel?: string;
  description?: string;
  status: UnitStatus;
  statusLabel?: string;
  typeLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  image?: string;
  fallbackImage?: string;
  location?: string;
};

const STATUS_BADGE: Record<UnitStatus, string> = {
  available: "border-white/20 bg-emerald-500/90 text-white backdrop-blur-md",
  reserved: "border-white/20 bg-amber-500/90 text-white backdrop-blur-md",
  sold: "border-white/20 bg-rose-500/90 text-white backdrop-blur-md",
};

const AgUnitCardBase = function AgUnitCard({
  id,
  label,
  unitType,
  floor,
  bedrooms,
  bathrooms,
  area,
  priceLabel,
  description,
  status,
  statusLabel,
  typeLabel,
  onEdit,
  onDelete,
  isDeleting,
  image,
  fallbackImage,
  location,
}: AgUnitCardProps) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const displayImg = image || fallbackImage;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 40px -10px rgba(0,0,0,0.14)",
        transition: { duration: 0.25 },
      }}
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col overflow-hidden rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] w-full transition-colors hover:border-foreground/20"
    >
      {/* Image Hero */}
      <div className="relative h-48 w-full overflow-hidden bg-muted/20">
        {displayImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayImg} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--workspace-background)]">
            <Building2 className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Status Badge Overlaid */}
        <motion.div
           initial={{ opacity: 0, x: 12 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2, duration: 0.35 }}
           className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} rounded-full border px-4 py-1.5 text-[11px] font-black uppercase tracking-widest shadow-sm ${STATUS_BADGE[status]}`}
        >
          {statusLabel ?? status}
        </motion.div>

        {/* Type Badge Overlaid */}
        <div className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md`}>
          {typeLabel ?? unitType}
        </div>
      </div>

      <div className="flex flex-col p-5 gap-5">
        {/* Title & Location */}
        <div className={`flex flex-col ${isRtl ? "items-start text-right" : "items-end text-left"}`}>
          <div className="w-full flex items-start justify-between gap-3">
            <div className="text-[20px] font-black tracking-tight text-foreground line-clamp-1 flex-1">{label}</div>
            <div className="text-[18px] font-black text-foreground shrink-0">{priceLabel ?? "السعر عند الطلب"}</div>
          </div>
          {location ? (
            <div className="mt-1 text-[13px] font-bold text-[var(--workspace-muted)] truncate w-full">{location}</div>
          ) : null}
        </div>

        {/* Specs Row */}
        <div className={`flex flex-wrap items-center ${isRtl ? "justify-start" : "justify-end"} gap-5 text-[var(--workspace-muted)] pt-1`}>
          {bedrooms ? (
             <div className="flex items-center gap-1.5">
                <span className="text-[16px] font-bold text-foreground">{bedrooms}</span>
                <BedDouble className="h-4 w-4 shrink-0" />
             </div>
          ) : null}
          {bathrooms ? (
             <div className="flex items-center gap-1.5">
                <span className="text-[16px] font-bold text-foreground">{bathrooms}</span>
                <Bath className="h-4 w-4 shrink-0" />
             </div>
          ) : null}
          {area ? (
             <div className="flex items-center gap-1.5">
                <span className="text-[16px] font-bold text-foreground">{area}</span>
                <Ruler className="h-4 w-4 shrink-0" />
             </div>
          ) : null}
        </div>

      {description ? (
        <p className={`mt-4 text-[13px] leading-6 text-[var(--workspace-muted)] line-clamp-2 ${isRtl ? "text-right" : "text-left"}`}>{description}</p>
      ) : null}

      {(onEdit || onDelete) ? (
        <div className={`mt-5 flex items-center ${isRtl ? "justify-end" : "justify-start"} gap-2 border-t border-[color:var(--workspace-border)] pt-4`}>
          {onEdit && (
            <motion.button
              type="button"
              onClick={onEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="rounded-full px-4 py-2 text-[12px] font-black text-[var(--workspace-muted)] transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {dictionary.projects.actionFailed.includes("Failed") ? "Edit" : "تعديل"}
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="rounded-full px-4 py-2 text-[12px] font-black text-rose-500 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
            >
              {isDeleting ? dictionary.projectForm.saving : dictionary.projects.deleteConfirm}
            </motion.button>
          )}
        </div>
      ) : null}
    </div>
  </motion.div>
);
};

export default memo(AgUnitCardBase);
