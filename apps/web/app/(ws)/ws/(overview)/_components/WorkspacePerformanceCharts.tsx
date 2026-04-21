"use client";

import { useMemo } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";

type CTAPoint = {
  label: string;
  count: number;
  color: string;
};

type WorkspacePerformanceChartsProps = {
  inventory: {
    available: number;
    reserved: number;
    sold: number;
  };
  interactions: {
    impressions: number;
    enquiries: number;
    conversions: number;
  };
  ctaBreakdown: CTAPoint[];
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-2xl border border-[color:var(--workspace-border)] bg-background/80 px-5 py-4 shadow-2xl backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-widest text-foreground">{data.name}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.fill }} />
        <span className="text-2xl font-black tracking-tighter">{data.value}</span>
        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{data.unit || "Units"}</span>
      </div>
    </div>
  );
}

export default function WorkspacePerformanceCharts({ inventory, interactions, ctaBreakdown }: WorkspacePerformanceChartsProps) {
  const { dictionary, isRtl } = useWebLocale();

  const inventoryData = useMemo(() => [
    { name: dictionary.performance.available, value: inventory.available, fill: "var(--zane-ai-accent)", unit: "Asset" },
    { name: dictionary.performance.reserved, value: inventory.reserved, fill: "#f59e0b", unit: "Asset" },
    { name: dictionary.performance.sold, value: inventory.sold, fill: "#10b981", unit: "Asset" },
  ], [inventory, dictionary]);

  const interactionData = useMemo(() => [
    { name: "Impressions", value: interactions.impressions, fill: "var(--workspace-border)" },
    { name: dictionary.performance.eoiCount, value: interactions.enquiries, fill: "#6366f1" },
    { name: "CTAs", value: interactions.conversions, fill: "var(--zane-ai-deep)" },
  ], [interactions, dictionary]);

  const totalUnits = inventory.available + inventory.reserved + inventory.sold;

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2", isRtl ? "rtl" : "ltr")}>
      {/* ── Inventory Pulse (Radial) ── */}
      <div className="group relative flex flex-col rounded-[32px] border border-[color:var(--workspace-border)] bg-card p-10 transition-all hover:shadow-2xl hover:shadow-black/5">
        <div className={cn("mb-8 flex items-center justify-between", isRtl && "flex-row-reverse")}>
           <div className={cn(isRtl ? "text-right" : "text-left")}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                {dictionary.performance.inventoryHealth}
              </h3>
              <p className="mt-1 text-3xl font-black tracking-tighter">Real-time Portfolio Stock</p>
           </div>
           <div className={cn(isRtl ? "text-left" : "text-right")}>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                {dictionary.performance.capacity}
              </span>
              <p className="text-2xl font-black tabular-nums">{totalUnits}</p>
           </div>
        </div>

        <div className="relative h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="30%" 
              outerRadius="100%" 
              barSize={14} 
              data={inventoryData}
              startAngle={isRtl ? -180 : 180}
              endAngle={isRtl ? 180 : -180}
            >
              <RadialBar
                background={{ fill: "var(--workspace-border)", opacity: 0.2 }}
                dataKey="value"
                cornerRadius={14}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          
          {/* Center Text Cap */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-4xl font-black tracking-tighter tabular-nums text-[var(--workspace-highlight)]">
               {Math.round((inventory.sold / (totalUnits || 1)) * 100)}%
             </span>
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
               {dictionary.performance.occupancy}
             </span>
          </div>
        </div>

        {/* Legend Custom */}
        <div className={cn("mt-8 flex flex-wrap gap-x-6 gap-y-4", isRtl && "flex-row-reverse")}>
           {inventoryData.map(item => (
             <div key={item.name} className={cn("flex items-center gap-2.5", isRtl && "flex-row-reverse")}>
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">{item.name}</span>
                <span className="text-sm font-black tabular-nums">{item.value}</span>
             </div>
           ))}
        </div>
      </div>

      {/* ── Interaction Velocity (Funnel) ── */}
      <div className="flex flex-col rounded-[32px] border border-[color:var(--workspace-border)] bg-card p-10">
        <div className={cn("mb-8", isRtl ? "text-right" : "text-left")}>
           <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
             {dictionary.performance.conversionFunnel}
           </h3>
           <p className="mt-1 text-3xl font-black tracking-tighter">Market Response Index</p>
        </div>

        <div className="h-[260px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={interactionData} 
                margin={isRtl ? { left: 40, right: 10, top: 0, bottom: 0 } : { left: 10, right: 40, top: 0, bottom: 0 }}
              >
                 <XAxis type="number" hide />
                 <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 900, fill: "var(--zane-ai-text-muted)" }} 
                    width={100}
                    orientation={isRtl ? "right" : "left"}
                 />
                 <Tooltip cursor={{ fill: "var(--workspace-border)", opacity: 0.1 }} />
                 <Bar dataKey="value" barSize={36} radius={isRtl ? [18, 0, 0, 18] : [0, 18, 18, 0]}>
                    {interactionData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>

        <div className={cn("mt-auto grid grid-cols-3 gap-6 pt-8 border-t border-border/40", isRtl && "text-right")}>
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Efficiency</span>
              <span className="text-2xl font-black tabular-nums">{Math.round((interactions.conversions / (interactions.impressions || 1)) * 100)}%</span>
           </div>
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Response</span>
              <span className="text-2xl font-black tabular-nums">{Math.round((interactions.enquiries / (interactions.impressions || 1)) * 100)}%</span>
           </div>
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Top Channel</span>
              <span className="text-base font-black uppercase truncate text-emerald-500">WhatsApp</span>
           </div>
        </div>
      </div>
    </div>
  );
}

