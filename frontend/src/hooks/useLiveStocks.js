import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../services/api';

/**
 * The 15 Equity Arena listings (mirrors backend/prisma/seed.js).
 * Used as an instant first paint and as an offline fallback so the
 * landing page never renders an empty market board.
 */
export const SEED_STOCKS = [
  { symbol: 'ABAL', name: 'AirBharat Airlines', sector: 'Aviation', currentPrice: 7.09, percentChange: 0 },
  { symbol: 'ANAG', name: 'Annapurna Agro', sector: 'Agriculture', currentPrice: 5.42, percentChange: 0 },
  { symbol: 'BPTE', name: 'Bharat PetroEnergy', sector: 'Oil & Gas', currentPrice: 12.4, percentChange: 0 },
  { symbol: 'BRM', name: 'Bazaar Retail Mart', sector: 'Retail', currentPrice: 6.18, percentChange: 0 },
  { symbol: 'BWT', name: 'BharatWave Telecom', sector: 'Telecom', currentPrice: 9.35, percentChange: 0 },
  { symbol: 'GSL', name: 'Ganga Shipping Lines', sector: 'Shipping/Logistics', currentPrice: 8.02, percentChange: 0 },
  { symbol: 'HTM', name: 'Hindustan TurboMotors', sector: 'Automobile', currentPrice: 11.6, percentChange: 0 },
  { symbol: 'IDW', name: 'Indus Defence Works', sector: 'Defense', currentPrice: 14.2, percentChange: 0 },
  { symbol: 'MRI', name: 'Meridian Realty India', sector: 'Real Estate', currentPrice: 10.1, percentChange: 0 },
  { symbol: 'NITI', name: 'Nimbus InfoTech India', sector: 'Technology', currentPrice: 16.8, percentChange: 0 },
  { symbol: 'RTB', name: 'Rashtriya Trust Bank', sector: 'Banking/Finance', currentPrice: 13.5, percentChange: 0 },
  { symbol: 'SANP', name: 'Sanjeevani Pharma', sector: 'Pharmaceuticals', currentPrice: 9.9, percentChange: 0 },
  { symbol: 'SGE', name: 'Surya Green Energy', sector: 'Renewable Energy', currentPrice: 7.75, percentChange: 0 },
  { symbol: 'SGM', name: 'Suvarna Gold Mining', sector: 'Precious Metals', currentPrice: 18.3, percentChange: 0 },
  { symbol: 'SWST', name: 'Swarna Studios', sector: 'Media/Entertainment', currentPrice: 6.6, percentChange: 0 }
];

/**
 * Single-letter mark + sector tint used for each listing's badge tile.
 */
export const SECTOR_THEME = {
  'Aviation': { from: 'from-sky-500/25', text: 'text-sky-300', ring: 'ring-sky-400/30' },
  'Agriculture': { from: 'from-lime-500/25', text: 'text-lime-300', ring: 'ring-lime-400/30' },
  'Oil & Gas': { from: 'from-amber-500/25', text: 'text-amber-300', ring: 'ring-amber-400/30' },
  'Retail': { from: 'from-pink-500/25', text: 'text-pink-300', ring: 'ring-pink-400/30' },
  'Telecom': { from: 'from-violet-500/25', text: 'text-violet-300', ring: 'ring-violet-400/30' },
  'Shipping/Logistics': { from: 'from-cyan-500/25', text: 'text-cyan-300', ring: 'ring-cyan-400/30' },
  'Automobile': { from: 'from-red-500/25', text: 'text-red-300', ring: 'ring-red-400/30' },
  'Defense': { from: 'from-slate-400/25', text: 'text-slate-200', ring: 'ring-slate-300/30' },
  'Real Estate': { from: 'from-orange-500/25', text: 'text-orange-300', ring: 'ring-orange-400/30' },
  'Technology': { from: 'from-blue-500/25', text: 'text-blue-300', ring: 'ring-blue-400/30' },
  'Banking/Finance': { from: 'from-indigo-500/25', text: 'text-indigo-300', ring: 'ring-indigo-400/30' },
  'Pharmaceuticals': { from: 'from-teal-500/25', text: 'text-teal-300', ring: 'ring-teal-400/30' },
  'Renewable Energy': { from: 'from-emerald-500/25', text: 'text-emerald-300', ring: 'ring-emerald-400/30' },
  'Precious Metals': { from: 'from-yellow-500/25', text: 'text-yellow-300', ring: 'ring-yellow-400/30' },
  'Media/Entertainment': { from: 'from-fuchsia-500/25', text: 'text-fuchsia-300', ring: 'ring-fuchsia-400/30' }
};

export function sectorTheme(sector) {
  return SECTOR_THEME[sector] || { from: 'from-blue-500/25', text: 'text-blue-300', ring: 'ring-blue-400/30' };
}

/**
 * Polls the public GET /stocks endpoint so the landing page shows the same
 * prices the trading floor is seeing. Falls back to SEED_STOCKS if the
 * backend is unreachable (e.g. a statically hosted preview).
 */
export function useLiveStocks(intervalMs = 5000) {
  const [stocks, setStocks] = useState(SEED_STOCKS);
  const [isLive, setIsLive] = useState(false);
  const previousPrices = useRef({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch('/stocks');
        if (cancelled || !Array.isArray(data) || data.length === 0) return;

        setStocks((prev) => {
          // Remember the prior price so rows can flash green/red on change
          const map = {};
          prev.forEach((s) => { map[s.symbol] = s.currentPrice; });
          previousPrices.current = map;
          return data;
        });
        setIsLive(true);
      } catch {
        if (!cancelled) setIsLive(false);
      }
    }

    load();
    const timer = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return { stocks, isLive, previousPrices: previousPrices.current };
}

/** Market-wide index value derived from the 15 listings. */
export function useArenaIndex(stocks) {
  const total = stocks.reduce((sum, s) => sum + (s.currentPrice || 0), 0);
  const base = stocks.reduce((sum, s) => sum + (s.basePrice || s.currentPrice || 0), 0);
  const value = Math.round(total * 100) / 100;
  const change = base > 0 ? Math.round(((total - base) / base) * 10000) / 100 : 0;
  return { value, change, absolute: Math.round((total - base) * 100) / 100 };
}
