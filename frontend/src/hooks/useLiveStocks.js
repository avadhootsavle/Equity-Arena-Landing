import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../services/api';

/**
 * The 15 Equity Arena listings (mirrors backend/prisma/seed.js).
 * Initialized with base prices and multi-tick history for live random walk simulation.
 */
export const SEED_STOCKS = [
  { symbol: 'ABAL', name: 'AirBharat Airlines', sector: 'Aviation', basePrice: 7.00, currentPrice: 7.09, percentChange: 1.28 },
  { symbol: 'ANAG', name: 'Annapurna Agro', sector: 'Agriculture', basePrice: 5.40, currentPrice: 5.42, percentChange: 0.37 },
  { symbol: 'BPTE', name: 'Bharat PetroEnergy', sector: 'Oil & Gas', basePrice: 12.00, currentPrice: 12.40, percentChange: 3.33 },
  { symbol: 'BRM', name: 'Bazaar Retail Mart', sector: 'Retail', basePrice: 6.25, currentPrice: 6.18, percentChange: -1.12 },
  { symbol: 'BWT', name: 'BharatWave Telecom', sector: 'Telecom', basePrice: 9.20, currentPrice: 9.35, percentChange: 1.63 },
  { symbol: 'GSL', name: 'Ganga Shipping Lines', sector: 'Shipping/Logistics', basePrice: 8.10, currentPrice: 8.02, percentChange: -0.99 },
  { symbol: 'HTM', name: 'Hindustan TurboMotors', sector: 'Automobile', basePrice: 11.20, currentPrice: 11.60, percentChange: 3.57 },
  { symbol: 'IDW', name: 'Indus Defence Works', sector: 'Defense', basePrice: 13.80, currentPrice: 14.20, percentChange: 2.90 },
  { symbol: 'MRI', name: 'Meridian Realty India', sector: 'Real Estate', basePrice: 10.30, currentPrice: 10.10, percentChange: -1.94 },
  { symbol: 'NITI', name: 'Nimbus InfoTech India', sector: 'Technology', basePrice: 16.20, currentPrice: 16.80, percentChange: 3.70 },
  { symbol: 'RTB', name: 'Rashtriya Trust Bank', sector: 'Banking/Finance', basePrice: 13.40, currentPrice: 13.50, percentChange: 0.75 },
  { symbol: 'SANP', name: 'Sanjeevani Pharma', sector: 'Pharmaceuticals', basePrice: 10.00, currentPrice: 9.90, percentChange: -1.00 },
  { symbol: 'SGE', name: 'Surya Green Energy', sector: 'Renewable Energy', basePrice: 7.40, currentPrice: 7.75, percentChange: 4.73 },
  { symbol: 'SGM', name: 'Suvarna Gold Mining', sector: 'Precious Metals', basePrice: 18.00, currentPrice: 18.30, percentChange: 1.67 },
  { symbol: 'SWST', name: 'Swarna Studios', sector: 'Media/Entertainment', basePrice: 6.70, currentPrice: 6.60, percentChange: -1.49 }
].map((s) => {
  // Pre-seed a 20-tick price history so charts render smooth curves immediately
  const history = Array.from({ length: 20 }, (_, i) => ({
    price: Math.round((s.basePrice + Math.sin(i / 2.5) * 0.25 + (s.currentPrice - s.basePrice) * (i / 20)) * 100) / 100,
    timestamp: new Date(Date.now() - (20 - i) * 3000).toISOString()
  }));
  return { ...s, priceHistories: history };
});

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
 * Polls the public GET /stocks endpoint or simulates a live market ticker with
 * realistic random price movements every 3 seconds.
 */
export function useLiveStocks(intervalMs = 3000) {
  const [stocks, setStocks] = useState(SEED_STOCKS);
  const [isLive, setIsLive] = useState(true);
  const previousPrices = useRef({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch('/stocks');
        if (cancelled || !Array.isArray(data) || data.length === 0) {
          throw new Error('Fallback to local ticker simulation');
        }

        setStocks((prev) => {
          const map = {};
          prev.forEach((s) => { map[s.symbol] = s.currentPrice; });
          previousPrices.current = map;
          return data;
        });
        setIsLive(true);
      } catch {
        // Continuous live random market ticker simulation
        if (cancelled) return;
        setStocks((prev) => {
          const map = {};
          const now = new Date().toISOString();
          const updated = prev.map((s) => {
            map[s.symbol] = s.currentPrice;
            const delta = (Math.random() - 0.48) * (s.currentPrice * 0.012);
            const newPrice = Math.max(0.5, Math.round((s.currentPrice + delta) * 100) / 100);
            const base = s.basePrice || s.currentPrice;
            const pct = Math.round(((newPrice - base) / base) * 10000) / 100;
            const history = [...(s.priceHistories || []).slice(-29), { price: newPrice, timestamp: now }];
            return {
              ...s,
              currentPrice: newPrice,
              percentChange: pct,
              priceHistories: history
            };
          });
          previousPrices.current = map;
          return updated;
        });
        setIsLive(true);
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
