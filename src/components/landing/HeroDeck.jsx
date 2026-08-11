import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, Newspaper, TrendingUp } from 'lucide-react';
import { sectorTheme } from '../../hooks/useLiveStocks';

/** Chart windows offered by the timeframe selector. */
const TIMEFRAMES = [
  { id: '1M', label: '1M', minutes: 1, title: '1 minute' },
  { id: '15M', label: '15M', minutes: 15, title: '15 minutes' },
  { id: '30M', label: '30M', minutes: 30, title: '30 minutes' },
  { id: '1H', label: '1H', minutes: 60, title: '1 hour' }
];

const CHART_POINTS = 36;

/**
 * Builds a smooth SVG area path from a price series.
 */
function buildPath(points, width, height) {
  if (points.length < 2) return { line: '', area: '' };

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return [x, y];
  });

  // Catmull-Rom style smoothing for an organic market curve
  let line = `M ${coords[0][0]} ${coords[0][1]}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const [x0, y0] = coords[i];
    const [x1, y1] = coords[i + 1];
    const cx = (x0 + x1) / 2;
    line += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }

  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return { line, area, coords };
}

/** Deterministic PRNG so a given symbol + window always draws the same curve. */
function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Builds the chart series for the selected window.
 *
 * The backend keeps roughly the last 3 minutes of ticks, so short windows are
 * drawn from real history. Longer windows (15M / 30M / 1H) reach further back
 * than stored data, so the earlier part is extrapolated as a seeded random walk
 * that lands exactly on the real current price — the tail of every chart is
 * always live data.
 */
function buildSeries({ histories, currentPrice, minutes, seedKey }) {
  const cutoff = Date.now() - minutes * 60 * 1000;
  const real = (histories || [])
    .filter((h) => new Date(h.timestamp).getTime() >= cutoff)
    .map((h) => h.price)
    .filter((p) => Number.isFinite(p));

  // Enough real ticks to fill the window — sample them evenly.
  if (real.length >= CHART_POINTS) {
    const step = (real.length - 1) / (CHART_POINTS - 1);
    return Array.from({ length: CHART_POINTS }, (_, i) => real[Math.round(i * step)]);
  }

  const anchor = real.length ? real[0] : currentPrice || 1;
  const missing = CHART_POINTS - real.length;
  const rand = seededRandom(hashString(`${seedKey}|${minutes}`));

  // Walk backwards from the oldest real tick, then flip to chronological order.
  const volatility = anchor * 0.012 * Math.sqrt(minutes);
  const back = [];
  let price = anchor;
  for (let i = 0; i < missing; i++) {
    price = Math.max(anchor * 0.45, price + (rand() - 0.48) * volatility);
    back.push(price);
  }

  return [...back.reverse(), ...real];
}

/** Evenly spaced clock labels ending at "now", matching the selected window. */
function axisTimes(minutes) {
  const now = Date.now();
  return [0, 1, 2, 3].map((i) => {
    const t = new Date(now - ((3 - i) * minutes * 60 * 1000) / 3);
    return t
      .toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      .toUpperCase();
  });
}

/** One selectable line in the instrument dropdown. */
function MenuRow({ label, caption, value, change, selected, onSelect }) {
  const positive = change >= 0;
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-3 rounded px-2.5 py-2 text-left transition-all ${
        selected ? 'bg-[#ff0055]/10 text-red-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
      }`}
    >
      <span className="min-w-0">
        <span className={`block text-[12.5px] font-bold ${selected ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
          {label}
        </span>
        <span className="block truncate text-[10.5px] text-slate-500 dark:text-slate-400">{caption}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-mono text-[11.5px] text-slate-800 dark:text-slate-200 font-semibold tabular-nums">{value.toFixed(2)}</span>
        <span className={`block font-mono text-[10.5px] font-bold ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {positive ? '+' : ''}{change.toFixed(2)}%
        </span>
      </span>
    </button>
  );
}

/**
 * The centrepiece: a glass trading terminal floating above a lit podium,
 * tilted in 3D and parallaxed against the pointer.
 */
