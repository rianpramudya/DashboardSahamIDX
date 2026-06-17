import { Metadata } from 'next';
import { FAQSection } from '@/components/sections/FAQSection';
import { DataSourceSection } from '@/components/sections/DataSourceSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Github, Mail, Database, Code2, Globe, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { t as translate } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'About - IDX Dashboard',
  description: 'Dataset and application information',
};

interface AboutPageProps {
  params: { locale: string };
}

export default function AboutPage({ params }: AboutPageProps) {
  const locale = params.locale;

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">IDX Dashboard</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Comprehensive Indonesian Stock Market visualization with real-time data, beautiful charts, and powerful analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Database, title: 'Real-time Data', desc: 'Live stock data from Yahoo Finance API' },
          { icon: Globe, title: 'Bilingual', desc: 'English & Bahasa Indonesia support' },
          { icon: RefreshCw, title: 'Auto Refresh', desc: 'Automatic data refresh every 60 seconds' },
          { icon: Code2, title: 'Open Source', desc: 'Built with Next.js 14, TypeScript, Tailwind' },
          { icon: Download, title: 'Export Data', desc: 'Download CSV or JSON format' },
          { icon: Github, title: 'Modern Stack', desc: 'Chart.js, Framer Motion, shadcn/ui' },
        ].map((feature, i) => (
          <Card key={i} className="glass-card hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-6 text-center space-y-3">
              <feature.icon className="h-10 w-10 mx-auto text-cyan-400" />
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-cyan-400" />Technology Stack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Chart.js', 'Framer Motion'].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{tech}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-cyan-400" />{translate(locale, 'dataSource')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: locale === 'id' ? 'Saham' : 'Stocks', value: '15' },
              { label: locale === 'id' ? 'Indeks' : 'Indices', value: '3' },
              { label: locale === 'id' ? 'Sektor' : 'Sectors', value: '7' },
              { label: locale === 'id' ? 'Segar' : 'Refresh', value: '60s' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-cyan-400">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">All data is sourced from Yahoo Finance. This application is for educational purposes only.</p>
        </CardContent>
      </Card>

      <FAQSection />

      <Card className="glass-card">
        <CardContent className="p-6 text-center space-y-4">
          <Mail className="h-10 w-10 mx-auto text-cyan-400" />
          <h3 className="text-xl font-semibold">Questions or Feedback?</h3>
          <p className="text-muted-foreground">This is an open-source project. Feel free to contribute or report issues.</p>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />View on GitHub</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
