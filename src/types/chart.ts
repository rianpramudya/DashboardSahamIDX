// Chart.js type definitions and configuration types

import type { ChartOptions, ChartData } from 'chart.js';

export interface ChartThemeColors {
  background: string;
  grid: string;
  text: string;
  tooltip: {
    background: string;
    title: string;
    body: string;
    border: string;
  };
}

export interface BaseChartProps {
  data: ChartData<'line' | 'bar' | 'doughnut' | 'scatter'>;
  options?: ChartOptions<'line' | 'bar' | 'doughnut' | 'scatter'>;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
}

export interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
}

export interface BarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
}

export interface DoughnutChartProps {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
}

export interface ScatterChartProps {
  datasets: {
    label: string;
    data: { x: number; y: number; ticker?: string }[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
}

export type ChartType = 'line' | 'bar' | 'doughnut' | 'scatter';

export interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}
