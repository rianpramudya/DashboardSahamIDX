'use client';

// Trend indicator with arrow and percentage
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  value: number;
  showIcon?: boolean;
  showPercent?: boolean;
  decimals?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrendIndicator({
  value,
  showIcon = true,
  showPercent = true,
  decimals = 2,
  size = 'sm',
  className,
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const sizeClasses = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        isPositive && 'text-emerald-500',
        isNegative && 'text-red-500',
        isNeutral && 'text-muted-foreground',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp className={iconSizes[size]} />}
          {isNegative && <TrendingDown className={iconSizes[size]} />}
          {isNeutral && <Minus className={iconSizes[size]} />}
        </>
      )}
      {showPercent && (
        <span>
          {isPositive ? '+' : ''}
          {value.toFixed(decimals)}%
        </span>
      )}
    </span>
  );
}
