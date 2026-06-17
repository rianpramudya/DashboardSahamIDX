'use client';

import { Clock } from 'lucide-react';
import { formatTime, getRelativeTime } from '@/lib/formatters';
import { t as translate } from '@/lib/i18n';

interface LastUpdatedProps {
  timestamp: Date | null;
  isStale?: boolean;
  className?: string;
  locale?: string;
}

export function LastUpdated({ timestamp, isStale = false, className, locale = 'id' }: LastUpdatedProps) {
  if (!timestamp) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
        <Clock className="w-3 h-3" />
        <span>{translate(locale, 'loading')}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <Clock className={`w-3 h-3 ${isStale ? 'text-amber-400' : 'text-emerald-400'}`} />
      <span className="text-muted-foreground">{translate(locale, 'lastUpdated')}: </span>
      <span className={isStale ? 'text-amber-400' : 'text-foreground'}>
        {getRelativeTime(timestamp, locale)}
      </span>
      {isStale && <span className="text-amber-400/80">({translate(locale, 'stale')})</span>}
    </div>
  );
}
