'use client';

// Chart.js registration - must be imported before any chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Disable datalabels by default to prevent errors with empty datasets
ChartDataLabels.defaults.display = false;

// Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

// Configure default Chart.js options
ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif';
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

interface ChartProviderProps {
  children: React.ReactNode;
}

export function ChartProvider({ children }: ChartProviderProps) {
  return <>{children}</>;
}

// Helper to get theme-aware chart options
export function getThemeChartOptions(isDark: boolean): Partial<ChartOptions> {
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const tooltipBg = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipText = isDark ? '#e2e8f0' : '#1e293b';
  const tooltipBorder = isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { size: 11 },
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        displayColors: true,
        boxPadding: 4,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
        border: { display: false },
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, font: { size: 10 } },
        border: { display: false },
      },
    },
  };
}

export { ChartJS, ChartDataLabels };
