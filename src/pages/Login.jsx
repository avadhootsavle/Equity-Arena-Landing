import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, Activity, Sparkles, TrendingUp } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Live demo mode: Login functionality will connect to your Equity Arena backend!');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full" />

      {/* Header Navigation */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            EQUITY <span className="text-blue-400">ARENA</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          &larr; Back to Landing Page
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 my-auto px-6 py-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl shadow-black/80"
        >
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-xs text-slate-400 mt-2">Enter your credentials to access the Equity Arena trading floor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@equityarena.com"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <a href="#forgot" className="text-xs text-blue-400 hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-[0.99] transition-all"
            >
              Sign In to Arena
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/" className="font-semibold text-blue-400 hover:underline">
              Explore the Arena
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Equity Arena. All rights reserved.
      </footer>
    </div>
  );
}
