'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockBatch } from '@/hooks/useStockBatch';
import { useDebounce } from '@/hooks/useDebounce';
import { WATCHLIST_TICKERS } from '@/data/watchlist';
import { SECTORS } from '@/data/sectors';
import { exportStockData } from '@/lib/export-utils';
import { formatRupiah, formatPercent, formatVolume, formatMarketCap } from '@/lib/formatters';
import { t as translate, getSectorName } from '@/lib/i18n';
import type { SortField, SortDirection } from '@/types/stock';

interface StockTableSectionProps {
  locale?: string;
  showAll?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
}

export function StockTableSection({ locale = 'id', showAll = false, showSearch = false, showFilter = false }: StockTableSectionProps) {
  const { stocks, isLoading } = useStockBatch(WATCHLIST_TICKERS);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('changePercent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const debouncedSearch = useDebounce(search, 300);

  const filteredStocks = useMemo(() => {
    let result = [...stocks];
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((s) => s.ticker.toLowerCase().includes(query) || s.name.toLowerCase().includes(query));
    }
    if (sectorFilter !== 'all') result = result.filter((s) => s.sector === sectorFilter);
    result.sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
    return result;
  }, [stocks, debouncedSearch, sectorFilter, sortField, sortDirection]);

  const displayedStocks = showAll ? filteredStocks : filteredStocks.slice(0, 8);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />;
  };

  return (
    <section className="px-4 md:px-6 lg:px-8">
      <SectionHeader
        title={translate(locale, 'stockTable')}
        action={
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportStockData(stocks)}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{translate(locale, 'export')}</span>
          </Button>
        }
      />

      {(showSearch || showFilter) && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={translate(locale, 'search')} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background/50" />
            </div>
          )}
          {showFilter && (
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={translate(locale, 'filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translate(locale, 'allSectors')}</SelectItem>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector.name} value={sector.name}>{getSectorName(locale, sector.name)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {[
                  { key: 'ticker' as SortField, label: translate(locale, 'ticker'), align: 'left' },
                  { key: 'name' as SortField, label: translate(locale, 'name'), align: 'left' },
                  { key: 'price' as SortField, label: translate(locale, 'price'), align: 'right' },
                  { key: 'changePercent' as SortField, label: translate(locale, 'changePercent'), align: 'right' },
                  { key: 'volume' as SortField, label: translate(locale, 'volume'), align: 'right' },
                  { key: 'marketCap' as SortField, label: translate(locale, 'marketCap'), align: 'right' },
                  { key: 'sector' as SortField, label: translate(locale, 'sector'), align: 'left' },
                ].map((col) => (
                  <th key={col.key} className={`px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors ${col.align === 'right' ? 'text-right' : 'text-left'}`} onClick={() => handleSort(col.key)}>
                    <span className="inline-flex items-center gap-1">{col.label}<SortIcon field={col.key} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    {Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : (
                displayedStocks.map((stock, index) => (
                  <motion.tr key={stock.ticker} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold">{stock.ticker}</td>
                    <td className="px-4 py-3"><div className="truncate max-w-[120px] md:max-w-[200px]">{stock.name}</div></td>
                    <td className="px-4 py-3 text-right font-medium">{formatRupiah(stock.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatPercent(stock.changePercent)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatVolume(stock.volume)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatMarketCap(stock.marketCap)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted">{getSectorName(locale, stock.sector)}</span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </section>
  );
}
