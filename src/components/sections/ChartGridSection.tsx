'use client';

import { motion } from 'framer-motion';
import { BarChart3, PieChart, Activity, ScatterChart as ScatterIcon } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TopMoversChart } from '@/components/charts/TopMoversChart';
import { SectorChart } from '@/components/charts/SectorChart';
import { VolumeChart } from '@/components/charts/VolumeChart';
import { ScatterChart } from '@/components/charts/ScatterChart';
import { useStockBatch } from '@/hooks/useStockBatch';
import { WATCHLIST_TICKERS } from '@/data/watchlist';
import { t as translate } from '@/lib/i18n';

interface ChartGridSectionProps {
  locale?: string;
}

export function ChartGridSection({ locale = 'id' }: ChartGridSectionProps) {
  const { stocks, isLoading } = useStockBatch(WATCHLIST_TICKERS);

  const charts = [
    { title: translate(locale, 'topMovers'), subtitle: 'Gainers & Losers', icon: BarChart3, component: <TopMoversChart stocks={stocks} isLoading={isLoading} height={300} /> },
    { title: translate(locale, 'sectorDistribution'), subtitle: 'By Market Cap', icon: PieChart, component: <SectorChart stocks={stocks} isLoading={isLoading} height={300} locale={locale} /> },
    { title: translate(locale, 'volumeAnalysis'), subtitle: 'Highest Volume', icon: Activity, component: <VolumeChart stocks={stocks} isLoading={isLoading} height={300} /> },
    { title: translate(locale, 'volatilityAnalysis'), subtitle: 'Volume vs Change', icon: ScatterIcon, component: <ScatterChart stocks={stocks} isLoading={isLoading} height={300} /> },
  ];

  return (
    <section className="px-4 md:px-6 lg:px-8">
      <SectionHeader title={translate(locale, 'chartGrid')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {charts.map((chart, index) => (
          <motion.div
            key={chart.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <chart.icon className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-semibold">{chart.title}</h3>
                  <p className="text-xs text-muted-foreground">{chart.subtitle}</p>
                </div>
              </div>
              {chart.component}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
