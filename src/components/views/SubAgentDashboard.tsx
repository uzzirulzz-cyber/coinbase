import React, { useState, useEffect } from 'react';
import { User, Trade } from '../../types';
import { storage } from '../../lib/storage';
import { formatPrice } from '../../lib/market-data';
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
  Calendar
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

  useEffect(() => {
    return storage.subscribe(() => {
      setAllUsers(storage.getUsers());
      setAllTrades(storage.getTrades());
    });
  }, []);

  const agentCode = currentUser.invitationCode || 'CB-AG001';

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
      {/* Sub-Agent Header & Invitation Code Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            SUB-AGENT BROKER DESK
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Manage your invited customer book, monitor live trading volume, and administer customer account access under your exclusive broker code.
          </p>
        </div>

        {/* Shareable Invitation Code Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-blue-950/60 border border-purple-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Your Invitation Code
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px] font-mono font-bold">
              VERIFIED BROKER
            </span>
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
            Customers must input this code during registration to be routed to your desk.
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
                          onClick={() => handleToggleFreeze(cust)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                            isFrozen
                              ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isFrozen ? (
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
