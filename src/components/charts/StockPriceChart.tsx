'use client';

// Individual Stock Price Line Chart with time range support
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { getThemeChartOptions } from './ChartProvider';
import { formatChartDate } from '@/lib/formatters';
import type { StockHistory } from '@/types/stock';

interface StockPriceChartProps {
  history: StockHistory[];
  ticker?: string;
  isLoading?: boolean;
  height?: number;
  range?: string;
}

export function StockPriceChart({
  history,
  ticker = '',
  isLoading = false,
  height = 350,
  range = '1m',
}: StockPriceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    if (!history.length) return { labels: [], datasets: [] };

    const labels = history.map((h) =>
      formatChartDate(new Date(h.date).getTime() / 1000, range)
    );
    const prices = history.map((h) => h.close);
    const volumes = history.map((h) => h.volume);

    const isPositive = prices[prices.length - 1] >= prices[0];
    const lineColor = isPositive ? '#00c853' : '#ff1744';

    return {
      labels,
      datasets: [
        {
          label: ticker,
          data: prices,
          borderColor: lineColor,
          backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, isPositive ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 23, 68, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          yAxisID: 'y',
        },
        {
          label: 'Volume',
          data: volumes,
          type: 'bar' as const,
          backgroundColor: isPositive ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 23, 68, 0.1)',
          borderRadius: 2,
          borderSkipped: false as const,
          yAxisID: 'y1',
          barThickness: 2,
        },
      ],
    };
  }, [history, ticker, range, isDark]);

  const options = useMemo(() => {
    const base = getThemeChartOptions(isDark);

    return {
      ...base,
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      plugins: {
        ...base.plugins,
        legend: {
          ...base.plugins?.legend,
          display: true,
          position: 'top' as const,
          align: 'end' as const,
        },
        tooltip: {
          ...base.plugins?.tooltip,
          callbacks: {
            title: (items: Array<{ label: string }>) => items[0]?.label || '',
            label: (context: { dataset: { label?: string }; parsed: { y: number } }) => {
              if (context.dataset.label === 'Volume') {
                return `Volume: ${context.parsed.y.toLocaleString('id-ID')}`;
              }
              return `${context.dataset.label || ''}: ${context.parsed.y.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            },
          },
        },
      },
      scales: {
        ...base.scales,
        x: {
          ...base.scales?.x,
          grid: { display: false },
        },
        y: {
          ...base.scales?.y,
          position: 'left' as const,
          ticks: {
            ...base.scales?.y?.ticks,
            callback: (value: string | number) => {
              const num = typeof value === 'string' ? parseFloat(value) : value;
              return num.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            },
          },
        },
        y1: {
          type: 'linear' as const,
          position: 'right' as const,
          display: false,
          grid: { display: false },
          min: 0,
        },
      },
    };
  }, [isDark]);

  if (isLoading) {
    return (
      <div className="animate-pulse" style={{ height }}>
        <div className="h-full bg-muted rounded-lg" />
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-muted-foreground text-sm">Select a stock to view chart</p>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      {/* @ts-expect-error - mixed chart types */}
      <Line data={chartData} options={options} />
    </div>
  );
}
