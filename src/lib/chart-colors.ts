// Chart color palette per sector
export const SECTOR_COLOR_MAP: Record<string, string> = {
  financials: '#00d4ff',
  communication: '#7c4dff',
  consumer: '#ff6e40',
  technology: '#00e676',
  energy: '#ffd600',
  materials: '#ff4081',
  healthcare: '#69f0ae',
  unknown: '#94a3b8',
};

export const CHART_GRADIENTS = {
  cyan: ['#00d4ff', '#0099cc'],
  purple: ['#7c4dff', '#5e35b1'],
  orange: ['#ff6e40', '#e64a19'],
  green: ['#00e676', '#00c853'],
  yellow: ['#ffd600', '#ffab00'],
  pink: ['#ff4081', '#d5006d'],
  mint: ['#69f0ae', '#00e676'],
  blue: ['#448aff', '#2962ff'],
};

/**
 * Get color for a sector
 */
export function getSectorChartColor(sector: string): string {
  return SECTOR_COLOR_MAP[sector] || SECTOR_COLOR_MAP.unknown;
}

/**
 * Get gradient colors for a line chart
 */
export function getLineGradientColors(baseColor: string): {
  border: string;
  background: string;
} {
  return {
    border: baseColor,
    background: baseColor + '20', // 20 = ~12% opacity
  };
}

/**
 * Get positive/negative color based on value
 */
export function getValueColor(value: number): string {
  return value >= 0 ? '#00c853' : '#ff1744';
}

/**
 * Generate array of colors for charts
 */
export function generateChartColors(count: number): string[] {
  const colors = Object.values(SECTOR_COLOR_MAP).filter((c) => c !== '#94a3b8');
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
}

/**
 * Get background color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
