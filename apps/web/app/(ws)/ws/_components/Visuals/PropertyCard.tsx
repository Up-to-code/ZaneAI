"use client";

import Link from "next/link";
import { memo } from "react";
import { cn } from "@/lib/i18n";
import { MapPin, Building2 } from "lucide-react";

type PropertyCardSpec = {
  label: string;
  value: string;
};

/**
 * WHY:   The generic property card must reflect the institutional luxury of the workspace.
 * WHAT:  High-precision 'Reydghin' redesigned PropertyCard for CRM and Offers.
 * HOW:   Applying Silk-Glass texture, massive technical headers, and tracking-widest metadata.
 */
const PropertyCardComponent = function PropertyCard({
  href,
  image,
  title,
  location,
  priceLabel,
  summary,
  specs,
  footer,
  publicationBadge,
  density = "compact",
}: {
  href?: string;
  image: string;
  title: string;
  location: string;
  priceLabel: string;
  summary: string;
  specs: PropertyCardSpec[];
  footer?: React.ReactNode;
  publicationBadge?: React.ReactNode;
  density?: "compact" | "detail" | "flexible";
}) {
  const content = (
    <article
      className={cn(
        "group overflow-hidden rounded-[24px] border border-border bg-gradient-to-br from-foreground/[0.01] to-transparent shadow-sm transition-all hover:border-foreground/30",
        density === "flexible" ? "w-full" : density === "detail" ? "w-full max-w-sm" : "w-full max-w-xs",
      )}
    >
      <div className="relative h-48 overflow-hidden bg-muted/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/5" />
        
        {publicationBadge && (
          <div className="absolute top-4 right-4">
             {publicationBadge}
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[20px] font-black tracking-tighter text-foreground leading-tight uppercase line-clamp-1">{title}</h2>
            <div className="shrink-0 text-[16px] font-black tabular-nums tracking-tighter text-foreground">{priceLabel}</div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {summary ? (
          <p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-muted-foreground/60">
            {summary}
          </p>
        ) : null}

        {specs.length > 0 ? (
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-border/50 pt-5">
            {specs.slice(0, 4).map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{spec.label}</div>
                <div className="text-[13px] font-black text-foreground uppercase tracking-tight">{spec.value}</div>
              </div>
            ))}
          </div>
        ) : null}

        {footer ? (
          <div className="border-t border-border/50 pt-4 mt-1">
            {footer}
          </div>
        ) : null}
      </div>
    </article>
  );

  if (!href) return content;
  return <Link href={href} className="block group/link">{content}</Link>;
}

export default memo(PropertyCardComponent);
