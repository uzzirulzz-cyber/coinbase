import React from 'react';
import { AppView, User } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { ArrowUpRight, ShieldCheck, Zap, Users, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
  onSelectCoinForTrade?: (symbol: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, currentUser, onSelectCoinForTrade }) => {
  const topCoins = INITIAL_COINS.slice(0, 4);

  return (
    <div className="cb-home-page space-y-12 py-6">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cb-hero relative rounded-3xl cb-glass-card border border-blue-500/30 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 cb-pulse-dot" />
              DIGITAL ASSET MARKETS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Your markets. <span className="cb-gradient-text">Your next move.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Explore cryptocurrency markets, follow the assets you care about, and manage your trading activity from one intuitive workspace.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={() => onNavigate('trade')} className="btn btn-primary cb-primary-action px-4 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all">
                Open trading terminal <ArrowUpRight className="w-4 h-4" />
              </button>
              {!currentUser ? (
                <button onClick={() => onNavigate('register')} className="btn btn-outline-light px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
                  Create an account <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => onNavigate('wallet')} className="btn btn-outline-light px-4 py-3 rounded-xl font-bold text-sm">
                  View wallet · ${currentUser.balance.toFixed(2)}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div><span className="text-xs text-slate-400">Market access</span><div className="text-lg font-bold text-white mt-1">Multiple crypto pairs</div></div>
              <div><span className="text-xs text-slate-400">Account tools</span><div className="text-lg font-bold text-white mt-1">Wallet & activity</div></div>
              <div><span className="text-xs text-slate-400">Workspace</span><div className="text-lg font-bold text-white mt-1">Customer · Agent · Admin</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div><h2 className="text-xl font-bold text-white tracking-tight">Market highlights</h2><p className="text-xs text-slate-400">Explore available trading pairs</p></div>
          <button onClick={() => onNavigate('markets')} className="text-xs text-blue-400 hover:text-blue-300 font-bold">All markets →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCoins.map(coin => {
            const isPositive = coin.change24h >= 0;
            return <button key={coin.symbol} type="button" onClick={() => { onSelectCoinForTrade?.(coin.symbol); onNavigate('trade'); }} className="cb-market-card text-left p-5 rounded-2xl cb-glass-card border border-blue-500/20 hover:border-blue-400/50 transition-all space-y-4 group">
              <div className="flex justify-between items-start"><div><h3 className="font-bold text-white group-hover:text-blue-300">{coin.symbol}</h3><span className="text-xs text-slate-400">{coin.name}</span></div><span className={`px-2 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>{isPositive ? '+' : ''}{coin.change24h}%</span></div>
              <div className="text-2xl font-black text-white">{formatPrice(coin.currentPrice)}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10"><span>24h volume: {coin.volume24h}</span><span className="text-blue-300 font-bold flex items-center gap-1">Trade <ArrowUpRight className="w-3.5 h-3.5" /></span></div>
            </button>;
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="cb-feature-card p-6 rounded-2xl cb-glass-card space-y-3"><div className="w-11 h-11 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-300"><Zap className="w-5 h-5" /></div><h3 className="font-bold text-white">Trading workspace</h3><p className="text-sm text-slate-400 leading-relaxed">Review supported markets and access the trading interface with clear, focused tools.</p></div>
          <div className="cb-feature-card p-6 rounded-2xl cb-glass-card space-y-3"><div className="w-11 h-11 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-300"><Users className="w-5 h-5" /></div><h3 className="font-bold text-white">Account management</h3><p className="text-sm text-slate-400 leading-relaxed">Customer and sub-agent workspaces keep account activity and assigned customer records organized.</p></div>
          <div className="cb-feature-card p-6 rounded-2xl cb-glass-card space-y-3"><div className="w-11 h-11 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-300"><ShieldCheck className="w-5 h-5" /></div><h3 className="font-bold text-white">Operations controls</h3><p className="text-sm text-slate-400 leading-relaxed">Administrative tools bring user management, transaction review, reporting and platform settings together.</p></div>
        </div>
      </section>
    </div>
  );
};
