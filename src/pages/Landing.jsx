import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, Check, ChevronDown, Coins, Compass, Copy, Crosshair, ExternalLink,
  Gauge, LineChart, Lock, MapPin, Menu, Moon, Navigation, Newspaper, Play, Radio,
  Shield, Sparkles, Sun, TrendingUp, Trophy, Users, Wallet, X, Zap
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md overflow-hidden pointer-events-auto p-4"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10 blur-3xl opacity-60 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="card-neo w-full max-w-[620px] bg-white dark:bg-[#131c30] border-4 border-slate-950 max-h-[85vh] overflow-y-auto flex flex-col p-6 sm:p-8 relative shadow-[8px_8px_0px_#ff0055]"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="badge-neo bg-[#ffd200] text-slate-950 px-2.5 py-1 text-[11px] font-black shadow-[2px_2px_0px_#05070e]">
            WARNING // REGULATORY DISCLAIMER
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] select-none font-bold">ID: EA-SEC-99</span>
        </div>

        <h3 className="font-display text-slate-950 dark:text-white text-xl sm:text-2xl font-black tracking-tight mb-2 text-left">
          EQUITY ARENA — LEGAL DISCLAIMER
        </h3>

        <div className="space-y-4 font-mono text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed max-h-[40vh] overflow-y-auto pr-3 border-y border-slate-200 dark:border-slate-800 py-4 my-4 text-left font-medium">
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
          <p className="text-red-600 font-bold">
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
            <span className="font-mono text-[11px] text-slate-600 leading-tight font-bold">
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 dark:bg-[#0c1222] overflow-hidden pointer-events-auto"
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
          <svg viewBox="0 0 300 300" fill="none" className="w-[85vw] h-[85vw] max-w-[450px] max-h-[450px]">
            <circle cx="150" cy="150" r="120" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="8 6" />
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
        <svg viewBox="0 0 600 600" fill="none" className="w-[90vw] h-[90vw] max-w-[850px] max-h-[850px]">
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
        className="absolute z-30 top-1/4 left-1/4 pointer-events-none select-none font-display font-black text-4xl sm:text-6xl text-white bg-[#ff0055] border-3 border-slate-950 px-6 py-2.5 shadow-[4px_4px_0px_#0284c7] rounded-lg -rotate-12"
      >
        *ZIP!*
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: [0, 2.0, 0], rotate: [-20, 15, 35], opacity: [0, 0.95, 0] }}
        transition={{ duration: 0.8, delay: 0.35, times: [0, 0.35, 1], ease: "backOut" }}
        className="absolute z-30 bottom-1/4 right-1/4 pointer-events-none select-none font-display font-black text-4xl sm:text-6xl text-slate-950 bg-[#00c3ff] border-3 border-slate-950 px-6 py-2.5 shadow-[4px_4px_0px_#ffd200] rounded-lg rotate-12"
      >
        *SHWIIP!*
      </motion.div>

      {/* Center Spidey Status Neo-Brutalist Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 mx-4 max-w-[420px] bg-white dark:bg-[#131c30] border-4 border-slate-950 p-8 text-center rounded-xl shadow-[8px_8px_0px_#ff0055]"
      >
        {/* Top accent hazard stripes inside card */}
        <div 
          className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #ffd200, #ffd200 6px, #05070e 6px, #05070e 12px)'
          }}
        />

        {/* Stylized Neo-Brutalist Badge */}
        <div className="relative mx-auto mb-5 mt-2 flex h-20 w-20 items-center justify-center rounded-2xl border-3 border-slate-950 bg-[#ff0055] shadow-[4px_4px_0px_#05070e] text-white select-none">
          <Radio className="h-10 w-10 animate-pulse" strokeWidth={2} />
        </div>

        <span className="badge-neo bg-[#ffd200] text-slate-950 px-3 py-1.5 text-[10px] font-black shadow-[2px_2px_0px_#05070e]">
          CONNECTION DEPLOYED
        </span>

        <h3 className="font-display mt-5 text-2xl font-black tracking-tight text-slate-950 dark:text-white uppercase">
          TELEPORTING TO SYSTEM
        </h3>

        <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono font-bold">
          Deploying simulated capital • Live WebSocket feeds live
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Spidey-Tracer Tactical Campus Radar & Interactive Map Modal */
function SpideyTrackerModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [radarActive, setRadarActive] = useState(true);

  // Default campus venue profile
  const venue = {
    name: 'Ignite 8.0 Arena • Central Campus Auditorium',
    address: 'Campus Tech Complex, Ground Floor Innovation Hall',
    city: 'College Campus',
    coords: '19.0760° N, 72.8777° E',
    lat: 19.0760,
    lng: 72.8777,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Central+Campus+Auditorium'
  };

  const handleCopyCoords = () => {
    try {
      navigator.clipboard?.writeText?.(`${venue.coords} - ${venue.name}`);
    } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 dark:bg-black/85 backdrop-blur-md overflow-y-auto pointer-events-auto p-3 sm:p-5"
    >
      {/* Background Stark-tech Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-transparent to-cyan-500/15 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.88, y: 25 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 25 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="card-neo w-full max-w-[760px] bg-white dark:bg-[#0f172a] border-4 border-slate-950 max-h-[92vh] overflow-y-auto flex flex-col p-4 sm:p-6 relative shadow-[8px_8px_0px_#ff0055] rounded-2xl"
      >
        {/* Top Hazard Accent Stripe */}
        <div 
          className="absolute top-0 left-0 right-0 h-2 pointer-events-none rounded-t-xl"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #ff0055, #ff0055 8px, #ffd200 8px, #ffd200 16px, #00f3ff 16px, #00f3ff 24px)'
          }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 pt-2 pb-3 border-b-2 border-slate-950 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* Spider-Tracer Device Icon */}
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#ff0055] border-2 border-slate-950 shadow-[2px_2px_0px_#05070e] text-white shrink-0">
              <Crosshair className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-neo bg-[#ffd200] text-slate-950 !px-1.5 !py-0.5 !text-[8.5px] font-black shadow-[1.5px_1.5px_0px_#05070e]">
                  SPIDEY-TRACER v4.2
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 animate-pulse flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> TARGET LOCKED
                </span>
              </div>
              <h3 className="font-display text-slate-950 dark:text-white text-base sm:text-xl font-black tracking-tight leading-tight uppercase">
                SPIDEY TRACKER // CAMPUS RADAR
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Spidey Tracker"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border-2 border-slate-950 bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white shadow-[2px_2px_0px_#05070e] transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Telemetry Radar Readout Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 font-mono text-[10px] sm:text-[11px]">
          <div className="p-2 rounded-lg border-2 border-slate-950 bg-slate-50 dark:bg-[#131c30] shadow-[2px_2px_0px_#05070e]">
            <span className="text-slate-500 dark:text-slate-400 block text-[8.5px] font-bold uppercase">Signal Telemetry</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">100% STARK-LINK</span>
          </div>
          <div className="p-2 rounded-lg border-2 border-slate-950 bg-slate-50 dark:bg-[#131c30] shadow-[2px_2px_0px_#05070e]">
            <span className="text-slate-500 dark:text-slate-400 block text-[8.5px] font-bold uppercase">Direct Distance</span>
            <span className="font-black text-[#0284c7] text-xs">0.0 KM • DIRECT</span>
          </div>
          <div className="p-2 rounded-lg border-2 border-slate-950 bg-slate-50 dark:bg-[#131c30] shadow-[2px_2px_0px_#05070e]">
            <span className="text-slate-500 dark:text-slate-400 block text-[8.5px] font-bold uppercase">Coordinates</span>
            <span className="font-black text-[#ff0055] text-[10px] truncate block">{venue.coords}</span>
          </div>
          <div className="p-2 rounded-lg border-2 border-slate-950 bg-slate-50 dark:bg-[#131c30] shadow-[2px_2px_0px_#05070e]">
            <span className="text-slate-500 dark:text-slate-400 block text-[8.5px] font-bold uppercase">Event Timeline</span>
            <span className="font-black text-[#d97706] text-xs">SEPT 4 • 3-HR</span>
          </div>
        </div>

        {/* Tactical Map Container with Spidey Radar Overlay */}
        <div className="relative w-full h-[270px] sm:h-[340px] rounded-xl border-3 border-slate-950 overflow-hidden shadow-[4px_4px_0px_#05070e] bg-slate-900">
          {/* Interactive Google Map Embed */}
          <iframe
            title="Spidey Tracker College Map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.name + ' ' + venue.city)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
            loading="lazy"
          />

          {/* Corner Crosshairs */}
          <div className="absolute top-2 left-2 pointer-events-none font-mono text-[10px] font-black text-[#ff0055] select-none">
            + [RADAR_NW]
          </div>
          <div className="absolute top-2 right-2 pointer-events-none font-mono text-[10px] font-black text-[#00f3ff] select-none">
            [RADAR_NE] +
          </div>
          <div className="absolute bottom-2 left-2 pointer-events-none font-mono text-[10px] font-black text-[#ffd200] select-none">
            + [GRID_SW]
          </div>
          <div className="absolute bottom-2 right-2 pointer-events-none font-mono text-[10px] font-black text-emerald-400 select-none">
            [GRID_SE] +
          </div>

          {/* Radar Sweep Scanner Effect (Overlaid on the map) */}
          {radarActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-40">
              {/* Concentric Radar Sonar Rings */}
              <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full border border-cyan-400/60 animate-sonar-ping" />
              <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full border border-red-500/60 animate-sonar-ping-delayed" />
              
              {/* Rotating Radar Sweep Cone */}
              <div 
                className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full animate-radar-sweep pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(0, 243, 255, 0.45) 0deg, rgba(0, 243, 255, 0.1) 45deg, transparent 70deg, transparent 360deg)'
                }}
              />
            </div>
          )}

          {/* Pulsing Spidey-Tracer Pin on Center of Map */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center">
            <div className="relative animate-tracker-target">
              {/* Spidey mask / tracer target badge */}
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#ff0055] border-2 sm:border-3 border-slate-950 text-white shadow-[3px_3px_0px_#05070e]">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#ffd200] rotate-45 border border-slate-950" />
            </div>
            {/* Target Label */}
            <div className="mt-1.5 bg-slate-950/90 text-white border border-[#00f3ff] px-2 py-0.5 rounded text-[9px] font-mono font-black shadow-[2px_2px_0px_#000] whitespace-nowrap">
              🎯 SPIDEY-TRACER // COLLEGE VENUE
            </div>
          </div>

          {/* Interactive Map Overlay Controls */}
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRadarActive(!radarActive)}
              className="badge-neo !px-2 !py-1 !text-[9px] bg-slate-900/90 text-white border-2 border-slate-950 font-mono font-black shadow-[2px_2px_0px_#000] cursor-pointer hover:bg-slate-800"
            >
              {radarActive ? '⚡ RADAR: ON' : '⏸ RADAR: PAUSED'}
            </button>
          </div>
        </div>

        {/* Venue Information Dossier */}
        <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl border-2 border-slate-950 bg-slate-50 dark:bg-[#131c30] shadow-[3px_3px_0px_#05070e] text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-neo bg-[#0284c7] text-white !px-1.5 !py-0.5 !text-[8.5px] font-black">
                  OFFICIAL VENUE
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold">IGNITE 8.0 ARENA</span>
              </div>
              <h4 className="font-display text-slate-950 dark:text-white font-black text-sm sm:text-base mt-1">
                {venue.name}
              </h4>
              <p className="font-mono text-slate-600 dark:text-slate-300 text-xs mt-0.5 font-medium">
                {venue.address} • {venue.city}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3.5 pt-2">
          <button
            type="button"
            onClick={handleCopyCoords}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-slate-950 bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-mono text-xs font-black shadow-[2px_2px_0px_#05070e] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all w-full sm:w-auto active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
            <span>{copied ? 'COORDINATES COPIED!' : 'COPY VENUE COORDS'}</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neo flex-1 sm:flex-none justify-center px-5 py-3 text-xs font-black shadow-[3px_3px_0px_#05070e] flex items-center gap-1.5"
            >
              <Navigation className="h-4 w-4" />
              NAVIGATE IN GOOGLE MAPS <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Corner Spiderweb SVG Overlay */
function SpiderWebCorner({ className = "top-0 left-0", rotate = 0 }) {
  return (
    <div
      className={`pointer-events-none absolute z-10 opacity-55 dark:opacity-85 transition-opacity hover:opacity-100 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg data-gsap="corner-web" width="190" height="190" viewBox="0 0 180 180" fill="none" className="drop-shadow-[0_0_12px_rgba(255,0,85,0.65)]">
        <path d="M0 0 L180 0 M0 0 L0 180" stroke="#ff0055" strokeWidth="2" />
        <path d="M0 0 L140 140" stroke="#00f3ff" strokeWidth="1.8" strokeDasharray="3 3" />
        <path d="M30 0 Q 30 30 0 30" stroke="#ff0055" strokeWidth="1.6" fill="none" />
        <path d="M60 0 Q 60 60 0 60" stroke="#ffd200" strokeWidth="1.6" fill="none" />
        <path d="M90 0 Q 90 90 0 90" stroke="#ff0055" strokeWidth="1.6" fill="none" />
        <path d="M120 0 Q 120 120 0 120" stroke="#00f3ff" strokeWidth="1.8" fill="none" />
        <path d="M150 0 Q 150 150 0 150" stroke="#ff0055" strokeWidth="1.6" fill="none" />
        <circle cx="140" cy="140" r="3.5" fill="#00f3ff" className="animate-pulse" />
      </svg>
    </div>
  );
}

/** Spider Web Strand Grid Lines Background */
function WebStrandPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20 dark:opacity-50">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="spiderGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#ff0055" strokeWidth="1.2" strokeOpacity="0.75" />
            <path d="M 0 0 L 100 100" fill="none" stroke="#00f3ff" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.8" />
            <path d="M 100 0 L 0 100" fill="none" stroke="#ffd200" strokeWidth="0.8" strokeDasharray="2 5" strokeOpacity="0.5" />
            <circle cx="50" cy="50" r="2.5" fill="#00f3ff" fillOpacity="0.85" />
            <circle cx="0" cy="0" r="3" fill="#ff0055" fillOpacity="0.85" />
            <circle cx="100" cy="100" r="3" fill="#ff0055" fillOpacity="0.85" />
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
function Navbar({ onRegisterClick, onTrackerClick, theme, onToggleTheme }) {
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
          ? 'border-b-3 border-slate-950 bg-white/92 dark:bg-[#0c1222]/92 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-2.5">
          <span className="badge-neo bg-[#ff0055] text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow-[1.5px_1.5px_0px_#05070e] uppercase transition-transform group-hover:scale-105 group-hover:-rotate-2">
            IGNITE 8.0
          </span>
          <span className="font-display text-[15px] font-black tracking-tight text-slate-950 dark:text-white transition-colors group-hover:text-red-600 uppercase">
            EQUITY <span className="text-red-600">ARENA</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:gap-8 md:flex">
          <a
            href="#home"
            className="relative text-[12.5px] font-bold uppercase font-mono tracking-wide text-slate-800 dark:text-slate-200 transition-all hover:text-red-600 dark:hover:text-red-500 after:absolute after:bottom-[-6px] after:left-0 after:h-[2.5px] after:w-full after:scale-x-0 after:bg-gradient-to-r after:from-[#ff0055] after:to-[#0284c7] after:transition-transform after:duration-250 hover:after:scale-x-100"
          >
            Home
          </a>
          <a
            href="#features"
            className="relative text-[12.5px] font-bold uppercase font-mono tracking-wide text-slate-800 dark:text-slate-200 transition-all hover:text-red-600 dark:hover:text-red-500 after:absolute after:bottom-[-6px] after:left-0 after:h-[2.5px] after:w-full after:scale-x-0 after:bg-gradient-to-r after:from-[#ff0055] after:to-[#0284c7] after:transition-transform after:duration-250 hover:after:scale-x-100"
          >
            Highlights
          </a>
          <a
            href="#about"
            className="relative text-[12.5px] font-bold uppercase font-mono tracking-wide text-slate-800 dark:text-slate-200 transition-all hover:text-red-600 dark:hover:text-red-500 after:absolute after:bottom-[-6px] after:left-0 after:h-[2.5px] after:w-full after:scale-x-0 after:bg-gradient-to-r after:from-[#ff0055] after:to-[#0284c7] after:transition-transform after:duration-250 hover:after:scale-x-100"
          >
            Rules & Onboarding
          </a>

          {/* Spidey Tracker Nav Trigger */}
          <button
            type="button"
            onClick={onTrackerClick}
            className="relative text-[12px] font-bold uppercase font-mono tracking-wide text-slate-800 dark:text-slate-200 transition-all hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-950/20 dark:border-slate-700/60 bg-slate-100/60 dark:bg-slate-800/60 shadow-sm cursor-pointer hover:border-red-500"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0055]" />
            </span>
            <span>Spidey Tracker</span>
          </button>
        </nav>

        {/* Action Buttons & Theme Toggle */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Light and Dark Theme"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="theme-toggle-btn group"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-[#ffd200] transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>

          <a
            href={REGISTER_URL}
            onClick={onRegisterClick}
            className="btn-neo px-5 py-2.5 text-[13px] font-extrabold group"
          >
            Register Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Mobile menu controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onTrackerClick}
            aria-label="Open Spidey Tracker"
            title="Spidey Tracker // Campus Radar"
            className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-950 bg-[#ff0055] text-white shadow-[2px_2px_0px_#05070e] transition-transform active:scale-95"
          >
            <Crosshair className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Light and Dark Theme"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="theme-toggle-btn group !h-9 !w-9"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-[#ffd200]" /> : <Moon className="h-4 w-4 text-slate-800" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Mobile Navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-950 bg-white dark:bg-[#131c30] text-slate-950 dark:text-white shadow-[2px_2px_0px_#05070e] transition-transform active:scale-95"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — Cyber Neo-Brutalist Action HUD */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative border-b-4 border-slate-950 bg-white/98 dark:bg-[#10172a]/98 px-5 py-6 backdrop-blur-2xl md:hidden shadow-[0_12px_32px_rgba(0,0,0,0.35)] overflow-hidden"
          >
            {/* Top Hazard Accent Stripe */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #ff0055, #ff0055 8px, #ffd200 8px, #ffd200 16px, #00f3ff 16px, #00f3ff 24px)'
              }}
            />

            {/* Mobile Header Info Pill */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="badge-neo bg-[#ffd200] text-slate-950 !px-2 !py-0.5 !text-[9px] font-black">
                  ARENA 15 // LIVE
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                  FEED: ACTIVE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                SEPT 4 • 20K IC
              </span>
            </div>

            <nav className="flex flex-col gap-2.5">
              <a
                href="#home"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between border-2 border-slate-950 bg-slate-100 dark:bg-[#131c30] px-4 py-3 rounded-lg shadow-[2px_2px_0px_#05070e] text-sm font-mono font-black text-slate-950 dark:text-white transition-all active:translate-x-[1px] active:translate-y-[1px] border-l-4 border-l-[#ff0055]"
              >
                <span>🏠 Home Deck</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between border-2 border-slate-950 bg-slate-100 dark:bg-[#131c30] px-4 py-3 rounded-lg shadow-[2px_2px_0px_#05070e] text-sm font-mono font-black text-slate-950 dark:text-white transition-all active:translate-x-[1px] active:translate-y-[1px] border-l-4 border-l-[#0284c7]"
              >
                <span>⚡ Event Highlights</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
              <a
                href="#about"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between border-2 border-slate-950 bg-slate-100 dark:bg-[#131c30] px-4 py-3 rounded-lg shadow-[2px_2px_0px_#05070e] text-sm font-mono font-black text-slate-950 dark:text-white transition-all active:translate-x-[1px] active:translate-y-[1px] border-l-4 border-l-[#ffd200]"
              >
                <span>📋 Rules & Onboarding</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>

              {/* Mobile Spidey Tracker Button */}
              <button
                type="button"
                onClick={() => { setMobileOpen(false); onTrackerClick(); }}
                className="flex items-center justify-between border-2 border-slate-950 bg-slate-100 dark:bg-[#131c30] px-4 py-3 rounded-lg shadow-[2px_2px_0px_#05070e] text-sm font-mono font-black text-slate-950 dark:text-white transition-all active:translate-x-[1px] active:translate-y-[1px] border-l-4 border-l-[#ff0055]"
              >
                <div className="flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-[#ff0055]" />
                  <span>🎯 Spidey Tracker // Campus Map</span>
                </div>
                <span className="badge-neo !px-1.5 !py-0.5 !text-[8.5px] bg-[#ffd200] text-slate-950">
                  GPS
                </span>
              </button>
              
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center justify-between border-2 border-slate-950 bg-slate-100 dark:bg-[#131c30] px-4 py-3 rounded-lg shadow-[2px_2px_0px_#05070e] text-sm font-mono font-black text-slate-950 dark:text-white transition-all border-l-4 border-l-[#00f3ff]"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-[#ffd200]" /> : <Moon className="h-4 w-4 text-slate-800" />}
                  <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </div>
                <span className="badge-neo !px-1.5 !py-0.5 !text-[8.5px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {theme.toUpperCase()}
                </span>
              </button>

              <a
                href={REGISTER_URL}
                onClick={(e) => { setMobileOpen(false); onRegisterClick(e); }}
                className="btn-neo mt-2 justify-center py-3.5 text-sm font-black text-center shadow-[4px_4px_0px_#05070e]"
              >
                REGISTER ACCOUNT [20,000 IC] <ArrowRight className="h-4 w-4 ml-1" />
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
  { icon: Zap, title: 'Live Ticker Feed', sub: 'Sub-second WebSocket network' },
  { icon: Shield, title: 'Instant Fills', sub: 'Instant order execution' },
  { icon: BarChart3, title: 'Market Depth', sub: 'Real-time index matrix' }
];

const Hero = forwardRef(({ stocks, index, isLive, onRegisterClick, onTrackerClick }, ref) => {
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
    <section ref={ref} id="home" className="relative min-h-screen overflow-hidden pt-[68px] sm:pt-[72px] spider-web-bg bg-slate-50 dark:bg-[#0c1222]">
      {/* Corner Spiderwebs */}
      <SpiderWebCorner className="top-0 left-0" rotate={0} />
      <SpiderWebCorner className="top-0 right-0" rotate={90} />
      <WebStrandPattern />

      {/* Backdrop: Radial glows + receding grid floor (GSAP Parallax) */}
      <div data-gsap="parallax" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-[380px] sm:h-[580px] w-[380px] sm:w-[580px] rounded-full bg-red-400/15 blur-[100px] sm:blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-[320px] sm:h-[520px] w-[320px] sm:w-[520px] rounded-full bg-blue-400/15 blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] sm:h-[400px] w-[600px] sm:w-[1000px] -translate-x-1/2 rounded-full bg-amber-400/15 blur-[90px] sm:blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] grid-floor opacity-60" />
      </div>

      {/* Spider-Man hanging from web — now fully responsive and visible on mobile & desktop! */}
      <div id="gsap-hero-spiderman-wrapper" className="absolute top-0 right-[1%] sm:right-[4%] lg:right-[8%] xl:right-[10%] z-10 pointer-events-none flex flex-col items-center">
        <div
          id="gsap-hero-spiderman-line"
          style={{
            width: '3px',
            height: 'clamp(50px, 7vw, 90px)',
            background: 'linear-gradient(to bottom, rgba(100,100,100,0.8) 0%, #666 60%, #333 100%)',
            boxShadow: '0 0 4px 1px rgba(0,0,0,0.2)',
            transformOrigin: 'top center'
          }}
        />
        <div
          id="gsap-hero-spiderman-body"
          className="relative mt-[-1px]"
          style={{ transformOrigin: 'top center' }}
        >
          <div
            className="absolute inset-0 blur-2xl sm:blur-3xl opacity-60 z-0 animate-spidey-aura pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(255,0,85,0.55) 0%, rgba(0,243,255,0.25) 55%, transparent 100%)' }}
          />
          <img
            src="/images/spiderman_hanging.png"
            alt="Spider-Man hanging from web"
            draggable={false}
            className="relative z-10 select-none w-[115px] xs:w-[135px] sm:w-[180px] md:w-[220px] lg:w-[260px] xl:w-[300px]"
            style={{
              filter: 'drop-shadow(0 6px 24px rgba(15,23,42,0.3)) drop-shadow(0 0 14px rgba(239,68,68,0.35))',
            }}
          />
          {/* Comic pop stamp next to Spider-man */}
          <div
            id="gsap-hero-spiderman-stamp"
            className="absolute left-[38%] -translate-x-full bottom-[12%] opacity-0 scale-0 z-30 bg-[#ffd200] border-2 sm:border-3 border-slate-950 text-slate-950 font-black uppercase px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs rotate-[-8deg] shadow-[2.5px_2.5px_0px_#05070e] font-mono select-none"
          >
            Hey there!
          </div>
        </div>
      </div>

      {/* Layout grid */}
      <div className="mx-auto grid max-w-[1280px] items-center gap-8 sm:gap-14 px-4 sm:px-8 pb-16 pt-4 sm:pb-24 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-12 lg:pt-16">
        {/* ---------- Left column (GSAP Hero Page-Load Entrance) ---------- */}
        <div data-gsap="hero" className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="font-display text-[clamp(2.05rem,6.8vw,4.6rem)] font-black leading-[1.03] tracking-[-0.03em] text-slate-950 dark:text-white">
            With great capital
            <br />
            comes <span className="text-gradient-spidey">great responsibility.</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-[460px] text-[14.5px] sm:text-[16px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            Step into the live trading arena. Monitor 15 high-volatility sector stocks, track price swings in real time, and place orders across the market with 20,000 Ignite Coins to start.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <a
              href={REGISTER_URL}
              onClick={onRegisterClick}
              className="btn-neo w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-[14px] font-extrabold group justify-center shadow-[4px_4px_0px_#05070e]"
            >
              Register Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <button
              type="button"
              onClick={onTrackerClick}
              className="card-neo flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3.5 sm:py-4 bg-white dark:bg-[#131c30] border-3 border-slate-950 shadow-[4px_4px_0px_#ff0055] hover:shadow-[5px_5px_0px_#00f3ff] transition-all group active:translate-x-[1px] active:translate-y-[1px] rounded-xl cursor-pointer w-full sm:w-auto"
            >
              <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-[#ff0055] text-white border border-slate-950 shadow-[1px_1px_0px_#05070e] shrink-0">
                <Crosshair className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
              </div>
              <span className="font-display text-[12.5px] sm:text-[13.5px] font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                SPIDEY TRACKER <span className="badge-neo !px-1.5 !py-0.2 !text-[8px] bg-[#ffd200] text-slate-950 font-black">GPS MAP</span>
              </span>
            </button>
          </div>

          {/* Neo-Brutalist Launch Countdown to Sept 4 */}
          <div className="mt-6 sm:mt-8 border-3 border-slate-950 bg-white dark:bg-[#10172a] p-3.5 sm:p-4.5 rounded-xl shadow-[4px_4px_0px_#05070e,8px_8px_0px_rgba(255,0,85,0.15)] text-left max-w-[420px] w-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-blue-600/5 pointer-events-none" />
            <div className="flex items-center justify-between mb-2.5 sm:mb-3 border-b border-slate-200 dark:border-slate-800 pb-2 sm:pb-2.5">
              <span className="badge-neo bg-[#ffd200] text-slate-950 px-2 py-0.5 text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#05070e]">
                LAUNCH TELEMETRY // SEPT 4
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-mono text-emerald-600 dark:text-emerald-400 animate-pulse select-none font-bold">STATE: ONLINE</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="bg-red-50/70 dark:bg-red-950/30 p-2 sm:p-2.5 rounded-lg border-2 border-slate-950 shadow-[2.5px_2.5px_0px_#ff0055] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-xl sm:text-2xl font-black text-[#ff0055] tabular-nums animate-brutalist-glitch">{timeLeft.days}</span>
                <span className="text-[8px] sm:text-[9px] font-mono uppercase text-slate-700 dark:text-slate-300 font-black tracking-wider">Days</span>
              </div>
              <div className="bg-blue-50/70 dark:bg-blue-950/30 p-2 sm:p-2.5 rounded-lg border-2 border-slate-950 shadow-[2.5px_2.5px_0px_#0284c7] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-xl sm:text-2xl font-black text-[#0284c7] tabular-nums animate-brutalist-glitch">{timeLeft.hours}</span>
                <span className="text-[8px] sm:text-[9px] font-mono uppercase text-slate-700 dark:text-slate-300 font-black tracking-wider">Hours</span>
              </div>
              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2 sm:p-2.5 rounded-lg border-2 border-slate-950 shadow-[2.5px_2.5px_0px_#d97706] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-xl sm:text-2xl font-black text-[#d97706] tabular-nums animate-brutalist-glitch">{timeLeft.minutes}</span>
                <span className="text-[8px] sm:text-[9px] font-mono uppercase text-slate-700 dark:text-slate-300 font-black tracking-wider">Mins</span>
              </div>
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-2 sm:p-2.5 rounded-lg border-2 border-slate-950 shadow-[2.5px_2.5px_0px_#10b981] transition-transform group-hover:translate-y-[-1px]">
                <span className="block font-display text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums animate-brutalist-glitch">{timeLeft.seconds}</span>
                <span className="text-[8px] sm:text-[9px] font-mono uppercase text-slate-700 dark:text-slate-300 font-black tracking-wider">Secs</span>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-3 border-t border-slate-300 dark:border-slate-800 pt-5 sm:pt-7 w-full">
            {HERO_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center lg:items-start gap-1 p-2 rounded-xl border-2 border-slate-950 bg-white dark:bg-[#131c30] shadow-[2.5px_2.5px_0px_#05070e] transition-transform hover:-translate-y-0.5">
                <Icon className="h-4 w-4 text-red-600 mx-auto lg:mx-0" />
                <span className="font-display text-[10.5px] sm:text-[12px] font-bold text-slate-950 dark:text-white leading-tight">{title}</span>
                <span className="text-[9px] sm:text-[10.5px] text-slate-600 dark:text-slate-400 font-medium leading-tight">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Right column: HeroDeck ---------- */}
        <div data-gsap="hero" className="relative flex flex-col items-center lg:pr-4 w-full">
          {/* Rotating HUD ring behind HeroDeck */}
          <div className="absolute -inset-14 -z-10 flex items-center justify-center pointer-events-none opacity-20 select-none scale-75 sm:scale-100">
            <svg width="500" height="500" viewBox="0 0 200 200" className="stroke-[#0284c7] stroke-[0.8] fill-none overflow-visible animate-spin" style={{ animationDuration: '24s' }}>
              <circle cx="100" cy="100" r="82" strokeDasharray="12 6 2 6" />
              <circle cx="100" cy="100" r="92" strokeDasharray="50 15" strokeWidth="1.2" />
              <circle cx="100" cy="100" r="62" strokeDasharray="3 6" />
            </svg>
          </div>
          <div className="w-full relative p-3 sm:p-4 border-3 border-slate-950 bg-slate-100 dark:bg-[#10172a] shadow-[5px_5px_0px_#05070e] sm:shadow-[6px_6px_0px_#05070e] rounded-xl sm:rounded-2xl">
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
    <div className="marquee-track relative overflow-hidden border-y-3 border-slate-950 bg-white dark:bg-[#0c1222]/95 py-3.5 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white dark:from-[#0c1222] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-white dark:from-[#0c1222] to-transparent" />

      <div className="flex w-max animate-marquee gap-8">
        {doubled.map((stock, i) => {
          const positive = (stock.percentChange || 0) >= 0;
          return (
            <div key={`${stock.symbol}-${i}`} className="flex shrink-0 items-center gap-2.5 text-[13px]">
              <span className="font-display font-extrabold text-slate-950 dark:text-white">{stock.symbol}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-bold tabular-nums">{(stock.currentPrice || 0).toFixed(2)}</span>
              <span className={`flex items-center gap-1 font-mono text-[12px] font-bold ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                <TrendingUp className={`h-3 w-3 ${positive ? '' : 'rotate-180 text-rose-600'}`} />
                {positive ? '+' : ''}{(stock.percentChange || 0).toFixed(2)}%
              </span>
              <span className="text-red-500">🕸️</span>
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
    icon: LineChart,
    title: 'Realistic Virtual Stock Market',
    body: 'Experience a fully simulated market with live, dynamic price movement.',
    span: 'md:col-span-2 lg:col-span-1'
  },
  {
    icon: Wallet,
    title: 'Trade With Virtual Funds',
    body: 'Every participant starts with the same predefined virtual capital, no real money involved.',
    span: ''
  },
  {
    icon: TrendingUp,
    title: 'Simulated Price Movements',
    body: 'Buy and sell stocks as prices shift throughout the event, driven by market dynamics and breaking news.',
    span: ''
  },
  {
    icon: Activity,
    title: 'Sharpen Strategic Thinking',
    body: 'Develop analytical and decision-making skills in a genuine trading environment.',
    span: ''
  },
  {
    icon: Zap,
    title: 'Fast-Paced Competition',
    body: 'Compete against other traders in a live, time-limited event.',
    span: ''
  },
  {
    icon: Trophy,
    title: 'Highest Portfolio Wins',
    body: 'The participant with the greatest final portfolio value at market close is declared the winner.',
    span: ''
  }
];

const Features = forwardRef((props, ref) => {
  return (
    <section ref={ref} id="features" data-gsap="section" className="relative border-t-3 border-slate-950 py-24 sm:py-28 bg-slate-100/70 dark:bg-[#0c1222]/90">
      <SpiderWebCorner className="top-0 right-0" rotate={90} />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-gsap="heading" className="max-w-[800px]">
          <SectionTag icon={Sparkles}>IGNITE 8.0</SectionTag>
          <h2 className="font-display mt-5 text-[clamp(2.2rem,5vw,3.6rem)] font-black leading-[1.05] tracking-[-0.03em] text-slate-950 dark:text-white uppercase">
            EQUITY <span className="text-red-600">ARENA</span>
          </h2>
          
          {/* Highlight Badge */}
          <div className="mt-4 flex flex-wrap">
            <span className="badge-neo bg-[#ffd200] text-slate-950 px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#05070e]">
              3-Hour Live Trading Event — Open for Registration to All Trading Enthusiasts
            </span>
          </div>

          {/* Intro Paragraphs */}
          <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            <p>
              Equity Arena is an exciting finance-inspired simulation designed to test your analytical thinking, decision-making, and investment strategy in a risk-free environment. Inspired by modern trading platforms, this event provides participants with virtual capital to build and manage their own investment portfolio using simulated stock prices.
            </p>
            <p>
              Throughout the competition, participants will analyze market trends, strategically buy and sell stocks, and adapt to changing market conditions. Every decision matters, as your objective is to maximize portfolio value and outperform other participants before the market closes.
            </p>
            <p>
              Unlike real-world investing, Equity Arena offers the thrill of stock trading without any financial risk, making it an engaging and educational experience for beginners and enthusiasts alike.
            </p>
          </div>
        </div>

        <div className="stage-3d mt-12 sm:mt-14 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, span }, i) => {
            const colors = [
              'bg-red-500/10 text-red-600 ring-red-500/30',
              'bg-amber-500/10 text-amber-600 ring-amber-500/30',
              'bg-blue-500/10 text-blue-600 ring-blue-500/30',
              'bg-emerald-500/10 text-emerald-600 ring-emerald-500/30',
              'bg-purple-500/10 text-purple-600 ring-purple-500/30',
              'bg-yellow-500/10 text-yellow-600 ring-yellow-500/30'
            ];
            const colorClass = colors[i % colors.length];

            return (
              <div
                key={title}
                data-gsap="card"
                className={`card-neo layer-3d group relative overflow-hidden p-5 sm:p-6 bg-white dark:bg-[#131c30] border-3 border-slate-950 ${span}`}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/0 blur-3xl transition-all duration-500 group-hover:bg-red-500/15" />

                <span className={`relative flex h-12 w-12 items-center justify-center rounded-xl ring-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-[2px_2px_0px_#05070e] ${colorClass}`}>
                  <Icon className="h-5.5 w-5.5" strokeWidth={2} />
                </span>

                <h3 className="font-display relative mt-4 sm:mt-5 text-[17px] sm:text-[18px] font-bold tracking-tight text-slate-950 dark:text-white">{title}</h3>
                <p className="relative mt-2 text-[13.5px] sm:text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{body}</p>
              </div>
            );
          })}
        </div>

        {/* Two new sections below the feature cards */}
        <div className="mt-14 sm:mt-16 grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* What to Expect */}
          <div data-gsap="card" className="card-neo relative overflow-hidden p-6 sm:p-8 bg-white dark:bg-[#10172a] border-3 border-slate-950 border-t-4 border-t-[#0284c7] shadow-[5px_5px_0px_#05070e,8px_8px_0px_rgba(2,132,199,0.15)]">
            <h3 className="font-display text-slate-950 dark:text-white text-lg sm:text-xl font-black tracking-tight mb-5 sm:mb-6 uppercase flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0284c7]" />
              What to Expect
            </h3>
            <ul className="space-y-3 sm:space-y-4 font-mono text-[12.5px] sm:text-[13px] text-slate-800 dark:text-slate-200 font-bold">
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Activity className="h-4.5 w-4.5 text-[#0284c7] shrink-0 mt-0.5" />
                <span>Realistic trading interface inspired by modern investment platforms</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <TrendingUp className="h-4.5 w-4.5 text-[#0284c7] shrink-0 mt-0.5" />
                <span>Dynamic market simulation with changing stock prices</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Zap className="h-4.5 w-4.5 text-[#0284c7] shrink-0 mt-0.5" />
                <span>Strategic buying and selling decisions</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Trophy className="h-4.5 w-4.5 text-[#0284c7] shrink-0 mt-0.5" />
                <span>Live leaderboard to track performance</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Shield className="h-4.5 w-4.5 text-[#0284c7] shrink-0 mt-0.5" />
                <span>Fair and transparent evaluation</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Sparkles className="h-4.5 w-4.5 text-[#0284c7] shrink-0 mt-0.5" />
                <span>Exciting prizes and certificates for top performers</span>
              </li>
            </ul>
          </div>

          {/* Rules at a Glance */}
          <div data-gsap="card" className="card-neo relative overflow-hidden p-6 sm:p-8 bg-white dark:bg-[#10172a] border-3 border-slate-950 border-t-4 border-t-[#ff0055] shadow-[5px_5px_0px_#05070e,8px_8px_0px_rgba(255,0,85,0.15)]">
            <h3 className="font-display text-slate-950 dark:text-white text-lg sm:text-xl font-black tracking-tight mb-5 sm:mb-6 uppercase flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#ff0055]" />
              Rules at a Glance
            </h3>
            <ul className="space-y-3 sm:space-y-4 font-mono text-[12.5px] sm:text-[13px] text-slate-800 dark:text-slate-200 font-bold">
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Wallet className="h-4.5 w-4.5 text-[#ff0055] shrink-0 mt-0.5" />
                <span>Each participant starts with the same predefined virtual capital</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Activity className="h-4.5 w-4.5 text-[#ff0055] shrink-0 mt-0.5" />
                <span>Stock prices are simulated and updated throughout the event</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Zap className="h-4.5 w-4.5 text-[#ff0055] shrink-0 mt-0.5" />
                <span>Participants may buy or sell stocks at any time during the competition</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Trophy className="h-4.5 w-4.5 text-[#ff0055] shrink-0 mt-0.5" />
                <span>The participant with the highest final portfolio value will be declared the winner</span>
              </li>
              <li className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <Lock className="h-4.5 w-4.5 text-[#ff0055] shrink-0 mt-0.5" />
                <span>No real money or financial transactions are involved</span>
              </li>
            </ul>
          </div>
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
    title: 'Register Your Account',
    body: 'Create your trader profile on Equity Arena in seconds. No KYC or banking details required.',
    sound: 'THWIP!'
  },
  {
    n: '02',
    icon: Coins,
    title: 'Receive 20,000 IC',
    body: 'Instant credit of 20,000 virtual Ignite Coins directly to your trading wallet.',
    sound: 'BZZZT!'
  },
  {
    n: '03',
    icon: Activity,
    title: 'Track the Live Market',
    body: 'Monitor real-time prices across 15 high-volatility sector stocks on the live dashboard.',
    sound: 'SWING!'
  },
  {
    n: '04',
    icon: Zap,
    title: 'Place Orders & Climb',
    body: 'Execute market buys and sells instantly. Climb the global trader leaderboard.',
    sound: 'BOOM!'
  }
];

const About = forwardRef((props, ref) => {
  return (
    <section ref={ref} id="about" data-gsap="section" className="relative border-t-3 border-slate-950 py-20 sm:py-28 bg-slate-50 dark:bg-[#0c1222] overflow-hidden">
      {/* Comic Book popups scoped to About section */}
      <div id="gsap-comic-thwip" className="pointer-events-none absolute left-[12%] top-[42%] opacity-0 scale-0 z-30 bg-[#ff1e42] border-4 border-black text-white font-extrabold uppercase px-5 py-1.5 rounded-lg text-lg -rotate-12 shadow-[4px_4px_0px_#000] font-mono hidden sm:block">THWIP!</div>
      <div id="gsap-comic-bzzzt" className="pointer-events-none absolute left-[38%] top-[38%] opacity-0 scale-0 z-30 bg-amber-400 border-4 border-black text-black font-extrabold uppercase px-5 py-1.5 rounded-lg text-lg rotate-6 shadow-[4px_4px_0px_#000] font-mono hidden sm:block">BZZZT!</div>
      <div id="gsap-comic-swing" className="pointer-events-none absolute left-[62%] top-[42%] opacity-0 scale-0 z-30 bg-blue-600 border-4 border-black text-white font-extrabold uppercase px-5 py-1.5 rounded-lg text-lg -rotate-6 shadow-[4px_4px_0px_#000] font-mono hidden sm:block">SWING!</div>
      <div id="gsap-comic-boom" className="pointer-events-none absolute left-[82%] top-[32%] opacity-0 scale-0 z-30 bg-red-600 border-4 border-black text-white font-extrabold uppercase px-7 py-2 rounded-lg text-2xl rotate-12 shadow-[6px_6px_0px_#000] font-mono hidden sm:block">BOOM!</div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div data-gsap="heading" className="mx-auto max-w-[620px] text-center">
          <SectionTag icon={Gauge}>Execution Workflow</SectionTag>
          <h2 className="font-display mt-4 sm:mt-5 text-[clamp(1.95rem,5.5vw,3.1rem)] font-black leading-[1.05] tracking-[-0.025em] text-slate-950 dark:text-white">
            From setup to
            <span className="text-gradient-spidey"> first fill</span> in seconds.
          </h2>
        </div>

        <div className="stage-3d relative mt-12 sm:mt-16 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div id="gsap-about-line" className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-md lg:block origin-left scale-x-0" />

          {STEPS.map(({ n, icon: Icon, title, body, sound }) => (
            <div
              key={n}
              data-gsap="step-card"
              className="card-neo layer-3d group relative p-5 sm:p-6 text-center bg-white dark:bg-[#131c30] border-3 border-slate-950"
            >
              {/* Mobile Comic Sound badge */}
              <div className="absolute top-2.5 right-2.5 sm:hidden">
                <span className="badge-neo !px-1.5 !py-0.5 !text-[8.5px] bg-[#ffd200] text-slate-950 font-black">
                  {sound}
                </span>
              </div>

              <span className="relative mx-auto flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border-2 border-slate-950 bg-slate-100 dark:bg-slate-800 shadow-[3px_3px_0px_#05070e] transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-red-600" strokeWidth={1.8} />
                <span className="absolute -right-1.5 -top-1.5 flex h-5.5 w-5.5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-slate-950 font-mono text-[9.5px] sm:text-[10px] font-bold text-white shadow-md">
                  {n}
                </span>
              </span>

              <h3 className="font-display mt-4 sm:mt-5 text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{body}</p>
            </div>
          ))}
        </div>

        {/* Onboarding Progress Caption */}
        <div className="mt-12 sm:mt-16 text-center max-w-xl mx-auto">
          <div className="relative rounded-2xl border-3 border-slate-950 bg-white dark:bg-[#10172a] px-4 sm:px-6 py-3.5 sm:py-4 shadow-[4px_4px_0px_#05070e] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-blue-600/5" />
            <p id="gsap-about-story" className="font-mono text-[12px] sm:text-[13px] font-bold text-red-600 dark:text-red-400 tracking-wide transition-all duration-300">
              STATUS FEED: Scroll to monitor your onboarding progress...
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
    <section data-gsap="section" className="relative py-20 sm:py-28 bg-slate-100/80 dark:bg-[#0c1222]/90 border-t-3 border-slate-950">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div data-gsap="heading">
          <div className="card-neo glow-neon-card relative overflow-hidden px-5 py-14 text-center sm:px-16 sm:py-20 bg-white dark:bg-[#10172a] border-4 border-slate-950 shadow-[6px_6px_0px_#05070e,10px_10px_0px_rgba(255,0,85,0.15)] dark:shadow-[8px_8px_0px_#ff0055]">
            {/* 🕸️ Spiderweb Corner Overlays inside CTA Banner */}
            <SpiderWebCorner className="top-0 left-0" rotate={0} />
            <SpiderWebCorner className="top-0 right-0" rotate={90} />
            <SpiderWebCorner className="bottom-0 left-0" rotate={270} />
            <SpiderWebCorner className="bottom-0 right-0" rotate={180} />

            {/* Watermark Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-[620px]">
              <span className="badge-neo bg-[#ff0055] text-white px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#05070e]">
                JOIN THE ARENA TRADING NETWORK TODAY
              </span>

              <h2 className="font-display mt-5 sm:mt-6 text-[clamp(2.1rem,5vw,3.6rem)] font-black leading-[1.05] tracking-[-0.03em] text-slate-950 dark:text-white">
                Ready to execute your first simulated trade?
              </h2>

              <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-slate-700 dark:text-slate-300 font-bold">
                Join thousands of traders building strategies on Equity Arena with 20,000 Ignite Coins. Zero risk, 100% real-time market action.
              </p>

              <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={REGISTER_URL}
                  onClick={onRegisterClick}
                  className="btn-neo w-full sm:w-auto px-8 py-4 text-[14.5px] sm:text-[15px] font-black justify-center shadow-[4px_4px_0px_#05070e]"
                >
                  Register Your Account <ArrowRight className="h-5 w-5 ml-1" />
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
    <footer className="relative border-t-3 border-slate-950 bg-slate-100 dark:bg-[#090e1b] py-14 text-slate-700 dark:text-slate-400">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-[17px] font-extrabold text-slate-950 dark:text-white">
                EQUITY <span className="text-red-600">ARENA</span>
              </span>
            </div>
            <p className="mt-3.5 max-w-[340px] text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              The high-tech virtual trading simulator. Real-time Indian market equities, sub-second tickers, and instant simulated fills.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-950 dark:text-white">Platform</h4>
              <ul className="mt-3 space-y-2 text-[13px] font-semibold">
                <li><a href="#home" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Highlights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-950 dark:text-white">Resources</h4>
              <ul className="mt-3 space-y-2 text-[13px] font-semibold">
                <li><a href="#about" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Rules & Onboarding</a></li>
                <li><a href={REGISTER_URL} onClick={onRegisterClick} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Register Account</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-950 dark:text-white">Network</h4>
              <ul className="mt-3 space-y-2 text-[13px] font-semibold">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-800 dark:text-slate-200">Exchange Network Online</span>
                </li>
                <li className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-bold">Ignite-8 Engine v2.4</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Styled Premium Neo-Brutalist Disclaimer Card */}
        <div className="card-neo mt-12 p-6 bg-white dark:bg-[#10172a] border-3 border-slate-950 border-t-4 border-t-[#ffd200] relative overflow-hidden text-left shadow-[4px_4px_0px_#05070e]">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-neo bg-[#ffd200] text-slate-950 px-2.5 py-1 text-[11px] font-black shadow-[2px_2px_0px_#05070e]">
              DISCLAIMER // READ CAREFULLY
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] select-none font-bold">ID: EA-TELEMETRY-SEC-88</span>
          </div>
          <h4 className="font-display text-slate-950 dark:text-white text-md font-black tracking-tight mb-2">EQUITY ARENA — LEGAL DISCLAIMER</h4>
          <div className="space-y-3 font-mono text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
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
            <p className="text-red-600 font-bold">
              By using Equity Arena, you acknowledge and agree that you are participating in a simulated trading environment and that all market activity, assets, currency, profits, and losses are virtual and have no real-world monetary value.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-300 dark:border-slate-800 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-[12.5px] text-slate-600 dark:text-slate-400 font-medium">
            © {new Date().getFullYear()} Equity Arena. Simulated exchange — no real money is traded.
          </p>
          <p className="flex items-center gap-2 text-[12.5px] text-slate-700 dark:text-slate-300 font-semibold">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-live" />
            Arena Core Engine Online
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
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

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

    const handleMouseEnterInteractive = () => setIsHoveringInteractive(true);
    const handleMouseLeaveInteractive = () => setIsHoveringInteractive(false);

    window.addEventListener('mousemove', handleMouseMove);

    // Attach listeners to all interactive elements in the viewport
    const attachListeners = () => {
      const elements = document.querySelectorAll('a, button, [role="button"], .btn-neo, .card-neo');
      elements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };

    attachListeners();

    // Observe changes to the DOM to cover dynamically loaded elements
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      const elements = document.querySelectorAll('a, button, [role="button"], .btn-neo, .card-neo');
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[999999] ml-[-55px] mt-[-55px] hidden lg:block"
        style={{ transform: 'translate3d(-100px, -100px, 0)', willChange: 'transform' }}
      >
        <div className="relative w-[110px] h-[110px] flex items-center justify-center">
          {/* Spidey mask & radiating squiggles in one single 110x110 canvas */}
          <svg width="110" height="110" viewBox="0 0 100 100" fill="none" className="overflow-visible select-none">
            {/* RADIATING SPIDEY-SENSE COMIC SQUIGGLES (Only render when hovering interactive elements) */}
            <AnimatePresence>
              {isHoveringInteractive && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="stroke-slate-900 dark:stroke-yellow-400 stroke-[2] stroke-linecap-round filter drop-shadow-[0_0_3px_rgba(0,0,0,0.3)] animate-spidey-sense-tingle"
                >
                  {/* Fewer Clean Radiating Waves */}
                  <path d="M 50 28 Q 47 22 52 16 T 50 8" />
                  <path d="M 43 29 Q 38 23 41 17 T 36 10" />
                  <path d="M 57 29 Q 62 23 59 17 T 64 10" />
                  <path d="M 31 39 Q 22 36 26 30 T 17 23" />
                  <path d="M 69 39 Q 78 36 74 30 T 83 23" />
                  <path d="M 28 47 Q 18 46 21 40 T 11 35" />
                  <path d="M 72 47 Q 82 46 79 40 T 89 35" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Spidey Mask centered at (50, 50) */}
            <g transform="translate(33, 33)">
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
            </g>
          </svg>
        </div>
      </div>
      <div
        ref={trailingRef}
        className="fixed top-0 left-0 w-6 h-6 border-2 border-[#0284c7] rounded-full pointer-events-none z-[999998] ml-[-12px] mt-[-12px] opacity-60 shadow-[0_0_6px_rgba(2,132,199,0.4)] hidden lg:block"
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
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    try {
      const stored = localStorage.getItem('ea_disclaimer_accepted');
      return stored !== 'true';
    } catch (_) {
      return true;
    }
  });

  // Theme management: default to 'light', persist in localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ea_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch (_) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('ea_theme', theme);
    } catch (_) {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

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
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0c1222] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      <SpideyCursor />
      {/* "The Bite" Full-Bleed Radial Impact Overlay */}
      <div id="gsap-bite-overlay" className="pointer-events-none fixed inset-0 z-[90] opacity-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/30 via-blue-600/15 to-transparent" />

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

      {/* Spidey-Tracer Tactical Campus Radar & Interactive Map Modal */}
      <AnimatePresence>
        {isTrackerOpen && <SpideyTrackerModal onClose={() => setIsTrackerOpen(false)} />}
      </AnimatePresence>

      {/* Regulatory Disclaimer Modal Popup */}
      <AnimatePresence>
        {showDisclaimer && <DisclaimerModal onClose={handleAcceptDisclaimer} />}
      </AnimatePresence>

      {/* GSAP ScrollTrigger Top Progress Bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3.5px] origin-left bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-md shadow-red-500"
      />

      {/* GSAP ScrollTrigger Side Spider-Web Strand */}
      <div className="fixed left-2 sm:left-4 top-0 bottom-0 z-40 pointer-events-none w-1 hidden sm:block">
        <div
          id="gsap-spiderweb-line"
          className="w-[2.5px] h-0 bg-gradient-to-b from-red-500 via-red-600 to-blue-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] relative"
        >
          <div className="absolute bottom-0 -left-[3px] w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
        </div>
      </div>

      <Navbar
        onRegisterClick={handleRegisterClick}
        onTrackerClick={() => setIsTrackerOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main>
        <Hero
          ref={homeRef}
          stocks={stocks}
          index={index}
          isLive={isLive}
          onRegisterClick={handleRegisterClick}
          onTrackerClick={() => setIsTrackerOpen(true)}
        />
        <TickerTape stocks={stocks} />

        <About ref={aboutRef} />
        <Features ref={featuresRef} />
        <FinalCTA onRegisterClick={handleRegisterClick} />
      </main>
      <Footer stocks={stocks} onRegisterClick={handleRegisterClick} />

      {/* Sticky Mobile Bottom HUD Bar — Ultra-slick Phone Floating Controls */}
      <div className="fixed bottom-3 inset-x-3 z-40 sm:hidden">
        <div className="card-neo !shadow-[4px_4px_0px_#05070e] flex items-center justify-between gap-2 p-2 px-3 bg-white/95 dark:bg-[#10172a]/95 backdrop-blur-lg border-2 border-slate-950 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-live" />
            <div className="flex flex-col">
              <span className="font-display text-[11px] font-black text-slate-950 dark:text-white leading-tight">EQUITY ARENA</span>
              <span className="font-mono text-[9px] text-red-600 dark:text-red-400 font-black tracking-wide">20,000 IC LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsTrackerOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-950 bg-[#ff0055] text-white shadow-[1.5px_1.5px_0px_#05070e]"
              title="Spidey Tracker Radar"
            >
              <Crosshair className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn !h-8 !w-8 !rounded-lg"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-[#ffd200]" /> : <Moon className="h-3.5 w-3.5 text-slate-800" />}
            </button>
            <a
              href={REGISTER_URL}
              onClick={handleRegisterClick}
              className="btn-neo !px-3.5 !py-2 !text-[11px] font-black whitespace-nowrap !shadow-[2px_2px_0px_#05070e]"
            >
              Register <ArrowRight className="h-3 w-3 inline ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
