'use client';

// Hook for batch fetching multiple stock quotes
import { useState, useEffect, useCallback, useRef } from 'react';
import type { StockQuote } from '@/types/stock';
import { fetchWithRetry } from '@/lib/api-client';

interface UseStockBatchOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useStockBatch(
  tickers: string[],
  options: UseStockBatchOptions = {}
) {
  const { autoRefresh = true, refreshInterval = 60000 } = options;

  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBatch = useCallback(async () => {
    if (!tickers.length) return;

    setIsLoading(true);
    setError(null);

    try {
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
        throw new Error(data.error || 'Failed to fetch batch quotes');
      }

      setStocks(data.data.stocks);
      setIsStale(data.data.cached || false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  }, [tickers]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchBatch, refreshInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchBatch]);

  const refresh = useCallback(() => {
    fetchBatch();
  }, [fetchBatch]);

  // Derived data
  const topGainers = [...stocks]
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = [...stocks]
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  const volumeLeaders = [...stocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  const totalMarketCap = stocks.reduce((sum, s) => sum + (s.marketCap || 0), 0);

  return {
    stocks,
    isLoading,
    error,
    isStale,
    refresh,
    topGainers,
    topLosers,
    volumeLeaders,
    totalMarketCap,
  };
}
