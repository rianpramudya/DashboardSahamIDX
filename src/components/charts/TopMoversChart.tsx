'use client';

import { useMemo, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getThemeChartOptions } from './ChartProvider';
import type { StockQuote } from '@/types/stock';

interface TopMoversChartProps {
  stocks: StockQuote[];
  isLoading?: boolean;
  height?: number;
}

export function TopMoversChart({ stocks, isLoading = false, height = 350 }: TopMoversChartProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => { setIsDark(document.documentElement.classList.contains('dark')); };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    if (!stocks.length) return { labels: [], datasets: [] };
    const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sorted.slice(0, 5);
    const losers = sorted.slice(-5).reverse();
    return {
      labels: [...gainers.map((s) => s.ticker), ...losers.map((s) => s.ticker)],
      datasets: [{
        label: 'Change %',
        data: [...gainers.map((s) => s.changePercent), ...losers.map((s) => -Math.abs(s.changePercent))],
        backgroundColor: [...gainers.map(() => '#00c853'), ...losers.map(() => '#ff1744')],
        borderRadius: 6,
        borderSkipped: false as const,
      }],
    };
  }, [stocks]);

  const options = useMemo(() => {
    const base = getThemeChartOptions(isDark);
    return {
      ...base,
      plugins: {
        ...base.plugins,
        legend: { display: false },
        tooltip: {
          ...base.plugins?.tooltip,
          callbacks: {
            label: (context: { parsed: { y: number }; label: string }) => {
              const val = context.parsed.y;
              const sign = val >= 0 ? '+' : '';
              return `${context.label}: ${sign}${val.toFixed(2)}%`;
            },
          },
        },
      },
    };
  }, [isDark]);

  if (isLoading) return <div className="animate-pulse" style={{ height }}><div className="h-full bg-muted rounded-lg" /></div>;
  return <div style={{ height }}><Bar data={chartData} options={options} /></div>;
}
