'use client';

import { Database, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import Link from 'next/link';
import { t as translate } from '@/lib/i18n';

interface DataSourceSectionProps {
  locale?: string;
}

export function DataSourceSection({ locale = 'id' }: DataSourceSectionProps) {
  return (
    <section className="px-4 md:px-6 lg:px-8">
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
            <Database className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">{translate(locale, 'dataSource')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{translate(locale, 'dataDescription')}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{translate(locale, 'refreshRate')}: 60s</span>
              <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />{translate(locale, 'cacheDuration')}: 60s</span>
              <Link href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors">
                <ExternalLink className="w-3 h-3" />Yahoo Finance
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
