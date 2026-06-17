'use client';

// Hook for auto-refreshing data at intervals
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseRefreshIntervalOptions {
  interval?: number;
  enabled?: boolean;
  onRefresh?: () => void;
}

export function useRefreshInterval(
  refreshFn: () => void | Promise<void>,
  options: UseRefreshIntervalOptions = {}
) {
  const { interval = 60000, enabled = true, onRefresh } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshFn();
      const now = new Date();
      setLastRefresh(now);
      setNextRefresh(new Date(now.getTime() + interval));
      onRefresh?.();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFn, interval, onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    // Initial refresh
    refresh();

    // Set up interval
    intervalRef.current = setInterval(refresh, interval);

    // Countdown timer
    countdownRef.current = setInterval(() => {
      if (lastRefresh) {
        setNextRefresh(new Date(lastRefresh.getTime() + interval));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [enabled, interval, refresh]);

  return {
    isRefreshing,
    lastRefresh,
    nextRefresh,
    refresh,
  };
}
