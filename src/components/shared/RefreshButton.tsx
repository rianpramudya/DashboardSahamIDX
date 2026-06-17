'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t as translate } from '@/lib/i18n';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  className?: string;
  locale?: string;
}

export function RefreshButton({ onRefresh, isRefreshing = false, className, locale = 'id' }: RefreshButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing} className={className}>
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
        transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        <RefreshCw className="w-4 h-4" />
      </motion.div>
      <span className="ml-2 hidden sm:inline">{translate(locale, 'refresh')}</span>
    </Button>
  );
}
