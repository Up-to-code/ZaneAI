import { memo } from "react";
import { motion } from "framer-motion";
import { Building2, BedDouble, Bath, Square, Ruler, MapPin, ChevronLeft, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/i18n";
import type { UnitType, UnitStatus } from "@/app/(ws)/ws/_lib/entities";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  variant?: "horizontal" | "vertical";
  projectId?: string;
};

const STATUS_BADGE: Record<UnitStatus, string> = {
  available: "bg-background/60 backdrop-blur-xl text-foreground border border-foreground/10 shadow-sm font-bold",
  reserved: "bg-amber-500/90 backdrop-blur-xl text-white font-bold border border-amber-400/20",
  sold: "bg-rose-500/90 backdrop-blur-xl text-white font-bold border border-rose-400/20",
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
  variant = "vertical",
  projectId,
}: AgUnitCardProps) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const displayImg = image || fallbackImage;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "group flex overflow-hidden rounded-[24px] border border-border bg-gradient-to-br from-foreground/[0.01] to-transparent w-full transition-all hover:border-foreground/30 shadow-sm",
        variant === "vertical" ? "flex-col" : "flex-row items-stretch min-h-[160px]"
      )}
    >
      {/* 📸 Image Section */}
      <Link 
        href={projectId ? `/ws/projects/${projectId}/units/${id}` : "#"}
        className={cn(
          "relative overflow-hidden bg-muted/10 shrink-0",
          variant === "vertical" ? "h-[260px] w-full" : "w-[180px] md:w-[220px] lg:w-[260px] h-full"
        )}
      >
        {displayImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayImg} alt={label} className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--workspace-panel)]">
            <Building2 className="h-10 w-10 text-muted-foreground/10" />
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className={cn(
          "absolute top-5 flex items-center gap-2 px-5 w-full",
          isRtl ? "flex-row-reverse text-right" : "flex-row text-left"
        )}>
          <span className={cn(
            "rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest leading-none",
            STATUS_BADGE[status]
          )}>
            {statusLabel ?? (status === "available" ? (isRtl ? "للبيع" : "FOR SALE") : status)}
          </span>
          <span className="rounded-full bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white leading-none">
            {typeLabel ?? (isRtl ? "جديد" : "NEW")}
          </span>
        </div>

        {/* Carousel Dots Placeholder */}
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-1.5">
           <div className="h-1.5 w-1.5 rounded-full bg-white shadow-xl" />
           <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
           <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
        </div>
      </Link>

      {/* 📄 Content Section */}
      <div className={cn(
        "flex flex-1 flex-col p-7 gap-7",
        variant === "vertical" ? "justify-between" : "justify-center"
      )}>
        <div className="flex flex-col gap-6">
          {/* Header: Title & Price Side-by-Side */}
          <div className="flex items-start justify-between gap-4">
             <div className="flex flex-col gap-2">
                <h3 className="text-[24px] font-black tracking-tighter text-foreground leading-tight line-clamp-1 uppercase leading-none">{label}</h3>
                {location && (
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                     <MapPin className="h-3 w-3" />
                     <span className="truncate uppercase tracking-[0.2em]">{location}</span>
                  </div>
                )}
             </div>
             
             <div className="flex items-center gap-3">
               <div className="text-[20px] font-black text-foreground tabular-nums tracking-tighter whitespace-nowrap">
                  {priceLabel ?? (isRtl ? "طلب سعر" : "REQUEST")}
               </div>

               {(onEdit || onDelete) && (
                 <DropdownMenu>
                   <DropdownMenuTrigger
                     render={(
                       <button className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/[0.08] transition hover:bg-foreground/[0.04] active:scale-95">
                         <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                       </button>
                     )}
                   />
                   <DropdownMenuContent align={isRtl ? "start" : "end"} className="min-w-[180px] p-2 rounded-2xl border border-border bg-popover shadow-2xl animate-in fade-in zoom-in-95">
                     {onEdit && (
                       <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-foreground/[0.03] transition-colors cursor-pointer">
                         <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                         <span>{isRtl ? "تعديل الوحدة" : "EDIT ASSET"}</span>
                       </DropdownMenuItem>
                     )}
                     <DropdownMenuSeparator className="my-1 bg-foreground/[0.05]" />
                     {onDelete && (
                       <DropdownMenuItem 
                        onClick={onDelete} 
                        disabled={isDeleting}
                        variant="destructive"
                        className="flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                       >
                         <Trash2 className="h-3.5 w-3.5" />
                         <span>{isRtl ? "حذف الوحدة" : "DELETE ASSET"}</span>
                       </DropdownMenuItem>
                     )}
                   </DropdownMenuContent>
                 </DropdownMenu>
               )}
             </div>
          </div>

          {description && (
            <p className="text-[14px] font-medium leading-relaxed text-muted-foreground/40 line-clamp-2 min-h-[42px]">
              {description}
            </p>
          )}

          <div className="h-px bg-foreground/[0.05]" />

          {/* 💎 Commercial Specs Row - Luxury Institutional Tone */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               <BedDouble className="h-4 w-4 text-slate-400 opacity-60" />
               <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.25em]">{bedrooms || 0} Bed</span>
            </div>
            <div className="flex items-center gap-2">
               <Bath className="h-4 w-4 text-slate-400 opacity-60" />
               <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.25em]">{bathrooms || 0} Bath</span>
            </div>
            <div className="flex items-center gap-2">
               <Ruler className="h-4 w-4 text-slate-400 opacity-60" />
               <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.25em]">{area || 0} m²</span>
            </div>
          </div>
        </div>

        {/* 🚀 Actions Area - Institutional Premium CTA */}
        <div className="flex flex-col">
           {variant === "vertical" && (
             <button className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4.5 text-[11px] font-black uppercase tracking-[0.3em] text-background shadow-md shadow-foreground/5 transition-all hover:bg-foreground/90 hover:shadow-lg hover:shadow-foreground/10 active:scale-[0.98]">
                <span>{isRtl ? "استفسار عن الوحدة" : "ENQUIRE NOW"}</span>
                <ChevronLeft className={cn("h-4 w-4", isRtl ? "" : "rotate-180")} />
             </button>
           )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(AgUnitCardBase);
