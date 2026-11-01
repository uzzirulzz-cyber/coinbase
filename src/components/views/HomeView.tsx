import React from 'react';
import { AppView, User } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { ArrowUpRight, ShieldCheck, Zap, Users, ChevronRight, Activity, Wallet, BarChart3 } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
  onSelectCoinForTrade?: (symbol: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, currentUser, onSelectCoinForTrade }) => {
  const topCoins = INITIAL_COINS.slice(0, 4);
  return (
    <div className="container-fluid cb-home py-4 py-lg-5">
      <section className="container-xl mb-5">
        <div className="cb-hero rounded-4 p-4 p-md-5 position-relative overflow-hidden">
          <div className="cb-hero-orb cb-hero-orb-one" /><div className="cb-hero-orb cb-hero-orb-two" />
          <div className="row align-items-center g-5 position-relative">
            <div className="col-lg-8">
              <span className="badge rounded-pill text-bg-primary bg-opacity-25 border border-primary-subtle px-3 py-2 mb-4"><Activity size={14} className="me-2" /> DIGITAL ASSET MARKETPLACE</span>
              <h1 className="display-4 fw-bold text-white lh-sm mb-3">A clearer view of <span className="cb-gradient-text">crypto markets.</span></h1>
              <p className="lead text-white-50 mb-4 cb-hero-copy">Explore market prices, review your portfolio, and access trading tools from one streamlined workspace.</p>
              <div className="d-flex flex-wrap gap-3">
                <button onClick={() => onNavigate('trade')} className="btn btn-primary btn-lg px-4 py-3 fw-semibold shadow">Open trading terminal <ArrowUpRight size={18} className="ms-2" /></button>
                {!currentUser ? <button onClick={() => onNavigate('register')} className="btn btn-outline-light btn-lg px-4 py-3">Create account <ChevronRight size={18} className="ms-1" /></button> : <button onClick={() => onNavigate('wallet')} className="btn btn-outline-light btn-lg px-4 py-3"><Wallet size={18} className="me-2" /> Wallet · \${currentUser.balance.toFixed(2)}</button>}
              </div>
              <div className="row g-3 mt-4 pt-4 border-top border-light border-opacity-10">
                <div className="col-6 col-md-4"><div className="small text-white-50 mb-1">Market coverage</div><div className="fs-5 fw-bold text-white">Multi-asset</div></div>
                <div className="col-6 col-md-4"><div className="small text-white-50 mb-1">Workspace</div><div className="fs-5 fw-bold text-white">Portfolio + trading</div></div>
                <div className="col-12 col-md-4"><div className="small text-white-50 mb-1">Account controls</div><div className="fs-5 fw-bold text-white">Secure access</div></div>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block"><div className="cb-hero-panel rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3"><span className="small text-white-50">Market overview</span><span className="badge text-bg-success bg-opacity-25 text-success">Watchlist</span></div>
              {topCoins.slice(0, 3).map(coin => <div key={coin.symbol} className="d-flex justify-content-between align-items-center py-3 border-bottom border-light border-opacity-10"><div><div className="fw-semibold text-white">{coin.symbol}</div><div className="small text-white-50">{coin.name}</div></div><div className="text-end"><div className="fw-semibold text-white">{formatPrice(coin.currentPrice)}</div><div className={coin.change24h >= 0 ? 'small text-success' : 'small text-danger'}>{coin.change24h >= 0 ? '+' : ''}{coin.change24h}%</div></div></div>)}
              <button onClick={() => onNavigate('markets')} className="btn btn-link link-info text-decoration-none px-0 pt-3">Explore markets <ArrowUpRight size={15} className="ms-1" /></button>
            </div></div>
          </div>
        </div>
      </section>
      <section className="container-xl mb-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3"><div><h2 className="h3 fw-bold text-white mb-1">Market highlights</h2><p className="text-white-50 mb-0">A quick look at selected trading pairs</p></div><button onClick={() => onNavigate('markets')} className="btn btn-sm btn-outline-info">View all markets <ArrowUpRight size={15} className="ms-1" /></button></div>
        <div className="row g-3">{topCoins.map(coin => <div className="col-12 col-sm-6 col-xl-3" key={coin.symbol}>
          <button type="button" className="card cb-market-card h-100 w-100 text-start p-3" onClick={() => { onSelectCoinForTrade?.(coin.symbol); onNavigate('trade'); }}>
            <div className="card-body p-1"><div className="d-flex justify-content-between align-items-start mb-3"><div><div className="fw-bold text-white">{coin.symbol}</div><div className="small text-white-50">{coin.name}</div></div><span className={coin.change24h >= 0 ? 'badge text-bg-success bg-opacity-25' : 'badge text-bg-danger bg-opacity-25'}>{coin.change24h >= 0 ? '+' : ''}{coin.change24h}%</span></div>
              <div className="fs-3 fw-bold text-white mb-3">{formatPrice(coin.currentPrice)}</div><div className="d-flex justify-content-between align-items-center border-top border-light border-opacity-10 pt-3 small"><span className="text-white-50">24h volume · {coin.volume24h}</span><span className="text-info fw-semibold">Trade <ArrowUpRight size={14} /></span></div>
            </div>
          </button>
        </div>)}</div>
      </section>
      <section className="container-xl"><div className="row g-3">
        <div className="col-12 col-md-4"><div className="card cb-feature-card h-100 p-4"><div className="cb-feature-icon mb-3"><Zap size={22} /></div><h3 className="h5 fw-bold text-white">Trading workspace</h3><p className="text-white-50 mb-0">Review market pairs and use the available trading interface from a single workspace.</p></div></div>
        <div className="col-12 col-md-4"><div className="card cb-feature-card h-100 p-4"><div className="cb-feature-icon mb-3"><Users size={22} /></div><h3 className="h5 fw-bold text-white">Account network</h3><p className="text-white-50 mb-0">Manage customer and sub-agent access with role-aware account areas.</p></div></div>
        <div className="col-12 col-md-4"><div className="card cb-feature-card h-100 p-4"><div className="cb-feature-icon mb-3"><ShieldCheck size={22} /></div><h3 className="h5 fw-bold text-white">Operations controls</h3><p className="text-white-50 mb-0">Authorized administrators can review platform activity and account operations.</p></div></div>
      </div><div className="d-flex align-items-center gap-2 text-white-50 small mt-4"><BarChart3 size={15} /> Market values are indicative; verify quotes before making financial decisions.</div></section>
    </div>
  );
};
