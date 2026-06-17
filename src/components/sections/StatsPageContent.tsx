'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Activity, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KPICard } from '@/components/shared/KPICard';
import { TopMoversChart } from '@/components/charts/TopMoversChart';
import { SectorChart } from '@/components/charts/SectorChart';
import { useStockBatch } from '@/hooks/useStockBatch';
import { WATCHLIST_TICKERS } from '@/data/watchlist';
import { formatRupiah, formatPercent, formatVolume } from '@/lib/formatters';
import { t as translate, getSectorName } from '@/lib/i18n';

interface StatsPageContentProps {
  locale?: string;
}

export function StatsPageContent({ locale = 'id' }: StatsPageContentProps) {
  const { stocks, isLoading, topGainers, topLosers } = useStockBatch(WATCHLIST_TICKERS);

  const stats = useMemo(() => {
    if (!stocks.length) return null;
    const prices = stocks.map((s) => s.price);
    const changes = stocks.map((s) => s.changePercent);
    const volumes = stocks.map((s) => s.volume);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    const sortedChanges = [...changes].sort((a, b) => a - b);
    const medianChange = sortedChanges[Math.floor(sortedChanges.length / 2)];
    const totalVol = volumes.reduce((a, b) => a + b, 0);
    const gainers = changes.filter((c) => c > 0).length;
    const losers = changes.filter((c) => c < 0).length;
    const unchanged = changes.filter((c) => c === 0).length;

    const sectorChanges = new Map<string, number[]>();
    stocks.forEach((s) => { const arr = sectorChanges.get(s.sector) || []; arr.push(s.changePercent); sectorChanges.set(s.sector, arr); });
    let bestSector = '', worstSector = '', bestAvg = -Infinity, worstAvg = Infinity;
    sectorChanges.forEach((changes, sector) => { const avg = changes.reduce((a, b) => a + b, 0) / changes.length; if (avg > bestAvg) { bestAvg = avg; bestSector = sector; } if (avg < worstAvg) { worstAvg = avg; worstSector = sector; } });

    return { avgPrice, avgChange, medianChange, totalVol, gainers, losers, unchanged, bestSector, worstSector, bestAvg, worstAvg };
  }, [stocks]);

  return (
    <div className="space-y-8">
      <SectionHeader title={translate(locale, 'stats')} subtitle={locale === 'id' ? 'Statistik Pasar Harian' : 'Daily Market Statistics'} />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'avgPrice')} value={stats?.avgPrice || 0} format="currency" isLoading={isLoading} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'medianChange')} value={stats?.medianChange || 0} format="percent" decimals={2} isLoading={isLoading} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'totalVolume')} value={stats?.totalVol || 0} format="volume" isLoading={isLoading} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'avgChange')} value={stats?.avgChange || 0} format="percent" decimals={2} isLoading={isLoading} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6"><BarChart3 className="w-5 h-5 text-cyan-400" /><h3 className="text-lg font-semibold">{translate(locale, 'marketBreadth')}</h3></div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: translate(locale, 'topGainers'), value: stats?.gainers || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: translate(locale, 'topLosers'), value: stats?.losers || 0, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: translate(locale, 'unchanged'), value: stats?.unchanged || 0, color: 'text-muted-foreground', bg: 'bg-muted' },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center`}>
                <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6"><PieChart className="w-5 h-5 text-cyan-400" /><h3 className="text-lg font-semibold">{translate(locale, 'sectorDistribution')}</h3></div>
          <div className="space-y-3">
            {stats && (
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div><div className="text-sm font-medium">{translate(locale, 'bestSector')}</div><div className="text-xs text-muted-foreground">{getSectorName(locale, stats.bestSector)}</div></div>
                  <div className="flex items-center gap-1 text-emerald-400"><ArrowUpRight className="w-4 h-4" />{formatPercent(stats.bestAvg)}</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div><div className="text-sm font-medium">{translate(locale, 'worstSector')}</div><div className="text-xs text-muted-foreground">{getSectorName(locale, stats.worstSector)}</div></div>
                  <div className="flex items-center gap-1 text-red-400"><ArrowDownRight className="w-4 h-4" />{formatPercent(stats.worstAvg)}</div>
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-cyan-400" /><h3 className="text-lg font-semibold">{translate(locale, 'topMovers')}</h3></div>
          <TopMoversChart stocks={stocks} isLoading={isLoading} height={300} />
        </GlassCard>
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4"><PieChart className="w-5 h-5 text-cyan-400" /><h3 className="text-lg font-semibold">{translate(locale, 'sectorDistribution')}</h3></div>
          <SectorChart stocks={stocks} isLoading={isLoading} height={300} locale={locale} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-emerald-400" /><h3 className="text-lg font-semibold text-emerald-400">{translate(locale, 'topGainers')}</h3></div>
          <div className="space-y-2">
            {topGainers.map((stock, i) => (
              <div key={stock.ticker} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5">
                <div className="flex items-center gap-3"><span className="text-sm font-mono text-muted-foreground">#{i + 1}</span><div><div className="font-semibold">{stock.ticker}</div><div className="text-xs text-muted-foreground">{stock.name}</div></div></div>
                <div className="text-right"><div className="font-medium">{formatRupiah(stock.price)}</div><div className="text-xs text-emerald-400 flex items-center gap-1 justify-end"><ArrowUpRight className="w-3 h-3" />{formatPercent(stock.changePercent)}</div></div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4"><TrendingDown className="w-5 h-5 text-red-400" /><h3 className="text-lg font-semibold text-red-400">{translate(locale, 'topLosers')}</h3></div>
          <div className="space-y-2">
            {topLosers.map((stock, i) => (
              <div key={stock.ticker} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5">
                <div className="flex items-center gap-3"><span className="text-sm font-mono text-muted-foreground">#{i + 1}</span><div><div className="font-semibold">{stock.ticker}</div><div className="text-xs text-muted-foreground">{stock.name}</div></div></div>
                <div className="text-right"><div className="font-medium">{formatRupiah(stock.price)}</div><div className="text-xs text-red-400 flex items-center gap-1 justify-end"><ArrowDownRight className="w-3 h-3" />{formatPercent(stock.changePercent)}</div></div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
