import React from 'react';
import { CoinbaseLogo } from '../common/CoinbaseLogo';
import { Shield, Wallet, ArrowUpRight, BarChart3 } from 'lucide-react';
import { AppView } from '../../types';

interface FooterProps { onNavigate: (view: AppView) => void; }

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="mt-auto border-top border-secondary border-opacity-25 bg-[#080d18] text-slate-400">
    <div className="container-xl py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <CoinbaseLogo size="md" onClick={() => onNavigate('home')} />
          <p className="mt-3 small lh-lg" style={{ maxWidth: 360 }}>
            Digital asset interface for market exploration, account management and trading workflows.
            Review the platform's applicable terms and risk disclosures before using financial features.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <span className="badge rounded-pill text-bg-dark border border-secondary-subtle py-2 px-3"><Shield size={13} className="me-1" /> Role-based access</span>
            <span className="badge rounded-pill text-bg-dark border border-secondary-subtle py-2 px-3"><Wallet size={13} className="me-1" /> Wallet workspace</span>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <h2 className="small fw-bold text-white text-uppercase mb-3">Markets</h2>
          <ul className="list-unstyled d-grid gap-2 small">
            <li><button onClick={() => onNavigate('markets')} className="btn btn-link p-0 text-secondary text-decoration-none">Explore markets</button></li>
            <li><button onClick={() => onNavigate('trade')} className="btn btn-link p-0 text-secondary text-decoration-none">Trading terminal</button></li>
            <li><button onClick={() => onNavigate('watchlist')} className="btn btn-link p-0 text-secondary text-decoration-none">Watchlist</button></li>
          </ul>
        </div>
        <div className="col-6 col-lg-2">
          <h2 className="small fw-bold text-white text-uppercase mb-3">Account</h2>
          <ul className="list-unstyled d-grid gap-2 small">
            <li><button onClick={() => onNavigate('wallet')} className="btn btn-link p-0 text-secondary text-decoration-none">Wallet</button></li>
            <li><button onClick={() => onNavigate('history')} className="btn btn-link p-0 text-secondary text-decoration-none">Activity history</button></li>
            <li><button onClick={() => onNavigate('profile')} className="btn btn-link p-0 text-secondary text-decoration-none">Profile & verification</button></li>
          </ul>
        </div>
        <div className="col-12 col-lg-4">
          <h2 className="small fw-bold text-white text-uppercase mb-3">Operations</h2>
          <p className="small lh-lg">Authorized agents and administrators can access their respective workspaces after signing in.</p>
          <button onClick={() => onNavigate('admin-login')} className="btn btn-sm btn-outline-warning">Staff sign-in <ArrowUpRight size={14} className="ms-1" /></button>
          <div className="small text-secondary mt-3"><BarChart3 size={14} className="me-1" /> Market values shown in this interface may be indicative or simulated; verify any quote independently.</div>
        </div>
      </div>
      <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-5 pt-3 border-top border-secondary border-opacity-25 small">
        <span>© {new Date().getFullYear()} Coinbase interface. All rights reserved.</span>
        <span>Digital asset markets involve risk. No investment return is guaranteed.</span>
      </div>
    </div>
  </footer>
);
