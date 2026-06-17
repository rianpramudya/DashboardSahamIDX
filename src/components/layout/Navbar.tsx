'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', labelId: 'Dashboard' },
  { href: '/stocks', label: 'Stocks', labelId: 'Saham' },
  { href: '/stats', label: 'Statistics', labelId: 'Statistik' },
  { href: '/about', label: 'About', labelId: 'Tentang' },
];

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const [theme, setTheme] = useState('dark');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    // Load theme from localStorage
    const saved = localStorage.getItem('idx-theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
      document.documentElement.classList.toggle('light', saved === 'light');
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('idx-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const otherLocale = locale === 'id' ? 'en' : 'id';
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">IDX</span>
              <span className="text-lg md:text-xl font-semibold text-foreground ml-1">Dashboard</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === `/${locale}${item.href}` || pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive ? 'text-cyan-400' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-cyan-500/10 rounded-lg"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {item.href === '/' && <LayoutDashboard className="w-4 h-4" />}
                    {item.href === '/stocks' && <TrendingUp className="w-4 h-4" />}
                    {item.href === '/stats' && <BarChart3 className="w-4 h-4" />}
                    {item.href === '/about' && <Info className="w-4 h-4" />}
                    {locale === 'id' ? item.labelId : item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative w-9 h-9 rounded-lg hover:bg-muted transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5 text-amber-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex items-center gap-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Link href={`/${otherLocale}${pathWithoutLocale}`}>
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">{locale}</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname === `/${locale}${item.href}` || pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {item.href === '/' && <LayoutDashboard className="w-5 h-5" />}
                      {item.href === '/stocks' && <TrendingUp className="w-5 h-5" />}
                      {item.href === '/stats' && <BarChart3 className="w-5 h-5" />}
                      {item.href === '/about' && <Info className="w-5 h-5" />}
                      {locale === 'id' ? item.labelId : item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <Link
                href={`/${otherLocale}${pathWithoutLocale}`}
                className="flex sm:hidden items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
              >
                <Globe className="w-5 h-5" />
                Bahasa: {otherLocale.toUpperCase()}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
