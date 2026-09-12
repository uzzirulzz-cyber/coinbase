import React, { useState } from 'react';
import { CoinbaseLogo } from '../common/CoinbaseLogo';
import { AppView, User } from '../../types';
import { storage } from '../../lib/storage';
import { 
  Shield, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  KeyRound, 
  AlertCircle, 
  ArrowRight,
  Ticket
} from 'lucide-react';

interface AuthViewProps {
  mode: 'login' | 'register';
  onNavigate: (view: AppView) => void;
  onSuccess: (user: User) => void;
}

const COUNTRY_PHONE_CODES = [
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
];

export const AuthView: React.FC<AuthViewProps> = ({ mode: initialMode, onNavigate, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('United States');
  const [invitationCode, setInvitationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const users = storage.getUsers();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      setLoginError('No account found with this email. Please check your credentials or register.');
      return;
    }

    if (user.status === 'FROZEN' || user.status === 'SUSPENDED') {
      setLoginError('This account is currently restricted. Please contact your assigned Sub-Agent.');
      return;
    }

    storage.setCurrentUser(user);
    onSuccess(user);

    if (user.role === 'SUPER_ADMIN') {
      onNavigate('admin');
    } else if (user.role === 'SUB_AGENT') {
      onNavigate('subagent');
    } else {
      onNavigate('trade');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!name.trim()) {
      setRegisterError('Please provide your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setRegisterError('Please provide a valid email address.');
      return;
    }
    if (!invitationCode.trim()) {
      setRegisterError('An Invitation Code from a certified Sub-Agent is required to register.');
      return;
    }
    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setRegisterError('You must agree to the Institutional Trading Terms & Risk Disclosure.');
      return;
    }

    const fullPhone = phoneNumber.trim() ? `${selectedPhoneCode} ${phoneNumber.trim()}` : undefined;

    const res = storage.registerCustomer({
      name,
      email,
      phone: fullPhone,
      country,
      invitationCode: invitationCode.trim().toUpperCase(),
      password
    });

    if (res.success && res.user) {
      onSuccess(res.user);
      onNavigate('trade');
    } else {
      setRegisterError(res.error || 'Failed to complete registration.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <CoinbaseLogo size="lg" className="justify-center" />
          <h1 className="text-2xl font-black text-white tracking-tight">
            {activeTab === 'login' ? 'Institutional Account Login' : 'Create Customer Account'}
          </h1>
          <p className="text-sm text-slate-400">
            {activeTab === 'login' 
              ? 'Access institutional liquidity, pattern charts, and sub-second binary options.'
              : 'Registration requires an active Sub-Agent Invitation Code.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 md:p-8 shadow-2xl space-y-6">
          {/* Tabs Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/80 border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register (Invite Only)
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" /> Password
                  </label>
                  <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover cb-glow shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              {registerError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-blue-400" /> Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* International Phone with Country Code Selector (Default +1) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" /> Mobile Number (Default +1)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Accepts all countries</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedPhoneCode}
                    onChange={(e) => setSelectedPhoneCode(e.target.value)}
                    className="w-36 px-2.5 py-2.5 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  >
                    {COUNTRY_PHONE_CODES.map((c) => (
                      <option key={c.code + c.country} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.code} ({c.country.substring(0, 10)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="555-0199"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* SUB-AGENT INVITATION CODE (CRITICAL REQUIREMENT) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-blue-400" /> Sub-Agent Invitation Code *
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono font-semibold">REQUIRED</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter invitation code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-blue-500/40 text-white font-mono uppercase tracking-widest text-sm focus:outline-none focus:border-blue-400 transition-colors"
                />
                <p className="text-[11px] text-slate-400 pt-1 font-mono">
                  Enter the invitation code issued by your accredited institutional agent or account representative.
                </p>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-400" /> Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400 leading-snug">
                  I certify that I am at least 18 years old and agree to the Coinbase Customer Terms of Service and Digital Asset Risk Disclosure.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover cb-glow shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Create Account with Sub-Agent <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Security footnote */}
          <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>256-Bit SSL Encrypted Banking-Grade Infrastructure</span>
          </div>
        </div>

        {/* Staff portal link */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('admin-login')}
            className="text-xs font-mono text-slate-400 hover:text-blue-400 transition-colors"
          >
            Looking for Staff or Sub-Agent login? Access Staff Portal →
          </button>
        </div>
      </div>
    </div>
  );
};
