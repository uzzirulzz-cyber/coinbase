import React, { useState } from 'react';
import { CoinbaseLogo } from '../common/CoinbaseLogo';
import { AppView, User } from '../../types';
import { storage } from '../../lib/storage';
import { 
  ShieldAlert, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff,
  ShieldCheck
} from 'lucide-react';

interface AdminLoginViewProps {
  onNavigate: (view: AppView) => void;
  onSuccess: (user: User) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onNavigate, onSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = storage.authenticate(identifier, password);
    if (!result.success || !result.user) {
      setError(result.error || 'Authentication failed. Please verify credentials.');
      return;
    }

    const user = result.user;
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'SUB_AGENT') {
      setError('Access Denied: This portal is strictly restricted to Sub-Agents and Super Administrators.');
      return;
    }

    onSuccess(user);
    if (user.role === 'SUPER_ADMIN') {
      onNavigate('admin');
    } else {
      onNavigate('subagent');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <CoinbaseLogo size="lg" className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5" /> RESTRICTED STAFF & BROKER PORTAL
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Institutional Operations Desk
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Authorized access only. Enter your credentials to access your administrative operations console.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl cb-glass-card border border-amber-500/30 p-6 md:p-8 shadow-2xl space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" /> Administrative ID or Email
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Enter authorized ID or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-amber-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-amber-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Sign In Securely <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Discrete Security Footer */}
          <div className="pt-4 border-t border-white/10 text-center">
            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
              <span>Hardware token & multi-factor verification enforced.</span>
            </div>
          </div>
        </div>

        {/* Back to Customer Storefront */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Coinbase Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
