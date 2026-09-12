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
  CheckCircle2, 
  KeyRound,
  Users,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface AdminLoginViewProps {
  onNavigate: (view: AppView) => void;
  onSuccess: (user: User) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onNavigate, onSuccess }) => {
  const [identifier, setIdentifier] = useState('superadmin');
  const [password, setPassword] = useState('coinbasee11');
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

  const autofillAndLogin = (userLogin: string, pass: string) => {
    setIdentifier(userLogin);
    setPassword(pass);
    setError(null);

    const result = storage.authenticate(userLogin, pass);
    if (result.success && result.user) {
      onSuccess(result.user);
      if (result.user.role === 'SUPER_ADMIN') {
        onNavigate('admin');
      } else {
        onNavigate('subagent');
      }
    } else {
      setError(result.error || 'Quick login failed.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <CoinbaseLogo size="lg" className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5" /> RESTRICTED STAFF & BROKER PORTAL
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Institutional Operations & Desk Sign In
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
            Authorized access for Super Administrators and Certified Sub-Agents with active invitation codes.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl cb-glass-card border border-amber-500/30 p-6 md:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" /> Username or Staff Email
              </label>
              <input
                type="text"
                required
                placeholder="superadmin or agent001"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-amber-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Authenticate Staff Session <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* OFFICIAL PRE-SEEDED CREDENTIALS TABLE & ONE-CLICK TEST ACCESS */}
          <div className="pt-5 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Authorized Test Credentials (One-Click)
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live & Ready
              </span>
            </div>

            {/* SUPER ADMIN QUICK ACCESS */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  SUPER ADMIN (Full Desk & System Control)
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Username: <span className="text-amber-200 font-bold">superadmin</span> • Password: <span className="text-amber-200 font-bold">coinbasee11</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Email: admin@coinbase.io • All 11 Sections Unrestricted
                </div>
              </div>
              <button
                type="button"
                onClick={() => autofillAndLogin('superadmin', 'coinbasee11')}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" /> Auto Sign In
              </button>
            </div>

            {/* SUB-AGENTS QUICK ACCESS GRID */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" /> 5 Default Sub-Agents (With Unique Invitation Codes):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { user: 'agent001', pass: 'Agent@001', code: 'PBD-AGENT-001', name: 'Marcus Vance', email: 'agent001@playbeat.digital' },
                  { user: 'agent002', pass: 'Agent@002', code: 'PBD-AGENT-002', name: 'Elena Rostova', email: 'agent002@playbeat.digital' },
                  { user: 'agent003', pass: 'Agent@003', code: 'PBD-AGENT-003', name: 'Kenji Sato', email: 'agent003@playbeat.digital' },
                  { user: 'agent004', pass: 'Agent@004', code: 'PBD-AGENT-004', name: 'Amara Diallo', email: 'agent004@playbeat.digital' },
                  { user: 'agent005', pass: 'Agent@005', code: 'PBD-AGENT-005', name: 'Lucas Silva', email: 'agent005@playbeat.digital' },
                ].map((ag) => (
                  <button
                    key={ag.user}
                    type="button"
                    onClick={() => autofillAndLogin(ag.user, ag.pass)}
                    className="p-2.5 rounded-xl bg-purple-950/30 hover:bg-purple-950/60 border border-purple-500/30 text-left transition-colors flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
                        {ag.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-300">
                        <span className="text-white font-bold">{ag.user}</span> / <span className="text-purple-200">{ag.pass}</span>
                      </div>
                      <div className="text-[10px] font-mono text-amber-400 font-bold">
                        Code: {ag.code}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform pl-2">
                      Sign In →
                    </span>
                  </button>
                ))}
              </div>
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
