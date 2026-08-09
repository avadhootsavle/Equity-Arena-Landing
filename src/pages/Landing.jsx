import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, ChevronDown, Coins, Gauge, LineChart, Lock,
  Menu, Newspaper, Play, Radio, Shield, Sparkles, TrendingUp, Trophy, Users, Wallet, X, Zap
} from 'lucide-react';
import { HeroDeck } from '../components/landing/HeroDeck';
import { useLiveStocks, useArenaIndex, sectorTheme } from '../hooks/useLiveStocks';

const REGISTER_URL = 'https://ignite-8.vercel.app/register-stock';

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
    <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400 backdrop-blur shadow-lg shadow-red-500/10">
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
  { label: 'Spider Board', href: '#markets' },
  { label: 'Daily Bugle', href: '#news' },
  { label: 'Web Features', href: '#features' },
  { label: 'Spider-Verse', href: '#about' }
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
        scrolled ? 'border-b border-red-500/20 bg-[#060812]/90 backdrop-blur-xl shadow-xl shadow-red-900/10' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-blue-600 p-0.5 shadow-lg shadow-red-500/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <img src="/images/spider_emblem_hero.jpg" alt="Spider Emblem" className="h-full w-full object-cover rounded-[10px]" />
          </div>
          <span className="font-display text-[17px] font-bold tracking-[0.14em] text-white">
            SPIDEY <span className="text-red-500">EQUITY</span> <span className="text-blue-400">ARENA</span>
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
              <span className={active === link.href ? 'text-red-400 font-semibold' : ''}>{link.label}</span>
              {active === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-red-500 to-blue-500 shadow-md shadow-red-500/50"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href={REGISTER_URL}
            className="glow-ring group flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-red-600/30 transition-all hover:brightness-110 hover:shadow-red-500/50"
          >
            <span>Register</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg border border-red-500/20 p-2 text-slate-300 lg:hidden"
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
            className="overflow-hidden border-t border-red-500/20 bg-[#060812]/95 backdrop-blur-xl lg:hidden"
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
              <a
                href={REGISTER_URL}
                onClick={() => setMenuOpen(false)}
                className="mt-3 block rounded-xl bg-gradient-to-r from-red-600 to-blue-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-600/30"
              >
                Register Now
              </a>
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
  { icon: Zap, title: 'Spidey-Sense Ticker', sub: 'Sub-second WebSocket web' },
  { icon: Shield, title: 'Stark Nanotech Fills', sub: 'Instant order execution' },
  { icon: BarChart3, title: 'Spider-Verse Depth', sub: 'Real-time index matrix' }
];

