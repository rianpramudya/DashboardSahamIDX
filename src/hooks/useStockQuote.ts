'use client';

// Hook for real-time stock quote
import { useState, useEffect, useCallback, useRef } from 'react';
import type { StockQuote } from '@/types/stock';
import { fetchWithRetry } from '@/lib/api-client';

interface UseStockQuoteOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useStockQuote(
  ticker: string,
  options: UseStockQuoteOptions = {}
) {
  const { autoRefresh = true, refreshInterval = 60000 } = options;

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!ticker) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry(
        `/api/stock/${encodeURIComponent(ticker)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch quote for ${ticker}`);
      }

      const data = await response.json();

      if (!data.success || !data.data?.quote) {
        throw new Error(data.error || 'Failed to fetch quote');
      }

      setQuote(data.data.quote);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchQuote, refreshInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchQuote]);

  const refresh = useCallback(() => {
    fetchQuote();
  }, [fetchQuote]);

  return {
    quote,
    isLoading,
    error,
    refresh,
  };
}
