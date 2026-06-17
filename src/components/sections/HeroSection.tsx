'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ParticleBackground } from '@/components/animations/ParticleBackground';
import { GradientOrbit } from '@/components/animations/GradientOrbit';
import { t as translate } from '@/lib/i18n';

interface HeroSectionProps {
  locale?: string;
}

export function HeroSection({ locale = 'id' }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[50vh] md:min-h-[60vh] flex items-center justify-center">
      <ParticleBackground count={20} />
      <GradientOrbit />

      <div className="relative z-10 text-center px-4 py-12 md:py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            {translate(locale, 'realtimeData')}
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {translate(locale, 'heroTitle')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {translate(locale, 'heroSubtitle')}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25" asChild>
              <Link href={`/${locale}/stocks`}>
                <TrendingUp className="w-4 h-4" />
                {translate(locale, 'exploreStocks')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href={`/${locale}/stats`}>
                <BarChart3 className="w-4 h-4" />
                {translate(locale, 'exploreStats')}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto"
        >
          {[
            { label: locale === 'id' ? 'Saham' : 'Stocks', value: '15' },
            { label: locale === 'id' ? 'Indeks' : 'Indices', value: '3' },
            { label: locale === 'id' ? 'Sektor' : 'Sectors', value: '7' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
