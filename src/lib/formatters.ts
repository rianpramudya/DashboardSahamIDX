// Formatting utilities for currency, percentages, dates, and volumes

/**
 * Format number as Indonesian Rupiah
 */
export function formatRupiah(value: number, compact: boolean = false): string {
  if (compact && Math.abs(value) >= 1_000_000_000_000) {
    return `Rp${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (compact && Math.abs(value) >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (compact && Math.abs(value) >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number as currency without symbol
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage with sign
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format volume with appropriate suffix
 */
export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format market cap in trillions/billions/millions
 */
export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `Rp${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (value >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(1)}M`;
  }
  return formatRupiah(value);
}

/**
 * Format date to locale string
 */
export function formatDate(date: string | Date, locale: string = 'id-ID'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time to locale string
 */
export function formatTime(date: string | Date, locale: string = 'id-ID'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format datetime to locale string
 */
export function formatDateTime(date: string | Date, locale: string = 'id-ID'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format chart date label based on time range
 */
export function formatChartDate(timestamp: number, range: string): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (range === '1d') {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays < 7) {
    return date.toLocaleDateString('id-ID', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays < 90) {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
  return date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
}

/**
 * Add thousand separators
 */
export function addThousandSeparator(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date, locale: string = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');
  if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  return formatDateTime(d, locale === 'id' ? 'id-ID' : 'en-US');
}
