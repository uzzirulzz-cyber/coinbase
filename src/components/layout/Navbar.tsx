import React, { useState } from 'react';
import { CoinbaseLogo } from '../common/CoinbaseLogo';
import { AppView, User } from '../../types';
import { CryptoMarketTicker } from '../trading/CryptoMarketTicker';
import { 
  TrendingUp, 
  Wallet, 
  BarChart2, 
  ChevronDown, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  PlusCircle, 
  Star, 
  History, 
  Settings, 
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Menu,
  X,
  MessageSquare,
  ArrowDownUp
} from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
  onLogout: () => void;
  unreadNotifications: number;
  unreadMessages: number;
  onToggleChat?: () => void;
  onSelectCoinForTrade?: (symbol: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  unreadNotifications,
  unreadMessages,
  onToggleChat,
  onSelectCoinForTrade
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' as AppView },
    { label: 'Markets', view: 'markets' as AppView },
    { label: 'Trade', view: 'trade' as AppView },
    { label: 'DEX Swap', view: 'swap' as AppView },
    { label: 'Wallet', view: 'wallet' as AppView },
  ];

  const moreItems = [
    { label: 'DEX Instant Swap', view: 'swap' as AppView, icon: ArrowDownUp },
    { label: 'Watchlist', view: 'watchlist' as AppView, icon: Star },
    { label: 'Assets & Portfolio', view: 'assets' as AppView, icon: Layers },
    { label: 'Deposit Funds', view: 'deposit' as AppView, icon: ArrowDownToLine },
    { label: 'Withdraw', view: 'withdraw' as AppView, icon: ArrowUpFromLine },
    { label: 'Trading History', view: 'history' as AppView, icon: History },
    { label: 'Account Profile', view: 'profile' as AppView, icon: UserIcon },
    { label: 'Notifications', view: 'notifications' as AppView, icon: Bell, badge: unreadNotifications },
    { label: 'Settings', view: 'settings' as AppView, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-900/30 bg-[#050b18]/85 backdrop-blur-xl">
      {/* Top micro market ticker bar */}
      <CryptoMarketTicker
        onSelectCoin={(symbol) => {
          onSelectCoinForTrade?.(symbol);
          onNavigate('trade');
        }}
      />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <CoinbaseLogo 
            size="md" 
            onClick={() => onNavigate('home')} 
          />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(0,82,255,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* "More" Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                onBlur={() => setTimeout(() => setIsMoreOpen(false), 200)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isMoreOpen ? 'text-blue-400 bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                More
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl cb-glass-card p-1.5 shadow-2xl z-50 border border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-150">
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.view}
                        onClick={() => {
                          onNavigate(item.view);
                          setIsMoreOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-blue-400" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 ? (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right side Auth / User controls */}
        <div className="flex items-center gap-3">
          {/* Support Chat trigger */}
          {onToggleChat && (
            <button
              onClick={onToggleChat}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Live Support Chat"
            >
              <MessageSquare className="w-4 h-4 text-blue-400" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 cb-pulse-dot" />
              )}
            </button>
          )}

          {/* Notifications bell */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 cb-pulse-dot" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {/* Role specific quick badge */}
              {currentUser.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 text-xs font-bold uppercase rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
              )}

              {currentUser.role === 'SUB_AGENT' && (
                <button
                  onClick={() => onNavigate('subagent')}
                  className="px-3 py-1.5 text-xs font-bold uppercase rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center gap-1.5"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  Agent Desk ({currentUser.invitationCode})
                </button>
              )}

              {/* Customer Balance Pill */}
              {currentUser.role === 'CUSTOMER' && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-950/40 border border-blue-500/30">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400 font-mono">Available Balance</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('deposit')}
                    className="p-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    title="Deposit Funds"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-xl cb-glass hover:border-blue-500/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-blue-300">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl cb-glass-card p-2 shadow-2xl z-50 border border-blue-500/20">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-blue-500/20 text-blue-300">
                        {currentUser.role} • UID: {currentUser.uid}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-blue-600/20 rounded-lg text-left"
                    >
                      <UserIcon className="w-4 h-4 text-blue-400" />
                      Profile & KYC
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-blue-600/20 rounded-lg text-left"
                    >
                      <Settings className="w-4 h-4 text-blue-400" />
                      Security & Settings
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg text-left mt-1 border-t border-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-1.5 rounded-lg text-sm font-bold text-white cb-blue-gradient cb-blue-gradient-hover cb-glow transition-all shadow-md"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#050b18] px-4 py-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-blue-600/20 hover:text-white"
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-white/10 pt-2 space-y-1">
            {moreItems.map(item => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-blue-600/20 hover:text-white flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">{item.badge}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
