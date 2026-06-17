'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useStockBatch } from '@/hooks/useStockBatch';
import { WATCHLIST_TICKERS } from '@/data/watchlist';
import { formatRupiah, formatPercent } from '@/lib/formatters';
import { t as translate } from '@/lib/i18n';

interface TopMoversSectionProps {
  locale?: string;
}

export function TopMoversSection({ locale = 'id' }: TopMoversSectionProps) {
  const { stocks, isLoading, topGainers, topLosers } = useStockBatch(WATCHLIST_TICKERS);

  const StockList = ({ items, type }: { items: typeof stocks; type: 'gainer' | 'loser' }) => (
    <div className="space-y-2">
      {items.map((stock, index) => (
        <motion.div
          key={stock.ticker}
          initial={{ opacity: 0, x: type === 'gainer' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'gainer' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              <span className="text-xs font-bold">{index + 1}</span>
            </div>
            <div>
              <div className="font-semibold text-sm">{stock.ticker}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-[200px]">{stock.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-sm">{formatRupiah(stock.price)}</div>
            <div className={`flex items-center gap-1 text-xs ${type === 'gainer' ? 'text-emerald-400' : 'text-red-400'}`}>
              {type === 'gainer' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {formatPercent(stock.changePercent)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <section className="px-4 md:px-6 lg:px-8">
        <SectionHeader title={translate(locale, 'topMovers')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <GlassCard key={i} className="p-4 animate-pulse">
              <div className="h-6 w-32 bg-muted rounded mb-4" />
              {Array.from({ length: 5 }).map((_, j) => <div key={j} className="h-16 bg-muted rounded mb-2" />)}
            </GlassCard>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-6 lg:px-8">
      <SectionHeader title={translate(locale, 'topMovers')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-emerald-400">{translate(locale, 'topGainers')}</h3>
          </div>
          <StockList items={topGainers} type="gainer" />
        </GlassCard>
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">{translate(locale, 'topLosers')}</h3>
          </div>
          <StockList items={topLosers} type="loser" />
        </GlassCard>
      </div>
    </section>
  );
}
