'use client';

// Count-up animation hook
import { useState, useEffect, useRef, useCallback } from 'react';
import { easeOutQuart } from '@/lib/animation-utils';

interface UseCountUpOptions {
  duration?: number;
  delay?: number;
  decimals?: number;
  startOnMount?: boolean;
}

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
) {
  const {
    duration = 2000,
    delay = 0,
    decimals = 0,
    startOnMount = true,
  } = options;

  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current - delay;

      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = easedProgress * end;

      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(Number(end.toFixed(decimals)));
        setIsComplete(true);
      }
    },
    [end, duration, delay, decimals]
  );

  const start = useCallback(() => {
    startTimeRef.current = null;
    setIsComplete(false);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const reset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setCount(0);
    setIsComplete(false);
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (startOnMount) {
      start();
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [startOnMount, start]);

  return { count, isComplete, start, reset };
}
