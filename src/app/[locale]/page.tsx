import { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { MarketOverviewSection } from '@/components/sections/MarketOverviewSection';
import { TopMoversSection } from '@/components/sections/TopMoversSection';
import { ChartGridSection } from '@/components/sections/ChartGridSection';
import { StockTableSection } from '@/components/sections/StockTableSection';
import { DataSourceSection } from '@/components/sections/DataSourceSection';

export const metadata: Metadata = {
  title: 'Dashboard - IDX Dashboard',
  description: 'Real-time Indonesian Stock Market visualization dashboard',
};

interface DashboardPageProps {
  params: { locale: string };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  return (
    <div className="space-y-8 md:space-y-12">
      <HeroSection locale={params.locale} />
      <MarketOverviewSection locale={params.locale} />
      <TopMoversSection locale={params.locale} />
      <ChartGridSection locale={params.locale} />
      <StockTableSection locale={params.locale} />
      <DataSourceSection locale={params.locale} />
    </div>
  );
}
