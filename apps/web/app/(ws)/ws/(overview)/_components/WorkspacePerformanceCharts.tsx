"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";

type TrendPoint = {
  date: string;
  views: number;
  clicks: number;
};

type CTAPoint = {
  label: string;
  count: number;
  color: string;
};

type WorkspacePerformanceChartsProps = {
  trend: TrendPoint[];
  ctaBreakdown: CTAPoint[];
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-[var(--zane-ai-text-muted)]">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-6 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[10px] font-bold text-[var(--zane-ai-text-muted)]">{entry.name}</span>
          </div>
          <span className="text-[11px] font-black text-[var(--zane-ai-deep)] dark:text-white">
            {entry.name === "Convert" ? `${entry.value}%` : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function WorkspacePerformanceCharts({ trend, ctaBreakdown }: WorkspacePerformanceChartsProps) {
  const { dictionary, isRtl } = useWebLocale();
  const [activeRange, setActiveRange] = useState<7 | 30>(7);

  const chartData = useMemo(() => {
    const slice = trend.slice(-activeRange);
    return slice.map((p) => ({
      ...p,
      convert: p.views > 0 ? Math.round((p.clicks / p.views) * 100) : 0,
    }));
  }, [trend, activeRange]);

  // Totals for the legend pills
  const totals = useMemo(() => {
    const slice = trend.slice(-activeRange);
    const views = slice.reduce((s, p) => s + p.views, 0);
    const clicks = slice.reduce((s, p) => s + p.clicks, 0);
    const convert = views > 0 ? Math.round((clicks / views) * 100) : 0;
    return { views, clicks, convert };
  }, [trend, activeRange]);

  return (
    <div className="rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)]">
            {dictionary.performance.trendTitle}
          </h3>
        </div>

        {/* Range toggle */}
        <div className="flex rounded-xl border border-[color:var(--workspace-border)] bg-[var(--workspace-elevated)] p-1 self-start sm:self-auto">
          {([7, 30] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all",
                activeRange === r
                  ? "bg-[var(--zane-ai-deep)] text-white dark:bg-white dark:text-black"
                  : "text-[var(--zane-ai-text-muted)] hover:text-[var(--zane-ai-deep)]"
              )}
            >
              {r === 7 ? dictionary.performance.last7Days : dictionary.performance.last30Days}
            </button>
          ))}
        </div>
      </div>

      {/* Stat pills */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: dictionary.performance.views, value: totals.views, color: "var(--zane-ai-accent)" },
          { label: dictionary.performance.clicks, value: totals.clicks, color: "#6366f1" },
          { label: "Convert", value: `${totals.convert}%`, color: "#f59e0b" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-elevated)] px-3 py-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--zane-ai-text-muted)]">{s.label}</span>
            <span className="text-[12px] font-black text-[var(--zane-ai-deep)] dark:text-white">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--workspace-border)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 700, fill: "var(--zane-ai-text-muted)" }}
              tickFormatter={(s) => {
                const d = new Date(s);
                return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
              }}
              reversed={isRtl}
              interval="preserveStartEnd"
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: "var(--zane-ai-text-muted)" }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="var(--zane-ai-accent)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="convert"
              name="Convert"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
