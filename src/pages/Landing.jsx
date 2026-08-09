import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, ChevronDown, Coins, Gauge, LineChart, Lock,
  Menu, Newspaper, Play, Radio, Shield, Sparkles, TrendingUp, Trophy, Users, Wallet, X, Zap
} from 'lucide-react';
import { HeroDeck } from '../components/landing/HeroDeck';
import { useLiveStocks, useArenaIndex, sectorTheme } from '../hooks/useLiveStocks';

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

          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SLINGING TO <span className="text-gradient-spidey">REGISTRATION</span> DESK...
          </h3>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            Spidey-Sense Orderbook Connecting
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Intricate 2D SVG Spiderweb Corner Overlay */
function SpiderWebCorner({ className = "top-0 left-0", rotate = 0 }) {
  return (
    <div
      className={`pointer-events-none absolute z-0 opacity-40 hover:opacity-85 transition-opacity duration-700 w-36 h-36 sm:w-64 sm:h-64 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg width="100%" height="100%" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="spideyWebGrad" x1="0" y1="0" x2="260" y2="260" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4444" stopOpacity="0.85" />
            <stop offset="0.5" stopColor="#ff1e42" stopOpacity="0.75" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.85" />
          </linearGradient>
          <filter id="webGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Radial Web Strands */}
        <path d="M0 0 L260 260" stroke="url(#spideyWebGrad)" strokeWidth="1.4" filter="url(#webGlow)" />
        <path d="M0 0 L260 130" stroke="url(#spideyWebGrad)" strokeWidth="1" opacity="0.75" />
        <path d="M0 0 L130 260" stroke="url(#spideyWebGrad)" strokeWidth="1" opacity="0.75" />
        <path d="M0 0 L260 65" stroke="url(#spideyWebGrad)" strokeWidth="0.8" opacity="0.55" />
        <path d="M0 0 L65 260" stroke="url(#spideyWebGrad)" strokeWidth="0.8" opacity="0.55" />
        <path d="M0 0 L260 195" stroke="url(#spideyWebGrad)" strokeWidth="0.8" opacity="0.55" />
        <path d="M0 0 L195 260" stroke="url(#spideyWebGrad)" strokeWidth="0.8" opacity="0.55" />

        {/* Concentric Web Arcs */}
        <path d="M 45 0 Q 42 42 0 45" stroke="url(#spideyWebGrad)" strokeWidth="1" fill="none" />
        <path d="M 90 0 Q 84 84 0 90" stroke="url(#spideyWebGrad)" strokeWidth="1.2" fill="none" filter="url(#webGlow)" />
        <path d="M 135 0 Q 125 125 0 135" stroke="url(#spideyWebGrad)" strokeWidth="1.2" fill="none" />
        <path d="M 180 0 Q 168 168 0 180" stroke="url(#spideyWebGrad)" strokeWidth="1.4" fill="none" filter="url(#webGlow)" />
        <path d="M 225 0 Q 210 210 0 225" stroke="url(#spideyWebGrad)" strokeWidth="1.5" fill="none" />
        <path d="M 260 0 Q 240 240 0 260" stroke="url(#spideyWebGrad)" strokeWidth="1.6" fill="none" filter="url(#webGlow)" />

        {/* Glowing Web Nodes */}
        <circle cx="90" cy="84" r="3" fill="#ef4444" className="animate-ping" />
        <circle cx="180" cy="168" r="3" fill="#3b82f6" className="animate-pulse" />
        <circle cx="225" cy="210" r="3.5" fill="#ff1e42" />
      </svg>
    </div>
  );
}

/** Floating Web Strand Banner background */
function WebStrandPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="20%" x2="100%" y2="80%" stroke="#ef4444" strokeWidth="0.7" strokeDasharray="6 8" opacity="0.4" />
        <line x1="100%" y1="10%" x2="0" y2="90%" stroke="#3b82f6" strokeWidth="0.7" strokeDasharray="8 10" opacity="0.4" />
        <circle cx="30%" cy="40%" r="120" stroke="#ef4444" strokeWidth="0.5" fill="none" opacity="0.25" />
        <circle cx="70%" cy="60%" r="180" stroke="#3b82f6" strokeWidth="0.5" fill="none" opacity="0.25" />
      </svg>
    </div>
  );
}

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
    <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-red-300 backdrop-blur shadow-lg shadow-red-500/20">
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
  { label: 'Daily Bugle', href: '#news' },
  { label: 'Web Features', href: '#features' },
  { label: 'Spider-Verse', href: '#about' }
];

function Navbar({ onRegisterClick }) {
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
        scrolled ? 'border-b border-red-500/25 bg-[#05070e]/92 backdrop-blur-xl shadow-xl shadow-red-950/20' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 sm:px-8">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 overflow-hidden items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-blue-600 p-0.5 shadow-lg shadow-red-500/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <img src="/images/spider_emblem_hero.jpg" alt="Spider Emblem" className="h-full w-full object-cover rounded-[10px]" />
          </div>
          <span className="font-display text-[15px] sm:text-[17px] font-bold tracking-[0.14em] text-white">
            EQUITY<span className="text-red-500">ARENA</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 xl:gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-2 text-[14px] font-medium text-slate-400 transition-colors hover:text-white"
            >
              <span className={active === link.href ? 'text-red-400 font-bold' : ''}>{link.label}</span>
              {active === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-red-500 via-red-400 to-blue-500 shadow-md shadow-red-500/60"
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
            onClick={onRegisterClick}
            className="glow-ring group flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-4 py-2 sm:px-5 sm:py-2.5 text-[13px] sm:text-[14px] font-bold text-white shadow-lg shadow-red-600/35 transition-all hover:brightness-110 hover:shadow-red-500/60"
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
            className="overflow-hidden border-t border-red-500/20 bg-[#05070e]/95 backdrop-blur-xl lg:hidden"
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
                onClick={(e) => {
                  setMenuOpen(false);
                  onRegisterClick(e);
                }}
                className="mt-3 block rounded-xl bg-gradient-to-r from-red-600 to-blue-600 py-3 text-center text-sm font-bold text-white shadow-lg shadow-red-600/30"
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
 * Draggable Spider-Man — CSS drag, no complex hooks
 * ------------------------------------------------------------------ */
function DraggableSpiderMan() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const onDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startRef.current = { mx: clientX, my: clientY, ox: pos.x, oy: pos.y };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPos({
        x: startRef.current.ox + clientX - startRef.current.mx,
        y: startRef.current.oy + clientY - startRef.current.my,
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  return (
    <div
      onMouseDown={onDown}
      onTouchStart={onDown}
      className="group"
      style={{
        position: 'fixed',
        top: `calc(50vh - 120px + ${pos.y}px)`, // Centered vertically
        left: `calc(0% + ${pos.x}px)`,         // Flush to the left edge
        zIndex: 9999,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        animation: dragging ? 'none' : 'float-slow 4s ease-in-out infinite',
      }}
    >
      {/* Dynamic Glowing Aura */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{ 
          background: dragging 
            ? 'radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.5), transparent 70%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.25), transparent 70%)', 
          filter: dragging ? 'blur(30px)' : 'blur(22px)',
          transform: dragging ? 'scale(1.2)' : 'scale(1)',
          pointerEvents: 'none' 
        }} 
      />
      
      {/* Spider-Man Image with Hover & Drag Effects */}
      <img
        src="/images/spiderman_side.png"
        alt="Spider-Man"
        draggable={false}
        className="transition-all duration-300 group-hover:drop-shadow-[0_8px_24px_rgba(239,68,68,0.6)]"
        style={{ 
          width: 'clamp(140px,16vw,260px)', 
          display: 'block', 
          position: 'relative', 
          filter: dragging 
            ? 'drop-shadow(0 15px 30px rgba(239,68,68,0.8)) brightness(1.15)' 
            : 'drop-shadow(0 4px 18px rgba(239,68,68,0.4))',
          transform: dragging ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)'
        }}
      />

      {/* Sleek Tooltip */}
      {!dragging && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-red-950/90 text-red-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-500/40 whitespace-nowrap uppercase tracking-widest shadow-[0_0_12px_rgba(239,68,68,0.4)] backdrop-blur-sm">
            Drag Me
          </span>
        </div>
      )}
    </div>
  );
}



/* ------------------------------------------------------------------ *
 * Hero Section — With Intricate Corner Spiderweb Overlays
 * ------------------------------------------------------------------ */
const HERO_FEATURES = [
  { icon: Zap, title: 'Spidey-Sense Ticker', sub: 'Sub-second WebSocket web' },
  { icon: Shield, title: 'Stark Nanotech Fills', sub: 'Instant order execution' },
  { icon: BarChart3, title: 'Spider-Verse Depth', sub: 'Real-time index matrix' }
];

function Hero({ stocks, index, isLive, onRegisterClick }) {
  const { scrollY } = useScroll();
  const y = useSpring(useTransform(scrollY, [0, 700], [0, 110]), { stiffness: 90, damping: 22 });
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-[72px] spider-web-bg">
      {/* 🕸️ Intricate Corner Spiderwebs */}
      <SpiderWebCorner className="top-0 left-0" rotate={0} />
      <SpiderWebCorner className="top-0 right-0" rotate={90} />
      <WebStrandPattern />

      {/* Backdrop: Spider-man radial glows + receding grid floor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-[580px] w-[580px] rounded-full bg-red-600/25 blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[1000px] -translate-x-1/2 rounded-full bg-red-700/18 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] grid-floor opacity-75" />
      </div>

      {/* 🕷️ Spider-Man — absolute, hanging from the very top of the hero (non-draggable) */}
      <div className="absolute top-0 right-[4%] lg:right-[8%] xl:right-[10%] z-10 pointer-events-none hidden sm:flex flex-col items-center">
        {/* Web strand */}
        <div
          style={{
            width: '3px',
            height: '90px',
            background: 'linear-gradient(to bottom, rgba(180,180,180,0.9) 0%, #b0b0b0 60%, #888 100%)',
            boxShadow: '0 0 4px 1px rgba(180,180,180,0.35)',
          }}
        />
        {/* Pendulum swing */}
        <motion.div
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center' }}
          className="relative mt-[-1px]"
        >
          {/* Ambient glow */}
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
        {/* ---------- Left column ---------- */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[12px] font-bold text-red-300 backdrop-blur shadow-lg shadow-red-500/20">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-live" />
              🕷️ SPIDER TRADING NETWORK • WEB-SHOOTER SPEED • ZERO RISK
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display mt-6 sm:mt-7 text-[clamp(2.25rem,6vw,4.6rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white"
          >
            With great capital
            <br />
            comes <span className="text-gradient-spidey">great responsibility.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 sm:mt-6 max-w-[460px] text-[15px] sm:text-[16px] leading-relaxed text-slate-300">
            Step into the Spider-Verse of trading. Monitor 15 high-volatility sector stocks,
            sense price swings with your Spidey-Sense ticker, and sling orders across the live market web with 20,000 Ignite Coins.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-8 sm:mt-9 flex flex-wrap items-center gap-4 sm:gap-5">
            <a
              href={REGISTER_URL}
              onClick={onRegisterClick}
              className="glow-ring group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-6 py-3.5 sm:px-7 sm:py-4 text-[14px] sm:text-[15px] font-bold text-white shadow-xl shadow-red-600/40 transition-all hover:scale-[1.03] hover:shadow-red-500/70"
            >
              Register Now
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1.5" />
            </a>

            <a href="#features" className="group flex items-center gap-3.5">
              <span className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-red-500/40 bg-red-500/15 transition-all group-hover:border-red-400 group-hover:bg-red-500/25">
                <Play className="h-4 w-4 fill-white text-white translate-x-[1px]" />
                <span className="absolute inset-0 rounded-full border border-blue-400/40 opacity-0 transition-all duration-500 group-hover:scale-[1.35] group-hover:opacity-100" />
              </span>
              <span className="text-[14px] sm:text-[15px] font-medium text-slate-300 transition group-hover:text-white">
                Explore Web Terminal
              </span>
            </a>
          </motion.div>

          {/* Feature strip */}
          <motion.div
            variants={fadeUp}
            className="mt-10 sm:mt-12 grid grid-cols-1 gap-2.5 rounded-2xl border border-red-500/30 bg-slate-900/70 p-2 backdrop-blur-md sm:grid-cols-3 shadow-2xl"
          >
            {HERO_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-red-500/15"
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

        {/* ---------- Right column: HeroDeck ---------- */}
        <motion.div style={{ y }} className="relative flex flex-col items-center lg:pr-4">
          
          {/* Mobile-only: Hanging Spider-Man in flow (since absolute is hidden on mobile) */}
          <div className="flex sm:hidden flex-col items-center w-full mb-4">
            <div style={{ width: '3px', height: '50px', background: 'linear-gradient(to bottom, rgba(180,180,180,0.9), #888)', boxShadow: '0 0 4px 1px rgba(180,180,180,0.3)' }} />
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top center' }}
              className="mt-[-1px]"
            >
              <img
                src="/images/spiderman_hanging.png"
                alt="Spider-Man hanging from web"
                draggable={false}
                className="w-[140px] select-none"
                style={{ mixBlendMode: 'multiply', filter: 'drop-shadow(0 4px 20px rgba(239,68,68,0.55))' }}
              />
            </motion.div>
          </div>

          {/* HeroDeck trading terminal card */}
          <div className="w-full relative rounded-3xl p-2 border border-red-500/40 bg-gradient-to-b from-red-600/15 via-slate-950 to-blue-600/15 shadow-2xl shadow-red-950/90 backdrop-blur-xl">
            <HeroDeck stocks={stocks} index={index} isLive={isLive} />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-7 z-10 mx-auto flex max-w-[1280px] items-center justify-between px-5 sm:px-8"
      >
        <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-red-400">
          <span className="flex h-5 w-3.5 items-start justify-center rounded-full border border-red-500/50 pt-1">
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
 * Stats band
 * ------------------------------------------------------------------ */
const STATS = [
  { value: 15, suffix: '', label: 'Spider-Sense Listings' },
  { value: 20000, suffix: ' IC', label: 'Web Capital Balance' },
  { value: 100, suffix: '%', label: 'Risk-Free Simulation' }
];

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
    <section className="relative border-b border-red-500/20 py-16 bg-slate-950/90">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-5 sm:grid-cols-3 sm:px-8">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center lg:text-left">
            <CountUp to={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-[13px] text-red-400 font-medium">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Markets — Spider Board with Corner Webs
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
      className="layer-3d group relative overflow-hidden rounded-2xl border border-red-500/25 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-4 backdrop-blur-md transition-all hover:border-red-500/60 hover:shadow-xl hover:shadow-red-950/60"
    >
      {/* Spiderweb watermark inside stock cards */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-25 transition-opacity">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#ef4444" strokeWidth="1">
          <path d="M0 0 L100 100 M100 0 L0 100 M50 0 L50 100 M0 50 L100 50" />
          <circle cx="50" cy="50" r="20" />
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>

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
            <span className="ml-1 text-[11px] font-normal text-red-400/80">IC</span>
          </p>
          <p className="mt-1 text-[10.5px] uppercase tracking-wider text-slate-400">{stock.sector}</p>
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

function Markets({ stocks, isLive, onRegisterClick }) {
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
      <SpiderWebCorner className="bottom-0 left-0" rotate={270} />

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

          <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-red-500/25 bg-slate-900/70 p-1.5 backdrop-blur-md">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`relative shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  filter === tab.id ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === tab.id && (
                  <motion.span
                    layoutId="market-tab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-lg shadow-red-600/35"
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

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-500/25 bg-slate-900/50 px-6 py-5 shadow-xl">
          <p className="flex items-center gap-2.5 text-[13.5px] text-slate-300">
            <span className={`h-2.5 w-2.5 rounded-full ${isLive ? 'bg-red-500 animate-live' : 'bg-amber-400'}`} />
            {isLive
              ? 'Streaming live price ticks across the Equity Arena exchange web'
              : 'Showing reference market seeds — register to enter the live Spider-Verse'}
          </p>
          <a
            href={REGISTER_URL}
            onClick={onRegisterClick}
            className="group flex items-center gap-2 text-[14px] font-bold text-red-400 transition hover:text-red-300"
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
    <section id="features" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/70">
      <SpiderWebCorner className="top-0 right-0" rotate={90} />

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
              className={`glow-ring layer-3d group relative overflow-hidden rounded-2xl border border-red-500/25 bg-gradient-to-b from-slate-900/85 to-slate-950/95 p-6 backdrop-blur-md shadow-xl ${span}`}
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

function News({ onRegisterClick }) {
  return (
    <section id="news" className="relative overflow-hidden border-t border-red-500/20 py-24 sm:py-28">
      <SpiderWebCorner className="top-0 left-0" rotate={0} />

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
            onClick={onRegisterClick}
            className="group flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-[14px] font-bold text-slate-200 transition hover:border-red-400 hover:bg-red-500/20"
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
              className="group relative overflow-hidden rounded-2xl border border-red-500/25 bg-slate-900/70 p-6 backdrop-blur-md transition-colors hover:border-red-500/50 shadow-xl"
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
    <section id="about" className="relative border-t border-red-500/20 py-24 sm:py-28 bg-slate-950/80">
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
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent lg:block" />

          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <motion.div
              key={n}
              variants={fadeUp}
              whileHover={{ y: -7, rotateY: 5, transition: { duration: 0.25 } }}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Closing CTA — Spider-Man Web Skyline Banner with 4 Corner Webs
 * ------------------------------------------------------------------ */
function FinalCTA({ onRegisterClick }) {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <div className="stage-3d relative overflow-hidden rounded-[32px] border border-red-500/40 bg-slate-950 px-6 py-16 text-center sm:px-16 sm:py-20 shadow-2xl shadow-red-950/90">
            {/* 🕸️ Spiderweb Corner Overlays inside CTA Banner */}
            <SpiderWebCorner className="top-0 left-0" rotate={0} />
            <SpiderWebCorner className="top-0 right-0" rotate={90} />
            <SpiderWebCorner className="bottom-0 left-0" rotate={270} />
            <SpiderWebCorner className="bottom-0 right-0" rotate={180} />

            {/* Background Image: Futuristic Spider Web City Skyline */}
            <div className="absolute inset-0 -z-10 opacity-40">
              <img src="/images/spider_web_banner.jpg" alt="Spider Web Skyline" className="h-full w-full object-cover" />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

            <motion.div
              className="layer-3d relative z-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-[12px] font-bold text-red-300 backdrop-blur shadow-lg shadow-red-500/20">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-live" />
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
                  onClick={onRegisterClick}
                  className="glow-ring group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-xl shadow-red-600/40 transition-all hover:scale-[1.03] hover:shadow-red-500/70"
                >
                  Register Now
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1.5" />
                </a>
                <a
                  href="#markets"
                  className="rounded-2xl border border-red-500/40 bg-slate-900/70 px-7 py-4 text-[15px] font-medium text-slate-200 backdrop-blur transition hover:border-red-400 hover:bg-red-500/15"
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
function Footer({ stocks, onRegisterClick }) {
  return (
    <footer className="border-t border-red-500/25 bg-[#030409] py-14">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-blue-600">
                <img src="/images/spider_emblem_hero.jpg" alt="Spider Emblem" className="h-full w-full object-cover" />
              </div>
              <span className="font-display text-[17px] font-bold tracking-[0.14em] text-white">
                EQUITY<span className="text-red-500">ARENA</span>
              </span>
            </div>
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-relaxed text-slate-400">
              A real-time simulated Spider-Verse stock exchange for learning market dynamics. Built for traders, run on Ignite Coins.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-red-400">Spider Web</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-slate-400">
              {['Markets', 'News', 'Features'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="transition hover:text-slate-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-red-400">Top listings</h4>
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
            <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-red-400">Account</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-slate-400">
              <li><a href={REGISTER_URL} onClick={onRegisterClick} className="transition hover:text-slate-200">Register</a></li>
              <li><a href={REGISTER_URL} onClick={onRegisterClick} className="transition hover:text-slate-200">Trading Floor</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-red-500/20 pt-7 sm:flex-row">
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
    <div className="relative min-h-screen bg-[#05070e] text-slate-100 antialiased">
      {/* Spiderweb Slinging Transition Overlay */}
      <SpiderWebTransitionModal isOpen={isSlingingWeb} />

      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-md shadow-red-500"
      />

      <Navbar onRegisterClick={handleRegisterClick} />
      <DraggableSpiderMan />
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
