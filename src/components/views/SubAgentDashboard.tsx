import React, { useState, useEffect } from 'react';
import { User, Trade } from '../../types';
import { storage, getOrSetAgent5CountdownEnd } from '../../lib/storage';
import { formatPrice } from '../../lib/market-data';
import { CountdownTimer } from '../common/CountdownTimer';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Check, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Unlock,
  Share2,
  BarChart3,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';

interface SubAgentDashboardProps {
  currentUser: User;
}

export const SubAgentDashboard: React.FC<SubAgentDashboardProps> = ({ currentUser }) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>(() => storage.getUsers());
  const [allTrades, setAllTrades] = useState<Trade[]>(() => storage.getTrades());
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [showRevokeInfoModal, setShowRevokeInfoModal] = useState(false);

  useEffect(() => {
    return storage.subscribe(() => {
      setAllUsers(storage.getUsers());
      setAllTrades(storage.getTrades());
    });
  }, []);

  const agentCode = currentUser.invitationCode || 'CB-AG001';
  const isPowerRevoked = 
    currentUser.status === 'VIEW_ONLY' || 
    currentUser.username === 'agentae005' || 
    currentUser.invitationCode === 'PBD-AGENT-ae005' ||
    Boolean(currentUser.permissions?.includes('VIEW_ONLY'));

  const countdownTarget = currentUser.viewOnlyCountdownEndsAt || getOrSetAgent5CountdownEnd();

  // Strict Data Isolation: ONLY customers linked to this Sub-Agent's code
  const myCustomers = allUsers.filter(u => 
    u.role === 'CUSTOMER' && 
    u.linkedSubAgentId?.toUpperCase() === agentCode.toUpperCase()
  );

  const filteredCustomers = myCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Customer IDs belonging to this subagent
  const myCustomerIds = new Set(myCustomers.map(c => c.id));

  // Trades isolated to this subagent's customers
  const myCustomerTrades = allTrades.filter(t => myCustomerIds.has(t.userId));

  const totalCustomerBalance = myCustomers.reduce((acc, c) => acc + c.balance, 0);
  const activeCustomers = myCustomers.filter(c => c.status === 'ACTIVE').length;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(agentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFreeze = (cust: User) => {
    if (isPowerRevoked) {
      setActionNotice('⚠️ Action Denied: All operational powers for Agent 5 have been revoked. View-only mode enforced.');
      setTimeout(() => setActionNotice(null), 4000);
      return;
    }

    const nextStatus = cust.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    storage.updateUser(cust.id, { status: nextStatus });
    
    // Add audit notification
    storage.addNotification({
      userId: cust.id,
      title: nextStatus === 'FROZEN' ? 'Account Restricted by Agent' : 'Account Re-Activated',
      body: nextStatus === 'FROZEN'
        ? `Your trading privileges were suspended by your broker desk (${agentCode}). Please contact support.`
        : 'Your trading privileges have been restored.',
      type: nextStatus === 'FROZEN' ? 'warning' : 'success',
    });

    setActionNotice(`Updated ${cust.name}'s account status to ${nextStatus}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* REVOCATION / VIEW-ONLY ALERT BANNER FOR AGENT 5 */}
      {isPowerRevoked && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-amber-950/70 to-slate-900 border border-amber-500/50 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-black uppercase tracking-wider">
                    POWERS REVOKED
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                    VIEW-ONLY MODE ACTIVE
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black text-white tracking-tight">
                  Operational Powers Revoked — Restricted to Observation Desk
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Super Administrator has revoked execution privileges for <strong>{currentUser.name}</strong> (Code: <code>{agentCode}</code>).
                  Client freeze controls, code generation, and trade staking actions are suspended.
                </p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex flex-col sm:items-end gap-1.5 p-3 rounded-xl bg-slate-950/90 border border-amber-500/40 shrink-0">
              <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">
                Lockout Countdown Ticking
              </span>
              <CountdownTimer 
                targetDateIso={countdownTarget}
                className="text-amber-300 text-lg md:text-xl font-mono tracking-widest"
              />
              <span className="text-[10px] text-slate-400 font-mono">
                Duration: 3 hrs 30 mins (starts now)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Agent Header & Invitation Code Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            {isPowerRevoked ? 'SUB-AGENT DESK (READ-ONLY)' : 'SUB-AGENT BROKER DESK'}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            {isPowerRevoked
              ? 'Monitoring view active. You can inspect customer activity and trade history in real-time, but operational modifications are disabled.'
              : 'Manage your invited customer book, monitor live trading volume, and administer customer account access under your exclusive broker code.'}
          </p>
        </div>

        {/* Shareable Invitation Code Card */}
        <div className={`p-5 rounded-2xl border shadow-xl space-y-3 ${
          isPowerRevoked 
            ? 'bg-gradient-to-br from-rose-950/50 via-slate-900/90 to-amber-950/40 border-amber-500/40' 
            : 'bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-blue-950/60 border-purple-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Your Invitation Code
            </span>
            {isPowerRevoked ? (
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                REVOKED / LOCKED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px] font-mono font-bold">
                VERIFIED BROKER
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-purple-500/30">
            <span className="text-xl font-black font-mono tracking-widest text-white">
              {agentCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isPowerRevoked
              ? '⚠️ New registrations with this code are suspended while under view-only lockout.'
              : 'Customers must input this code during registration to be routed to your desk.'}
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-500/40 text-blue-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>My Customers</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{myCustomers.length}</div>
          <div className="text-[11px] text-emerald-400 font-mono">
            {activeCustomers} active accounts
          </div>
        </div>

        <div className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Customer Total Equity</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ${totalCustomerBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">USDT Assets under desk</div>
        </div>

        <div className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Customer Trades Placed</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{myCustomerTrades.length}</div>
          <div className="text-[11px] text-purple-300 font-mono">All-time volume executions</div>
        </div>

        <div className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Broker Revenue Share</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            ${(myCustomerTrades.length * 18.5).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">15% Spread commission</div>
        </div>
      </div>

      {/* Customer Management Table (Data Isolation) */}
      <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Assigned Customer Directory ({myCustomers.length})
            </h2>
            <p className="text-xs text-slate-400">
              Only displaying clients registered with broker code <strong>{agentCode}</strong>
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client by UID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-blue-500/20 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-slate-400 text-sm">
              No customers found. Share your invitation code <strong>{agentCode}</strong> with prospective traders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto cb-scroll">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="py-3 px-3">Client UID</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Email & Phone</th>
                  <th className="py-3 px-3">Country</th>
                  <th className="py-3 px-3">Trading Balance</th>
                  <th className="py-3 px-3">VIP Tier</th>
                  <th className="py-3 px-3">Account Status</th>
                  <th className="py-3 px-3 text-right">Desk Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredCustomers.map(cust => {
                  const isFrozen = cust.status === 'FROZEN';
                  return (
                    <tr key={cust.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-blue-400">{cust.uid}</td>
                      <td className="py-3.5 px-3 font-semibold text-white">{cust.name}</td>
                      <td className="py-3.5 px-3">
                        <div className="text-slate-300">{cust.email}</div>
                        <div className="text-[10px] text-slate-500">{cust.phone || 'No phone'}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">{cust.country || 'Global'}</td>
                      <td className="py-3.5 px-3 font-bold text-emerald-400">
                        ${cust.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                          VIP {cust.vipLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {isFrozen ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                            <Lock className="w-3 h-3" /> FROZEN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                            <ShieldCheck className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          disabled={isPowerRevoked}
                          onClick={() => handleToggleFreeze(cust)}
                          title={isPowerRevoked ? 'Action disabled: Agent 5 powers revoked (View-Only mode)' : undefined}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                            isPowerRevoked
                              ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-white/5'
                              : isFrozen
                              ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isPowerRevoked ? (
                            <>
                              <Lock className="w-3 h-3 text-slate-500" /> View Only
                            </>
                          ) : isFrozen ? (
                            <>
                              <Unlock className="w-3 h-3" /> Unfreeze
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" /> Freeze
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Trades Feed */}
      <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">
            Client Order Executions Under Broker {agentCode} ({myCustomerTrades.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">Real-time settlement stream</span>
        </div>

        {myCustomerTrades.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            No trades executed by your invited customers yet.
          </div>
        ) : (
          <div className="overflow-x-auto cb-scroll">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="py-2 px-3">Trade ID</th>
                  <th className="py-2 px-3">Trader</th>
                  <th className="py-2 px-3">Symbol</th>
                  <th className="py-2 px-3">Direction</th>
                  <th className="py-2 px-3">Stake</th>
                  <th className="py-2 px-3">Outcome</th>
                  <th className="py-2 px-3">Profit / Loss</th>
                  <th className="py-2 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {myCustomerTrades.slice(0, 8).map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-blue-400 font-bold">{t.id}</td>
                    <td className="py-2.5 px-3 text-white font-semibold">{t.userName}</td>
                    <td className="py-2.5 px-3 font-bold">{t.symbol}</td>
                    <td className="py-2.5 px-3">
                      <span className={t.direction === 'UP' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {t.direction}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white">${t.amount.toFixed(2)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {t.result}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      {t.result === 'WIN' ? (
                        <span className="text-emerald-400">+${t.profit.toFixed(2)}</span>
                      ) : (
                        <span className="text-rose-400">-${t.amount.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
