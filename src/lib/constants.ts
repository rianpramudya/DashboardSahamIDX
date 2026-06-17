// Application constants

export const APP_NAME = 'IDX Dashboard';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Indonesian Stock Market Dashboard';

export const DEFAULT_LOCALE = 'id';
export const SUPPORTED_LOCALES = ['en', 'id'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_THEME = 'dark';
export const REFRESH_INTERVAL = 60_000; // 60 seconds
export const DEBOUNCE_DELAY = 250;
export const SEARCH_DEBOUNCE = 300;

export const API_TIMEOUT = 10_000; // 10 seconds
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000; // 1 second initial delay

export const CHART_ANIMATION_DURATION = 2000;
export const CHART_ANIMATION_EASING = 'easeOutQuart';
export const CHART_LINE_TENSION = 0.4;
export const CHART_BAR_BORDER_RADIUS = 6;

export const CHART_COLORS = {
  primary: '#00d4ff',
  primaryLight: 'rgba(0, 212, 255, 0.1)',
  primaryTransparent: 'rgba(0, 212, 255, 0.2)',
  positive: '#00c853',
  positiveLight: 'rgba(0, 200, 83, 0.1)',
  positiveTransparent: 'rgba(0, 200, 83, 0.2)',
  negative: '#ff1744',
  negativeLight: 'rgba(255, 23, 68, 0.1)',
  negativeTransparent: 'rgba(255, 23, 68, 0.2)',
  warning: '#ffd600',
  info: '#7c4dff',
  gridDark: 'rgba(255, 255, 255, 0.05)',
  gridLight: 'rgba(0, 0, 0, 0.05)',
  textDark: '#e2e8f0',
  textLight: '#1e293b',
};

export const SECTOR_COLORS = [
  '#00d4ff', // cyan
  '#7c4dff', // purple
  '#ff6e40', // orange
  '#00e676', // green
  '#ffd600', // yellow
  '#ff4081', // pink
  '#69f0ae', // mint
  '#448aff', // blue
];

export const STOCK_TICKERS = [
  'BBCA.JK',
  'BBRI.JK',
  'BMRI.JK',
  'TLKM.JK',
  'ASII.JK',
  'GOTO.JK',
  'UNVR.JK',
  'PGAS.JK',
  'ANTM.JK',
  'PTBA.JK',
  'INDF.JK',
  'ICBP.JK',
  'KLBF.JK',
  'SMGR.JK',
  'EXCL.JK',
];

export const INDICES = {
  IHSG: '^JKSE',
  LQ45: '^LQ45',
  IDX30: '^IDX30',
};

export const CACHE_DURATION = 60; // seconds
