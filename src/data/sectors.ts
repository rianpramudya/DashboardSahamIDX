// Sector definitions with colors and translations
import type { SectorData } from '@/types/stock';

export const SECTORS: SectorData[] = [
  {
    name: 'financials',
    nameEn: 'Financials',
    nameId: 'Keuangan',
    color: '#00d4ff',
    value: 0,
    count: 3,
  },
  {
    name: 'communication',
    nameEn: 'Communication',
    nameId: 'Komunikasi',
    color: '#7c4dff',
    value: 0,
    count: 2,
  },
  {
    name: 'consumer',
    nameEn: 'Consumer',
    nameId: 'Konsumen',
    color: '#ff6e40',
    value: 0,
    count: 4,
  },
  {
    name: 'technology',
    nameEn: 'Technology',
    nameId: 'Teknologi',
    color: '#00e676',
    value: 0,
    count: 1,
  },
  {
    name: 'energy',
    nameEn: 'Energy',
    nameId: 'Energi',
    color: '#ffd600',
    value: 0,
    count: 2,
  },
  {
    name: 'materials',
    nameEn: 'Materials',
    nameId: 'Material',
    color: '#ff4081',
    value: 0,
    count: 2,
  },
  {
    name: 'healthcare',
    nameEn: 'Healthcare',
    nameId: 'Kesehatan',
    color: '#69f0ae',
    value: 0,
    count: 1,
  },
];

export const getSectorColor = (sectorName: string): string => {
  const sector = SECTORS.find((s) => s.name === sectorName);
  return sector?.color || '#888888';
};

export const getSectorName = (sectorName: string, locale: string = 'en'): string => {
  const sector = SECTORS.find((s) => s.name === sectorName);
  if (!sector) return sectorName;
  return locale === 'id' ? sector.nameId : sector.nameEn;
};

export const getSectorByName = (name: string): SectorData | undefined => {
  return SECTORS.find((s) => s.name === name);
};
