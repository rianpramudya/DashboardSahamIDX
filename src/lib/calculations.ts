// Stock calculation utilities

/**
 * Calculate percentage change
 */
export function calculateChangePercent(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

/**
 * Calculate RSI (Relative Strength Index)
 */
export function calculateRSI(data: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    if (i <= period) {
      avgGain += gain / period;
      avgLoss += loss / period;
      if (i === period) {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      } else {
        rsi.push(NaN);
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    }
  }

  return rsi;
}

/**
 * Calculate simple moving average for a specific period
 */
export function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return 0;
  const slice = data.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

/**
 * Calculate price volatility (standard deviation)
 */
export function calculateVolatility(data: number[]): number {
  if (data.length < 2) return 0;
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map((v) => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calculate price change from open
 */
export function calculateDayChange(current: number, open: number): number {
  return current - open;
}

/**
 * Calculate day change percent
 */
export function calculateDayChangePercent(current: number, open: number): number {
  if (open === 0) return 0;
  return ((current - open) / open) * 100;
}

/**
 * Determine trend direction
 */
export function getTrendDirection(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0.5) return 'up';
  if (change < -0.5) return 'down';
  return 'neutral';
}

/**
 * Calculate correlation between two arrays
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);

  const sumX = xSlice.reduce((a, b) => a + b, 0);
  const sumY = ySlice.reduce((a, b) => a + b, 0);
  const sumXY = xSlice.reduce((sum, xi, i) => sum + xi * ySlice[i], 0);
  const sumX2 = xSlice.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = ySlice.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Get top N gainers from stock list
 */
export function getTopGainers<T extends { changePercent: number }>(
  stocks: T[],
  count: number = 5
): T[] {
  return [...stocks]
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, count);
}

/**
 * Get top N losers from stock list
 */
export function getTopLosers<T extends { changePercent: number }>(
  stocks: T[],
  count: number = 5
): T[] {
  return [...stocks]
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, count);
}

/**
 * Get volume leaders
 */
export function getVolumeLeaders<T extends { volume: number }>(
  stocks: T[],
  count: number = 5
): T[] {
  return [...stocks].sort((a, b) => b.volume - a.volume).slice(0, count);
}
