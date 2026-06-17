'use client';

import { useMemo, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getThemeChartOptions } from './ChartProvider';
import { SECTORS } from '@/data/sectors';
import type { StockQuote } from '@/types/stock';

interface SectorChartProps {
  stocks: StockQuote[];
  isLoading?: boolean;
  height?: number;
  locale?: string;
}

export function SectorChart({ stocks, isLoading = false, height = 350, locale = 'en' }: SectorChartProps) {
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
    const sectorMap = new Map<string, number>();
    stocks.forEach((stock) => {
      const sector = stock.sector || 'unknown';
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + (stock.marketCap || 0));
    });
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];
    sectorMap.forEach((value, key) => {
      const sector = SECTORS.find((s) => s.name === key);
      labels.push(locale === 'id' ? (sector?.nameId || key) : (sector?.nameEn || key));
      data.push(value);
      colors.push(sector?.color || '#94a3b8');
    });
    return {
      labels,
      datasets: [{ data, backgroundColor: colors, borderColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderWidth: 2, hoverOffset: 8 }],
    };
  }, [stocks, isDark, locale]);

  const options = useMemo(() => {
    const base = getThemeChartOptions(isDark);
    return {
      ...base,
      cutout: '65%',
      plugins: {
        ...base.plugins,
        legend: { ...base.plugins?.legend, position: 'bottom' as const, labels: { ...base.plugins?.legend?.labels, padding: 20, usePointStyle: true } },
        datalabels: {
          display: true,
          color: isDark ? '#e2e8f0' : '#1e293b',
          font: { size: 11, weight: 'bold' },
          formatter: (value: number, ctx: { dataset?: { data?: number[] } }) => {
            if (!ctx.dataset?.data || !Array.isArray(ctx.dataset.data) || ctx.dataset.data.length === 0) {
              return '';
            }
            const total = ctx.dataset.data.reduce((a: number, b: number) => (typeof a === 'number' ? a : 0) + (typeof b === 'number' ? b : 0), 0);
            if (total === 0) return '';
            return ((value / total) * 100).toFixed(1) + '%';
          },
        },
        tooltip: {
          ...base.plugins?.tooltip,
          callbacks: {
            label: (context: { parsed: number; label: string; dataset?: { data?: number[] } }) => {
              if (!context.dataset?.data || !Array.isArray(context.dataset.data) || context.dataset.data.length === 0) {
                return context.label;
              }
              const total = context.dataset.data.reduce((a: number, b: number) => (typeof a === 'number' ? a : 0) + (typeof b === 'number' ? b : 0), 0);
              if (total === 0) return context.label;
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${percentage}%`;
            },
          },
        },
      },
    };
  }, [isDark]);

  if (isLoading) return <div className="animate-pulse flex items-center justify-center" style={{ height }}><div className="w-48 h-48 rounded-full bg-muted" /></div>;
  return <div style={{ height }}><Doughnut data={chartData} options={options} /></div>;
}
