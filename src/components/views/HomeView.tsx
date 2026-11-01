import React from 'react';
import { AppView, User } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { ArrowUpRight, ShieldCheck, Zap, Users, ChevronRight, Activity, Wallet, BarChart3, TrendingUp, Globe2, LockKeyhole } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
  onSelectCoinForTrade?: (symbol: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, currentUser, onSelectCoinForTrade }) => {
  const topCoins = INITIAL_COINS.slice(0, 4);
  const openTrade = (symbol = 'BTC/USDT') => {
    onSelectCoinForTrade?.(symbol);
    onNavigate('trade');
  };

  return (
    <div className="container-fluid cb-bitcypo-home">
      <section className="container-xl cb-bitcypo-hero-wrap">
        <div className="cb-bitcypo-hero">
          <div className="cb-bitcypo-hero-grid" aria-hidden="true" />
          <div className="row align-items-center g-5 position-relative">
            <div className="col-lg-7">
              <div className="cb-eyebrow"><span className="cb-live-dot" /> DIGITAL ASSET WORKSPACE</div>
              <h1 className="cb-bitcypo-title">Trade smarter.<br /><span>Move with clarity.</span></h1>
              <p className="cb-bitcypo-lead">A focused workspace for exploring crypto markets, managing your account and following your trading activity.</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <button onClick={() => openTrade()} className="btn cb-gold-button btn-lg">Open trading terminal <ArrowUpRight size={18} className="ms-2" /></button>
                {!currentUser
                  ? <button onClick={() => onNavigate('register')} className="btn cb-outline-button btn-lg">Create account <ChevronRight size={18} className="ms-1" /></button>
                  : <button onClick={() => onNavigate('wallet')} className="btn cb-outline-button btn-lg"><Wallet size={17} className="me-2" /> Wallet · {formatPrice(currentUser.balance)}</button>}
              </div>
              <div className="cb-hero-trustline">
                <span><ShieldCheck size={16} /> Account controls</span>
                <span><LockKeyhole size={16} /> Role-based access</span>
                <span><Globe2 size={16} /> Market overview</span>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="cb-market-glass">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div><div className="cb-panel-kicker">MARKET SNAPSHOT</div><div className="text-white fw-semibold">Selected assets</div></div>
                  <span className="cb-data-tag">INDICATIVE DATA</span>
                </div>
                {topCoins.slice(0, 3).map((coin) => (
                  <button type="button" key={coin.symbol} className="cb-asset-row" onClick={() => openTrade(coin.symbol)}>
                    <span className="cb-asset-mark">{coin.symbol.slice(0, 1)}</span>
                    <span className="flex-grow-1 text-start"><strong>{coin.symbol}</strong><small>{coin.name}</small></span>
                    <span className="text-end"><strong>{formatPrice(coin.currentPrice)}</strong><small className={coin.change24h >= 0 ? 'text-success' : 'text-danger'}>{coin.change24h >= 0 ? '+' : ''}{coin.change24h}%</small></span>
                    <ArrowUpRight size={15} className="ms-2 text-white-50" />
                  </button>
                ))}
                <button onClick={() => onNavigate('markets')} className="cb-text-link mt-3">View all markets <ArrowUpRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl cb-home-section">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div><div className="cb-section-kicker">MARKET WATCH</div><h2 className="cb-section-title">Explore the market</h2><p className="cb-section-copy mb-0">Select an asset to open its trading workspace.</p></div>
          <button onClick={() => onNavigate('markets')} className="btn cb-outline-button">Browse markets <ArrowUpRight size={16} className="ms-2" /></button>
        </div>
        <div className="row g-3">
          {topCoins.map((coin) => (
            <div className="col-12 col-sm-6 col-xl-3" key={coin.symbol}>
              <button type="button" className="cb-coin-card w-100 h-100 text-start" onClick={() => openTrade(coin.symbol)}>
                <div className="d-flex justify-content-between align-items-start"><div><span className="cb-coin-symbol">{coin.symbol}</span><span className="cb-coin-name">{coin.name}</span></div><span className={coin.change24h >= 0 ? 'cb-change positive' : 'cb-change negative'}>{coin.change24h >= 0 ? '+' : ''}{coin.change24h}%</span></div>
                <div className="cb-coin-price">{formatPrice(coin.currentPrice)}</div>
                <div className="cb-coin-meta"><span>24h volume · {coin.volume24h}</span><span className="cb-gold-link">Trade <ArrowUpRight size={14} /></span></div>
              </button>
            </div>
          ))}
        </div>
        <p className="cb-market-disclaimer"><Activity size={14} /> Demo/indicative figures from the current app dataset; they are not verified live exchange quotes.</p>
      </section>

      <section className="container-xl cb-home-section cb-capabilities">
        <div className="row g-3">
          <div className="col-12 col-md-4"><article className="cb-capability-card"><span className="cb-capability-icon"><Zap size={21} /></span><h3>Trading workspace</h3><p>Open supported pairs, review the trading interface and move between market views.</p><button onClick={() => onNavigate('trade')}>Open terminal <ArrowUpRight size={15} /></button></article></div>
          <div className="col-12 col-md-4"><article className="cb-capability-card"><span className="cb-capability-icon"><Users size={21} /></span><h3>Customer & agent tools</h3><p>Account, wallet and assigned-customer views are available through role-based navigation.</p><button onClick={() => onNavigate(currentUser ? 'profile' : 'login')}>{currentUser ? 'Manage account' : 'Sign in'} <ArrowUpRight size={15} /></button></article></div>
          <div className="col-12 col-md-4"><article className="cb-capability-card"><span className="cb-capability-icon"><BarChart3 size={21} /></span><h3>Operations console</h3><p>Authorized staff can access administrative workflows and platform records.</p><button onClick={() => onNavigate('admin-login')}>Staff access <ArrowUpRight size={15} /></button></article></div>
        </div>
      </section>
    </div>
  );
};
