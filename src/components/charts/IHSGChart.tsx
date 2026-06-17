"use client";
import { useMemo, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { getThemeChartOptions } from "./ChartProvider";
import { formatChartDate } from "@/lib/formatters";
import type { StockHistory } from "@/types/stock";

interface IHSGChartProps {
  history: StockHistory[];
  isLoading?: boolean;
  height?: number;
  range?: string;
}

export function IHSGChart({
  history,
  isLoading = false,
  height = 350,
  range = "1mo",
}: IHSGChartProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    if (!history.length) return { labels: [], datasets: [] };

    const sorted = [...history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const labels = sorted.map((h) =>
      formatChartDate(new Date(h.date).getTime() / 1000, range),
    );
    const prices = sorted.map((h) => h.close);

    return {
      labels,
      datasets: [
        {
          label: "IHSG",
          data: prices,
          borderColor: "#00d4ff",
          backgroundColor: (context: {
            chart: { ctx: CanvasRenderingContext2D };
          }) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(0, 212, 255, 0.2)");
            gradient.addColorStop(1, "rgba(0, 212, 255, 0)");
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#00d4ff",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [history, range]);

  const options = useMemo((): ChartOptions<"line"> => {
    const base = getThemeChartOptions(isDark);
    return {
      ...base,
      interaction: { intersect: false, mode: "index" as const },
      plugins: {
        ...base.plugins,
        legend: {
          ...base.plugins?.legend,
          display: true,
          position: "top" as const,
          align: "end" as const,
        },
        tooltip: {
          ...base.plugins?.tooltip,
          callbacks: {
            title: (items: Array<{ label: string }>) => items[0]?.label || "",
            label: (context: {
              dataset: { label?: string };
              parsed: { y: number };
            }) => {
              return `${context.dataset.label || ""}: ${context.parsed.y.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            },
          },
        },
      },
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          ticks: {
            ...base.scales?.y?.ticks,
            callback: (value: string | number) => {
              const num = typeof value === "string" ? parseFloat(value) : value;
              return num.toLocaleString("id-ID", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });
            },
          },
        },
      },
    } as ChartOptions<"line">;
  }, [isDark]);

  if (isLoading)
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="bg-muted rounded-lg" style={{ height }} />
      </div>
    );

  if (!history.length)
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-muted-foreground text-sm">No data available</p>
      </div>
    );

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
