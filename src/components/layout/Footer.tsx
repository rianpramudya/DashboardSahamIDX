'use client';

import { Activity, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';
import { t as translate } from '@/lib/i18n';

interface FooterProps {
  locale?: string;
}

export function Footer({ locale = 'id' }: FooterProps) {
  return (
    <footer className="hidden md:block border-t border-border/50 bg-muted/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>IDX Dashboard v1.0</span>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-lg">
            {translate(locale, 'footer')}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="https://finance.yahoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-cyan-400 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Yahoo Finance
            </Link>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="w-3 h-3 text-red-400" />
              Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
