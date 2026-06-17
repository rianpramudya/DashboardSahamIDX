'use client';

import { useMemo, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getThemeChartOptions } from './ChartProvider';
import { formatVolume } from '@/lib/formatters';
import type { StockQuote } from '@/types/stock';

interface VolumeChartProps {
  stocks: StockQuote[];
  isLoading?: boolean;
  height?: number;
}

export function VolumeChart({ stocks, isLoading = false, height = 350 }: VolumeChartProps) {
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
    const sorted = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 10);
    return {
      labels: sorted.map((s) => s.ticker),
      datasets: [{
        label: 'Volume',
        data: sorted.map((s) => s.volume),
        backgroundColor: sorted.map((_, i) => { const opacity = 1 - (i * 0.08); return `rgba(0, 212, 255, ${opacity})`; }),
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
            title: (items: Array<{ label: string }>) => items[0]?.label || '',
            label: (context: { parsed: { y: number } }) => `Volume: ${formatVolume(context.parsed.y)}`,
          },
        },
      },
      scales: {
        ...base.scales,
        y: { ...base.scales?.y, ticks: { ...base.scales?.y?.ticks, callback: (value: string | number) => formatVolume(typeof value === 'string' ? parseFloat(value) : value) } },
      },
    };
  }, [isDark]);

  if (isLoading) return <div className="animate-pulse" style={{ height }}><div className="h-full bg-muted rounded-lg" /></div>;
  return <div style={{ height }}><Bar data={chartData} options={options} /></div>;
}
