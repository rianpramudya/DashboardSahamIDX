'use client';

// Pulsing live indicator dot
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  isLive?: boolean;
  className?: string;
  label?: string;
}

export function LiveIndicator({ isLive = true, className, label }: LiveIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative flex h-2.5 w-2.5">
        {isLive && (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <motion.span
              className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        )}
        {!isLive && (
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted-foreground/50" />
        )}
      </span>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
