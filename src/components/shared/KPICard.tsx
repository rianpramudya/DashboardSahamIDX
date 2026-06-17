'use client';

// KPI Card with count-up animation
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCountUp } from '@/hooks/useCountUp';
import { formatRupiah, formatNumber, formatVolume } from '@/lib/formatters';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change?: number;
  changePercent?: number;
  format?: 'number' | 'currency' | 'volume' | 'percent';
  isLoading?: boolean;
  delay?: number;
}

export function KPICard({
  title,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  change,
  changePercent,
  format = 'number',
  isLoading = false,
  delay = 0,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const { count, start } = useCountUp(value, {
    duration: 2000,
    delay,
    decimals,
    startOnMount: false,
  });

  useEffect(() => {
    if (!isLoading) {
      start();
    }
  }, [isLoading, start]);

  useEffect(() => {
    setDisplayValue(count);
  }, [count]);

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return formatRupiah(val, true);
      case 'volume':
        return formatVolume(val);
      case 'percent':
        return `${val >= 0 ? '+' : ''}${val.toFixed(decimals)}%`;
      default:
        return formatNumber(val, decimals);
    }
  };

  const getTrendIcon = () => {
    if (change === undefined && changePercent === undefined) return null;
    const val = change ?? changePercent ?? 0;
    if (val > 0) return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (val < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    const val = change ?? changePercent ?? 0;
    if (val > 0) return 'text-emerald-400';
    if (val < 0) return 'text-red-400';
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card className="glass-card p-4 md:p-5 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="will-change-transform"
    >
      <Card className="glass-card p-4 md:p-5 relative overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="space-y-2 relative">
          <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-sm text-muted-foreground">{prefix}</span>
            )}
            <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              {format === 'currency' ? '' : prefix}
              {formatValue(displayValue)}
            </span>
            {suffix && (
              <span className="text-sm text-muted-foreground">{suffix}</span>
            )}
          </div>
          {(change !== undefined || changePercent !== undefined) && (
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>
                {change !== undefined && formatNumber(change, decimals)}
                {changePercent !== undefined && ` (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`}
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
