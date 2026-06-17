// API Route: GET /api/stock/{ticker}?range=&interval=
// Proxy to Yahoo Finance for stock data

import { NextRequest, NextResponse } from 'next/server';

const YAHOO_BASE = 'https://query1.finance.yahoo.com';
const CACHE_DURATION = 60;

// In-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCacheKey(ticker: string, range: string, interval: string): string {
  return `${ticker}:${range}:${interval}`;
}

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION * 1000) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setCachedData(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

interface YahooChartResult {
  meta: {
    currency: string;
    symbol: string;
    regularMarketPrice: number;
    chartPreviousClose: number;
    previousClose: number;
  };
  timestamp: number[];
  indicators: {
    quote: Array<{
      open: (number | null)[];
      high: (number | null)[];
      low: (number | null)[];
      close: (number | null)[];
      volume: (number | null)[];
    }>;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = decodeURIComponent(params.ticker);
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '1mo';
  const interval = searchParams.get('interval') || '1d';

  const cacheKey = getCacheKey(ticker, range, interval);
  const cached = getCachedData(cacheKey);

  if (cached) {
    return NextResponse.json({
      success: true,
      data: cached,
      cached: true,
      timestamp: Date.now(),
    });
  }

  try {
    // Fetch chart data from Yahoo Finance
    const chartUrl = `${YAHOO_BASE}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}&includeAdjustedClose=true`;

    const chartRes = await fetch(chartUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: CACHE_DURATION },
    });

    if (!chartRes.ok) {
      throw new Error(`Yahoo Finance API error: ${chartRes.status}`);
    }

    const chartData = await chartRes.json();

    if (!chartData.chart?.result?.[0]) {
      throw new Error('No data available for this ticker');
    }

    const result: YahooChartResult = chartData.chart.result[0];
    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const quote = result.indicators.quote[0] || {};

    // Build history array
    const history = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString(),
      open: quote.open?.[i] || 0,
      high: quote.high?.[i] || 0,
      low: quote.low?.[i] || 0,
      close: quote.close?.[i] || 0,
      volume: quote.volume?.[i] || 0,
    })).filter((h: { close: number }) => h.close > 0);

    // Build quote object
    const quoteData = {
      ticker: ticker.replace('.JK', ''),
      name: ticker.replace('.JK', ''),
      sector: '',
      price: meta.regularMarketPrice || meta.previousClose || 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 0,
      dayHigh: 0,
      dayLow: 0,
      open: 0,
      previousClose: meta.previousClose || meta.chartPreviousClose || 0,
      fiftyTwoWeekHigh: 0,
      fiftyTwoWeekLow: 0,
      avgVolume: 0,
      timestamp: Date.now(),
    };

    // Calculate change
    if (quoteData.price && quoteData.previousClose) {
      quoteData.change = quoteData.price - quoteData.previousClose;
      quoteData.changePercent = (quoteData.change / quoteData.previousClose) * 100;
    }

    const responseData = {
      quote: quoteData,
      history,
      meta: {
        currency: meta.currency,
        symbol: meta.symbol,
      },
    };

    setCachedData(cacheKey, responseData);

    return NextResponse.json({
      success: true,
      data: responseData,
      cached: false,
      timestamp: Date.now(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message, timestamp: Date.now() },
      { status: 500 }
    );
  }
}
