import React, { useState } from 'react';
import { User, AppView } from '../../types';
import { CryptoSwapWidget } from '../trading/CryptoSwapWidget';
import { storage } from '../../lib/storage';
import { 
  ArrowDownUp, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  RefreshCw, 
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface SwapViewProps {
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  selectedSymbol?: string;
}

export const SwapView: React.FC<SwapViewProps> = ({
  currentUser,
  onNavigate,
  selectedSymbol
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const initialTo = selectedSymbol ? selectedSymbol.split('/')[0] : 'BTC';

  // Recent user transactions (swaps & deposits)
  const userTransactions = currentUser
    ? storage.getTransactions().filter(t => t.userId === currentUser.id && (t.type === 'SWAP' || (t.notes && t.notes.toLowerCase().includes('swap'))))
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          Coinbase Liquidity Pool v3 • Instant Zero Slippage Bridge
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Decentralized Crypto Swap & Bridge
        </h1>
        <p className="text-sm text-slate-400">
          Swap 200+ crypto assets instantly at institutional market rates with zero hidden fees and automated smart contract routing.
        </p>
      </div>

      {/* Grid: Swap Widget in center, side stats cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Pool Metrics & Highlights */}
        <div className="lg:col-span-3 space-y-4 font-mono text-xs hidden lg:block">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% On-Chain Proof
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every token swap routes through deep institutional automated market-maker (AMM) pools with cryptographic verification.
            </p>
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Total Value Locked</span>
                <span className="text-white font-bold">$1.84 Billion</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Avg Settlement</span>
                <span className="text-emerald-400 font-bold">&lt; 1.2 Seconds</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Protocol Fee</span>
                <span className="text-blue-400 font-bold">0.15% (Rebated)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="text-slate-300 font-bold">Supported Networks</div>
            <div className="flex flex-wrap gap-1.5">
              {['Ethereum', 'Solana', 'Arbitrum', 'Optimism', 'Base', 'Polygon'].map(net => (
                <span key={net} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-white/5">
                  {net}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center: The Core Swap Widget */}
        <div className="lg:col-span-6">
          <CryptoSwapWidget
            key={refreshKey}
            currentUser={currentUser}
            onRequireAuth={() => onNavigate('login')}
            onRequireDeposit={() => onNavigate('deposit')}
            initialFromSymbol="USDT"
            initialToSymbol={initialTo}
            onSwapCompleted={() => {
              setRefreshKey(k => k + 1);
            }}
          />
        </div>

        {/* Right Side: Account Balances & Quick Swap Shortcuts */}
        <div className="lg:col-span-3 space-y-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-slate-300 font-bold text-sm">
              <span>Your Balances</span>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => onNavigate('wallet')}
                  className="text-blue-400 text-[11px] hover:underline"
                >
                  Manage
                </button>
              )}
            </div>

            {currentUser ? (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-800/50">
                  <span className="text-white font-bold">USDT</span>
                  <span className="text-emerald-400 font-bold">${currentUser.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-800/50">
                  <span className="text-white font-bold">BTC</span>
                  <span className="text-slate-300 font-bold">0.0845 BTC</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-800/50">
                  <span className="text-white font-bold">ETH</span>
                  <span className="text-slate-300 font-bold">1.4500 ETH</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-500">
                Sign in to view your real-time wallet balances.
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5">
            <div className="text-slate-300 font-bold text-xs">Popular Swap Pairs</div>
            <div className="space-y-1.5">
              {[
                { from: 'USDT', to: 'BTC', label: 'USDT ➔ BTC' },
                { from: 'USDT', to: 'ETH', label: 'USDT ➔ ETH' },
                { from: 'USDT', to: 'SOL', label: 'USDT ➔ SOL' },
                { from: 'ETH', to: 'USDT', label: 'ETH ➔ USDT' }
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    // Update swap
                    onNavigate('swap');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors text-[11px]"
                >
                  <span>{p.label}</span>
                  <span className="text-blue-400">Swap ➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Swap History for Active User */}
      {currentUser && userTransactions.length > 0 && (
        <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-5 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="text-white font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Recent Swaps & Conversions
            </div>
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="text-blue-400 text-xs hover:underline"
            >
              View All History
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {userTransactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{tx.notes || tx.method}</div>
                  <div className="text-[10px] text-slate-500">{new Date(tx.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold font-mono">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
