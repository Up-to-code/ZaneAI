"use client";

import { Search, X } from "lucide-react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";

type AgSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * WHY:   The workspace needs a high-precision, locale-aware search input that fits the "Pure Canvas" aesthetic.
 * WHAT:  Renders a stylized search bar with floating icons and responsive focus states.
 * HOW:   Uses standard ZaneAI design tokens, handles RTL/LTR icons, and provides a clear-action button.
 */
export default function AgSearchInput({
  value,
  onChange,
  placeholder,
  className,
}: AgSearchInputProps) {
  const { dictionary, isRtl } = useWebLocale();
  const resolvedPlaceholder = placeholder ?? dictionary.common.search;

  return (
    <div 
      className={cn(
        "relative flex w-full max-w-md items-center",
        className
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className={cn(
        "absolute pointer-events-none text-muted-foreground/40 transition-colors",
        isRtl ? "right-5" : "left-5"
      )}>
        <Search className="h-4 w-4" strokeWidth={3} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        data-search-input="true"
        className={cn(
          "h-12 w-full rounded-2xl border border-border bg-card/50 font-bold tracking-tight text-foreground outline-none transition-all placeholder:text-muted-foreground/30 focus:border-foreground/20 focus:bg-card focus:ring-4 focus:ring-foreground/5",
          isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
        )}
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className={cn(
            "absolute flex h-6 w-6 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground",
            isRtl ? "left-3" : "right-3"
          )}
          aria-label="Clear search"
        >
          <X className="h-3 w-3" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
