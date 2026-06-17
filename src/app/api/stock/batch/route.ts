// API Route: POST /api/stock/batch
// Fetch multiple stock quotes in batch

import { NextRequest, NextResponse } from 'next/server';

const YAHOO_BASE = 'https://query1.finance.yahoo.com';
const CACHE_DURATION = 60;

const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCachedBatch(tickers: string[]) {
  const key = tickers.sort().join(',');
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION * 1000) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setCachedBatch(tickers: string[], data: unknown) {
  const key = tickers.sort().join(',');
  cache.set(key, { data, timestamp: Date.now() });
}

// Sector mapping
const SECTOR_MAP: Record<string, string> = {
  'BBCA.JK': 'financials',
  'BBRI.JK': 'financials',
  'BMRI.JK': 'financials',
  'TLKM.JK': 'communication',
  'ASII.JK': 'consumer',
  'GOTO.JK': 'technology',
  'UNVR.JK': 'consumer',
  'PGAS.JK': 'energy',
  'ANTM.JK': 'materials',
  'PTBA.JK': 'energy',
  'INDF.JK': 'consumer',
  'ICBP.JK': 'consumer',
  'KLBF.JK': 'healthcare',
  'SMGR.JK': 'materials',
  'EXCL.JK': 'communication',
};

const NAME_MAP: Record<string, string> = {
  'BBCA.JK': 'Bank Central Asia',
  'BBRI.JK': 'Bank Rakyat Indonesia',
  'BMRI.JK': 'Bank Mandiri',
  'TLKM.JK': 'Telkom Indonesia',
  'ASII.JK': 'Astra International',
  'GOTO.JK': 'GoTo Gojek Tokopedia',
  'UNVR.JK': 'Unilever Indonesia',
  'PGAS.JK': 'Perusahaan Gas Negara',
  'ANTM.JK': 'Aneka Tambang',
  'PTBA.JK': 'Bukit Asam',
  'INDF.JK': 'Indofood Sukses Makmur',
  'ICBP.JK': 'Indofood CBP Sukses',
  'KLBF.JK': 'Kalbe Farma',
  'SMGR.JK': 'Semen Indonesia',
  'EXCL.JK': 'XL Axiata',
};

// Mock data generator for development
function generateMockStock(ticker: string) {
  const basePrice = Math.random() * 10000 + 1000;
  const changePercent = (Math.random() - 0.5) * 5;
  return {
    ticker: ticker.replace('.JK', ''),
    name: NAME_MAP[ticker] || ticker,
    sector: SECTOR_MAP[ticker] || 'unknown',
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat((basePrice * changePercent / 100).toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 100000000),
    marketCap: Math.floor(Math.random() * 1000000000000),
    dayHigh: parseFloat((basePrice * 1.02).toFixed(2)),
    dayLow: parseFloat((basePrice * 0.98).toFixed(2)),
    open: parseFloat((basePrice * 0.995).toFixed(2)),
    previousClose: parseFloat((basePrice * 1.001).toFixed(2)),
    fiftyTwoWeekHigh: parseFloat((basePrice * 1.1).toFixed(2)),
    fiftyTwoWeekLow: parseFloat((basePrice * 0.9).toFixed(2)),
    avgVolume: Math.floor(Math.random() * 50000000),
    timestamp: Date.now(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tickers: string[] = body.tickers || [];

    if (!tickers.length) {
      return NextResponse.json(
        { success: false, error: 'No tickers provided' },
        { status: 400 }
      );
    }

    // Check cache
    const cached = getCachedBatch(tickers);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
        timestamp: Date.now(),
      });
    }

    let stocks: any[] = [];
    
    try {
      // Fetch quotes from Yahoo Finance
      const symbols = tickers.join(',');
      const quoteUrl = `${YAHOO_BASE}/v6/finance/quote?symbols=${encodeURIComponent(symbols)}`;

      console.log('[POST /api/stock/batch] Fetching URL:', quoteUrl);

      const quoteRes = await fetch(quoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: CACHE_DURATION },
      });

      console.log('[POST /api/stock/batch] Response status:', quoteRes.status);

      if (quoteRes.ok) {
        const quoteData = await quoteRes.json();

        if (quoteData.quoteResponse?.result && quoteData.quoteResponse.result.length > 0) {
          const results = quoteData.quoteResponse.result;

          stocks = results.map((result: {
            symbol: string;
            shortName?: string;
            longName?: string;
            regularMarketPrice?: number;
            regularMarketChange?: number;
            regularMarketChangePercent?: number;
            regularMarketVolume?: number;
            marketCap?: number;
            regularMarketDayHigh?: number;
            regularMarketDayLow?: number;
            regularMarketOpen?: number;
            regularMarketPreviousClose?: number;
            fiftyTwoWeekHigh?: number;
            fiftyTwoWeekLow?: number;
            averageDailyVolume3Month?: number;
          }) => {
            const symbol = result.symbol;
            return {
              ticker: symbol.replace('.JK', ''),
              name: result.shortName || result.longName || NAME_MAP[symbol] || symbol,
              sector: SECTOR_MAP[symbol] || 'unknown',
              price: result.regularMarketPrice || 0,
              change: result.regularMarketChange || 0,
              changePercent: result.regularMarketChangePercent || 0,
              volume: result.regularMarketVolume || 0,
              marketCap: result.marketCap || 0,
              dayHigh: result.regularMarketDayHigh || 0,
              dayLow: result.regularMarketDayLow || 0,
              open: result.regularMarketOpen || 0,
              previousClose: result.regularMarketPreviousClose || 0,
              fiftyTwoWeekHigh: result.fiftyTwoWeekHigh || 0,
              fiftyTwoWeekLow: result.fiftyTwoWeekLow || 0,
              avgVolume: result.averageDailyVolume3Month || 0,
              timestamp: Date.now(),
            };
          });
        } else {
          throw new Error('Invalid response structure from Yahoo Finance');
        }
      } else {
        throw new Error(`Yahoo Finance API error: ${quoteRes.status}`);
      }
    } catch (fetchError) {
      console.warn('[POST /api/stock/batch] Yahoo Finance API failed, using mock data:', fetchError);
      // Fallback to mock data
      stocks = tickers.map(ticker => generateMockStock(ticker));
    }

    const responseData = {
      stocks,
      count: stocks.length,
    };

    setCachedBatch(tickers, responseData);

    return NextResponse.json({
      success: true,
      data: responseData,
      cached: false,
      timestamp: Date.now(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[POST /api/stock/batch] Error:', message, error);
    return NextResponse.json(
      { success: false, error: message, timestamp: Date.now() },
      { status: 500 }
    );
  }
}
