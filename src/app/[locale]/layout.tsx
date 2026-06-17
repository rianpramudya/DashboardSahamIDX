import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeProvider } from '@/components/ThemeProvider';
import '@/styles/globals.css';
import '@/styles/animations.css';
import '@/styles/glassmorphism.css';
import '@/styles/scrollbar.css';
import '@/styles/chart-theme.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'IDX Dashboard - Indonesian Stock Market',
  description: 'Real-time visualization dashboard for Indonesian stock market data',
  keywords: ['IDX', 'Indonesian Stock Exchange', 'Saham Indonesia', 'IHSG', 'Stock Dashboard'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0e27',
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'id' }];
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale;
  if (!['en', 'id'].includes(locale)) notFound();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Navbar locale={locale} />
            <main className="flex-1 pt-16 md:pt-20 pb-20 md:pb-8">
              {children}
            </main>
            <Footer locale={locale} />
            <MobileNav locale={locale} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