function Hero({ stocks, index, isLive }) {
  const { scrollY } = useScroll();
  const y = useSpring(useTransform(scrollY, [0, 700], [0, 110]), { stiffness: 90, damping: 22 });
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-[72px] spider-web-bg">
      {/* Backdrop: Spider-man radial glows + receding grid floor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-[550px] w-[550px] rounded-full bg-red-600/22 blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/18 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[380px] w-[950px] -translate-x-1/2 rounded-full bg-red-700/15 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] grid-floor opacity-70" />
      </div>

      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-12 lg:pt-20">
        {/* ---------- Left column ---------- */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-[12px] font-semibold text-red-300 backdrop-blur shadow-lg shadow-red-500/20">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-live" />
              🕷️ SPIDEY TRADING NETWORK • WEB-SHOOTER SPEED • ZERO RISK
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display mt-7 text-[clamp(2.75rem,7vw,4.6rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white"
          >
            With great capital
            <br />
            comes <span className="text-gradient-spidey">great responsibility.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-[460px] text-[16px] leading-relaxed text-slate-300">
            Step into the Spider-Verse of trading. Monitor 15 high-volatility sector stocks,
            sense price swings with your Spidey-Sense ticker, and sling orders across the live market web with 20,000 Ignite Coins.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href={REGISTER_URL}
              className="glow-ring group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-7 py-4 text-[15px] font-bold text-white shadow-xl shadow-red-600/35 transition-all hover:scale-[1.02] hover:shadow-red-500/60"
            >
              Register Now
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1.5" />
            </a>

            <a href="#features" className="group flex items-center gap-3.5">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 transition-all group-hover:border-red-400 group-hover:bg-red-500/20">
                <Play className="h-4 w-4 fill-white text-white translate-x-[1px]" />
                <span className="absolute inset-0 rounded-full border border-blue-400/40 opacity-0 transition-all duration-500 group-hover:scale-[1.35] group-hover:opacity-100" />
              </span>
              <span className="text-[15px] font-medium text-slate-300 transition group-hover:text-white">
                Explore Web Terminal
              </span>
            </a>
          </motion.div>

          {/* Feature strip */}
          <motion.div
            variants={fadeUp}
            className="mt-12 grid grid-cols-1 gap-1 rounded-2xl border border-red-500/20 bg-slate-900/60 p-2 backdrop-blur-md sm:grid-cols-3 shadow-xl"
          >
            {HERO_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-red-500/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/20 ring-1 ring-red-400/30 transition-transform group-hover:scale-110">
                  <Icon className="h-4 w-4 text-red-400" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-bold text-slate-100">{title}</span>
                  <span className="block truncate text-[11px] text-slate-400">{sub}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ---------- Right column: 3D deck + Spider Banner preview ---------- */}
        <motion.div style={{ y }} className="relative lg:pr-14">
          <div className="relative rounded-3xl p-2 border border-red-500/30 bg-gradient-to-b from-red-600/10 via-slate-950 to-blue-600/10 shadow-2xl shadow-red-950/80 backdrop-blur-xl">
            {/* Embedded High-Tech Spider Cyber Image */}
            <div className="mb-4 overflow-hidden rounded-2xl border border-red-500/20 shadow-lg">
              <img src="/images/spider_cyber_hero.jpg" alt="Spider-Man Trading Terminal" className="h-44 w-full object-cover brightness-110 hover:scale-105 transition-transform duration-700" />
            </div>
            <HeroDeck stocks={stocks} index={index} isLive={isLive} />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-7 z-10 mx-auto flex max-w-[1280px] items-center justify-between px-5 sm:px-8"
      >
        <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-red-400/80">
          <span className="flex h-5 w-3.5 items-start justify-center rounded-full border border-red-500/40 pt-1">
            <motion.span
              className="h-1 w-1 rounded-full bg-red-400"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          Scroll across the spider web
        </span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="h-5 w-5 text-red-400" />
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
    <div className="marquee-track relative overflow-hidden border-y border-red-500/20 bg-[#060814]/90 py-3.5 backdrop-blur">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#060814] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#060814] to-transparent" />

      <div className="flex w-max animate-marquee gap-8">
        {doubled.map((stock, i) => {
          const positive = (stock.percentChange || 0) >= 0;
          return (
            <div key={`${stock.symbol}-${i}`} className="flex shrink-0 items-center gap-2.5 text-[13px]">
              <span className="font-display font-bold text-slate-100">{stock.symbol}</span>
              <span className="font-mono text-slate-400 tabular-nums">{(stock.currentPrice || 0).toFixed(2)}</span>
              <span className={`flex items-center gap-1 font-mono text-[12px] ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp className={`h-3 w-3 ${positive ? '' : 'rotate-180 text-red-400'}`} />
                {positive ? '+' : ''}{(stock.percentChange || 0).toFixed(2)}%
              </span>
              <span className="text-red-500/40">🕸️</span>
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
  { value: 15, suffix: '', label: 'Spider-Sense Listings' },
  { value: 20000, suffix: ' IC', label: 'Web Capital Balance' },
  { value: 100, suffix: '%', label: 'Risk-Free Simulation' }
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
    <section className="relative border-b border-red-500/15 py-16 bg-slate-950/80">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-5 sm:grid-cols-3 sm:px-8">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center lg:text-left">
            <CountUp to={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-[13px] text-red-400/80 font-medium">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Markets — the full 15-stock board
 * ------------------------------------------------------------------ */
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
      className="layer-3d group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-4 backdrop-blur-md transition-all hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/50"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-500/0 blur-2xl transition-all duration-500 group-hover:bg-red-500/25" />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${theme.from} to-transparent ring-1 ${theme.ring} font-display text-[13px] font-bold ${theme.text} transition-transform duration-300 group-hover:scale-110`}
          >
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-bold tracking-wide text-white">{stock.symbol}</p>
            <p className="truncate text-[11.5px] text-slate-400">{stock.name}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-lg px-2 py-1 font-mono text-[11.5px] font-semibold ${
            positive ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30'
          }`}
        >
          {positive ? '+' : ''}{(stock.percentChange || 0).toFixed(2)}%
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-mono text-[20px] font-semibold text-slate-100 tabular-nums">
            {(stock.currentPrice || 0).toFixed(2)}
            <span className="ml-1 text-[11px] font-normal text-red-400/70">IC</span>
          </p>
          <p className="mt-1 text-[10.5px] uppercase tracking-wider text-slate-500">{stock.sector}</p>
        </div>

        <MiniSpark history={stock.priceHistories} positive={positive} seed={i} />
      </div>
    </motion.div>
  );
});

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
        stroke={positive ? '#10b981' : '#ef4444'}
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
    { id: 'GAINERS', label: 'Top Gainers', count: gainers.length },
    { id: 'LOSERS', label: 'Top Losers', count: losers.length }
  ];

  return (
    <section id="markets" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionTag icon={Radio}>Spider Market Board</SectionTag>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
              15 Sector Listings,
              <br />
              <span className="text-gradient-spidey">priced across the web.</span>
            </h2>
            <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-slate-300">
              Track live prices across India's primary sectors. Asset prices swing continuously in real-time as market sentiment moves through the web network.
            </p>
          </div>

          <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-red-500/20 bg-slate-900/60 p-1.5 backdrop-blur-md">
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
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 shadow-lg shadow-red-600/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {tab.label}
                  <span className={`ml-1.5 text-[11px] ${filter === tab.id ? 'text-red-100' : 'text-slate-500'}`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="stage-3d mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((stock, i) => (
              <StockCard key={stock.symbol} stock={stock} i={i} />
            ))}
          </AnimatePresence>
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-slate-900/40 px-6 py-5">
          <p className="flex items-center gap-2.5 text-[13.5px] text-slate-300">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-red-500 animate-live' : 'bg-amber-400'}`} />
            {isLive
              ? 'Streaming live price ticks across the Spider-Man trading web'
              : 'Showing reference market seeds — register to enter the live Spider-Verse'}
          </p>
          <a
            href={REGISTER_URL}
            className="group flex items-center gap-2 text-[14px] font-semibold text-red-400 transition hover:text-red-300"
          >
            Register to Sling Trades
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
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
    icon: Zap,
    title: 'Spidey-Sense WebSocket Ticker',
    body: 'Sub-second price feeds push continuous ticks across all 15 sector listings straight to your terminal with zero lag.',
    span: 'lg:col-span-2'
  },
  {
    icon: Newspaper,
    title: 'Daily Bugle Market Feeds',
    body: 'Breaking market news broadcast directly from the Daily Bugle desk moves asset valuations instantly. Read fast, trade faster.',
    span: ''
  },
  {
    icon: Wallet,
    title: '20,000 Web Capital (IC)',
    body: 'Begin trading immediately with 20,000 Ignite Coins. Build, rebalance, and optimize your portfolio without financial risk.',
    span: ''
  },
  {
    icon: LineChart,
    title: 'Web Matrix Technical Charts',
    body: 'Evaluate price trends with smooth candlestick curves, 10-period moving averages, and multi-timeframe chart history (1M to 1H).',
    span: 'lg:col-span-2'
  },
  {
    icon: Trophy,
    title: 'Spider-Verse Leaderboard',
    body: 'Compete against traders across the multiverse. Leaderboard portfolio valuations recalculate dynamically on every price tick.',
    span: ''
  },
  {
    icon: Lock,
    title: 'Nanotech Security',
    body: 'Protected with JWT-authenticated sessions, hashed credentials, and role-scoped trader permissions.',
    span: ''
  },
  {
    icon: Gauge,
    title: 'Zero Latency Fills',
    body: 'Buy and market sell orders execute immediately against your virtual web wallet — no settlement delays or pending states.',
    span: ''
  }
];

function Features() {
  return (
    <section id="features" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/60">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="max-w-[620px]">
          <SectionTag icon={Sparkles}>Web Capabilities</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
            High-tech trading suite.
            <span className="text-gradient-spidey"> Zero capital risk.</span>
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
              className={`glow-ring layer-3d group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-6 backdrop-blur-md ${span}`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/0 blur-3xl transition-all duration-500 group-hover:bg-red-500/20" />

              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/30 to-blue-500/20 ring-1 ring-red-400/30 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon className="h-5.5 w-5.5 text-red-400" strokeWidth={1.9} />
              </span>

              <h3 className="font-display relative mt-5 text-[18px] font-bold tracking-tight text-white">{title}</h3>
              <p className="relative mt-2.5 text-[14px] leading-relaxed text-slate-300">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * News — Daily Bugle Feed
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
    body: 'Neutral rate stance maintains stable credit spreads while loan growth stays robust.',
    time: '48m ago',
    tone: 'blue'
  },
  {
    tag: 'Technology',
    title: 'Nimbus InfoTech lands multi-year cloud deal',
    body: 'NITI leads technology sector gains as enterprise cloud demand accelerates.',
    time: '2h ago',
    tone: 'violet'
  },
  {
    tag: 'Aviation',
    title: 'AirBharat trims capacity on fuel costs',
    body: 'Rising jet fuel prices weigh on operating margins; aviation stocks open under mild pressure.',
    time: '3h ago',
    tone: 'rose'
  }
];

const TONES = {
  emerald: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  blue: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  violet: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  rose: 'bg-red-500/15 text-red-300 ring-red-500/30'
};

function News() {
  return (
    <section id="news" className="relative overflow-hidden border-t border-red-500/20 py-24 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[380px] w-[520px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-[560px]">
            <SectionTag icon={Newspaper}>Daily Bugle Feed 📰</SectionTag>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
              Daily Bugle Headlines.
              <br />
              <span className="text-gradient-crimson">Web Fills React.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
              Market-moving announcements broadcast directly to the trading floor. Position your portfolio ahead of macro shifts and corporate catalysts.
            </p>
          </div>

          <a
            href={REGISTER_URL}
            className="group flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-[14px] font-medium text-slate-200 transition hover:border-red-400 hover:bg-red-500/20"
          >
            Register for Bugle Feed
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
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
              className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-slate-900/60 p-6 backdrop-blur-md transition-colors hover:border-red-500/40"
            >
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider ring-1 ${TONES[item.tone]}`}>
                  {item.tag}
                </span>
                <span className="text-[11.5px] text-slate-400">{item.time}</span>
              </div>

              <h3 className="font-display mt-4 text-[17px] font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-red-400">
                {item.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">{item.body}</p>

              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-red-600 to-blue-600 transition-all duration-500 group-hover:w-full" />
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
    title: 'Claim Your Spider Desk',
    body: 'Register in seconds to receive 20,000 Ignite Coins credited to your web wallet.'
  },
  {
    n: '02',
    icon: LineChart,
    title: 'Sense Market Moves',
    body: 'Monitor the 15 sector benchmarks, chart patterns, and live WebSocket price movements.'
  },
  {
    n: '03',
    icon: Coins,
    title: 'Sling Your Fills',
    body: 'Submit instant market orders to enter or exit positions with zero slippage.'
  },
  {
    n: '04',
    icon: Trophy,
    title: 'Conquer the Spider-Verse',
    body: 'Track real-time P&L changes and climb the global trader rankings as markets move.'
  }
];

function About() {
  return (
    <section id="about" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/70">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[620px] text-center">
          <SectionTag icon={Gauge}>Execution Workflow</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
            From setup to
            <span className="text-gradient-spidey"> first fill</span> in seconds.
          </h2>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="stage-3d relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent lg:block" />

          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <motion.div
              key={n}
              variants={fadeUp}
              whileHover={{ y: -7, rotateY: 5, transition: { duration: 0.25 } }}
              className="layer-3d group relative rounded-2xl border border-red-500/20 bg-slate-900/60 p-6 text-center backdrop-blur-md transition-colors hover:border-red-500/50"
            >
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-[#0c0f1d] shadow-lg shadow-red-950/50 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-red-400" strokeWidth={1.8} />
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-blue-600 font-mono text-[10px] font-bold text-white shadow-md shadow-red-600/40">
                  {n}
                </span>
              </span>

              <h3 className="font-display mt-5 text-[17px] font-bold tracking-tight text-white">{title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-300">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Closing CTA — Spider-Man Web Skyline Banner
 * ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <div className="stage-3d relative overflow-hidden rounded-[32px] border border-red-500/30 bg-slate-950 px-6 py-16 text-center sm:px-16 sm:py-20 shadow-2xl shadow-red-950/80">
            {/* Background Image: Futuristic Spider Web City Skyline */}
            <div className="absolute inset-0 -z-10 opacity-35">
              <img src="/images/spider_web_banner.jpg" alt="Spider Web Skyline" className="h-full w-full object-cover" />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <motion.div
              className="layer-3d relative z-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-[12px] font-semibold text-red-300 backdrop-blur shadow-lg shadow-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-live" />
                🕷️ The Spider Trading Web is Open
              </span>

              <h2 className="font-display mx-auto mt-7 max-w-[720px] text-[clamp(2.1rem,5vw,3.6rem)] font-bold leading-[1.03] tracking-[-0.03em] text-white">
                Ready to sling your
                <br />
                first <span className="text-gradient-spidey">trade?</span>
              </h2>

              <p className="mx-auto mt-5 max-w-[480px] text-[15.5px] leading-relaxed text-slate-300">
                Claim your 20,000 Ignite Coins, analyze live sector trends, and dominate the Spider-Verse leaderboard today.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={REGISTER_URL}
                  className="glow-ring group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-xl shadow-red-600/40 transition-all hover:scale-[1.03] hover:shadow-red-500/60"
                >
                  Register Now
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1.5" />
                </a>
                <a
                  href="#markets"
                  className="rounded-2xl border border-red-500/30 bg-slate-900/60 px-7 py-4 text-[15px] font-medium text-slate-200 backdrop-blur transition hover:border-red-400 hover:bg-red-500/10"
                >
                  Explore Spider Board
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
    <footer className="border-t border-red-500/20 bg-[#04060d] py-14">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-blue-600">
                <img src="/images/spider_emblem_hero.jpg" alt="Spider Emblem" className="h-full w-full object-cover" />
              </div>
              <span className="font-display text-[17px] font-bold tracking-[0.14em] text-white">
                SPIDEY <span className="text-red-500">EQUITY</span> <span className="text-blue-400">ARENA</span>
              </span>
            </div>
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-relaxed text-slate-400">
              A real-time simulated Spider-Verse stock exchange for learning market dynamics. Built for traders, run on Ignite Coins.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-400">Spider Web</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-slate-400">
              {['Markets', 'News', 'Features'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="transition hover:text-slate-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-400">Top listings</h4>
            <ul className="mt-4 space-y-2.5 font-mono text-[13px] text-slate-400">
              {stocks.slice(0, 4).map((s) => (
                <li key={s.symbol} className="flex items-center justify-between gap-4">
                  <span>{s.symbol}</span>
                  <span className="tabular-nums text-slate-500">{(s.currentPrice || 0).toFixed(2)} IC</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-400">Account</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-slate-400">
              <li><a href={REGISTER_URL} className="transition hover:text-slate-200">Register</a></li>
              <li><a href={REGISTER_URL} className="transition hover:text-slate-200">Trading Floor</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-red-500/20 pt-7 sm:flex-row">
          <p className="text-[12.5px] text-slate-500">
            © {new Date().getFullYear()} Spidey Equity Arena. Simulated exchange — no real money is traded.
          </p>
          <p className="flex items-center gap-2 text-[12.5px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-live" />
            Spider Web Engine Online
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
  const { stocks, isLive } = useLiveStocks(3000);
  const index = useArenaIndex(stocks);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative min-h-screen bg-[#05070e] text-slate-100 antialiased">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-md shadow-red-500"
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
