'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TIME_RANGES } from '@/data/indices';

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimeRangeSelector({ value, onChange, className }: TimeRangeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-1 p-1 rounded-lg bg-muted/50', className)}>
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            'relative px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
            value === range.value ? 'text-cyan-400' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === range.value && (
            <motion.div
              layoutId="timeRangeIndicator"
              className="absolute inset-0 bg-cyan-500/10 rounded-md border border-cyan-500/20"
              transition={{ type: 'spring', duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{range.label}</span>
        </button>
      ))}
    </div>
  );
}
