'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { isMarketOpen } from '@/data/indices';
import { Clock } from 'lucide-react';
import { t as translate } from '@/lib/i18n';

interface MarketStatusProps {
  locale?: string;
}

export function MarketStatus({ locale = 'id' }: MarketStatusProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(isMarketOpen());
    const interval = setInterval(() => setOpen(isMarketOpen()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="w-3 h-3" />
        ...
      </Badge>
    );
  }

  return (
    <Badge variant={open ? 'success' : 'secondary'} className="gap-1 font-medium">
      <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground'}`} />
      {open ? translate(locale, 'marketOpen') : translate(locale, 'marketClosed')}
    </Badge>
  );
}
