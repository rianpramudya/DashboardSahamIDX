// API client for Yahoo Finance proxy
import { API_TIMEOUT, API_RETRY_COUNT, API_RETRY_DELAY } from './constants';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Fetch with retry logic and exponential backoff
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = API_RETRY_COUNT, retryDelay = API_RETRY_DELAY, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Fetch failed after retries');
}

/**
 * Get stock history data
 */
export async function getStockHistory(
  ticker: string,
  range: string = '1mo',
  interval: string = '1d'
): Promise<{
  timestamps: number[];
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
  volumes: number[];
}> {
  const response = await fetchWithRetry(
    `/api/stock/${encodeURIComponent(ticker)}?range=${range}&interval=${interval}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch history for ${ticker}`);
  }

  const data = await response.json();

  if (!data.success || !data.data?.history) {
    throw new Error(data.error || 'Invalid response format');
  }

  const history = data.data.history;
  return {
    timestamps: history.map((h: { date: string }) => new Date(h.date).getTime() / 1000),
    opens: history.map((h: { open: number }) => h.open),
    highs: history.map((h: { high: number }) => h.high),
    lows: history.map((h: { low: number }) => h.low),
    closes: history.map((h: { close: number }) => h.close),
    volumes: history.map((h: { volume: number }) => h.volume),
  };
}

/**
 * Get batch stock quotes
 */
export async function getBatchQuotes(tickers: string[]): Promise<{
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  name: string;
  sector: string;
}[]> {
  const response = await fetchWithRetry('/api/stock/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickers }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch batch quotes');
  }

  const data = await response.json();

  if (!data.success || !data.data?.stocks) {
    throw new Error(data.error || 'Invalid response format');
  }

  return data.data.stocks;
}

/**
 * Get single stock quote
 */
export async function getStockQuote(ticker: string): Promise<{
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  name: string;
  sector: string;
  marketCap: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number;
}> {
  const response = await fetchWithRetry(
    `/api/stock/${encodeURIComponent(ticker)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${ticker}`);
  }

  const data = await response.json();

  if (!data.success || !data.data?.quote) {
    throw new Error(data.error || 'Invalid response format');
  }

  return data.data.quote;
}
