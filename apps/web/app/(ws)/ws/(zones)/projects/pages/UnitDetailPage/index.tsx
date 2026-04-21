"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import type { Id } from "@convex/dataModel";
import { 
  ChevronLeft, 
  MapPin, 
  Building2, 
  BedDouble, 
  Bath, 
  Ruler, 
  Calendar, 
  ShieldCheck, 
  CreditCard,
  Layers,
  MoreHorizontal,
  Pencil,
  Trash2,
  Compass,
  Sofa,
  Coins,
  History,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/i18n";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * WHY:   Individal units are complex assets that require a dedicated detail surface.
 * WHAT:  High-precision Unit Detail Page following the Luxury Institutional aesthetic.
 * HOW:   Structured hierarchy: Cinematic Hero -> Asset Scorecard -> Technical Grid -> Description.
 */
export default function UnitDetailPage({
  projectId,
  unitId,
}: {
  projectId: string;
  unitId: string;
}) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  
  const isValidUnitId = unitId && !unitId.startsWith("unit-");
  const isValidProjectId = projectId && !projectId.startsWith("property-");

  const unit = useQuery(
    api.workspaceUnits.getUnit, 
    isValidUnitId ? { unitId: unitId as Id<"units"> } : "skip"
  );
  
  const project = useQuery(
    api.partnerProperties.getWorkspaceProperty, 
    isValidProjectId ? { propertyId: projectId as Id<"projects"> } : "skip"
  );

  if (unit === undefined || project === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-foreground" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            {isRtl ? "جاري تحميل بيانات الوحدة..." : "LOADING ASSET DATA..."}
          </span>
        </div>
      </div>
    );
  }

  if (unit === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 text-center">
           <Building2 className="h-16 w-16 text-muted-foreground/20" />
           <h2 className="text-2xl font-black tracking-tighter">{isRtl ? "الوحدة غير موجودة" : "UNIT NOT FOUND"}</h2>
           <Link href={`/ws/projects/${projectId}`} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition hover:text-foreground">
             {dictionary.projects.backToProject}
           </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-10 lg:px-12 lg:py-16">
        
        {/* ── Institutional Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Link
              href={`/ws/projects/${projectId}`}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 transition hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>{isRtl ? "العودة للمشروع" : "BACK TO PROJECT"}</span>
            </Link>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground/60">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-widest">{unit.unitType}</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1] uppercase">{unit.label}</h1>
               <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground/40 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span className="uppercase tracking-[0.2em]">{unit.location}</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.3em] text-background shadow-lg shadow-foreground/5 transition hover:scale-[1.02] active:scale-95">
                <span>{isRtl ? "بدء استفسار" : "START ENQUIRY"}</span>
             </button>

             <DropdownMenu>
               <DropdownMenuTrigger
                 render={(
                   <button className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/[0.08] transition hover:bg-foreground/[0.04] active:scale-95">
                     <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                   </button>
                 )}
               />
               <DropdownMenuContent align={isRtl ? "start" : "end"} className="min-w-[200px] p-2 rounded-2xl border border-border bg-popover shadow-2xl animate-in fade-in zoom-in-95">
                 <DropdownMenuItem className="flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-foreground/[0.03] transition-colors cursor-pointer">
                   <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                   <span>{isRtl ? "تعديل الوحدة" : "EDIT ASSET"}</span>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator className="my-1 bg-foreground/[0.05]" />
                 <DropdownMenuItem 
                  className="flex items-center gap-2.5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                 >
                   <Trash2 className="h-3.5 w-3.5" />
                   <span>{isRtl ? "حذف الوحدة" : "DELETE ASSET"}</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>

        {/* ── Cinematic Hero ── */}
        <div className="relative h-[480px] w-full overflow-hidden rounded-[32px] border border-border group bg-muted/10">
          {unit.image || project?.image ? (
            <img 
              src={unit.image || project?.image} 
              alt={unit.label} 
              className="h-full w-full object-cover transition-transform duration-[1.5s]" 
            />
          ) : (
             <div className="flex h-full w-full items-center justify-center bg-foreground/[0.02]">
                <Building2 className="h-24 w-24 text-foreground/5" />
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className={cn(
            "absolute top-8 flex items-center gap-3 px-8 w-full",
            isRtl ? "flex-row-reverse" : "flex-row"
          )}>
             <span className={cn(
               "rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-foreground border border-foreground/10 bg-background/60 backdrop-blur-xl"
             )}>
                {unit.status === "available" ? dictionary.units.available : unit.status}
             </span>
             {unit.unitCode && (
               <span className="rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                  CODE: {unit.unitCode}
               </span>
             )}
          </div>
        </div>

        {/* ── Unit Metrics Scorecard ── */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 border border-border rounded-[24px] bg-gradient-to-br from-foreground/[0.02] to-transparent overflow-hidden shadow-sm">
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 transition-colors">{dictionary.projects.startingPrice}</span>
              <span className="text-[32px] font-black tracking-tighter text-foreground tabular-nums leading-none">{unit.priceLabel || (isRtl ? "طلب سعر" : "REQUEST")}</span>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">{dictionary.unitCreate.unitSpecs.toUpperCase()}</span>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 text-muted-foreground/40" />
                    <span className="text-[20px] font-black tracking-tight">{unit.bedrooms || 0}</span>
                 </div>
                 <div className="h-4 w-px bg-border/50" />
                 <div className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-muted-foreground/40" />
                    <span className="text-[20px] font-black tracking-tight">{unit.bathrooms || 0}</span>
                 </div>
              </div>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">{dictionary.unitCreate.floorPlaceholder}</span>
              <div className="flex items-center gap-2">
                 <Layers className="h-4 w-4 text-muted-foreground/40" />
                 <span className="text-[24px] font-black tracking-tighter text-foreground">{unit.floor || "-"}</span>
              </div>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 bg-foreground/[0.02]">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">{dictionary.unitCreate.areaPlaceholder}</span>
              <div className="flex items-center gap-2">
                 <Ruler className="h-5 w-5 text-muted-foreground/40" />
                 <span className="text-[28px] font-black tracking-tighter text-foreground tabular-nums">{unit.area || "0"} <span className="text-[14px] text-muted-foreground/30 font-bold uppercase ml-1">{dictionary.units.sqm}</span></span>
              </div>
           </div>
        </div>

        {/* ── Technical Grid & Description ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
           <div className="lg:col-span-8 flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">{dictionary.projects.description.toUpperCase()}</h2>
                 <p className="text-[17px] font-medium leading-relaxed text-muted-foreground/60 selection:bg-foreground selection:text-background">
                    {unit.description}
                 </p>
              </div>

              <div className="h-px bg-border/50" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Compound Name */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <Building2 className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.compoundNamePlaceholder}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase truncate">{unit.compoundName || project?.compoundName || "-"}</span>
                  </div>

                  {/* Direction */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <Compass className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.directionLabel}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase">{(unit as any).direction || "-"}</span>
                  </div>

                  {/* Reception */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <Sofa className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.receptionPlaceholder}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase">{(unit as any).reception || 0}</span>
                  </div>

                  {/* Maintenance Fees */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <Coins className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.maintenanceFeesPlaceholder}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase">{(unit as any).maintenanceFees || "-"}</span>
                  </div>

                  {/* Monthly Installment */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <History className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.monthlyInstallmentPlaceholder}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase">{(unit as any).monthlyInstallment || "-"}</span>
                  </div>

                  {/* Negotiable */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.negotiableLabel}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase">{(unit as any).negotiable ? dictionary.projects.active : "-"}</span>
                  </div>

                  {/* Payment Method */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.paymentMethodLabel}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase">{unit.paymentMethod || "-"}</span>
                  </div>

                  {/* Delivery timeline */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                     <div className="flex items-center gap-3 text-muted-foreground/40">
                        <Calendar className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.deliveryDatePlaceholder}</span>
                     </div>
                     <span className="text-lg font-black tracking-tight uppercase">{unit.deliveryDate || "-"}</span>
                  </div>
                  
                  {/* Property Rights */}
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                    <div className="flex items-center gap-3 text-muted-foreground/40">
                       <ShieldCheck className="h-4 w-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.unitCreate.legalTitle}</span>
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">{unit.registrationStatus || "-"}</span>
                 </div>
               </div>
           </div>

           <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="rounded-[24px] border border-border p-8 bg-foreground/[0.02] flex flex-col gap-6">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">{isRtl ? "طلب استفسار تقني" : "TECHNICAL ENQUIRY"}</h3>
                 <p className="text-xs font-medium text-muted-foreground/60 leading-relaxed">
                    Interested in the technical specifications, floor plans, or site visit for this specific unit? Start an enquiry to connect with the project manager.
                 </p>
                 <button className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-[10px] font-black uppercase tracking-[0.3em] text-background transition hover:bg-foreground/90 active:scale-95">
                    <span>{isRtl ? "بدء المحادثة" : "OPEN CHANNEL"}</span>
                 </button>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl border border-dashed border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                 <span>ASSET ID: {unitId.toUpperCase()}</span>
                 <span>REF: ZAY-2026-XQ</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
