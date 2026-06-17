import { Metadata } from 'next';
import { StockTableSection } from '@/components/sections/StockTableSection';

export const metadata: Metadata = {
  title: 'Stocks - IDX Dashboard',
  description: 'Indonesian stock movements and details',
};

interface StocksPageProps {
  params: { locale: string };
}

export default function StocksPage({ params }: StocksPageProps) {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-8">
      <StockTableSection locale={params.locale} showAll showSearch showFilter />
    </div>
  );
}
