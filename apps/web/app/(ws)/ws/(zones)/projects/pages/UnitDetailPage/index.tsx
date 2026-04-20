"use client";

import Link from "next/link";
import { useState } from "react";
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
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2
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
  
  // Mock unit data for UI development
  const unit = {
    id: unitId,
    label: `UNIT ${unitId.split('-')[1]?.toUpperCase() || 'A'}`,
    unitType: "apartment",
    floor: "04",
    bedrooms: 3,
    bathrooms: 2,
    area: "185",
    priceLabel: "2,500,000 ر.س",
    status: "available",
    description: "A premium luxury apartment featuring floor-to-ceiling windows with panoramic city views. This unit is designed with the 'Pure Canvas' philosophy, prioritizing natural light and high-end technical finishes.",
    location: "Al Narjis, Riyadh",
    finishingLevel: "fully_finished",
    paymentMethod: "installments",
    deliveryDate: "Q4 2026",
    registrationStatus: "registered",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
  };

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
                  variant="destructive"
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
          <img 
            src={unit.image} 
            alt={unit.label} 
            className="h-full w-full object-cover transition-transform duration-[1.5s]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className={cn(
            "absolute top-8 flex items-center gap-3 px-8 w-full",
            isRtl ? "flex-row-reverse" : "flex-row"
          )}>
             <span className="rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                {isRtl ? "متاح" : "AVAILABLE"}
             </span>
             <span className="rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                {isRtl ? "السعر عند الطلب" : "PRICE ON REQUEST"}
             </span>
          </div>
        </div>

        {/* ── Unit Metrics Scorecard ── */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 border border-border rounded-[24px] bg-gradient-to-br from-foreground/[0.02] to-transparent overflow-hidden shadow-sm">
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 transition-colors">FINANCIAL LABEL</span>
              <span className="text-[32px] font-black tracking-tighter text-foreground tabular-nums leading-none">{unit.priceLabel}</span>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">CONFIGURATION</span>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 text-muted-foreground/40" />
                    <span className="text-[20px] font-black tracking-tight">{unit.bedrooms}</span>
                 </div>
                 <div className="h-4 w-px bg-border/50" />
                 <div className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-muted-foreground/40" />
                    <span className="text-[20px] font-black tracking-tight">{unit.bathrooms}</span>
                 </div>
              </div>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 border-b lg:border-b-0 lg:border-r border-border/50">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">FLOOR LEVEL</span>
              <div className="flex items-center gap-2">
                 <Layers className="h-4 w-4 text-muted-foreground/40" />
                 <span className="text-[24px] font-black tracking-tighter text-foreground">{unit.floor}</span>
              </div>
           </div>
           <div className="flex-1 flex flex-col gap-2 p-8 bg-foreground/[0.02]">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">TOTAL AREA</span>
              <div className="flex items-center gap-2">
                 <Ruler className="h-5 w-5 text-muted-foreground/40" />
                 <span className="text-[28px] font-black tracking-tighter text-foreground tabular-nums">{unit.area} <span className="text-[14px] text-muted-foreground/30 font-bold uppercase ml-1">m²</span></span>
              </div>
           </div>
        </div>

        {/* ── Technical Grid & Description ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
           {/* Navigation/Sidebar actions placeholder or deep specs */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">{isRtl ? "نبذة عن الوحدة" : "ASSET DESCRIPTION"}</h2>
                 <p className="text-[17px] font-medium leading-relaxed text-muted-foreground/60 selection:bg-foreground selection:text-background">
                    {unit.description}
                 </p>
              </div>

              <div className="h-px bg-border/50" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                    <div className="flex items-center gap-3 text-muted-foreground/40">
                       <ShieldCheck className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Finishing Level</span>
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">{unit.finishingLevel.replace('_', ' ')}</span>
                 </div>
                 <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                    <div className="flex items-center gap-3 text-muted-foreground/40">
                       <CreditCard className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Payment Plan</span>
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">{unit.paymentMethod}</span>
                 </div>
                 <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                    <div className="flex items-center gap-3 text-muted-foreground/40">
                       <Calendar className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Delivery timeline</span>
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">{unit.deliveryDate}</span>
                 </div>
                 <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-foreground/[0.01]">
                    <div className="flex items-center gap-3 text-muted-foreground/40">
                       <ShieldCheck className="h-4 w-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Property Rights</span>
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">{unit.registrationStatus}</span>
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

              {/* QR / ID / Reference section */}
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
