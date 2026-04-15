"use client";

import { cn } from "@/lib/utils";

export default function LuxuriousLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Horizontal Bar */}
        <path
          d="M25 30H75"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Red Diagonal Bar - The "Luxurious" Touch */}
        <path
          d="M75 30L25 70"
          stroke="#FF4D00"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Bottom Horizontal Bar */}
        <path
          d="M25 70H75"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
