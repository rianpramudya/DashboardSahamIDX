'use client';
import { useMemo, useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { getThemeChartOptions } from './ChartProvider';
import { getSectorColor } from '@/data/sectors';
import type { StockQuote } from '@/types/stock';

interface ScatterChartProps {
  stocks: StockQuote[];
  isLoading?: boolean;
  height?: number;
}

export function ScatterChart({ stocks, isLoading = false, height = 350 }: ScatterChartProps) {
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

    const sectorGroups = new Map<string, Array<{ x: number; y: number; ticker: string }>>();
    stocks.forEach((stock) => {
      const sector = stock.sector || 'unknown';
      if (!sectorGroups.has(sector)) sectorGroups.set(sector, []);
      sectorGroups.get(sector)?.push({ x: stock.volume / 1_000_000, y: stock.changePercent, ticker: stock.ticker });
    });

    const datasets = Array.from(sectorGroups.entries()).map(([sector, data]) => ({
      label: sector.charAt(0).toUpperCase() + sector.slice(1),
      data,
      backgroundColor: getSectorColor(sector) + 'CC',
      borderColor: getSectorColor(sector),
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12,
    }));

    return { labels: [], datasets };
  }, [stocks]);

  const options = useMemo((): ChartOptions<'scatter'> => {
    const base = getThemeChartOptions(isDark);
    return {
      ...base,
      plugins: {
        ...base.plugins,
        legend: { ...base.plugins?.legend, display: true, position: 'top' as const, align: 'end' as const },
        tooltip: {
          ...base.plugins?.tooltip,
          callbacks: {
            title: (items: Array<{ raw: unknown }>) => (items[0]?.raw as { ticker: string })?.ticker || '',
            label: (context: { parsed: { x: number; y: number }; dataset: { label?: string } }) => [
              `Sector: ${context.dataset.label || ''}`,
              `Volume: ${context.parsed.x.toFixed(1)}M`,
              `Change: ${context.parsed.y >= 0 ? '+' : ''}${context.parsed.y.toFixed(2)}%`,
            ],
          },
        },
      },
      scales: {
        ...base.scales,
        x: { ...base.scales?.x, title: { display: true, text: 'Volume (Millions)', color: isDark ? '#e2e8f0' : '#1e293b', font: { size: 11 } } },
        y: { ...base.scales?.y, title: { display: true, text: 'Change %', color: isDark ? '#e2e8f0' : '#1e293b', font: { size: 11 } } },
      },
    } as ChartOptions<'scatter'>;
  }, [isDark]);

  if (isLoading) return <div className="animate-pulse" style={{ height }}><div className="h-full bg-muted rounded-lg" /></div>;
  return <div style={{ height }}><Scatter data={chartData} options={options} /></div>;
}