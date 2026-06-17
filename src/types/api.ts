// API response type definitions

import type { StockData, StockHistory, StockQuote } from './stock';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: number;
  cached?: boolean;
}

export interface StockApiResponse {
  ticker: string;
  quote: StockQuote;
  history: StockHistory[];
}

export interface BatchStockResponse {
  stocks: StockQuote[];
  count: number;
}

export interface YahooFinanceChartResponse {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        chartPreviousClose: number;
        previousClose: number;
        scale?: number;
        priceHint: number;
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
    }>;
    error: null | { code: string; description: string };
  };
}

export interface YahooFinanceQuoteResponse {
  quoteResponse: {
    result: Array<{
      symbol: string;
      shortName?: string;
      longName?: string;
      sector?: string;
      regularMarketPrice: number;
      regularMarketChange: number;
      regularMarketChangePercent: number;
      regularMarketVolume: number;
      marketCap?: number;
      regularMarketDayHigh?: number;
      regularMarketDayLow?: number;
      regularMarketOpen?: number;
      regularMarketPreviousClose?: number;
      fiftyTwoWeekHigh?: number;
      fiftyTwoWeekLow?: number;
      averageDailyVolume3Month?: number;
      trailingPE?: number;
      priceToBook?: number;
      dividendYield?: number;
      trailingAnnualDividendYield?: number;
      [key: string]: unknown;
    }>;
    error: null | { code: string; description: string };
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  timestamp: number;
}
