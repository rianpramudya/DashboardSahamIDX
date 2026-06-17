"use client";
import { useMemo, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions, ScriptableContext } from "chart.js";
import { getThemeChartOptions } from "./ChartProvider";
import { formatChartDate } from "@/lib/formatters";
import type { StockHistory } from "@/types/stock";

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────
const RANGES = [
  { label: "1D",  value: "1d"  },
  { label: "1W",  value: "1wk" },
  { label: "1M",  value: "1mo" },
  { label: "3M",  value: "3mo" },
  { label: "YTD", value: "ytd" },
  { label: "1Y",  value: "1y"  },
  { label: "3Y",  value: "3y"  },
  { label: "5Y",  value: "5y"  },
] as const;

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface IHSGChartProps {
  history: StockHistory[];
  isLoading?: boolean;
  height?: number;
  range?: string;
  onRangeChange?: (range: string) => void;
  title?: string;
  subtitle?: string;
}

interface ChartStats {
  current: number;
  open: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  maxDrawdown: number;
  volatility: number;
  avgVolume: number | null;
  dataPoints: number;
  isPositive: boolean;
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function calcStats(history: StockHistory[]): ChartStats | null {
  if (!history.length) return null;
  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const prices  = sorted.map((h) => h.close);
  const first   = prices[0];
  const last    = prices[prices.length - 1];
  const high    = Math.max(...prices);
  const low     = Math.min(...prices);
  const change  = last - first;
  const changePct = ((last - first) / first) * 100;

  // Max Drawdown
  let peak = prices[0]; let maxDD = 0;
  for (const p of prices) {
    if (p > peak) peak = p;
    const dd = ((peak - p) / peak) * 100;
    if (dd > maxDD) maxDD = dd;
  }

  // Annualised Volatility
  const lr   = prices.slice(1).map((p, i) => Math.log(p / prices[i]));
  const avgR = lr.reduce((a, b) => a + b, 0) / lr.length;
  const vari = lr.reduce((s, r) => s + (r - avgR) ** 2, 0) / lr.length;
  const vol  = Math.sqrt(vari * 252) * 100;

  // Avg Volume
  const vols = sorted
    .map((h) => (h as StockHistory & { volume?: number }).volume)
    .filter((v): v is number => v != null && v > 0);
  const avgVol = vols.length ? vols.reduce((a, b) => a + b, 0) / vols.length : null;

  return {
    current: last, open: first, change, changePercent: changePct,
    high, low, maxDrawdown: maxDD, volatility: vol,
    avgVolume: avgVol, dataPoints: sorted.length,
    isPositive: change >= 0,
  };
}

const fmtIDR  = (n: number, dec = 2) =>
  n.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });

