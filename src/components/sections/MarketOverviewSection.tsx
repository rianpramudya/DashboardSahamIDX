'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { KPICard } from '@/components/shared/KPICard';
import { IHSGChart } from '@/components/charts/IHSGChart';
import { GlassCard } from '@/components/shared/GlassCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TimeRangeSelector } from '@/components/shared/TimeRangeSelector';
import { LiveIndicator } from '@/components/shared/LiveIndicator';
import { RefreshButton } from '@/components/shared/RefreshButton';
import { useStockData } from '@/hooks/useStockData';
import { useStockBatch } from '@/hooks/useStockBatch';
import { IHSG_TICKER, WATCHLIST_TICKERS } from '@/data/watchlist';
import { TIME_RANGES } from '@/data/indices';
import { t as translate } from '@/lib/i18n';

interface MarketOverviewSectionProps {
  locale?: string;
}

export function MarketOverviewSection({ locale = 'id' }: MarketOverviewSectionProps) {
  const [timeRange, setTimeRange] = useState('1m');
  const selectedRange = TIME_RANGES.find((r) => r.value === timeRange) || TIME_RANGES[2];

  const { history: ihsgHistory, isLoading: ihsgLoading, refresh: refreshIhsg } = useStockData(IHSG_TICKER, {
    range: selectedRange.range,
    interval: selectedRange.interval,
  });

  const { stocks, isLoading: stocksLoading, refresh: refreshStocks } = useStockBatch(WATCHLIST_TICKERS);
  const refreshAll = () => { refreshIhsg(); refreshStocks(); };
  const isLoading = ihsgLoading || stocksLoading;

  const kpiData = useMemo(() => {
    if (!stocks.length) return null;
    const gainersCount = stocks.filter((s) => s.changePercent > 0).length;
    const losersCount = stocks.filter((s) => s.changePercent < 0).length;
    const totalVol = stocks.reduce((sum, s) => sum + s.volume, 0);
    const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;
    const totalMarketCap = stocks.reduce((sum, s) => sum + (s.marketCap || 0), 0);
    return { gainersCount, losersCount, totalVol, avgChange, totalMarketCap };
  }, [stocks]);

  return (
    <section className="px-4 md:px-6 lg:px-8">
      <SectionHeader
        title={translate(locale, 'marketOverview')}
        subtitle={translate(locale, 'marketSummary')}
        action={
          <div className="flex items-center gap-3">
            <LiveIndicator isLive={!isLoading} />
            <RefreshButton onRefresh={refreshAll} isRefreshing={isLoading} locale={locale} />
          </div>
        }
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'marketCap')} value={kpiData?.totalMarketCap || 0} format="currency" isLoading={isLoading} delay={0} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'gainers')} value={kpiData?.gainersCount || 0} isLoading={isLoading} delay={100} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'losers')} value={kpiData?.losersCount || 0} isLoading={isLoading} delay={200} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'volume')} value={kpiData?.totalVol || 0} format="volume" isLoading={isLoading} delay={300} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'avgChange')} value={kpiData?.avgChange || 0} format="percent" decimals={2} isLoading={isLoading} delay={400} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <KPICard title={translate(locale, 'active')} value={stocks.length} isLoading={isLoading} delay={500} />
        </motion.div>
      </motion.div>

      <GlassCard className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-lg font-semibold">{translate(locale, 'ihsgChart')}</h3>
              <p className="text-xs text-muted-foreground">Indonesia Composite Index</p>
            </div>
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
        <IHSGChart history={ihsgHistory} isLoading={ihsgLoading} height={350} />
      </GlassCard>
    </section>
  );
}
