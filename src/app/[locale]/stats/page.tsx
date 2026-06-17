import { Metadata } from 'next';
import { StatsPageContent } from '@/components/sections/StatsPageContent';

export const metadata: Metadata = {
  title: 'Statistics - IDX Dashboard',
  description: 'Daily market statistics for Indonesian stocks',
};

interface StatsPageProps {
  params: { locale: string };
}

export default function StatsPage({ params }: StatsPageProps) {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-6">
      <StatsPageContent locale={params.locale} />
    </div>
  );
}
