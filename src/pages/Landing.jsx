import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, ChevronDown, Coins, Gauge, LineChart, Lock,
  Menu, Newspaper, Play, Radio, Shield, Sparkles, TrendingUp, Trophy, Users, Wallet, X, Zap
} from 'lucide-react';
import { HeroDeck } from '../components/landing/HeroDeck';
import { useLiveStocks, useArenaIndex, sectorTheme } from '../hooks/useLiveStocks';

/* ------------------------------------------------------------------ *
 * Shared motion presets
 * ------------------------------------------------------------------ */
const easeOut = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } }
};

/** Section wrapper that animates in once when scrolled into view. */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut, delay } }
      }}
    >
      {children}
    </motion.div>
  );
}

/** Small eyebrow label above section headings. */
function SectionTag({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-blue-400" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Markets', href: '#markets' },
  { label: 'News', href: '#news' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' }
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOut }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/8 bg-[#070b14]/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[17px] font-bold tracking-[0.14em] text-white">
            EQUITY<span className="text-blue-400">ARENA</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-2 text-[14px] font-medium text-slate-400 transition-colors hover:text-white"
            >
              <span className={active === link.href ? 'text-white' : ''}>{link.label}</span>
              {active === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-blue-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-[14px] font-medium text-slate-300 transition hover:text-white sm:block"
          >
            Log in
          </Link>
          <Link
            to="/login"
            className="glow-ring group flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 sm:px-5"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/8 bg-[#070b14]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/5 py-3 text-sm font-medium text-slate-300 last:border-0"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */
const HERO_FEATURES = [
  { icon: Zap, title: 'Real-time Data', sub: 'Live market updates' },
  { icon: Shield, title: 'Secure & Reliable', sub: 'Your data is safe' },
  { icon: BarChart3, title: 'Smart Insights', sub: 'Make better decisions' }
];

function Hero({ stocks, index, isLive }) {
  const { scrollY } = useScroll();
  const y = useSpring(useTransform(scrollY, [0, 700], [0, 110]), { stiffness: 90, damping: 22 });
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-[72px]">
      {/* Backdrop: radial glows + receding grid floor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-blue-600/18 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[460px] w-[460px] rounded-full bg-cyan-500/12 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-blue-700/10 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] grid-floor opacity-60" />
      </div>

      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-12 lg:pt-20">
        {/* ---------- Left column ---------- */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-medium text-slate-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-live" />
              Real-time Markets • Smart Insights • Latest News
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display mt-7 text-[clamp(2.75rem,7vw,4.6rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white"
          >
            Smart moves
            <br />
            <span className="text-gradient-blue">start</span> here.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-[440px] text-[16px] leading-relaxed text-slate-400">
            Trade 15 live Indian sector stocks in a real-time simulated exchange. Track prices
            tick-by-tick, react to breaking market news, and build a portfolio with 20,000 Ignite
            Coins — zero real-money risk.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              to="/login"
              className="glow-ring group flex items-center gap-2.5 rounded-2xl bg-blue-600 px-7 py-4 text-[15px] font-semibold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
            >
              Explore Markets
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1.5" />
            </Link>

            <a href="#features" className="group flex items-center gap-3.5">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all group-hover:border-blue-400/50 group-hover:bg-blue-500/10">
                <Play className="h-4 w-4 fill-white text-white translate-x-[1px]" />
                <span className="absolute inset-0 rounded-full border border-blue-400/30 opacity-0 transition-all duration-500 group-hover:scale-[1.35] group-hover:opacity-100" />
              </span>
              <span className="text-[15px] font-medium text-slate-300 transition group-hover:text-white">
                Watch how it works
              </span>
            </a>
          </motion.div>

          {/* Feature strip */}
          <motion.div
            variants={fadeUp}
            className="mt-12 grid grid-cols-1 gap-1 rounded-2xl border border-white/8 bg-white/[0.025] p-2 backdrop-blur-sm sm:grid-cols-3"
          >
            {HERO_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/12 ring-1 ring-blue-400/20 transition-transform group-hover:scale-110">
                  <Icon className="h-4 w-4 text-blue-400" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-semibold text-slate-100">{title}</span>
                  <span className="block truncate text-[11px] text-slate-500">{sub}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ---------- Right column: 3D deck ---------- */}
        <motion.div style={{ y }} className="relative lg:pr-14">
          <HeroDeck stocks={stocks} index={index} isLive={isLive} />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-7 z-10 mx-auto flex max-w-[1280px] items-center justify-between px-5 sm:px-8"
      >
        <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
          <span className="flex h-5 w-3.5 items-start justify-center rounded-full border border-slate-600 pt-1">
            <motion.span
              className="h-1 w-1 rounded-full bg-slate-400"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          Scroll to explore
        </span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="h-5 w-5 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Ticker tape — every listing, scrolling forever
 * ------------------------------------------------------------------ */
function TickerTape({ stocks }) {
  const doubled = [...stocks, ...stocks];

  return (
    <div className="marquee-track relative overflow-hidden border-y border-white/8 bg-[#0a0f1c]/80 py-3.5 backdrop-blur">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#070b14] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#070b14] to-transparent" />

      <div className="flex w-max animate-marquee gap-8">
        {doubled.map((stock, i) => {
          const positive = (stock.percentChange || 0) >= 0;
          return (
            <div key={`${stock.symbol}-${i}`} className="flex shrink-0 items-center gap-2.5 text-[13px]">
              <span className="font-display font-bold text-slate-200">{stock.symbol}</span>
              <span className="font-mono text-slate-400 tabular-nums">{(stock.currentPrice || 0).toFixed(2)}</span>
              <span className={`flex items-center gap-1 font-mono text-[12px] ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                <TrendingUp className={`h-3 w-3 ${positive ? '' : 'rotate-180'}`} />
                {positive ? '+' : ''}{(stock.percentChange || 0).toFixed(2)}%
              </span>
              <span className="text-slate-700">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Stats band
 * ------------------------------------------------------------------ */
const STATS = [
  { value: 15, suffix: '', label: 'Listed companies' },
  { value: 20000, suffix: ' IC', label: 'Starting balance' },
  { value: 100, suffix: '%', label: 'Risk-free trading' }
];

/** Counts up to a target when scrolled into view. */
function CountUp({ to, suffix = '' }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, to]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
      className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold tracking-tight text-white tabular-nums"
    >
      {value.toLocaleString('en-IN')}{suffix}
    </motion.span>
  );
}

function StatsBand() {
  return (
    <section className="relative border-b border-white/8 py-16">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-5 sm:grid-cols-3 sm:px-8">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center lg:text-left">
            <CountUp to={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-[13px] text-slate-500">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Markets — the full 15-stock board
 * ------------------------------------------------------------------ */
// forwardRef so AnimatePresence's popLayout mode can measure the card on exit
const StockCard = forwardRef(function StockCard({ stock, i }, ref) {
  const theme = sectorTheme(stock.sector);
  const positive = (stock.percentChange || 0) >= 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05, ease: easeOut }}
      whileHover={{ y: -6, rotateX: 4, rotateY: -4, transition: { duration: 0.25 } }}
      className="layer-3d group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-4 backdrop-blur-sm transition-colors hover:border-blue-400/25"
    >
      {/* Hover glow wash */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/0 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${theme.from} to-transparent ring-1 ${theme.ring} font-display text-[13px] font-bold ${theme.text} transition-transform duration-300 group-hover:scale-110`}
          >
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-bold tracking-wide text-white">{stock.symbol}</p>
            <p className="truncate text-[11.5px] text-slate-500">{stock.name}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-lg px-2 py-1 font-mono text-[11.5px] font-semibold ${
            positive ? 'bg-emerald-500/12 text-emerald-400' : 'bg-rose-500/12 text-rose-400'
          }`}
        >
          {positive ? '+' : ''}{(stock.percentChange || 0).toFixed(2)}%
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-mono text-[20px] font-semibold text-slate-100 tabular-nums">
            {(stock.currentPrice || 0).toFixed(2)}
            <span className="ml-1 text-[11px] font-normal text-slate-500">IC</span>
          </p>
          <p className="mt-1 text-[10.5px] uppercase tracking-wider text-slate-600">{stock.sector}</p>
        </div>

        {/* Micro sparkline */}
        <MiniSpark history={stock.priceHistories} positive={positive} seed={i} />
      </div>
    </motion.div>
  );
});

/** Compact sparkline; synthesises a plausible curve when history is absent. */
function MiniSpark({ history, positive, seed = 0 }) {
  const points = useMemo(() => {
    const prices =
      history && history.length > 2
        ? history.slice(-16).map((h) => h.price)
        : Array.from({ length: 16 }, (_, i) => 10 + Math.sin((i + seed) / 2.2) * 1.6 + (positive ? i * 0.14 : -i * 0.14));

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    return prices
      .map((p, i) => `${(i / (prices.length - 1)) * 70},${28 - ((p - min) / range) * 26}`)
      .join(' ');
  }, [history, positive, seed]);

  return (
    <svg width="70" height="30" className="opacity-80 transition-opacity group-hover:opacity-100">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#10b981' : '#f43f5e'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Markets({ stocks, isLive }) {
  const [filter, setFilter] = useState('ALL');

  const gainers = useMemo(() => stocks.filter((s) => (s.percentChange || 0) >= 0), [stocks]);
  const losers = useMemo(() => stocks.filter((s) => (s.percentChange || 0) < 0), [stocks]);

  const visible = filter === 'GAINERS' ? gainers : filter === 'LOSERS' ? losers : stocks;

  const TABS = [
    { id: 'ALL', label: 'All listings', count: stocks.length },
    { id: 'GAINERS', label: 'Gainers', count: gainers.length },
    { id: 'LOSERS', label: 'Losers', count: losers.length }
  ];

  return (
    <section id="markets" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/8 blur-[120px]" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionTag icon={Radio}>Live market board</SectionTag>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
              All 15 listings,
              <br />
              <span className="text-gradient-blue">priced in real time.</span>
            </h2>
            <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-slate-400">
              Every company on the Equity Arena exchange, across 15 Indian sectors. Prices drift
              continuously and react to news the moment the admin desk publishes it.
            </p>
          </div>

          {/* Filter tabs — scroll within their own track on narrow screens */}
          <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.03] p-1.5 backdrop-blur">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`relative shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  filter === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === tab.id && (
                  <motion.span
                    layoutId="market-tab"
                    className="absolute inset-0 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {tab.label}
                  <span className={`ml-1.5 text-[11px] ${filter === tab.id ? 'text-blue-100' : 'text-slate-600'}`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid — each card animates itself on mount, so switching tabs
            always reveals the newly filtered listings. */}
        <div className="stage-3d mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((stock, i) => (
              <StockCard key={stock.symbol} stock={stock} i={i} />
            ))}
          </AnimatePresence>
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.025] px-6 py-5">
          <p className="flex items-center gap-2.5 text-[13.5px] text-slate-400">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-400 animate-live' : 'bg-amber-400'}`} />
            {isLive
              ? 'Streaming live prices from the Equity Arena exchange'
              : 'Showing reference prices — sign in for the live feed'}
          </p>
          <Link
            to="/login"
            className="group flex items-center gap-2 text-[14px] font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Start trading these stocks
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Features
 * ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: Activity,
    title: 'Tick-by-tick pricing',
    body: 'A background market engine drifts all 15 stocks continuously and pushes every move to your screen over WebSockets — no refresh, no lag.',
    span: 'lg:col-span-2'
  },
  {
    icon: Newspaper,
    title: 'News that moves markets',
    body: 'The admin desk broadcasts breaking headlines that shift real prices. Read fast, trade faster.',
    span: ''
  },
  {
    icon: Wallet,
    title: '20,000 Ignite Coins',
    body: 'Every trader starts with the same balance. Pure skill, zero real-money risk.',
    span: ''
  },
  {
    icon: LineChart,
    title: 'Charts with real depth',
    body: 'Sparklines, SMA-10 overlays, volume bars and 1D / 1W / 1M history on every listing — the same tooling a real desk expects.',
    span: 'lg:col-span-2'
  },
  {
    icon: Trophy,
    title: 'Live leaderboard',
    body: 'Portfolio values recompute on every tick. Watch your rank move in real time.',
    span: ''
  },
  {
    icon: Lock,
    title: 'Secure by default',
    body: 'JWT-authenticated sessions, hashed credentials and role-scoped access for traders and admins.',
    span: ''
  },
  {
    icon: Gauge,
    title: 'Instant settlement',
    body: 'Buy and sell orders clear immediately against your wallet and holdings — no pending states.',
    span: ''
  }
];

function Features() {
  return (
    <section id="features" className="relative border-t border-white/8 py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="max-w-[620px]">
          <SectionTag icon={Sparkles}>Why Equity Arena</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
            Everything a real exchange has.
            <span className="text-gradient-emerald"> None of the risk.</span>
          </h2>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="stage-3d mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, body, span }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className={`glow-ring layer-3d group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.045] to-white/[0.01] p-6 backdrop-blur-sm ${span}`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/15" />

              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-cyan-400/10 ring-1 ring-blue-400/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon className="h-5.5 w-5.5 text-blue-300" strokeWidth={1.9} />
              </span>

              <h3 className="font-display relative mt-5 text-[18px] font-bold tracking-tight text-white">{title}</h3>
              <p className="relative mt-2.5 text-[14px] leading-relaxed text-slate-400">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * News
 * ------------------------------------------------------------------ */
const NEWS_FEED = [
  {
    tag: 'Energy',
    title: 'Surya Green Energy wins record solar tender',
    body: 'Renewable capacity expansion pushes SGE to session highs as the sector re-rates.',
    time: '12m ago',
    tone: 'emerald'
  },
  {
    tag: 'Banking',
    title: 'Rashtriya Trust Bank holds rates steady',
    body: 'A neutral stance from the desk keeps RTB range-bound while credit growth stays firm.',
    time: '48m ago',
    tone: 'blue'
  },
  {
    tag: 'Technology',
    title: 'Nimbus InfoTech lands multi-year cloud deal',
    body: 'NITI leads the technology pack as global cues turn decisively positive.',
    time: '2h ago',
    tone: 'violet'
  },
  {
    tag: 'Aviation',
    title: 'AirBharat trims capacity on fuel costs',
    body: 'Rising crude weighs on ABAL margins; the sector opens under mild pressure.',
    time: '3h ago',
    tone: 'rose'
  }
];

const TONES = {
  emerald: 'bg-emerald-500/12 text-emerald-300 ring-emerald-400/25',
  blue: 'bg-blue-500/12 text-blue-300 ring-blue-400/25',
  violet: 'bg-violet-500/12 text-violet-300 ring-violet-400/25',
  rose: 'bg-rose-500/12 text-rose-300 ring-rose-400/25'
};

function News() {
  return (
    <section id="news" className="relative overflow-hidden border-t border-white/8 py-24 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[380px] w-[520px] rounded-full bg-cyan-500/8 blur-[130px]" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-[560px]">
            <SectionTag icon={Newspaper}>Market desk</SectionTag>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
              Headlines hit.
              <br />
              <span className="text-gradient-blue">Prices react.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Every broadcast from the admin desk lands as a live toast on the trading floor and
              moves the affected stock instantly. The edge belongs to whoever reads it first.
            </p>
          </div>

          <Link
            to="/login"
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-[14px] font-medium text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10"
          >
            Open the news feed
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-12 grid gap-4 md:grid-cols-2"
        >
          {NEWS_FEED.map((item) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              whileHover={{ x: 6, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-6 backdrop-blur-sm transition-colors hover:border-white/15"
            >
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider ring-1 ${TONES[item.tone]}`}>
                  {item.tag}
                </span>
                <span className="text-[11.5px] text-slate-500">{item.time}</span>
              </div>

              <h3 className="font-display mt-4 text-[17px] font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-blue-300">
                {item.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">{item.body}</p>

              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 group-hover:w-full" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * About / how it works
 * ------------------------------------------------------------------ */
const STEPS = [
  {
    n: '01',
    icon: Users,
    title: 'Claim your desk',
    body: 'Register in seconds and receive 20,000 Ignite Coins credited to your wallet instantly.'
  },
  {
    n: '02',
    icon: LineChart,
    title: 'Read the tape',
    body: 'Study all 15 listings with live sparklines, SMA overlays and sector-level context.'
  },
  {
    n: '03',
    icon: Coins,
    title: 'Execute your trade',
    body: 'Buy and sell at the live tick. Orders settle instantly against your holdings.'
  },
  {
    n: '04',
    icon: Trophy,
    title: 'Climb the board',
    body: 'Your portfolio revalues on every tick. Outperform the arena and take the top rank.'
  }
];

function About() {
  return (
    <section id="about" className="relative border-t border-white/8 py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[620px] text-center">
          <SectionTag icon={Gauge}>How it works</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
            From signup to
            <span className="text-gradient-blue"> first fill</span> in under a minute.
          </h2>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="stage-3d relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Connector rail */}
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent lg:block" />

          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <motion.div
              key={n}
              variants={fadeUp}
              whileHover={{ y: -7, rotateY: 5, transition: { duration: 0.25 } }}
              className="layer-3d group relative rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.045] to-transparent p-6 text-center backdrop-blur-sm transition-colors hover:border-blue-400/25"
            >
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1424] shadow-lg shadow-black/40 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-blue-400" strokeWidth={1.8} />
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 font-mono text-[10px] font-bold text-white shadow-md shadow-blue-600/40">
                  {n}
                </span>
              </span>

              <h3 className="font-display mt-5 text-[17px] font-bold tracking-tight text-white">{title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-400">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Closing CTA
 * ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <div className="stage-3d relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/18 via-[#0c1322] to-cyan-500/10 px-6 py-16 text-center sm:px-16 sm:py-20">
            {/* Ambient light + grid */}
            <div className="pointer-events-none absolute inset-0 opacity-50">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-[100px]" />
              <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-[100px]" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 grid-floor opacity-40" />

            <motion.div
              className="layer-3d relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[12px] font-medium text-slate-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-live" />
                The arena is open
              </span>

              <h2 className="font-display mx-auto mt-7 max-w-[720px] text-[clamp(2.1rem,5vw,3.6rem)] font-bold leading-[1.03] tracking-[-0.03em] text-white">
                Your first 20,000 coins
                <br />
                are <span className="text-gradient-blue">waiting.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-[480px] text-[15.5px] leading-relaxed text-slate-400">
                Join the exchange, take a position on all 15 listings, and find out where you land
                on the leaderboard.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="glow-ring group flex items-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-[15px] font-semibold text-white shadow-xl shadow-blue-600/35 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
                >
                  Get Started — it's free
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1.5" />
                </Link>
                <a
                  href="#markets"
                  className="rounded-2xl border border-white/12 bg-white/5 px-7 py-4 text-[15px] font-medium text-slate-200 backdrop-blur transition hover:border-white/25 hover:bg-white/10"
                >
                  Browse the board
                </a>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Footer
 * ------------------------------------------------------------------ */
function Footer({ stocks }) {
  return (
    <footer className="border-t border-white/8 bg-[#060911]/60 py-14">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-[17px] font-bold tracking-[0.14em] text-white">
                EQUITY<span className="text-blue-400">ARENA</span>
              </span>
            </div>
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-relaxed text-slate-500">
              A real-time simulated stock exchange for learning how markets actually move. Built for
              traders, run on Ignite Coins.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-300">Platform</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-slate-500">
              {['Markets', 'News', 'Features', 'Leaderboard'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="transition hover:text-slate-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-300">Top listings</h4>
            <ul className="mt-4 space-y-2.5 font-mono text-[13px] text-slate-500">
              {stocks.slice(0, 4).map((s) => (
                <li key={s.symbol} className="flex items-center justify-between gap-4">
                  <span>{s.symbol}</span>
                  <span className="tabular-nums text-slate-600">{(s.currentPrice || 0).toFixed(2)} IC</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-300">Account</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-slate-500">
              <li><Link to="/login" className="transition hover:text-slate-200">Log in</Link></li>
              <li><Link to="/login" className="transition hover:text-slate-200">Create account</Link></li>
              <li><Link to="/trader" className="transition hover:text-slate-200">Trading floor</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-7 sm:flex-row">
          <p className="text-[12.5px] text-slate-600">
            © {new Date().getFullYear()} Equity Arena. Simulated exchange — no real money is traded.
          </p>
          <p className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-live" />
            Market engine online
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */
export function Landing() {
  const { stocks, isLive } = useLiveStocks(5000);
  const index = useArenaIndex(stocks);

  // Thin progress bar tracking scroll through the page
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 antialiased">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
      />

      <Navbar />
      <main>
        <Hero stocks={stocks} index={index} isLive={isLive} />
        <TickerTape stocks={stocks} />
        <StatsBand />
        <Markets stocks={stocks} isLive={isLive} />
        <Features />
        <News />
        <About />
        <FinalCTA />
      </main>
      <Footer stocks={stocks} />
    </div>
  );
}

export default Landing;
