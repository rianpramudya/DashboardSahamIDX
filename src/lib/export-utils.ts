// Export utilities for CSV/JSON download

/**
 * Convert data to CSV string
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) return '';

  const keys = headers ? headers.map((h) => h.key as string) : Object.keys(data[0]);
  const headerRow = headers
    ? headers.map((h) => h.label).join(',')
    : keys.join(',');

  const rows = data.map((row) =>
    keys
      .map((key) => {
        const value = row[key];
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // Escape values containing commas or quotes
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',')
  );

  return [headerRow, ...rows].join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download data as JSON file
 */
export function downloadJSON<T>(data: T, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy data to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Export stock data as CSV with proper headers
 */
export function exportStockData(stocks: Array<{
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}>): void {
  const headers = [
    { key: 'ticker' as const, label: 'Ticker' },
    { key: 'name' as const, label: 'Company Name' },
    { key: 'sector' as const, label: 'Sector' },
    { key: 'price' as const, label: 'Price (IDR)' },
    { key: 'change' as const, label: 'Change (IDR)' },
    { key: 'changePercent' as const, label: 'Change %' },
    { key: 'volume' as const, label: 'Volume' },
    { key: 'marketCap' as const, label: 'Market Cap (IDR)' },
  ];

  const date = new Date().toISOString().split('T')[0];
  downloadCSV(stocks, `idx-stocks-${date}`, headers);
}

/**
 * Export stock history as CSV
 */
export function exportStockHistory(
  ticker: string,
  history: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>
): void {
  const headers = [
    { key: 'date' as const, label: 'Date' },
    { key: 'open' as const, label: 'Open' },
    { key: 'high' as const, label: 'High' },
    { key: 'low' as const, label: 'Low' },
    { key: 'close' as const, label: 'Close' },
    { key: 'volume' as const, label: 'Volume' },
  ];

  downloadCSV(history, `${ticker}-history`, headers);
}
