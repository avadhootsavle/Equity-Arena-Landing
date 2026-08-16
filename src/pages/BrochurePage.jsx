import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Printer, Download, ArrowLeft, Users, Flame, LineChart, Newspaper,
  TrendingUp, Wallet, Lock, Trophy, Zap, Shield, CheckCircle2, AlertTriangle
} from 'lucide-react';

const REGISTER_URL = 'https://ignite-8.vercel.app/register-stock';

export function BrochurePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const STEPS = [
    {
      num: '01',
      title: 'REGISTER & GET 20,000 IC',
      color: '#ff0055',
      shadow: '#000000',
      badge: 'WELCOME BONUS',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      icon: Users,
      body: 'Create your account on Equity Arena and receive 20,000 free Ignite Points (IC) to start the game. Your IC balance is your trading capital.'
    },
    {
      num: '02',
      title: 'START THE 3-HOUR GAME',
      color: '#0284c7',
      shadow: '#000000',
      badge: 'LIVE ARENA',
      badgeBg: '#00f3ff',
      badgeText: '#000000',
      icon: Flame,
      body: 'The game runs for exactly 3 hours live. During the game, the market prices of the 15 available stocks keep changing in real-time based on high-volatility telemetry.'
    },
    {
      num: '03',
      title: 'CHECK THE STOCKS',
      color: '#d97706',
      shadow: '#000000',
      badge: 'TELEMETRY & GRAPHS',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      icon: LineChart,
      body: 'Explore the 15 available stocks and check their live price, trend graph, sector telemetry, and order details before making your move.'
    },
    {
      num: '04',
      title: 'FOLLOW THE MARKET NEWS',
      color: '#059669',
      shadow: '#000000',
      badge: 'MARKET SHOCKS',
      badgeBg: '#10b981',
      badgeText: '#ffffff',
      icon: Newspaper,
      body: 'New breaking market news will appear during the game. The news can affect stock prices, so read the news and make your trading decisions carefully.'
    },
    {
      num: '05',
      title: 'BUY & SELL SHARES',
      color: '#2563eb',
      shadow: '#000000',
      badge: 'TRADING DESK',
      badgeBg: '#00f3ff',
      badgeText: '#000000',
      icon: TrendingUp,
      body: 'Use your Ignite Points to buy and sell shares.',
      subPoints: [
        { label: 'Buy / Sell at Market Price', desc: 'Trade instantly at the current live stock price.' },
        { label: 'Place a Limit Order', desc: 'Set the exact price at which you want to buy or sell. The order executes automatically when the stock hits your price.' }
      ]
    },
    {
      num: '06',
      title: 'MANAGE YOUR IC',
      color: '#7c3aed',
      shadow: '#000000',
      badge: 'PORTFOLIO CONTROL',
      badgeBg: '#c084fc',
      badgeText: '#000000',
      icon: Wallet,
      body: 'Keep track of your Ignite Points, stock holdings, and profit/loss. Use your points wisely and decide strategically when to buy, hold or sell.'
    },
    {
      num: '07',
      title: 'FINAL 5 MINUTES (LOCKOUT WARNING)',
      color: '#dc2626',
      shadow: '#ff0055',
      badge: 'CRITICAL LOCKOUT',
      badgeBg: '#ff0055',
      badgeText: '#ffffff',
      icon: Lock,
      body: 'When the game enters its last 5 minutes, no new trades can be placed. All remaining shares you still own will be automatically sold at the current market price.'
    },
    {
      num: '08',
      title: 'WIN THE GAME (CHAMPIONSHIP)',
      color: '#d97706',
      shadow: '#ffd200',
      badge: 'VICTORY GOAL',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      icon: Trophy,
      body: 'After the 3-hour game ends, the player with the highest final amount of Ignite Points (IC) wins the championship!'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#ffd200] selection:text-slate-950">
      {/* Print CSS Custom Rules */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .page-break { page-break-after: always; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Floating Action Bar (Hidden when Printing) */}
      <div className="no-print fixed top-4 right-4 z-50 flex items-center gap-2.5 bg-slate-950 p-2.5 px-4 rounded-2xl border-3 border-slate-950 shadow-[4px_4px_0px_#ff0055]">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white font-mono text-xs font-bold hover:bg-slate-700 transition-all cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffd200] text-slate-950 font-mono text-xs font-black hover:bg-amber-300 transition-all cursor-pointer border-2 border-slate-950 shadow-[2px_2px_0px_#000]"
        >
          <Printer className="h-4 w-4 text-slate-950" />
          <span>PRINT / SAVE AS PDF</span>
        </button>

        <a
          href="/Equity_Arena_Official_Brochure.pdf"
          download="Equity_Arena_Official_Brochure.pdf"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00f3ff] text-slate-950 font-mono text-xs font-black hover:bg-cyan-300 transition-all border-2 border-slate-950 shadow-[2px_2px_0px_#000]"
        >
          <Download className="h-4 w-4 text-slate-950" />
          <span className="hidden sm:inline">DOWNLOAD PDF</span>
        </a>
      </div>

      {/* Main Neo-Brutalist Printable Container */}
      <div className="mx-auto max-w-[900px] p-4 sm:p-8 space-y-8">
        
        {/* ================= PAGE 1 ================= */}
        <div className="page-break relative space-y-6 pt-2">
          {/* Top Hazard Bar */}
          <div className="h-3 w-full border-2 border-slate-950 rounded-full flex overflow-hidden shadow-[2px_2px_0px_#000]">
            <div className="h-full w-1/5 bg-[#ff0055]" />
            <div className="h-full w-1/5 bg-[#ffd200]" />
            <div className="h-full w-1/5 bg-[#00f3ff]" />
            <div className="h-full w-1/5 bg-[#10b981]" />
            <div className="h-full w-1/5 bg-slate-950" />
          </div>

          {/* Header Neo Banner Box */}
          <div className="relative rounded-2xl bg-slate-50 border-3.5 border-slate-950 p-6 sm:p-8 shadow-[6px_6px_0px_#ff0055] overflow-hidden">
            {/* Hanging Spider-Man Character Illustration */}
            <div className="absolute right-2 -top-2 w-32 sm:w-44 pointer-events-none drop-shadow-lg">
              <img src="/images/spiderman_hanging.png" alt="Spider-Man Character" className="w-full h-auto" />
            </div>

            <div className="relative z-10 max-w-lg space-y-3 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-3 py-1 bg-[#ffd200] text-slate-950 border-2 border-slate-950 rounded-lg text-xs font-mono font-black shadow-[2px_2px_0px_#000]">
                  IGNITE 8.0 • OFFICIAL GAME BROCHURE
                </span>
                <span className="inline-block px-2.5 py-1 bg-slate-950 text-white border-2 border-slate-950 rounded-lg text-xs font-mono font-bold">
                  SVKM'S SBMP
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none">
                EQUITY <span className="text-[#ff0055]">ARENA</span>
              </h1>

              <div className="inline-block px-3 py-1 bg-slate-950 text-[#00f3ff] rounded-md font-mono text-xs font-black">
                HOW TO PLAY &amp; OFFICIAL RULEBOOK
              </div>

              <p className="font-mono text-xs sm:text-sm font-bold text-slate-700">
                SVKM's Shri Bhagubhai Mafatlal Polytechnic • Vile Parle (West), Mumbai
              </p>

              <div className="p-3 bg-white border-2 border-slate-950 rounded-xl shadow-[3px_3px_0px_#000] inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#ff0055]" />
                <span className="font-mono text-xs font-black text-slate-950">STARTING CAPITAL:</span>
                <span className="font-mono text-xs font-black text-[#ff0055]">20,000 IC (VIRTUAL COINS)</span>
              </div>
            </div>
          </div>

          {/* Section Banner */}
          <div className="flex items-center justify-between border-b-4 border-slate-950 pb-2">
            <div className="inline-block px-4 py-1.5 bg-[#ff0055] text-white border-3 border-slate-950 rounded-xl font-mono text-sm font-black shadow-[3px_3px_0px_#000]">
              ⚡ 8 STEPS TO DOMINATE THE ARENA
            </div>
            <span className="font-mono text-xs font-bold text-slate-500 hidden sm:block">
              IGNITE 8.0 OFFICIAL HANDBOOK
            </span>
          </div>

          {/* Steps 01 to 04 Grid */}
          <div className="grid gap-5 sm:grid-cols-2 text-left">
            {STEPS.slice(0, 4).map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-5 bg-white border-3.5 border-slate-950 rounded-2xl shadow-[5px_5px_0px_#000] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-black border-2 border-slate-950 shadow-[2px_2px_0px_#000] text-white"
                          style={{ backgroundColor: step.color }}
                        >
                          {step.num}
                        </span>
                        <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-950 text-slate-950 shadow-sm">
                          <Icon className="h-4.5 w-4.5" style={{ color: step.color }} />
                        </div>
                      </div>

                      <span
                        className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black border-2 border-slate-950 shadow-[1.5px_1.5px_0px_#000]"
                        style={{ backgroundColor: step.badgeBg, color: step.badgeText }}
                      >
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-black text-slate-950 tracking-tight">
                      {step.title}
                    </h3>

                    <p className="font-mono text-xs font-bold text-slate-700 leading-relaxed">
                      {step.body}
                    </p>
                  </div>

                  {idx === 0 && (
                    <div className="mt-3 pt-2 border-t-2 border-slate-200 flex items-center justify-between text-[11px] font-mono font-bold text-emerald-600">
                      <span>✓ 20,000 IC credited instantly</span>
                      <img src="/images/spidey_pixel_head_icon.png" alt="Icon" className="h-6 w-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= PAGE 2 ================= */}
        <div className="space-y-6 pt-4">
          {/* Header Mini Banner */}
          <div className="relative rounded-2xl bg-slate-50 border-3.5 border-slate-950 p-5 shadow-[5px_5px_0px_#00f3ff] overflow-hidden flex items-center justify-between">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-slate-950 text-white rounded font-mono text-[10px] font-bold">
                  PAGE 2 OF 2
                </span>
                <span className="px-2.5 py-0.5 bg-[#00f3ff] text-slate-950 rounded border border-slate-950 font-mono text-[10px] font-black">
                  TRADING STRATEGY
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-950">
                EQUITY <span className="text-[#ff0055]">ARENA</span> • GAMEPLAY RULES
              </h2>
            </div>

            {/* Side Spider-Man Character Illustration */}
            <div className="w-20 sm:w-24 shrink-0 pointer-events-none">
              <img src="/images/spiderman_side.png" alt="Spider-Man Side" className="w-full h-auto drop-shadow-md" />
            </div>
          </div>

          {/* Steps 05 to 08 Grid */}
          <div className="grid gap-5 sm:grid-cols-2 text-left">
            {STEPS.slice(4, 8).map((step) => {
              const Icon = step.icon;
              const isWarning = step.num === '07';
              const isVictory = step.num === '08';

              return (
                <div
                  key={step.num}
                  className={`relative p-5 border-3.5 border-slate-950 rounded-2xl shadow-[5px_5px_0px_#000] flex flex-col justify-between ${
                    isWarning
                      ? 'bg-red-50/90 shadow-[5px_5px_0px_#ff0055]'
                      : isVictory
                      ? 'bg-amber-50/90 shadow-[5px_5px_0px_#ffd200]'
                      : 'bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-black border-2 border-slate-950 shadow-[2px_2px_0px_#000] text-white"
                          style={{ backgroundColor: step.color }}
                        >
                          {step.num}
                        </span>
                        <div className="p-1.5 rounded-lg bg-white border border-slate-950 text-slate-950 shadow-sm">
                          <Icon className="h-4.5 w-4.5" style={{ color: step.color }} />
                        </div>
                      </div>

                      <span
                        className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black border-2 border-slate-950 shadow-[1.5px_1.5px_0px_#000]"
                        style={{ backgroundColor: step.badgeBg, color: step.badgeText }}
                      >
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-black text-slate-950 tracking-tight">
                      {step.title}
                    </h3>

                    <p className="font-mono text-xs font-bold text-slate-700 leading-relaxed">
                      {step.body}
                    </p>

                    {step.subPoints && (
                      <div className="space-y-2 pt-2 border-t-2 border-slate-200">
                        {step.subPoints.map((sub, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-950 shadow-[2px_2px_0px_#000]">
                            <span className="block font-mono text-[11px] font-black text-[#0284c7]">
                              • {sub.label}
                            </span>
                            <span className="block font-mono text-[10.5px] font-bold text-slate-700 mt-0.5">
                              {sub.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call To Action Box */}
          <div className="relative rounded-2xl bg-slate-950 border-3.5 border-slate-950 p-6 shadow-[6px_6px_0px_#ff0055] text-left text-white space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#ffd200] text-slate-950 rounded font-mono text-xs font-black border border-slate-950">
                JOIN THE ARENA
              </span>
              <span className="font-mono text-xs text-slate-400 font-bold">IGNITE 8.0</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black text-[#ffd200]">
              READY TO DOMINATE THE STOCK MARKET?
            </h3>

            <p className="font-mono text-xs text-slate-300 font-bold">
              Register today for Equity Arena at SVKM's Shri Bhagubhai Mafatlal Polytechnic and claim your 20,000 IC virtual trading capital.
            </p>

            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00f3ff] text-slate-950 rounded-xl font-mono text-xs font-black border-2 border-slate-950 shadow-[3px_3px_0px_#fff] hover:bg-cyan-300 transition-all"
            >
              <span>REGISTER ONLINE: https://ignite-8.vercel.app/register-stock</span>
            </a>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t-2 border-slate-950 flex flex-col sm:flex-row items-center justify-between text-xs font-mono font-bold text-slate-600 gap-2">
            <p>© {new Date().getFullYear()} Equity Arena • Virtual Trading Simulator • No Real Money Involved</p>
            <p className="text-slate-950">SVKM'S SBMP • VILE PARLE (WEST)</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BrochurePage;
