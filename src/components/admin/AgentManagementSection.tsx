import React, { useState } from 'react';
import { User, Trade } from '../../types';
import { storage } from '../../lib/storage';
import { CountdownTimer } from '../common/CountdownTimer';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  KeyRound, 
  Percent, 
  Search, 
  Copy, 
  Check, 
  Eye, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  AlertTriangle,
  Clock,
  Ban
} from 'lucide-react';

interface AgentManagementSectionProps {
  onShowToast: (msg: string) => void;
}

export const AgentManagementSection: React.FC<AgentManagementSectionProps> = ({ onShowToast }) => {
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [trades, setTrades] = useState<Trade[]>(() => storage.getTrades());
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgentClients, setSelectedAgentClients] = useState<User | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Agent Form state
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentUsername, setNewAgentUsername] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentCountry, setNewAgentCountry] = useState('United States');
  const [newAgentCode, setNewAgentCode] = useState('');
  const [newAgentCommission, setNewAgentCommission] = useState(20);

  const subAgents = users.filter(u => u.role === 'SUB_AGENT');
  const customers = users.filter(u => u.role === 'CUSTOMER');

  const filteredAgents = subAgents.filter(ag => 
    ag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ag.username && ag.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    ag.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ag.invitationCode && ag.invitationCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    onShowToast(`Copied invitation code ${code} to clipboard`);
  };

  const handleToggleAgentStatus = (agent: User) => {
    const nextStatus = agent.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    storage.updateUser(agent.id, { status: nextStatus });
    setUsers(storage.getUsers());
    onShowToast(`Agent ${agent.name} status updated to ${nextStatus}`);
  };

  const handleRevokePower = (agent: User) => {
    storage.revokeAgentPower(agent.id, 210, 'Revoked by Super Administrator. Set to View-Only mode for 3 hours 30 minutes.');
    setUsers(storage.getUsers());
    onShowToast(`Revoked all powers for ${agent.name} (${agent.invitationCode}). Set to VIEW-ONLY (3h 30m countdown starts now).`);
  };

  const handleRestorePower = (agent: User) => {
    storage.restoreAgentPower(agent.id);
    setUsers(storage.getUsers());
    onShowToast(`Restored full operational powers for ${agent.name} (${agent.invitationCode}).`);
  };

  const handleResetPassword = (agent: User) => {
    const newPass = 'Agent@' + Math.floor(100 + Math.random() * 900);
    storage.resetUserPassword(agent.id, newPass);
    setUsers(storage.getUsers());
    onShowToast(`Reset credentials for ${agent.name}. Temporary pass: ${newPass}`);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentUsername.trim() || !newAgentEmail.trim()) return;

    const code = newAgentCode.trim().toUpperCase() || `PBD-AGENT-ae00${subAgents.length + 1}`;
    const newAgent: User = {
      id: 'agent-' + Date.now(),
      uid: 'CB' + Math.floor(900000 + Math.random() * 99999),
      username: newAgentUsername.trim().toLowerCase(),
      password: 'Agent@' + Math.floor(100 + Math.random() * 900),
      name: newAgentName.trim(),
      email: newAgentEmail.trim().toLowerCase(),
      role: 'SUB_AGENT',
      balance: 10000,
      frozenFunds: 0,
      vipLevel: 4,
      invitationCode: code,
      phone: newAgentPhone.trim(),
      country: newAgentCountry,
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      walletLocked: false,
      registeredAt: new Date().toISOString(),
      commissionRate: newAgentCommission / 100,
      permissions: ['VIEW_CLIENTS', 'FREEZE_CLIENTS', 'GENERATE_CODES', 'VIEW_TRADES'],
    };

    const updated = [...users, newAgent];
    storage.saveUsers(updated);

    // Also register the invitation code in system
    storage.createInvitationCode({
      code,
      agentId: newAgent.id,
      type: 'UNLIMITED',
      maxUses: 9999
    });

    setUsers(storage.getUsers());
    setShowCreateModal(false);
    onShowToast(`Successfully onboarded Sub-Agent ${newAgent.name} with code ${code}`);

    // Reset form
    setNewAgentName('');
    setNewAgentUsername('');
    setNewAgentEmail('');
    setNewAgentPhone('');
    setNewAgentCode('');
  };

  return (
    <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-bold mb-1">
            <Users className="w-3.5 h-3.5" /> SUB-AGENT BROKERAGE MANAGEMENT
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Certified Sub-Agents ({subAgents.length})
          </h2>
          <p className="text-xs text-slate-400">
            Control the 5 pre-configured sub-agents, monitor their invited client books, commission rates, and invitation codes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agent by name, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-blue-500/20 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(0,82,255,0.3)]"
          >
            <UserPlus className="w-4 h-4" /> Add Sub-Agent
          </button>
        </div>
      </div>

      {/* Agents Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((ag) => {
          const clientBook = customers.filter(c => c.linkedSubAgentId?.toUpperCase() === ag.invitationCode?.toUpperCase());
          const totalClientAUM = clientBook.reduce((acc, c) => acc + c.balance, 0);
          const clientIds = new Set(clientBook.map(c => c.id));
          const clientTrades = trades.filter(t => clientIds.has(t.userId));
          const commissionPct = Math.round((ag.commissionRate || 0.20) * 100);
          const isFrozen = ag.status === 'FROZEN';
          const isViewOnly = ag.status === 'VIEW_ONLY';

          return (
            <div 
              key={ag.id} 
              className={`p-5 rounded-2xl border transition-all space-y-4 shadow-lg ${
                isViewOnly 
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                  : 'bg-slate-900/80 border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    {ag.name}
                    {isViewOnly && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                        VIEW ONLY
                      </span>
                    )}
                  </h3>
                  <div className="text-xs font-mono text-purple-300">
                    Username: <span className="font-bold text-white">{ag.username}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {ag.email}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isViewOnly
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isFrozen 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {ag.status}
                </span>
              </div>

              {/* View-Only Countdown Lockout Box */}
              {isViewOnly && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                      LOCKOUT COUNTDOWN
                    </span>
                    <CountdownTimer 
                      targetDateIso={ag.viewOnlyCountdownEndsAt}
                      className="text-xs text-amber-300 font-mono font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    All administrative and broker privileges revoked. 3 hours 30 minutes observation period active.
                  </p>
                </div>
              )}

              {/* Code Box */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Invitation Code</div>
                  <div className="text-sm font-black font-mono text-amber-300 tracking-wider">
                    {ag.invitationCode}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(ag.invitationCode || '')}
                  className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 transition-colors"
                  title="Copy Invitation Code"
                >
                  {copiedCode === ag.invitationCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center">
                <div className="p-2 rounded-lg bg-slate-950/60">
                  <div className="text-[10px] text-slate-400 font-mono">Clients</div>
                  <div className="text-sm font-bold font-mono text-white">{clientBook.length}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60">
                  <div className="text-[10px] text-slate-400 font-mono">Book AUM</div>
                  <div className="text-xs font-bold font-mono text-emerald-400">${Math.round(totalClientAUM).toLocaleString()}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60">
                  <div className="text-[10px] text-slate-400 font-mono">Commission</div>
                  <div className="text-sm font-bold font-mono text-purple-300">{commissionPct}%</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => setSelectedAgentClients(ag)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-blue-400" /> Book ({clientBook.length})
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleResetPassword(ag)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs transition-colors"
                    title="Reset Agent Password"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>

                  {isViewOnly ? (
                    <button
                      onClick={() => handleRestorePower(ag)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1"
                      title="Restore full agent powers"
                    >
                      <ShieldCheck className="w-3 h-3" /> Restore Powers
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRevokePower(ag)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1"
                      title="Revoke powers & set to View-Only (3h 30m)"
                    >
                      <Ban className="w-3 h-3" /> Revoke (3.5h)
                    </button>
                  )}

                  {!isViewOnly && (
                    <button
                      onClick={() => handleToggleAgentStatus(ag)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                        isFrozen
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isFrozen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {isFrozen ? 'Unfreeze' : 'Freeze'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLIENT BOOK MODAL */}
      {selectedAgentClients && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Invited Client Book: {selectedAgentClients.name}
                </h3>
                <div className="text-xs font-mono text-purple-300">
                  Routing Code: <strong>{selectedAgentClients.invitationCode}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgentClients(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto cb-scroll flex-1 space-y-3">
              {(() => {
                const book = customers.filter(c => c.linkedSubAgentId?.toUpperCase() === selectedAgentClients.invitationCode?.toUpperCase());
                if (book.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-400 text-xs font-mono">
                      No traders registered under {selectedAgentClients.invitationCode} yet.
                    </div>
                  );
                }
                return (
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400">
                        <th className="py-2">UID</th>
                        <th className="py-2">Name / Email</th>
                        <th className="py-2">Balance</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {book.map(c => (
                        <tr key={c.id}>
                          <td className="py-2.5 font-bold text-blue-400">{c.uid}</td>
                          <td className="py-2.5">
                            <div className="text-white font-medium">{c.name}</div>
                            <div className="text-[10px] text-slate-400">{c.email}</div>
                          </td>
                          <td className="py-2.5 font-bold text-emerald-400">
                            ${c.balance.toLocaleString()} USDT
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-400 text-[10px]">
                            {new Date(c.registeredAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            <div className="pt-3 border-t border-white/10 text-right">
              <button
                onClick={() => setSelectedAgentClients(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUB-AGENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" /> Onboard New Sub-Agent
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Sterling"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="agentae006"
                    value={newAgentUsername}
                    onChange={(e) => setNewAgentUsername(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Broker Code</label>
                  <input
                    type="text"
                    placeholder="PBD-AGENT-ae006"
                    value={newAgentCode}
                    onChange={(e) => setNewAgentCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="agentae006@coinbase.ae"
                  value={newAgentEmail}
                  onChange={(e) => setNewAgentEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555 0199"
                    value={newAgentPhone}
                    onChange={(e) => setNewAgentPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Commission %</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={newAgentCommission}
                    onChange={(e) => setNewAgentCommission(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white"
                >
                  Create Sub-Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
