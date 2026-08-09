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

/** Regulatory Disclaimer Modal Popup on first visit */
function DisclaimerModal({ onClose }) {
  const [checked, setChecked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#04060e]/95 backdrop-blur-md overflow-hidden pointer-events-auto p-4"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10 blur-3xl opacity-60 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="card-neo w-full max-w-[620px] bg-[#070b16] max-h-[85vh] overflow-y-auto flex flex-col p-6 sm:p-8 relative"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="badge-neo bg-[#ffd200] text-slate-950 px-2.5 py-1 text-[11px] font-black shadow-[2px_2px_0px_#05070e]">
            WARNING // REGULATORY DISCLAIMER
          </span>
          <span className="text-slate-500 font-mono text-[11px] select-none">ID: EA-SEC-99</span>
        </div>

        <h3 className="font-display text-white text-xl sm:text-2xl font-black tracking-tight mb-2 text-left">
          EQUITY ARENA — LEGAL DISCLAIMER
        </h3>

        <div className="space-y-4 font-mono text-[12px] text-slate-300 leading-relaxed max-h-[40vh] overflow-y-auto pr-3 border-y border-slate-800 py-4 my-4 text-left">
          <p>
            <strong>Equity Arena</strong> is an educational stock-market simulation game created for learning and entertainment purposes only.
          </p>
          <p>
            All funds, stocks, prices, portfolios, profits, losses, orders, and transactions shown in the game are <strong>virtual and simulated</strong>. No real money is deposited, invested, transferred, or withdrawn through Equity Arena, and no real financial transactions take place.
          </p>
          <p>
            The market prices, price movements, company data, and news presented in the game are simulated for gameplay and educational purposes and do not represent actual market prices, real investment opportunities, or real-world trading conditions. Any profits or losses displayed in the game have no real monetary value.
          </p>
          <p>
            Equity Arena does not provide financial, investment, trading, or legal advice. Information shown in the game should not be used as a basis for making real-world investment or trading decisions. Past simulated performance does not guarantee or indicate future results.
          </p>
          <p>
            All virtual currency used within the game, including <strong>IC (In-Game Currency)</strong>, has no cash value and cannot be exchanged for real money or other financial assets.
          </p>
          <p className="text-[#ffd200] font-bold">
            By using Equity Arena, you acknowledge and agree that you are participating in a simulated trading environment and that all market activity, assets, currency, profits, and losses are virtual and have no real-world monetary value.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none text-left max-w-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 accent-[#ff0055] h-5 w-5 border-2 border-slate-950 rounded cursor-pointer shrink-0"
            />
            <span className="font-mono text-[11px] text-slate-400 leading-tight">
              I understand and agree that this is a simulated platform and no real money is involved.
            </span>
          </label>
          <button
            disabled={!checked}
            onClick={onClose}
            className={`btn-neo px-6 py-3.5 text-xs font-black whitespace-nowrap self-stretch sm:self-auto justify-center ${
              !checked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            ACCEPT & ENTER <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** High-Impact Full-Screen Spiderweb Sling Transition Overlay */
function SpiderWebTransitionModal() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070e] overflow-hidden pointer-events-auto"
    >
      {/* Halftone Comic Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#ff0055 2px, transparent 2px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Repeating Diagonal Hazard Stripes Background Panel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #ffd200, #ffd200 10px, #05070e 10px, #05070e 20px)'
        }}
      />

      {/* Giant Expanding Concentric Web Rings (Solid Outlines, no glows) */}
      {Array.from({ length: 5 }).map((_, idx) => (
        <motion.div
          key={`ring-${idx}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 4.5], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: idx * 0.3,
            ease: "linear"
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <svg width="450" height="450" viewBox="0 0 300 300" fill="none">
            <circle cx="150" cy="150" r="120" stroke="#00f3ff" strokeWidth="2.5" strokeDasharray="8 6" />
            <circle cx="150" cy="150" r="75" stroke="#ff0055" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </motion.div>
      ))}

      {/* Layer 1: Clockwise Web Shoot (Solid Comic Lines) */}
      <motion.div
        initial={{ scale: 0.04, rotate: -360, opacity: 0 }}
        animate={{
          scale: [0.04, 2.2, 0.85, 6.0],
          rotate: [-360, 270, 720, 1440],
          opacity: [0, 0.95, 0.9, 0]
        }}
        transition={{ duration: 1.5, times: [0, 0.25, 0.55, 1], ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <svg width="850" height="850" viewBox="0 0 600 600" fill="none">
          {/* Radial Strands */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i * 18 * Math.PI) / 180;
            const x2 = 300 + Math.cos(angle) * 350;
            const y2 = 300 + Math.sin(angle) * 350;
            return (
              <line 
                key={i} 
                x1="300" 
                y1="300" 
                x2={x2} 
                y2={y2} 
                stroke="#ff0055" 
                strokeWidth="3.5" 
              />
            );
          })}

          {/* Arcs */}
          {[40, 80, 120, 160, 200, 240, 280].map((r, i) => (
            <circle 
              key={r} 
              cx="300" 
              cy="300" 
              r={r} 
              stroke="#ffd200" 
              strokeWidth="2.5" 
              fill="none" 
            />
          ))}
        </svg>
      </motion.div>

      {/* MULTIPLE COMIC SHOCKWAVE POPS: THWIP!, BAM!, CRASH! */}
      <motion.div
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: [0, 2.5, 0], rotate: [-45, 12, 28], opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.35, 1], ease: "backOut" }}
        className="absolute z-30 pointer-events-none select-none font-display font-black text-6xl sm:text-8.5xl text-slate-950 bg-[#ffd200] border-4 border-slate-950 px-8 py-4 shadow-[6px_6px_0px_#ff0055] rounded-lg tracking-tighter"
      >
        *THWIP!*
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: 30, opacity: 0 }}
        animate={{ scale: [0, 1.8, 0], rotate: [30, -8, -22], opacity: [0, 0.95, 0] }}
        transition={{ duration: 0.75, delay: 0.2, times: [0, 0.35, 1], ease: "backOut" }}
        className="absolute z-30 top-1/4 left-1/4 pointer-events-none select-none font-display font-black text-4xl sm:text-6xl text-white bg-[#ff0055] border-3 border-slate-950 px-6 py-2.5 shadow-[4px_4px_0px_#00f3ff] rounded-lg -rotate-12"
      >
        *ZIP!*
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: [0, 2.0, 0], rotate: [-20, 15, 35], opacity: [0, 0.95, 0] }}
        transition={{ duration: 0.8, delay: 0.35, times: [0, 0.35, 1], ease: "backOut" }}
        className="absolute z-30 bottom-1/4 right-1/4 pointer-events-none select-none font-display font-black text-4xl sm:text-6xl text-slate-950 bg-[#00f3ff] border-3 border-slate-950 px-6 py-2.5 shadow-[4px_4px_0px_#ffd200] rounded-lg rotate-12"
      >
        *SHWIIP!*
      </motion.div>

      {/* Center Spidey Status Neo-Brutalist Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 mx-4 max-w-[420px] bg-[#070b16] border-4 border-slate-950 p-8 text-center rounded-xl shadow-[8px_8px_0px_#ff0055]"
      >
        {/* Top accent hazard stripes inside card */}
        <div 
          className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #ffd200, #ffd200 6px, #05070e 6px, #05070e 12px)'
          }}
        />

        {/* Stylized Neo-Brutalist Spidey Badge */}
        <div className="relative mx-auto mb-5 mt-2 flex h-20 w-20 items-center justify-center rounded-2xl border-3 border-slate-950 bg-[#ff0055] shadow-[4px_4px_0px_#05070e] font-display text-4xl text-white select-none">
          🕷️
        </div>

        <span className="badge-neo bg-[#ffd200] text-slate-950 px-3 py-1.5 text-[10px] font-black shadow-[2px_2px_0px_#05070e]">
          CONNECTION DEPLOYED
        </span>

        <h3 className="font-display mt-5 text-2xl font-black tracking-tight text-white uppercase">
          TELEPORTING TO SYSTEM
        </h3>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed font-mono">
          Deploying simulated capital • Spidey WebSocket feeds live
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Corner Spiderweb SVG Overlay */
function SpiderWebCorner({ className = "top-0 left-0", rotate = 0 }) {
  return (
    <div
      className={`pointer-events-none absolute z-10 opacity-35 transition-opacity hover:opacity-75 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg data-gsap="corner-web" width="180" height="180" viewBox="0 0 180 180" fill="none" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
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
    <span className="badge-neo px-4 py-1.5 inline-flex items-center gap-2">
      <Icon className="h-3.5 w-3.5" />
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
          <div className="flex flex-col">
            <span className="font-display text-[16px] font-extrabold tracking-tight text-white group-hover:text-red-400 transition-colors">
              EQUITY <span className="text-red-500">ARENA</span>
            </span>
            <span className="font-mono text-[9px] font-medium tracking-widest text-slate-400 uppercase">
              Spidey Exchange
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
            Home
          </a>
          <a href="#features" className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
            Capabilities
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
            className="btn-neo px-5 py-2.5 text-[13px] font-extrabold group"
          >
            Sling Into Trading <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            <nav className="flex flex-col gap-3">
              <a
                href="#home"
                onClick={() => setMobileOpen(false)}
                className="block text-center border-2 border-slate-950 bg-slate-900 px-4 py-3 rounded shadow-[2px_2px_0px_#05070e] text-sm font-mono font-bold text-slate-100 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#05070e]"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="block text-center border-2 border-slate-950 bg-slate-900 px-4 py-3 rounded shadow-[2px_2px_0px_#05070e] text-sm font-mono font-bold text-slate-100 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#05070e]"
              >
                Capabilities
              </a>
              <a
                href="#about"
                onClick={() => setMobileOpen(false)}
                className="block text-center border-2 border-slate-950 bg-slate-900 px-4 py-3 rounded shadow-[2px_2px_0px_#05070e] text-sm font-mono font-bold text-slate-100 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#05070e]"
              >
                Workflow
              </a>
              <a
                href={REGISTER_URL}
                onClick={(e) => { setMobileOpen(false); onRegisterClick(e); }}
                className="btn-neo mt-2 justify-center py-3.5 text-sm font-black"
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

const Hero = forwardRef(({ stocks, index, isLive, onRegisterClick }, ref) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-09-04T00:00:00+05:30').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} id="home" className="relative min-h-screen overflow-hidden pt-[72px] spider-web-bg">
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
      <div id="gsap-hero-spiderman-wrapper" className="absolute top-0 right-[4%] lg:right-[8%] xl:right-[10%] z-10 pointer-events-none hidden sm:flex flex-col items-center">
        <div
          id="gsap-hero-spiderman-line"
          style={{
            width: '3px',
            height: '90px',
            background: 'linear-gradient(to bottom, rgba(180,180,180,0.9) 0%, #b0b0b0 60%, #888 100%)',
            boxShadow: '0 0 4px 1px rgba(180,180,180,0.35)',
            transformOrigin: 'top center'
          }}
        />
        <div
          id="gsap-hero-spiderman-body"
          className="relative mt-[-1px]"
          style={{ transformOrigin: 'top center' }}
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
        </div>
      </div>

      {/* Layout grid */}
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 sm:gap-14 px-4 sm:px-8 pb-20 pt-10 sm:pb-24 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-12 lg:pt-20">
        {/* ---------- Left column (GSAP Hero Page-Load Entrance) ---------- */}
        <div data-gsap="hero" className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="font-display mt-6 sm:mt-7 text-[clamp(2.25rem,6vw,4.6rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white">
            With great capital
            <br />
            comes <span className="text-gradient-spidey">great responsibility.</span>
          </h1>

          <p className="mt-5 sm:mt-6 max-w-[460px] text-[15px] sm:text-[16px] leading-relaxed text-slate-300">
            Step into the Spider-Verse of trading. Monitor 15 high-volatility sector stocks,
            sense price swings with your Spidey-Sense ticker, and sling orders across the live market web with 20,000 Ignite Coins.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 sm:gap-5 justify-center lg:justify-start">
            <a
              href={REGISTER_URL}
              onClick={onRegisterClick}
              className="btn-neo px-6 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-[14px] font-extrabold group"
            >
              Sling Into Trading <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Neo-Brutalist Launch Countdown to Sept 4 */}
          <div className="mt-8 border-3 border-slate-950 bg-[#070b16] p-4.5 rounded-xl shadow-[4px_4px_0px_#05070e,8px_8px_0px_rgba(255,0,85,0.12)] text-left max-w-[420px] w-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-blue-600/5 pointer-events-none" />
            <div className="flex items-center justify-between mb-3 border-b border-slate-850 pb-2.5">
              <span className="badge-neo bg-[#ffd200] text-slate-950 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#05070e]">
                LAUNCH TELEMETRY // SEPT 4
              </span>
              <span className="text-[9px] font-mono text-slate-500 animate-pulse select-none font-bold">STATE: ONLINE</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-[#0e1220] p-2.5 rounded border-2 border-slate-950 shadow-[2px_2px_0px_#ff0055] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-2xl font-black text-[#ff0055] tabular-nums">{timeLeft.days}</span>
                <span className="text-[9px] font-mono uppercase text-slate-400 font-black tracking-wider">Days</span>
              </div>
              <div className="bg-[#0e1220] p-2.5 rounded border-2 border-slate-950 shadow-[2px_2px_0px_#00f3ff] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-2xl font-black text-[#00f3ff] tabular-nums">{timeLeft.hours}</span>
                <span className="text-[9px] font-mono uppercase text-slate-400 font-black tracking-wider">Hours</span>
              </div>
              <div className="bg-[#0e1220] p-2.5 rounded border-2 border-slate-950 shadow-[2px_2px_0px_#ffd200] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-2xl font-black text-[#ffd200] tabular-nums">{timeLeft.minutes}</span>
                <span className="text-[9px] font-mono uppercase text-slate-400 font-black tracking-wider">Mins</span>
              </div>
              <div className="bg-[#0e1220] p-2.5 rounded border-2 border-slate-950 shadow-[2px_2px_0px_#ffffff] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-2xl font-black text-white tabular-nums">{timeLeft.seconds}</span>
                <span className="text-[9px] font-mono uppercase text-slate-400 font-black tracking-wider">Secs</span>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-3 border-t border-red-500/20 pt-6 sm:pt-7 w-full">
            {HERO_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center lg:items-start gap-1">
                <Icon className="h-4 w-4 text-red-400 mx-auto lg:mx-0" />
                <span className="font-display text-[12px] sm:text-[13px] font-bold text-slate-100">{title}</span>
                <span className="text-[11px] text-slate-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Right column: HeroDeck ---------- */}
        <div data-gsap="hero" className="relative flex flex-col items-center lg:pr-4">
          {/* Rotating Stark HUD ring behind HeroDeck */}
          <div className="absolute -inset-14 -z-10 flex items-center justify-center pointer-events-none opacity-25 select-none scale-90 sm:scale-100">
            <svg width="500" height="500" viewBox="0 0 200 200" className="stroke-[#00f3ff] stroke-[0.8] fill-none overflow-visible animate-spin" style={{ animationDuration: '24s' }}>
              <circle cx="100" cy="100" r="82" strokeDasharray="12 6 2 6" />
              <circle cx="100" cy="100" r="92" strokeDasharray="50 15" strokeWidth="1.2" />
              <circle cx="100" cy="100" r="62" strokeDasharray="3 6" />
            </svg>
          </div>
          <div className="w-full relative p-4 border-3 border-slate-950 bg-slate-900 shadow-[6px_6px_0px_#000] rounded-lg">
            <HeroDeck stocks={stocks} index={index} isLive={isLive} />
          </div>
        </div>
      </div>
    </section>
  );
});

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

const Features = forwardRef((props, ref) => {
  return (
    <section ref={ref} id="features" data-gsap="section" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/70">
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
              className={`card-neo layer-3d group relative overflow-hidden p-6 ${span}`}
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
});



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

const About = forwardRef((props, ref) => {
  return (
    <section ref={ref} id="about" data-gsap="section" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/80 overflow-hidden">
      {/* Comic Book popups scoped to About section */}
      <div id="gsap-comic-thwip" className="pointer-events-none absolute left-[12%] top-[42%] opacity-0 scale-0 z-30 bg-[#ff1e42] border-4 border-white text-white font-extrabold uppercase px-5 py-1.5 rounded-lg text-lg -rotate-12 shadow-[4px_4px_0px_#000] font-mono">THWIP!</div>
      <div id="gsap-comic-bzzzt" className="pointer-events-none absolute left-[38%] top-[38%] opacity-0 scale-0 z-30 bg-amber-400 border-4 border-black text-black font-extrabold uppercase px-5 py-1.5 rounded-lg text-lg rotate-6 shadow-[4px_4px_0px_#000] font-mono">BZZZT!</div>
      <div id="gsap-comic-swing" className="pointer-events-none absolute left-[62%] top-[42%] opacity-0 scale-0 z-30 bg-blue-600 border-4 border-white text-white font-extrabold uppercase px-5 py-1.5 rounded-lg text-lg -rotate-6 shadow-[4px_4px_0px_#000] font-mono">SWING!</div>
      <div id="gsap-comic-boom" className="pointer-events-none absolute left-[82%] top-[32%] opacity-0 scale-0 z-30 bg-red-600 border-4 border-white text-white font-extrabold uppercase px-7 py-2 rounded-lg text-2xl rotate-12 shadow-[6px_6px_0px_#000] font-mono">BOOM!</div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-gsap="heading" className="mx-auto max-w-[620px] text-center">
          <SectionTag icon={Gauge}>Execution Workflow</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white">
            From setup to
            <span className="text-gradient-spidey"> first fill</span> in seconds.
          </h2>
        </div>

        <div className="stage-3d relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div id="gsap-about-line" className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-[0_0_10px_#ef4444] lg:block origin-left scale-x-0" />

          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <div
              key={n}
              data-gsap="step-card"
              className="card-neo layer-3d group relative p-6 text-center"
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

        {/* Narrative Peter Parker Story Progression Caption */}
        <div className="mt-16 text-center max-w-xl mx-auto">
          <div className="relative rounded-2xl border border-red-500/30 bg-[#070b19]/80 px-6 py-4 shadow-xl backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-blue-600/5" />
            <p id="gsap-about-story" className="font-mono text-[13px] font-bold text-red-400 tracking-wide transition-all duration-300">
              STORY CAPTION: Scroll to unlock Peter Parker's trading origin...
            </p>
          </div>
        </div>


      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ *
 * Closing CTA — Spider-Man Web Skyline Banner with 4 Corner Webs
 * ------------------------------------------------------------------ */
function FinalCTA({ onRegisterClick }) {
  return (
    <section data-gsap="section" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-gsap="heading">
          <div className="card-neo relative overflow-hidden px-6 py-16 text-center sm:px-16 sm:py-20">
            {/* 🕸️ Spiderweb Corner Overlays inside CTA Banner */}
            <SpiderWebCorner className="top-0 left-0" rotate={0} />
            <SpiderWebCorner className="top-0 right-0" rotate={90} />
            <SpiderWebCorner className="bottom-0 left-0" rotate={270} />
            <SpiderWebCorner className="bottom-0 right-0" rotate={180} />

            {/* Glowing Spidey Emblem Watermark */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-[620px]">
              <span className="badge-neo bg-[#ff0055] text-white px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#05070e]">
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
                  className="btn-neo px-8 py-4 text-[15px] font-black"
                >
                  Register Spider Account <ArrowRight className="h-5 w-5" />
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
                <li><a href="#features" className="hover:text-white transition-colors">Capabilities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">Resources</h4>
              <ul className="mt-3 space-y-2 text-[13px]">
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

        {/* Styled Premium Neo-Brutalist Disclaimer Card */}
        <div className="card-neo mt-12 p-6 bg-[#070b16]/90 border-t-4 border-t-[#ffd200] relative overflow-hidden text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-neo bg-[#ffd200] text-slate-950 px-2.5 py-1 text-[11px] font-black shadow-[2px_2px_0px_#05070e]">
              DISCLAIMER // READ CAREFULLY
            </span>
            <span className="text-slate-500 font-mono text-[11px] select-none">ID: EA-TELEMETRY-SEC-88</span>
          </div>
          <h4 className="font-display text-white text-md font-black tracking-tight mb-2">EQUITY ARENA — LEGAL DISCLAIMER</h4>
          <div className="space-y-3 font-mono text-[12px] text-slate-400 leading-relaxed">
            <p>
              <strong>Equity Arena</strong> is an educational stock-market simulation game created for learning and entertainment purposes only.
            </p>
            <p>
              All funds, stocks, prices, portfolios, profits, losses, orders, and transactions shown in the game are <strong>virtual and simulated</strong>. No real money is deposited, invested, transferred, or withdrawn through Equity Arena, and no real financial transactions take place.
            </p>
            <p>
              The market prices, price movements, company data, and news presented in the game are simulated for gameplay and educational purposes and do not represent actual market prices, real investment opportunities, or real-world trading conditions. Any profits or losses displayed in the game have no real monetary value.
            </p>
            <p>
              Equity Arena does not provide financial, investment, trading, or legal advice. Information shown in the game should not be used as a basis for making real-world investment or trading decisions. Past simulated performance does not guarantee or indicate future results.
            </p>
            <p>
              All virtual currency used within the game, including <strong>IC (In-Game Currency)</strong>, has no cash value and cannot be exchanged for real money or other financial assets.
            </p>
            <p className="text-[#ffd200] font-bold">
              By using Equity Arena, you acknowledge and agree that you are participating in a simulated trading environment and that all market activity, assets, currency, profits, and losses are virtual and have no real-world monetary value.
            </p>
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
 * Spidey-Sense Custom Interactive Cursor Trail
 * ------------------------------------------------------------------ */
function SpideyCursor() {
  const dotRef = useRef(null);
  const trailingRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (trailingRef.current) {
        gsap.to(trailingRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block drop-shadow-[0_0_8px_rgba(255,0,85,0.7)]"
        style={{ transform: 'translate3d(-100px, -100px, 0)', willChange: 'transform' }}
      >
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          {/* Spidey Mask Red Outer Base */}
          <path
            d="M17 2C24.5 2 29 7.5 29 15C29 22.5 22.5 29.5 17 32C11.5 29.5 5 22.5 5 15C5 7.5 9.5 2 17 2Z"
            fill="#ff0055"
            stroke="#05070e"
            strokeWidth="2.5"
          />
          {/* Web Lines on Mask */}
          <path d="M17 2V32" stroke="#05070e" strokeWidth="1" opacity="0.6" />
          <path d="M5 15H29" stroke="#05070e" strokeWidth="1" opacity="0.6" />
          <path d="M8 8C12 11 22 11 26 8" stroke="#05070e" strokeWidth="1" opacity="0.6" />
          <path d="M8 22C12 19 22 19 26 22" stroke="#05070e" strokeWidth="1" opacity="0.6" />

          {/* Left Spidey Eye */}
          <path
            d="M7 14C8.5 10.5 12.5 9.5 14.5 12.5C15 13.5 14 17 11 18.5C8 20 7.5 17.5 7 14Z"
            fill="white"
            stroke="#05070e"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Right Spidey Eye */}
          <path
            d="M27 14C25.5 10.5 21.5 9.5 19.5 12.5C19 13.5 20 17 23 18.5C26 20 26.5 17.5 27 14Z"
            fill="white"
            stroke="#05070e"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        ref={trailingRef}
        className="fixed top-0 left-0 w-6 h-6 border-2 border-[#00f3ff] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 opacity-60 shadow-[0_0_6px_rgba(0,243,255,0.4)] hidden lg:block"
        style={{ transform: 'translate3d(-100px, -100px, 0)', willChange: 'transform' }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Main Landing Page Component
 * ------------------------------------------------------------------ */
export function Landing() {
  const { stocks, isLive } = useLiveStocks(3000);
  const index = useArenaIndex(stocks);
  const [isSlingingWeb, setIsSlingingWeb] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    try {
      const stored = localStorage.getItem('ea_disclaimer_accepted');
      return stored !== 'true';
    } catch (_) {
      return true;
    }
  });

  const handleAcceptDisclaimer = () => {
    try {
      localStorage.setItem('ea_disclaimer_accepted', 'true');
    } catch (_) {}
    setShowDisclaimer(false);
  };

  // Target refs for the sections
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);

  useScrollAnimation(homeRef, aboutRef, featuresRef);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const handleRegisterClick = (e) => {
    if (e) e.preventDefault();
    setIsSlingingWeb(true);
    setTimeout(() => {
      window.location.href = REGISTER_URL;
    }, 1800);
  };

  return (
    <div className="relative min-h-screen bg-[#05070e] text-slate-100 antialiased overflow-x-hidden">
      <SpideyCursor />
      {/* "The Bite" Full-Bleed Radial Impact Overlay */}
      <div id="gsap-bite-overlay" className="pointer-events-none fixed inset-0 z-[90] opacity-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/40 via-blue-600/20 to-transparent" />

      {/* Spidey-Sense Comic Alert Indicators (Left/Right margins) */}
      <div id="gsap-spidey-sense-left" className="pointer-events-none fixed left-4 top-1/3 z-[80] opacity-0 transition-opacity duration-300 select-none">
        <svg width="80" height="160" viewBox="0 0 80 160" className="stroke-[#ff0055] stroke-[3.5] fill-none overflow-visible drop-shadow-[0_0_12px_#ff0055]">
          <path d="M 20 10 Q 70 80 20 150" />
          <path d="M 35 25 Q 75 80 35 135" opacity="0.75" stroke="#ffd200" />
          <path d="M 50 40 Q 80 80 50 120" opacity="0.4" stroke="#ff0055" />
        </svg>
      </div>
      <div id="gsap-spidey-sense-right" className="pointer-events-none fixed right-4 top-1/3 z-[80] opacity-0 transition-opacity duration-300 select-none">
        <svg width="80" height="160" viewBox="0 0 80 160" className="stroke-[#ff0055] stroke-[3.5] fill-none overflow-visible drop-shadow-[0_0_12px_#ff0055]">
          <path d="M 60 10 Q 10 80 60 150" />
          <path d="M 45 25 Q 5 80 45 135" opacity="0.75" stroke="#ffd200" />
          <path d="M 30 40 Q 0 80 30 120" opacity="0.4" stroke="#ff0055" />
        </svg>
      </div>

      {/* Spiderweb Slinging Transition Overlay */}
      <AnimatePresence>
        {isSlingingWeb && <SpiderWebTransitionModal />}
      </AnimatePresence>

      {/* Regulatory Disclaimer Modal Popup */}
      <AnimatePresence>
        {showDisclaimer && <DisclaimerModal onClose={handleAcceptDisclaimer} />}
      </AnimatePresence>

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
        <Hero ref={homeRef} stocks={stocks} index={index} isLive={isLive} onRegisterClick={handleRegisterClick} />
        <TickerTape stocks={stocks} />

        <About ref={aboutRef} />
        <Features ref={featuresRef} />
        <FinalCTA onRegisterClick={handleRegisterClick} />
      </main>
      <Footer stocks={stocks} onRegisterClick={handleRegisterClick} />
    </div>
  );
}

export default Landing;
