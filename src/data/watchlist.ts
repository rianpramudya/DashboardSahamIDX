// 15 Indonesian Blue Chip Stocks Watchlist
import type { WatchlistStock } from '@/types/stock';

export const WATCHLIST: WatchlistStock[] = [
  { ticker: 'BBCA', name: 'Bank Central Asia', sector: 'financials' },
  { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'financials' },
  { ticker: 'BMRI', name: 'Bank Mandiri', sector: 'financials' },
  { ticker: 'TLKM', name: 'Telkom Indonesia', sector: 'communication' },
  { ticker: 'ASII', name: 'Astra International', sector: 'consumer' },
  { ticker: 'GOTO', name: 'GoTo Gojek Tokopedia', sector: 'technology' },
  { ticker: 'UNVR', name: 'Unilever Indonesia', sector: 'consumer' },
  { ticker: 'PGAS', name: 'Perusahaan Gas Negara', sector: 'energy' },
  { ticker: 'ANTM', name: 'Aneka Tambang', sector: 'materials' },
  { ticker: 'PTBA', name: 'Bukit Asam', sector: 'energy' },
  { ticker: 'INDF', name: 'Indofood Sukses Makmur', sector: 'consumer' },
  { ticker: 'ICBP', name: 'Indofood CBP Sukses', sector: 'consumer' },
  { ticker: 'KLBF', name: 'Kalbe Farma', sector: 'healthcare' },
  { ticker: 'SMGR', name: 'Semen Indonesia', sector: 'materials' },
  { ticker: 'EXCL', name: 'XL Axiata', sector: 'communication' },
];

export const WATCHLIST_TICKERS = WATCHLIST.map((s) => `${s.ticker}.JK`);

export const IHSG_TICKER = '^JKSE';
export const LQ45_TICKER = '^LQ45';
export const IDX30_TICKER = '^IDX30';

export const getStockByTicker = (ticker: string): WatchlistStock | undefined => {
  const cleanTicker = ticker.replace('.JK', '');
  return WATCHLIST.find((s) => s.ticker === cleanTicker);
};

export const getSectorByTicker = (ticker: string): string => {
  const stock = getStockByTicker(ticker);
  return stock?.sector || 'unknown';
};
