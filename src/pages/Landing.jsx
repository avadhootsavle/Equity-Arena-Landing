import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, ChevronDown, Coins, Gauge, LineChart, Lock,
  Menu, Newspaper, Play, Radio, Shield, Sparkles, TrendingUp, Trophy, Users, Wallet, X, Zap
} from 'lucide-react';
import { HeroDeck } from '../components/landing/HeroDeck';
import { useLiveStocks, useArenaIndex, sectorTheme } from '../hooks/useLiveStocks';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const REGISTER_URL = 'https://ignite-8.vercel.app/register-stock';

/* ------------------------------------------------------------------ *
 * SVG Spiderweb Decorative & Transition Components
 * ------------------------------------------------------------------ */

/** High-Impact Full-Screen Spiderweb Sling Transition Overlay */
function SpiderWebTransitionModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#04060e]/96 backdrop-blur-2xl overflow-hidden pointer-events-auto"
      >
        {/* Animated Background Pulse Radial Glows */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-transparent to-blue-600/30 blur-3xl animate-pulse" />

        {/* 🕸️ Fullscreen expanding SVG web-shooter net */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-web-shoot">
          <svg width="700" height="700" viewBox="0 0 600 600" fill="none" className="animate-web-glow">
            <defs>
              <linearGradient id="webSlingGrad" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ef4444" />
                <stop offset="0.4" stopColor="#ff1e42" />
                <stop offset="0.8" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#00d2ff" />
              </linearGradient>
            </defs>

            {/* 16 Radial Web Strands shooting out from center */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 22.5 * Math.PI) / 180;
              const x2 = 300 + Math.cos(angle) * 320;
              const y2 = 300 + Math.sin(angle) * 320;
              return (
                <line
                  key={i}
                  x1="300"
                  y1="300"
                  x2={x2}
                  y2={y2}
                  stroke="url(#webSlingGrad)"
                  strokeWidth="2"
                  opacity="0.9"
                />
              );
            })}

            {/* Concentric Web Arcs */}
            {[40, 80, 120, 160, 200, 240, 280].map((r, i) => (
              <circle
                key={r}
                cx="300"
                cy="300"
                r={r}
                stroke="url(#webSlingGrad)"
                strokeWidth="1.6"
                fill="none"
                opacity={0.9 - i * 0.1}
              />
            ))}

            {/* Glowing Web Nodes */}
            {[80, 160, 240].map((r) =>
              Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const cx = 300 + Math.cos(angle) * r;
                const cy = 300 + Math.sin(angle) * r;
                return <circle key={`${r}-${i}`} cx={cx} cy={cy} r="3" fill="#ff1e42" />;
              })
            )}
          </svg>
        </div>

        {/* Center Spidey Status Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-4 max-w-[420px] rounded-3xl border border-red-500/40 bg-slate-950/90 p-8 text-center backdrop-blur-xl shadow-2xl shadow-red-950/80"
        >
          {/* Glowing Spider Emblem Badge */}
          <div className="relative mx-auto mb-5 flex h-20 w-20 overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-blue-600 p-0.5 shadow-2xl shadow-red-600/60 ring-2 ring-red-400/50">
            <img src="/images/spider_emblem_hero.jpg" alt="Spider Emblem" className="h-full w-full object-cover rounded-[14px]" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-bold text-red-400 border border-red-500/30">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            WEB-SLINGER TELEPORT ACTIVE
          </span>

          <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-white">
            Connecting to Equity Arena
          </h3>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed font-mono">
            Deploying simulated capital • Spidey WebSocket feeds live
          </p>

          {/* Web Shoot Progress Spinner */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Slinging order web...
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Corner Spiderweb SVG Overlay */
function SpiderWebCorner({ className = "top-0 left-0", rotate = 0 }) {
  return (
    <div
      className={`pointer-events-none absolute z-10 opacity-35 transition-opacity hover:opacity-75 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
        <path d="M0 0 L180 0 M0 0 L0 180" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M0 0 L140 140" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" />
        <path d="M30 0 Q 30 30 0 30" stroke="#ef4444" strokeWidth="1.2" fill="none" />
        <path d="M60 0 Q 60 60 0 60" stroke="#ef4444" strokeWidth="1.2" fill="none" />
        <path d="M90 0 Q 90 90 0 90" stroke="#ef4444" strokeWidth="1.2" fill="none" />
        <path d="M120 0 Q 120 120 0 120" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <path d="M150 0 Q 150 150 0 150" stroke="#ef4444" strokeWidth="1" fill="none" />
        <circle cx="140" cy="140" r="3" fill="#ef4444" className="animate-pulse" />
      </svg>
    </div>
  );
}

/** Spider Web Strand Grid Lines Background */
function WebStrandPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.12]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="spiderGrid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#ef4444" strokeWidth="0.8" />
            <path d="M 0 0 L 120 120" fill="none" stroke="#ef4444" strokeWidth="0.4" strokeDasharray="2 4" />
            <circle cx="60" cy="60" r="2" fill="#ef4444" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#spiderGrid)" />
      </svg>
    </div>
  );
}

const easeOut = [0.16, 1, 0.3, 1];
const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
};

function SectionTag({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400 backdrop-blur-md">
      <Icon className="h-3.5 w-3.5 text-red-400" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Navbar
 * ------------------------------------------------------------------ */
function Navbar({ onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-red-500/30 bg-[#05070e]/85 backdrop-blur-xl shadow-lg shadow-red-950/40'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-red-500/40 bg-gradient-to-br from-red-600 via-slate-900 to-blue-600 p-0.5 shadow-lg shadow-red-600/30 transition-transform group-hover:scale-105">
            <img src="/images/spider_emblem_hero.jpg" alt="Logo" className="h-full w-full object-cover rounded-[10px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[16px] font-extrabold tracking-tight text-white group-hover:text-red-400 transition-colors">
              EQUITY <span className="text-red-500">ARENA</span>
            </span>
            <span className="font-mono text-[9px] font-medium tracking-widest text-slate-400 uppercase">
              Spidey Exchange
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
            Home
          </a>
          <a href="#markets" className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
            Spider Board
          </a>
          <a href="#features" className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
            Capabilities
          </a>
          <a href="#news" className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
            Bugle Feed
          </a>
          <a href="#about" className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
            Workflow
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden items-center gap-3 sm:flex">
          <a
            href={REGISTER_URL}
            onClick={onRegisterClick}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sling Into Trading <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-slate-900/60 text-slate-200 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-red-500/30 bg-[#05070e]/95 px-5 py-6 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-4">
              <a href="#home" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-300">Home</a>
              <a href="#markets" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-300">Spider Board</a>
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-300">Capabilities</a>
              <a href="#news" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-300">Bugle Feed</a>
              <a href="#about" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-300">Workflow</a>
              <a
                href={REGISTER_URL}
                onClick={(e) => { setMobileOpen(false); onRegisterClick(e); }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 py-3 text-center text-sm font-bold text-white"
              >
                Sling Into Trading <ArrowRight className="h-4 w-4" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ *
 * Hero Section — Page-Load GSAP Entrance & Parallax Background
 * ------------------------------------------------------------------ */
const HERO_FEATURES = [
  { icon: Zap, title: 'Spidey-Sense Ticker', sub: 'Sub-second WebSocket web' },
  { icon: Shield, title: 'Stark Nanotech Fills', sub: 'Instant order execution' },
  { icon: BarChart3, title: 'Spider-Verse Depth', sub: 'Real-time index matrix' }
];

function Hero({ stocks, index, isLive, onRegisterClick }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-[72px] spider-web-bg">
      {/* Corner Spiderwebs */}
      <SpiderWebCorner className="top-0 left-0" rotate={0} />
      <SpiderWebCorner className="top-0 right-0" rotate={90} />
      <WebStrandPattern />

      {/* Backdrop: Spider-man radial glows + receding grid floor (GSAP Parallax) */}
      <div data-gsap="parallax" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-[580px] w-[580px] rounded-full bg-red-600/25 blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[1000px] -translate-x-1/2 rounded-full bg-red-700/18 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] grid-floor opacity-75" />
      </div>

      {/* Spider-Man hanging from web */}
      <div className="absolute top-0 right-[4%] lg:right-[8%] xl:right-[10%] z-10 pointer-events-none hidden sm:flex flex-col items-center">
        <div
          style={{
            width: '3px',
            height: '90px',
            background: 'linear-gradient(to bottom, rgba(180,180,180,0.9) 0%, #b0b0b0 60%, #888 100%)',
            boxShadow: '0 0 4px 1px rgba(180,180,180,0.35)',
          }}
        />
        <motion.div
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center' }}
          className="relative mt-[-1px]"
        >
          <div
            className="absolute inset-0 blur-3xl opacity-50 z-0"
            style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(239,68,68,0.55) 0%, rgba(59,130,246,0.15) 65%, transparent 100%)' }}
          />
          <img
            src="/images/spiderman_hanging.png"
            alt="Spider-Man hanging from web"
            draggable={false}
            className="relative z-10 select-none w-[180px] md:w-[220px] lg:w-[260px] xl:w-[300px]"
            style={{
              mixBlendMode: 'multiply',
              filter: 'drop-shadow(0 4px 28px rgba(239,68,68,0.6)) drop-shadow(0 0 12px rgba(59,130,246,0.3))',
            }}
          />
        </motion.div>
      </div>

      {/* Layout grid */}
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 sm:gap-14 px-4 sm:px-8 pb-20 pt-10 sm:pb-24 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-12 lg:pt-20">
        {/* ---------- Left column (GSAP Hero Page-Load Entrance) ---------- */}
        <div data-gsap="hero" className="relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[12px] font-bold text-red-300 backdrop-blur shadow-lg shadow-red-500/20">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-live" />
              🕷️ SPIDER TRADING NETWORK • WEB-SHOOTER SPEED • ZERO RISK
            </span>
          </div>

          <h1 className="font-display mt-6 sm:mt-7 text-[clamp(2.25rem,6vw,4.6rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white">
            With great capital
            <br />
            comes <span className="text-gradient-spidey">great responsibility.</span>
          </h1>

          <p className="mt-5 sm:mt-6 max-w-[460px] text-[15px] sm:text-[16px] leading-relaxed text-slate-300">
            Step into the Spider-Verse of trading. Monitor 15 high-volatility sector stocks,
            sense price swings with your Spidey-Sense ticker, and sling orders across the live market web with 20,000 Ignite Coins.
          </p>

          <div className="mt-8 sm:mt-9 flex flex-wrap items-center gap-4 sm:gap-5">
            <a
              href={REGISTER_URL}
              onClick={onRegisterClick}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-6 sm:px-7 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-bold text-white shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Sling Orders Live <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#markets"
              className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-slate-900/60 px-5 sm:px-6 py-3.5 sm:py-4 text-[13px] sm:text-[14px] font-bold text-slate-200 backdrop-blur transition-all hover:border-red-500/60 hover:bg-slate-900/90"
            >
              Inspect Spider Board
            </a>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-3 border-t border-red-500/20 pt-6 sm:pt-7">
            {HERO_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col gap-1">
                <Icon className="h-4 w-4 text-red-400" />
                <span className="font-display text-[12px] sm:text-[13px] font-bold text-slate-100">{title}</span>
                <span className="text-[11px] text-slate-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Right column: HeroDeck ---------- */}
        <div data-gsap="hero" className="relative flex flex-col items-center lg:pr-4">
          <div className="w-full relative rounded-3xl p-2 border border-red-500/40 bg-gradient-to-b from-red-600/15 via-slate-950 to-blue-600/15 shadow-2xl shadow-red-950/90 backdrop-blur-xl">
            <HeroDeck stocks={stocks} index={index} isLive={isLive} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Ticker tape
 * ------------------------------------------------------------------ */
function TickerTape({ stocks }) {
  const doubled = [...stocks, ...stocks];

  return (
    <div className="marquee-track relative overflow-hidden border-y border-red-500/25 bg-[#05070e]/95 py-3.5 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#05070e] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#05070e] to-transparent" />

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
              <span className="text-red-500/50">🕸️</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Stats band — GSAP Count-Up ScrollTrigger Section
 * ------------------------------------------------------------------ */
const STATS = [
  { value: 15, suffix: '', label: 'Spider-Sense Listings' },
  { value: 20000, suffix: ' IC', label: 'Web Capital Balance' },
  { value: 100, suffix: '%', label: 'Risk-Free Simulation' }
];

function StatsBand() {
  return (
    <section data-gsap="section" className="relative border-b border-red-500/20 py-16 bg-slate-950/90">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-5 sm:grid-cols-3 sm:px-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <span
              data-gsap="stat-count"
              data-target={stat.value}
              data-suffix={stat.suffix}
              className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold tracking-tight text-white tabular-nums"
            >
              0{stat.suffix}
            </span>
            <p className="mt-2 text-[13px] text-red-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Features — GSAP ScrollTrigger Section & Staggered Cards
 * ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: Sparkles,
    title: 'Stark Nanotech Simulator',
    body: 'Trade simulated Indian market equities with live WebSockets. Test strategies without touching your bank account.',
    span: 'md:col-span-2 lg:col-span-1'
  },
  {
    icon: Activity,
    title: 'Live Spidey Index (SPIDEY-50)',
    body: 'Real-time weighted sector index calculating market momentum across Tech, Energy, Auto, and Finance.',
    span: ''
  },
  {
    icon: Zap,
    title: 'Spider-Sense Ticker',
    body: 'Sub-second price updates with visual web-glow alerts when stocks cross major momentum thresholds.',
    span: ''
  },
  {
    icon: Wallet,
    title: '20,000 IC Starter Web',
    body: 'Every new trader receives 20,000 virtual Ignite Coins to build and balance their portfolio.',
    span: ''
  },
  {
    icon: Trophy,
    title: 'Leaderboard Competitions',
    body: 'Compete against other traders across the Spider-Verse for top portfolio return rankings.',
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
    <section id="features" data-gsap="section" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/70">
      <SpiderWebCorner className="top-0 right-0" rotate={90} />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-gsap="heading" className="max-w-[620px]">
          <SectionTag icon={Sparkles}>Web Capabilities</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
            High-tech trading suite.
            <span className="text-gradient-spidey"> Zero capital risk.</span>
          </h2>
        </div>

        <div className="stage-3d mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, span }) => (
            <div
              key={title}
              data-gsap="card"
              className={`glow-ring layer-3d group relative overflow-hidden rounded-2xl border border-red-500/25 bg-gradient-to-b from-slate-900/85 to-slate-950/95 p-6 backdrop-blur-md shadow-xl ${span}`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/0 blur-3xl transition-all duration-500 group-hover:bg-red-500/20" />

              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/30 to-blue-500/20 ring-1 ring-red-400/30 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon className="h-5.5 w-5.5 text-red-400" strokeWidth={1.9} />
              </span>

              <h3 className="font-display relative mt-5 text-[18px] font-bold tracking-tight text-white">{title}</h3>
              <p className="relative mt-2.5 text-[14px] leading-relaxed text-slate-300">{body}</p>
            </div>
          ))}
        </div>
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
    body: 'Secures 1.2 GW renewable capacity; order book expands by 18%. Stock surging +3.8% in live simulation.',
    time: '12m ago',
    tone: 'emerald'
  },
  {
    tag: 'Technology',
    title: 'Apex Nanotech discloses Q3 margin expansion',
    body: 'Enterprise cloud adoption drives 24% YoY revenue growth. Spidey-Sense ticker flags heavy buying volume.',
    time: '45m ago',
    tone: 'blue'
  },
  {
    tag: 'Automotive',
    title: 'Veloce Motors rolls out next-gen EV platform',
    body: 'Pre-orders exceed 50,000 units within first 48 hours; analyst consensus moves to strong buy.',
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

function News({ onRegisterClick }) {
  return (
    <section id="news" data-gsap="section" className="relative overflow-hidden border-t border-red-500/20 py-24 sm:py-28">
      <SpiderWebCorner className="top-0 left-0" rotate={0} />

      <div className="pointer-events-none absolute right-0 top-1/4 h-[380px] w-[520px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-gsap="heading" className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
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
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
          >
            Sling Orders Live <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {NEWS_FEED.map((item) => (
            <div
              key={item.title}
              data-gsap="card"
              className="glow-ring group relative overflow-hidden rounded-2xl border border-red-500/25 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl transition-all hover:border-red-500/60"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${TONES[item.tone]}`}>
                  {item.tag}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{item.time}</span>
              </div>

              <h3 className="font-display mt-4 text-[17px] font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Execution Workflow — GSAP ScrollTrigger Steps
 * ------------------------------------------------------------------ */
const STEPS = [
  {
    n: '01',
    icon: Users,
    title: 'Register Spider Account',
    body: 'Create your trader profile on Ignite-8 in seconds. No KYC or banking details required.'
  },
  {
    n: '02',
    icon: Coins,
    title: 'Receive 20,000 IC',
    body: 'Instant credit of 20,000 virtual Ignite Coins directly to your Stark nanotech wallet.'
  },
  {
    n: '03',
    icon: Activity,
    title: 'Track Spidey Index',
    body: 'Monitor real-time prices across 15 high-volatility sector equities on the live Spider Board.'
  },
  {
    n: '04',
    icon: Zap,
    title: 'Sling Orders & Climb',
    body: 'Execute market buys and sells instantly. Climb the global trader leaderboard.'
  }
];

function About() {
  return (
    <section id="about" data-gsap="section" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/80">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-gsap="heading" className="mx-auto max-w-[620px] text-center">
          <SectionTag icon={Gauge}>Execution Workflow</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
            From setup to
            <span className="text-gradient-spidey"> first fill</span> in seconds.
          </h2>
        </div>

        <div className="stage-3d relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent lg:block" />

          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <div
              key={n}
              data-gsap="card"
              className="layer-3d group relative rounded-2xl border border-red-500/25 bg-slate-900/70 p-6 text-center backdrop-blur-md transition-colors hover:border-red-500/60 shadow-xl"
            >
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/40 bg-[#0c0f1d] shadow-lg shadow-red-950/60 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-red-400" strokeWidth={1.8} />
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-blue-600 font-mono text-[10px] font-bold text-white shadow-md shadow-red-600/40">
                  {n}
                </span>
              </span>

              <h3 className="font-display mt-5 text-[17px] font-bold tracking-tight text-white">{title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Closing CTA — Spider-Man Web Skyline Banner with 4 Corner Webs
 * ------------------------------------------------------------------ */
function FinalCTA({ onRegisterClick }) {
  return (
    <section data-gsap="section" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-gsap="heading">
          <div className="stage-3d relative overflow-hidden rounded-[32px] border border-red-500/40 bg-slate-950 px-6 py-16 text-center sm:px-16 sm:py-20 shadow-2xl shadow-red-950/90">
            {/* 🕸️ Spiderweb Corner Overlays inside CTA Banner */}
            <SpiderWebCorner className="top-0 left-0" rotate={0} />
            <SpiderWebCorner className="top-0 right-0" rotate={90} />
            <SpiderWebCorner className="bottom-0 left-0" rotate={270} />
            <SpiderWebCorner className="bottom-0 right-0" rotate={180} />

            {/* Glowing Spidey Emblem Watermark */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-[620px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-live" />
                JOIN THE SPIDER TRADING NETWORK TODAY
              </span>

              <h2 className="font-display mt-6 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                Ready to sling your first simulated trade?
              </h2>

              <p className="mt-4 text-[16px] leading-relaxed text-slate-300">
                Join thousands of traders building strategies on Equity Arena with 20,000 Ignite Coins. Zero risk, 100% real-time market action.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={REGISTER_URL}
                  onClick={onRegisterClick}
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-xl shadow-red-600/40 transition-all hover:scale-105 active:scale-95"
                >
                  Register Spider Account <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Footer — Spider-Man Exchange Footer
 * ------------------------------------------------------------------ */
function Footer({ stocks, onRegisterClick }) {
  return (
    <footer className="relative border-t border-red-500/20 bg-[#04060e] py-14 text-slate-400">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-red-500/40 bg-gradient-to-br from-red-600 to-blue-600 p-0.5 shadow-md shadow-red-600/30">
                <img src="/images/spider_emblem_hero.jpg" alt="Logo" className="h-full w-full object-cover rounded-[9px]" />
              </div>
              <span className="font-display text-[17px] font-extrabold text-white">
                EQUITY <span className="text-red-500">ARENA</span>
              </span>
            </div>
            <p className="mt-3.5 max-w-[340px] text-[13px] leading-relaxed text-slate-400">
              The high-tech Spider-Verse trading simulator. Real-time Indian market equities, sub-second tickers, and instant simulated fills.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">Platform</h4>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#markets" className="hover:text-white transition-colors">Spider Board</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Capabilities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">Resources</h4>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li><a href="#news" className="hover:text-white transition-colors">Daily Bugle Feed</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Execution Workflow</a></li>
                <li><a href={REGISTER_URL} onClick={onRegisterClick} className="hover:text-white transition-colors">Register Account</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">Network</h4>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-300">Spidey Web Online</span>
                </li>
                <li className="font-mono text-[11px] text-slate-500">Ignite-8 Engine v2.4</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-red-500/15 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-[12.5px] text-slate-500">
            © {new Date().getFullYear()} Equity Arena. Simulated exchange — no real money is traded.
          </p>
          <p className="flex items-center gap-2 text-[12.5px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-live" />
            Spider Web Engine Online
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ *
 * Main Landing Page Component
 * ------------------------------------------------------------------ */
export function Landing() {
  const { stocks, isLive } = useLiveStocks(3000);
  const index = useArenaIndex(stocks);
  const [isSlingingWeb, setIsSlingingWeb] = useState(false);
  const { containerRef } = useScrollAnimation();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const handleRegisterClick = (e) => {
    if (e) e.preventDefault();
    setIsSlingingWeb(true);
    setTimeout(() => {
      window.location.href = REGISTER_URL;
    }, 1100);
  };

  return (
    <div className="relative min-h-screen bg-[#05070e] text-slate-100 antialiased overflow-x-hidden">
      {/* Spiderweb Slinging Transition Overlay */}
      <SpiderWebTransitionModal isOpen={isSlingingWeb} />

      {/* GSAP ScrollTrigger Top Progress Bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-md shadow-red-500"
      />

      {/* GSAP ScrollTrigger Side Spider-Web Strand */}
      <div className="fixed left-2 sm:left-4 top-0 bottom-0 z-40 pointer-events-none w-1 hidden sm:block">
        <div
          id="gsap-spiderweb-line"
          className="w-[2px] h-0 bg-gradient-to-b from-red-500 via-red-600 to-blue-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] relative"
        >
          <div className="absolute bottom-0 -left-[3px] w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
        </div>
      </div>

      <Navbar onRegisterClick={handleRegisterClick} />
      <main>
        <Hero stocks={stocks} index={index} isLive={isLive} onRegisterClick={handleRegisterClick} />
        <TickerTape stocks={stocks} />
        <StatsBand />

        <Features />
        <News onRegisterClick={handleRegisterClick} />
        <About />
        <FinalCTA onRegisterClick={handleRegisterClick} />
      </main>
      <Footer stocks={stocks} onRegisterClick={handleRegisterClick} />
    </div>
  );
}

export default Landing;