const fmtVol  = (v: number) =>
  v >= 1e9 ? `${(v / 1e9).toFixed(2)}B`
  : v >= 1e6 ? `${(v / 1e6).toFixed(2)}M`
  : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K`
  : v.toFixed(0);

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────
function StatCard({
  label, value, sub, sentiment = "neutral",
}: {
  label: string; value: string; sub?: string;
  sentiment?: "positive" | "negative" | "neutral";
}) {
  const cls =
    sentiment === "positive" ? "text-emerald-400"
    : sentiment === "negative" ? "text-red-400"
    : "text-foreground";
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
        {label}
      </span>
      <span className={`text-sm font-bold tabular-nums leading-tight ${cls}`}>{value}</span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Skeleton({ height }: { height: number }) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="space-y-2">
        <div className="h-7 w-40 bg-muted rounded-md" />
        <div className="h-4 w-24 bg-muted rounded-md" />
      </div>
      <div className="bg-muted rounded-xl" style={{ height }} />
      <div className="h-8 bg-muted rounded-lg" />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────
export function IHSGChart({
  history,
  isLoading  = false,
  height     = 300,
  range      = "1mo",
  onRangeChange,
  title      = "IHSG",
  subtitle   = "Index Harga Saham Gabungan",
}: IHSGChartProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const stats = useMemo(() => calcStats(history), [history]);

  // ── Chart datasets ──────────────────────────
  const chartData = useMemo(() => {
    if (!history.length) return { labels: [], datasets: [] };

    const sorted = [...history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const labels  = sorted.map((h) =>
      formatChartDate(new Date(h.date).getTime() / 1000, range),
    );
    const prices  = sorted.map((h) => h.close);
    const baseline = prices[0]; // open of the period

    const pos       = stats?.isPositive ?? true;
    const color     = pos ? "#34d399" : "#f87171";
    const fillStart = pos ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.18)";
    const fillEnd   = pos ? "rgba(52,211,153,0)"    : "rgba(248,113,113,0)";
    const baseClr   = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)";

    return {
      labels,
      datasets: [
        // ── 1. Dashed baseline reference line (Stockbit style) ──
        {
          label: "_baseline",
          data: prices.map(() => baseline),
          borderColor: baseClr,
          borderWidth: 1,
          borderDash: [5, 4],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHitRadius: 0,
          pointHoverRadius: 0,
        },
        // ── 2. Price line ──
        {
          label: title,
          data: prices,
          borderColor: color,
          backgroundColor: (ctx: ScriptableContext<"line">) => {
            const c = ctx.chart.ctx;
            const area = ctx.chart.chartArea;
            if (!area) return fillStart;

            const g = c.createLinearGradient(0, area.top, 0, area.bottom);
            g.addColorStop(0, fillStart);
            g.addColorStop(1, fillEnd);
            return g;
          },
          borderWidth: 1.8,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 12,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: isDark ? "#1a1a2e" : "#ffffff",
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [history, range, stats, isDark, title]);

  // ── Chart options ───────────────────────────
  const options = useMemo((): ChartOptions<"line"> => {
    const base = getThemeChartOptions(isDark);
    return {
      ...base,
      interaction: { intersect: false, mode: "index" as const },
      plugins: {
        ...base.plugins,
        legend: { display: false },
        tooltip: {
          ...base.plugins?.tooltip,
          // Hide the baseline from tooltip
          filter: (item) => item.dataset.label !== "_baseline",
          callbacks: {
            title: (items: Array<{ label: string }>) => items[0]?.label ?? "",
            label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
              `${ctx.dataset.label ?? ""}: ${fmtIDR(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        ...base.scales,
        x: { ...base.scales?.x, grid: { display: false } },
        y: {
          ...base.scales?.y,
          ticks: {
            ...base.scales?.y?.ticks,
            callback: (v: string | number) => {
              const n = typeof v === "string" ? parseFloat(v) : v;
              return fmtIDR(n, 0);
            },
          },
        },
      },
    } as ChartOptions<"line">;
  }, [isDark]);

  // ── Guards ──────────────────────────────────
  if (isLoading) return <Skeleton height={height} />;

  if (!history.length)
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground" style={{ height }}>
        <span className="text-2xl">📉</span>
        <p className="text-sm">No data available</p>
      </div>
    );

  const pos = stats?.isPositive ?? true;

  return (
    <div className="space-y-4">

      {/* ── Price Header (mirip Stockbit) ─────── */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{title}</span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </div>

        <div className="mt-1 flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl font-extrabold tabular-nums tracking-tight leading-none">
            {fmtIDR(stats?.current ?? 0)}
          </span>
          <span className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${pos ? "text-emerald-400" : "text-red-400"}`}>
            <span>{pos ? "↗" : "↘"}</span>
            <span>
              {Math.abs(stats?.change ?? 0).toFixed(2)}
              ({pos ? "+" : ""}{stats?.changePercent.toFixed(2)}%)
            </span>
            <span className="font-normal text-muted-foreground">Hari Ini</span>
          </span>
        </div>
      </div>

      {/* ── Chart ────────────────────────────── */}
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>

      {/* ── Range Selector (Stockbit style) ───── */}
      {onRangeChange && (
        <div className="flex items-center gap-1 border-b border-border pb-1">
          {RANGES.map(({ label, value }) => {
            const active = range === value;
            return (
              <button
                key={value}
                onClick={() => onRangeChange(value)}
                className={[
                  "px-2.5 py-1 text-xs font-semibold rounded transition-colors",
                  active
                    ? "text-emerald-400 border-b-2 border-emerald-400 rounded-none"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Stats Grid ───────────────────────── */}
      {stats && (
        <>
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4">
            <StatCard label="Period High"  value={fmtIDR(stats.high)} sentiment="positive" />
            <StatCard label="Period Low"   value={fmtIDR(stats.low)}  sentiment="negative" />
            <StatCard
              label="Return"
              value={`${stats.changePercent >= 0 ? "+" : ""}${stats.changePercent.toFixed(2)}%`}
              sentiment={stats.changePercent >= 0 ? "positive" : "negative"}
            />
            <StatCard
              label="Max Drawdown"
              value={`-${stats.maxDrawdown.toFixed(2)}%`}
              sub="dari puncak periode"
              sentiment="negative"
            />
            <StatCard
              label="Volatility (ann.)"
              value={`${stats.volatility.toFixed(2)}%`}
              sub="σ tahunan"
            />
            {stats.avgVolume !== null ? (
              <StatCard label="Avg Volume" value={fmtVol(stats.avgVolume)} sub="per sesi" />
            ) : (
              <StatCard label="Data Points" value={String(stats.dataPoints)} sub="sesi perdagangan" />
            )}
          </div>
        </>
      )}
    </div>
  );
}