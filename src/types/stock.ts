// Stock data type definitions

export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  close: number;
  pe: number | null;
  pbv: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number;
  isActive: boolean;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number;
  timestamp: number;
}

export interface WatchlistStock {
  ticker: string;
  name: string;
  sector: string;
  logo?: string;
}

export interface SectorData {
  name: string;
  nameEn: string;
  nameId: string;
  color: string;
  value: number;
  count: number;
}

export interface MarketIndex {
  ticker: string;
  name: string;
  nameEn: string;
  nameId: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface TimeRange {
  label: string;
  labelEn: string;
  labelId: string;
  value: string;
  interval: string;
  range: string;
}

export type SortField = 'ticker' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap' | 'sector';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  sector: string | null;
  search: string;
  minPrice: number | null;
  maxPrice: number | null;
}
