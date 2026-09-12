import React from 'react';
import { CoinbaseLogo } from '../common/CoinbaseLogo';
import { Shield, Lock, Cpu, Globe, ArrowUpRight } from 'lucide-react';
import { AppView } from '../../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-blue-900/30 bg-[#030712]/95 text-slate-400 text-sm">
      {/* Network Health Strip */}
      <div className="border-b border-white/5 bg-[#02050f]/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 cb-pulse-dot" />
              <span>Core Matching Engine: Operational (0.38ms)</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Block Confirmations: 6/6 Confirmed</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Server Time: UTC {new Date().toISOString().substring(11, 19)}</span>
            <span className="text-emerald-500">Tier-1 Cold Storage 100% Backed</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <CoinbaseLogo size="md" onClick={() => onNavigate('home')} />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Coinbase is an enterprise-grade cryptocurrency trading exchange offering institutional execution speed, high-yield digital asset options, and sub-agent liquidity distribution.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/20 text-xs font-mono text-blue-300">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                256-Bit Vault Encryption
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/20 text-xs font-mono text-emerald-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Proof of Reserves (1:1)
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Markets & Trading
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('markets')} className="hover:text-blue-400 transition-colors">
                  Spot & Futures Pairs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trade')} className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  High-Speed Trading <ArrowUpRight className="w-3 h-3 text-blue-500" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('watchlist')} className="hover:text-blue-400 transition-colors">
                  Watchlist & Alerts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assets')} className="hover:text-blue-400 transition-colors">
                  Asset Allocations
                </button>
              </li>
            </ul>
          </div>

          {/* Financial Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Wallet & Accounts
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('deposit')} className="hover:text-blue-400 transition-colors">
                  Instant Crypto Deposit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('withdraw')} className="hover:text-blue-400 transition-colors">
                  Fast Wire & Blockchain Withdraw
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-blue-400 transition-colors">
                  Ledger History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-blue-400 transition-colors">
                  VIP Tiers & Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Portal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Staff & Compliance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('admin-login')} className="hover:text-blue-400 text-blue-400 font-semibold transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Staff & Sub-Agent Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-blue-400 transition-colors">
                  Invitation Registration
                </button>
              </li>
              <li>
                <span className="text-slate-500 block text-xs">
                  Institutional Custody License #CB-9941
                </span>
              </li>
              <li>
                <span className="text-slate-500 block text-xs">
                  Official Support: support@coinbase.buzz
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Coinbase Trading Exchange. All rights reserved. TRADE • INVEST • GROW.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Risk Disclosure</span>
            <span className="hover:text-slate-400 cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
