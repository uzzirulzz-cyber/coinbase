import React from 'react';
import { AppView, User } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Users, 
  Wallet, 
  BarChart2, 
  Lock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
  onSelectCoinForTrade?: (symbol: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  currentUser,
  onSelectCoinForTrade
}) => {
  const topCoins = INITIAL_COINS.slice(0, 4);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl cb-glass-card border border-blue-500/30 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 cb-pulse-dot" />
              COINBASE ENTERPRISE LIQUIDITY & TRADING TERMINAL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Trade Cryptocurrencies with <span className="cb-gradient-text">Institutional Precision</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-sans">
              Access lightning-speed execution, technical indicators, 30s/60s contract options, and multi-tier sub-agent broker accounts on Coinbase.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('trade')}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover cb-glow shadow-xl flex items-center gap-2 transition-all"
              >
                Launch Trading Terminal <ArrowUpRight className="w-4 h-4" />
              </button>

              {!currentUser ? (
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-all flex items-center gap-2"
                >
                  Invitation Registration <ChevronRight className="w-4 h-4 text-blue-400" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('wallet')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-all flex items-center gap-2"
                >
                  Custodial Wallet (${currentUser.balance.toFixed(2)})
                </button>
              )}
            </div>

            {/* Platform Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 font-mono">
              <div>
                <span className="text-xs text-slate-400">24h Trading Volume</span>
                <div className="text-xl sm:text-2xl font-black text-white">$2,418,900,000+</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Order Latency</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">0.38 ms</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Reserve Backing</span>
                <div className="text-xl sm:text-2xl font-black text-blue-400">100% 1:1 Proof</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Cards Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Market Highlights</h2>
            <p className="text-xs text-slate-400">Top liquidity pairs with real-time indicators</p>
          </div>
          <button
            onClick={() => onNavigate('markets')}
            className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold flex items-center gap-1"
          >
            All Markets →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCoins.map(coin => {
            const isPositive = coin.change24h >= 0;
            return (
              <div
                key={coin.symbol}
                className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 hover:border-blue-400/40 transition-all space-y-4 group cursor-pointer"
                onClick={() => {
                  if (onSelectCoinForTrade) onSelectCoinForTrade(coin.symbol);
                  onNavigate('trade');
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      {coin.symbol}
                    </h3>
                    <span className="text-xs text-slate-400">{coin.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {isPositive ? '+' : ''}{coin.change24h}%
                  </span>
                </div>

                <div className="text-2xl font-black font-mono text-white">
                  {formatPrice(coin.currentPrice)}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-white/5">
                  <span>24h Vol: {coin.volume24h}</span>
                  <span className="text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Trade <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Architecture & Sub-Agent Feature Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">High-Yield Contract Options</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trade 30s, 60s, and 120s binary forecast contracts with up to 85% payouts and instant automated settlement.
            </p>
          </div>

          <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Sub-Agent Broker Network</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exclusive invitation codes connect certified sub-agents to isolated customer books, earning spread revenue shares.
            </p>
          </div>

          <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Super Admin Operations Desk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise management suite with balance adjustments, withdrawal verification, risk freezes, and real-time chat support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
