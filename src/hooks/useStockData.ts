'use client';

// Hook for fetching stock history data with time range support
import { useState, useEffect, useCallback, useRef } from 'react';
import type { StockHistory } from '@/types/stock';
import { fetchWithRetry } from '@/lib/api-client';

interface UseStockDataOptions {
  range?: string;
  interval?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useStockData(
  ticker: string,
  options: UseStockDataOptions = {}
) {
  const {
    range = '1mo',
    interval = '1d',
    autoRefresh = false,
    refreshInterval = 60000,
  } = options;

  const [history, setHistory] = useState<StockHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!ticker) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry(
        `/api/stock/${encodeURIComponent(ticker)}?range=${range}&interval=${interval}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${ticker}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      setHistory(data.data.history || []);
      setIsStale(data.data.cached || false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  }, [ticker, range, interval]);

  // Fetch on mount and when params change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    history,
    isLoading,
    error,
    isStale,
    refresh,
  };
}
