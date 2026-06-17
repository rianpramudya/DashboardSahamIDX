'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Info,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/stocks', label: 'Saham' },
  { href: '/stats', label: 'Statistik' },
  { href: '/about', label: 'Tentang' },
];

interface MobileNavProps {
  locale: string;
}

export function MobileNav({ locale }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around h-16 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === `/${locale}${item.href}` || pathname === item.href;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-cyan-400' : 'text-muted-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-400 rounded-full"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              {item.href === '/' && <LayoutDashboard className="w-5 h-5 mb-1" />}
              {item.href === '/stocks' && <TrendingUp className="w-5 h-5 mb-1" />}
              {item.href === '/stats' && <BarChart3 className="w-5 h-5 mb-1" />}
              {item.href === '/about' && <Info className="w-5 h-5 mb-1" />}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
