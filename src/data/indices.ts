// Indonesian Stock Market Indices
import type { MarketIndex } from '@/types/stock';

export const MARKET_INDICES: MarketIndex[] = [
  {
    ticker: '^JKSE',
    name: 'IHSG',
    nameEn: 'Composite Index',
    nameId: 'Indeks Harga Saham Gabungan',
    value: 0,
    change: 0,
    changePercent: 0,
  },
  {
    ticker: '^LQ45',
    name: 'LQ45',
    nameEn: 'LQ45 Index',
    nameId: 'Indeks LQ45',
    value: 0,
    change: 0,
    changePercent: 0,
  },
  {
    ticker: '^IDX30',
    name: 'IDX30',
    nameEn: 'IDX30 Index',
    nameId: 'Indeks IDX30',
    value: 0,
    change: 0,
    changePercent: 0,
  },
];

export const TIME_RANGES = [
  { label: '1D', labelEn: '1 Day', labelId: '1 Hari', value: '1d', interval: '5m', range: '1d' },
  { label: '1W', labelEn: '1 Week', labelId: '1 Minggu', value: '1w', interval: '15m', range: '5d' },
  { label: '1M', labelEn: '1 Month', labelId: '1 Bulan', value: '1m', interval: '1d', range: '1mo' },
  { label: '3M', labelEn: '3 Months', labelId: '3 Bulan', value: '3m', interval: '1d', range: '3mo' },
  { label: '6M', labelEn: '6 Months', labelId: '6 Bulan', value: '6m', interval: '1d', range: '6mo' },
  { label: '1Y', labelEn: '1 Year', labelId: '1 Tahun', value: '1y', interval: '1wk', range: '1y' },
];

export const MARKET_HOURS = {
  open: '09:00',
  close: '15:00',
  timezone: 'Asia/Jakarta',
  preOpen: '08:30',
  postClose: '15:30',
};

export const isMarketOpen = (): boolean => {
  const now = new Date();
  const jakartaTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  const [hour, minute] = jakartaTime.split(':').map(Number);
  const timeDecimal = hour + minute / 60;

  // Market open: 9:00 - 15:00 WIB, Monday - Friday
  const day = now.getDay();
  if (day === 0 || day === 6) return false;

  return timeDecimal >= 9.0 && timeDecimal < 15.0;
};
