import { memo } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { UnitType, UnitStatus } from "@/app/(ws)/ws/_lib/entities";

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
};

const STATUS_BADGE: Record<UnitStatus, string> = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  reserved: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  sold: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300",
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
}: AgUnitCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -4,
        boxShadow: "0 12px 32px -8px rgba(0,0,0,0.12)",
        transition: { duration: 0.2 },
      }}
      className="flex flex-col rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-5 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-right">
          <div className="text-[16px] font-black tracking-tight text-foreground">{label}</div>
          <div className="mt-1 flex items-center gap-2 justify-end text-[12px] font-bold text-[var(--workspace-muted)]">
             {floor ? <span>{floor}</span> : null}
             {floor ? <span>·</span> : null}
             <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{typeLabel ?? unitType}</span>
          </div>
        </div>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-widest ${STATUS_BADGE[status]}`}
        >
          {statusLabel ?? status}
        </motion.span>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {[
          bedrooms ? { label: "غرف", value: bedrooms } : null,
          bathrooms ? { label: "حمامات", value: bathrooms } : null,
        ].filter(Boolean).map((spec, i) => (
          <motion.div
            key={spec!.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center rounded-xl border border-[color:var(--workspace-border)] bg-background/50 px-3 py-2 min-w-[60px]"
          >
            <span className="text-[10px] font-bold text-[var(--workspace-muted)] uppercase tracking-widest">{spec!.label}</span>
            <span className="text-[14px] font-black text-foreground">{spec!.value}</span>
          </motion.div>
        ))}
        {area ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.32, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center rounded-xl border border-[color:var(--workspace-border)] bg-background/50 px-3 py-2"
          >
            <span className="text-[13px] font-black text-foreground">{area}</span>
          </motion.div>
        ) : null}
        {priceLabel ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.38, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center rounded-xl border border-[color:var(--workspace-border)] bg-[color:color-mix(in_srgb,var(--workspace-highlight)_10%,transparent)] px-4 py-2"
          >
            <span className="text-[13px] font-black text-foreground border-b border-[var(--workspace-highlight)] pb-0.5">{priceLabel}</span>
          </motion.div>
        ) : null}
      </div>

      {description ? (
        <p className="mt-4 text-[13px] leading-6 text-[var(--workspace-muted)] line-clamp-2 text-right">{description}</p>
      ) : null}

      {(onEdit || onDelete) ? (
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[color:var(--workspace-border)] pt-4">
          {onEdit && (
            <motion.button
              type="button"
              onClick={onEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="rounded-full px-4 py-2 text-[12px] font-black text-[var(--workspace-muted)] transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              تعديل
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
              {isDeleting ? "جاري الحذف..." : "حذف الوحدة"}
            </motion.button>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default memo(AgUnitCardBase);