export function HeroDeck({ stocks, index, isLive }) {
  // Pointer-driven 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springCfg = { stiffness: 120, damping: 20, mass: 0.6 };
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [14, -14]), springCfg);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), springCfg);

  // Floating side cards drift further than the deck for depth separation
  const driftX = useSpring(useTransform(mouseX, [0, 1], [26, -26]), springCfg);
  const driftY = useSpring(useTransform(mouseY, [0, 1], [16, -16]), springCfg);
  const counterDriftX = useSpring(useTransform(mouseX, [0, 1], [-30, 30]), springCfg);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Top 3 movers, pulled from the live market board
  const topGainers = useMemo(
    () => [...stocks].sort((a, b) => (b.percentChange || 0) - (a.percentChange || 0)).slice(0, 3),
    [stocks]
  );

  // ---- Instrument + timeframe selection -------------------------------
  const [instrument, setInstrument] = useState('ARENA');
  const [timeframe, setTimeframe] = useState('15M');
  const [openMenu, setOpenMenu] = useState(null); // 'instrument' | 'timeframe' | null
  const headerRef = useRef(null);

  // Close either menu on outside click or Escape
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpenMenu(null);
    };
    const onKey = (e) => e.key === 'Escape' && setOpenMenu(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  const activeStock = instrument === 'ARENA' ? null : stocks.find((s) => s.symbol === instrument);
  const frame = TIMEFRAMES.find((t) => t.id === timeframe) || TIMEFRAMES[1];

  // Header readout — the ARENA 15 index, or the selected listing
  const display = activeStock
    ? {
        label: activeStock.symbol,
        caption: activeStock.name,
        value: activeStock.currentPrice || 0,
        change: activeStock.percentChange || 0,
        absolute: (activeStock.currentPrice || 0) - (activeStock.basePrice || activeStock.currentPrice || 0)
      }
    : {
        label: 'ARENA 15',
        caption: 'Equity Arena composite index',
        value: index.value,
        change: index.change,
        absolute: index.absolute
      };

  // The index has no stored history of its own — sum every listing tick by tick.
  const indexHistories = useMemo(() => {
    const withHistory = stocks.filter((s) => s.priceHistories && s.priceHistories.length);
    if (!withHistory.length) return [];
    const depth = Math.min(...withHistory.map((s) => s.priceHistories.length));
    return Array.from({ length: depth }, (_, i) => {
      const offset = depth - i;
      const slice = withHistory.map((s) => s.priceHistories[s.priceHistories.length - offset]);
      return {
        price: slice.reduce((sum, h) => sum + (h?.price || 0), 0),
        timestamp: slice[0]?.timestamp
      };
    });
  }, [stocks]);

  const series = useMemo(
    () =>
      buildSeries({
        histories: activeStock ? activeStock.priceHistories : indexHistories,
        currentPrice: display.value,
        minutes: frame.minutes,
        seedKey: instrument
      }),
    [activeStock, indexHistories, display.value, frame.minutes, instrument]
  );

  const chart = useMemo(() => buildPath(series, 380, 120), [series]);
  const times = useMemo(() => axisTimes(frame.minutes), [frame.minutes, series]);
  const up = display.change >= 0;

  return (
    <div
      className="stage-3d relative w-full max-w-[500px] mx-auto"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Ambient glow behind the whole rig */}
      <div className="absolute inset-0 -z-10 blur-[90px] opacity-40 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-56 w-56 rounded-full bg-blue-400/30" />
        <div className="absolute right-1/4 top-1/2 h-48 w-48 rounded-full bg-cyan-400/25" />
        <div className="absolute left-1/2 bottom-8 h-40 w-72 -translate-x-1/2 rounded-full bg-red-400/25" />
      </div>

      <motion.div
        className="layer-3d relative"
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, y: 60, rotateX: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* ---------------- Main terminal panel ---------------- */}
        <motion.div
          className="panel-3d sheen relative z-20 rounded-3xl p-5 pb-9 sm:p-6 sm:pb-9 bg-white dark:bg-[#131c30] border-3 border-slate-950 shadow-[6px_6px_0px_#05070e]"
          style={{ z: 60 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Index header */}
          <div ref={headerRef} className="relative z-40 flex items-start justify-between">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === 'instrument' ? null : 'instrument'))}
                aria-haspopup="listbox"
                aria-expanded={openMenu === 'instrument'}
                className="flex items-center gap-1.5 border-2 border-slate-950 bg-slate-100 dark:bg-[#10172a] px-2.5 py-1.5 text-xs font-mono font-bold text-slate-950 dark:text-white shadow-[2px_2px_0px_#05070e] transition-all hover:bg-slate-200 dark:hover:bg-slate-800 hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#05070e] rounded"
              >
                {display.label}
                <ChevronDown
                  className={`h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform ${openMenu === 'instrument' ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {openMenu === 'instrument' && (
                  <motion.div
                    role="listbox"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-0 top-full z-50 mt-2 max-h-[290px] w-[248px] overflow-y-auto rounded-xl border-2 border-slate-950 bg-white dark:bg-[#10172a] p-1.5 shadow-2xl backdrop-blur-xl"
                  >
                    <MenuRow
                      label="ARENA 15"
                      caption="Composite index"
                      value={index.value}
                      change={index.change}
                      selected={instrument === 'ARENA'}
                      onSelect={() => {
                        setInstrument('ARENA');
                        setOpenMenu(null);
                      }}
                    />
                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
                    {stocks.map((s) => (
                      <MenuRow
                        key={s.symbol}
                        label={s.symbol}
                        caption={s.name}
                        value={s.currentPrice || 0}
                        change={s.percentChange || 0}
                        selected={instrument === s.symbol}
                        onSelect={() => {
                          setInstrument(s.symbol);
                          setOpenMenu(null);
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white tabular-nums">
                {display.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`mt-1 font-mono text-sm font-bold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {up ? '+' : ''}{display.absolute.toFixed(2)} ({up ? '+' : ''}{display.change.toFixed(2)}%)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-live" />
                {isLive ? 'Live' : 'Demo'}
              </span>

               <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu((m) => (m === 'timeframe' ? null : 'timeframe'))}
                  aria-haspopup="listbox"
                  aria-expanded={openMenu === 'timeframe'}
                  className="flex items-center gap-1.5 border-2 border-slate-950 bg-slate-100 dark:bg-[#10172a] px-2.5 py-1.5 text-xs font-mono font-bold text-slate-950 dark:text-white shadow-[2px_2px_0px_#05070e] transition-all hover:bg-slate-200 dark:hover:bg-slate-800 hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#05070e] rounded"
                >
                  {frame.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-600 dark:text-slate-400 transition-transform ${openMenu === 'timeframe' ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {openMenu === 'timeframe' && (
                    <motion.div
                      role="listbox"
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full z-50 mt-2 w-[148px] rounded-xl border-2 border-slate-950 bg-white dark:bg-[#10172a] p-1.5 shadow-2xl backdrop-blur-xl"
                    >
                      {TIMEFRAMES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          role="option"
                          aria-selected={t.id === timeframe}
                          onClick={() => {
                            setTimeframe(t.id);
                            setOpenMenu(null);
                          }}
                          className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-[12.5px] transition ${
                            t.id === timeframe ? 'bg-[#ff0055]/10 text-red-600 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          {t.title}
                          {t.id === timeframe && <Check className="h-3.5 w-3.5 text-red-600" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Index chart */}
          <div className="relative mt-4 h-[130px]">
            <svg viewBox="0 0 380 120" preserveAspectRatio="none" className="h-[120px] w-full overflow-visible">
              <defs>
                <linearGradient id="deck-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff0055" stopOpacity="0.28" />
                  <stop offset="60%" stopColor="#0284c7" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="deck-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff0055" />
                  <stop offset="45%" stopColor="#ffd200" />
                  <stop offset="100%" stopColor="#00c3ff" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {[0, 30, 60, 90, 120].map((y) => (
                <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="currentColor" className="text-slate-300/80 dark:text-slate-800/80" strokeWidth="1" strokeDasharray="3 3" />
              ))}

              <motion.path
                d={chart.area}
                fill="url(#deck-fill)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.9 }}
              />
              <motion.path
                d={chart.line}
                fill="none"
                stroke="url(#deck-stroke)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }}
              />
              {chart.coords && (
                <circle
                  cx={chart.coords[chart.coords.length - 1][0]}
                  cy={chart.coords[chart.coords.length - 1][1]}
                  r="5"
                  fill="#00c3ff"
                  className="animate-live"
                  style={{ filter: 'drop-shadow(0 0 8px #00c3ff)' }}
                />
              )}
            </svg>

            {/* Price axis labels */}
            <div className="pointer-events-none absolute left-0 top-0 flex h-[120px] flex-col justify-between text-[9px] font-mono text-slate-600 dark:text-slate-400 font-bold">
              {[1.04, 1.02, 1.0, 0.98, 0.96].map((m) => (
                <span key={m} className="rounded bg-slate-100/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 px-1 shadow-sm">
                  {(display.value * m).toFixed(display.value < 100 ? 1 : 0)}
                </span>
              ))}
            </div>
          </div>

          {/* Time axis */}
          <div className="mt-1 flex justify-between px-1 text-[9px] font-mono text-slate-500 dark:text-slate-400 font-bold">
            {times.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>

          {/* Top gainers — real Equity Arena listings */}
          <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ff0055] animate-pulse" />
                Top Gainers
              </h4>
              <span className="text-[10.5px] font-mono font-bold text-slate-500 dark:text-slate-400">ARENA 15 MOVERS</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {topGainers.map((stock, i) => {
                const theme = sectorTheme(stock.sector);
                const positive = (stock.percentChange || 0) >= 0;
                return (
                  <motion.div
                    key={stock.symbol}
                    className="flex items-center justify-between p-1.5 sm:p-0 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.12, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-700 text-[10px] font-black text-slate-900 dark:text-white`}>
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <span className="text-[12.5px] sm:text-[13px] font-black text-slate-950 dark:text-white">{stock.symbol}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="font-mono text-[12px] sm:text-[13px] text-slate-900 dark:text-white font-bold tabular-nums">
                        {(stock.currentPrice || 0).toFixed(2)} <span className="text-slate-500 text-[10px]">IC</span>
                      </span>
                      <span className={`flex w-[62px] sm:w-[68px] items-center justify-end gap-0.5 sm:gap-1 font-mono text-[11px] sm:text-[12px] font-extrabold ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        <TrendingUp className={`h-3 w-3 ${positive ? '' : 'rotate-180'}`} />
                        {positive ? '+' : ''}{(stock.percentChange || 0).toFixed(2)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile-only Live News Chip */}
            <div className="mt-3.5 sm:hidden flex items-center justify-between gap-2 rounded-lg border-2 border-slate-950 bg-slate-50 dark:bg-[#10172a] p-2.5 shadow-[2px_2px_0px_#05070e]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="badge-neo !px-1.5 !py-0.5 !text-[8.5px] bg-[#ff0055] text-white shrink-0">
                  LIVE NEWS
                </span>
                <span className="truncate text-[10px] font-bold text-slate-800 dark:text-slate-200">
                  Nimbus InfoTech rallies +4.2% on tech surge
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </motion.div>

        {/* ---------------- Floating: market news (front left) ---------------- */}
        <motion.div
          className="panel-3d absolute z-30 -left-8 lg:-left-12 -bottom-24 w-[172px] rounded-2xl p-3.5 bg-white dark:bg-[#131c30] border-2 border-slate-950 shadow-[4px_4px_0px_#05070e] hidden sm:block"
          style={{ x: driftX, y: driftY, z: 120, rotate: -6 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-950 dark:text-white">
            <Newspaper className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            Market News
          </div>
          <p className="mt-2 text-[10.5px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            Admin desk holds interest rates steady — Banking &amp; Finance sector opens neutral.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono font-bold">
            <span>3h ago</span>
            <ChevronRight className="h-3 w-3 text-slate-700 dark:text-slate-400" />
          </div>
        </motion.div>

        {/* ---------------- Floating: sector rally (right) ---------------- */}
        <motion.div
          className="panel-3d absolute z-30 -right-14 lg:-right-20 top-[22%] w-[152px] rounded-2xl p-3.5 bg-white dark:bg-[#131c30] border-2 border-slate-950 shadow-[4px_4px_0px_#05070e] hidden sm:block"
          style={{ x: counterDriftX, y: driftY, z: 100, rotate: 5 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10.5px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            Nimbus InfoTech rallies as technology cues turn positive across the arena.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono font-bold">
            <span>4h ago</span>
            <ChevronRight className="h-3 w-3 text-slate-700 dark:text-slate-400" />
          </div>
        </motion.div>

        {/* ---------------- Orbiting coin badges ---------------- */}
        <motion.div
          className="absolute z-40 -right-2 sm:-right-12 top-10 sm:top-16 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-slate-950 bg-white dark:bg-[#131c30] text-blue-600 dark:text-blue-400 shadow-[2px_2px_0px_#05070e] sm:shadow-[3px_3px_0px_#05070e] animate-float-slow"
          style={{ z: 150 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 180 }}
        >
          <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
        </motion.div>

        <motion.div
          className="absolute z-40 -right-3 sm:-right-7 bottom-10 sm:bottom-14 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-slate-950 bg-white dark:bg-[#131c30] text-emerald-600 dark:text-emerald-400 shadow-[2px_2px_0px_#05070e] sm:shadow-[3px_3px_0px_#05070e] animate-float-slow"
          style={{ z: 140, animationDelay: '1.5s' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring', stiffness: 180 }}
        >
          <span className="font-display text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">IC</span>
        </motion.div>

        {/* ---------------- Podium ---------------- */}
        <motion.div
          className="relative z-10 mx-auto -mt-3 h-16 w-[72%]"
          style={{ z: -40 }}
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Cylinder body */}
          <div className="absolute inset-x-0 top-3 h-12 rounded-[50%/26%] bg-gradient-to-b from-slate-200 dark:from-slate-700 via-slate-300 dark:via-slate-800 to-slate-400 dark:to-slate-900 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.25)] border border-slate-300 dark:border-slate-700" />
          {/* Top face */}
          <div className="absolute inset-x-0 top-0 h-8 rounded-[50%] bg-gradient-to-b from-white dark:from-slate-700 to-slate-100 dark:to-slate-800 border-t border-slate-300 dark:border-slate-700" />
          {/* Under-glow ring */}
          <div className="absolute inset-x-4 -bottom-1 h-7 rounded-[50%] bg-blue-400/40 blur-lg" />
          <div className="absolute inset-x-1 bottom-0 h-5 rounded-[50%] border-2 border-blue-400/40 blur-[2px]" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HeroDeck;
