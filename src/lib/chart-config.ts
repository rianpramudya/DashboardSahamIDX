// Chart.js theme configuration presets
import { CHART_COLORS } from './constants';

interface ChartTheme {
  grid: string;
  text: string;
  tooltipBg: string;
  tooltipText: string;
  tooltipBorder: string;
}

function getTheme(isDark: boolean): ChartTheme {
  return {
    grid: isDark ? CHART_COLORS.gridDark : CHART_COLORS.gridLight,
    text: isDark ? CHART_COLORS.textDark : CHART_COLORS.textLight,
    tooltipBg: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    tooltipText: isDark ? '#e2e8f0' : '#1e293b',
    tooltipBorder: isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  };
}

/**
 * Get base Chart.js options with theme support
 */
export function getBaseChartOptions(isDark: boolean, customOptions: Record<string, unknown> = {}) {
  const theme = getTheme(isDark);

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const,
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: theme.text,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.tooltipBg,
        titleColor: theme.tooltipText,
        bodyColor: theme.tooltipText,
        borderColor: theme.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 12, weight: 'bold' as const, family: 'Inter, system-ui, sans-serif' },
        bodyFont: { size: 11, family: 'Inter, system-ui, sans-serif' },
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: function(context: { parsed: { y?: number }; dataset: { label?: string } }) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (value === undefined || value === null) return label;
            return `${label}: ${typeof value === 'number' ? value.toLocaleString('id-ID') : value}`;
          },
        },
        ...((customOptions.plugins as Record<string, unknown>)?.tooltip || {}),
      },
      ...((customOptions.plugins as Record<string, unknown>) || {}),
    },
    scales: {
      x: {
        grid: {
          color: theme.grid,
          drawBorder: false,
        },
        ticks: {
          color: theme.text,
          font: { size: 10, family: 'Inter, system-ui, sans-serif' },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
        border: { display: false },
        ...((customOptions.scales as Record<string, unknown>)?.x || {}),
      },
      y: {
        grid: {
          color: theme.grid,
          drawBorder: false,
        },
        ticks: {
          color: theme.text,
          font: { size: 10, family: 'Inter, system-ui, sans-serif' },
          callback: function(value: string | number) {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            if (Math.abs(num) >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
            if (Math.abs(num) >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
            if (Math.abs(num) >= 1_000) return (num / 1_000).toFixed(1) + 'K';
            return num.toLocaleString('id-ID');
          },
        },
        border: { display: false },
        ...((customOptions.scales as Record<string, unknown>)?.y || {}),
      },
      ...((customOptions.scales as Record<string, unknown>) || {}),
    },
    ...customOptions,
  };
}

/**
 * Get line chart options
 */
export function getLineChartOptions(isDark: boolean) {
  return getBaseChartOptions(isDark, {
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 6,
        hoverBorderWidth: 2,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
      },
    },
  });
}

/**
 * Get bar chart options
 */
export function getBarChartOptions(isDark: boolean) {
  return getBaseChartOptions(isDark, {
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false as const,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  });
}

/**
 * Get doughnut chart options
 */
export function getDoughnutChartOptions(isDark: boolean) {
  const theme = getTheme(isDark);

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const,
    },
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: theme.text,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.tooltipBg,
        titleColor: theme.tooltipText,
        bodyColor: theme.tooltipText,
        borderColor: theme.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context: { parsed: number; label: string; dataset: { data: number[] } }) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };
}

/**
 * Get scatter chart options
 */
export function getScatterChartOptions(isDark: boolean) {
  return getBaseChartOptions(isDark, {
    elements: {
      point: {
        radius: 6,
        hoverRadius: 10,
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { x: number; y: number }; raw: { ticker?: string } }) {
            const ticker = context.raw?.ticker || '';
            return `${ticker}: Vol ${context.parsed.x.toLocaleString('id-ID')}, Change ${context.parsed.y.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Volume',
          color: getTheme(isDark).text,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Change %',
          color: getTheme(isDark).text,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
        },
      },
    },
  });
}
