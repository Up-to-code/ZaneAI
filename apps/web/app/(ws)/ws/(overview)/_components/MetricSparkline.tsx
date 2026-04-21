"use client";

import { motion } from "framer-motion";

type MetricSparklineProps = {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
};

/**
 * WHY:   A dashboard number without context is static. Sparklines provide a 7-day "heartbeat".
 * WHAT:  A lightweight, high-precision SVG line with subtle drawing animation.
 * HOW:   Constructs a path from normalized data points. Uses framer-motion for the entrance line-draw.
 */
export default function MetricSparkline({ 
  data, 
  color = "var(--workspace-highlight)", 
  width = 80, 
  height = 30 
}: MetricSparklineProps) {
  if (!data?.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible opacity-50 transition-opacity group-hover:opacity-100">
      <motion.polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}
