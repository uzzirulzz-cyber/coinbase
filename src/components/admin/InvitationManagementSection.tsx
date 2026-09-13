import React, { useState, useEffect } from 'react';
import { InvitationCode, User } from '../../types';
import { storage } from '../../lib/storage';
import { CountdownTimer } from '../common/CountdownTimer';
import { 
  KeyRound, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Users, 
  ExternalLink,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface InvitationManagementSectionProps {
  onShowToast: (msg: string) => void;
}

export const InvitationManagementSection: React.FC<InvitationManagementSectionProps> = ({ onShowToast }) => {
  const [invitations, setInvitations] = useState<InvitationCode[]>(() => storage.getInvitationCodes());
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCodeDetails, setSelectedCodeDetails] = useState<InvitationCode | null>(null);

  // New Code Form
  const [customCode, setCustomCode] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState<string>('agent-001');
  const [codeType, setCodeType] = useState<'ONE_TIME' | 'UNLIMITED'>('UNLIMITED');
  const [maxUses, setMaxUses] = useState<number>(50);
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [hasExpiry, setHasExpiry] = useState<boolean>(false);

  useEffect(() => {
    return storage.subscribe(() => {
      setInvitations(storage.getInvitationCodes());
      setUsers(storage.getUsers());
    });
  }, []);

  const agents = users.filter(u => u.role === 'SUB_AGENT');

  const filtered = invitations.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    onShowToast(`Copied invitation code ${code} to clipboard`);
  };

  const handleToggleStatus = (id: string) => {
    storage.toggleInvitationStatus(id);
    onShowToast('Invitation code status updated');
  };

  const handleDeleteCode = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this invitation code?')) {
      storage.deleteInvitationCode(id);
      onShowToast('Invitation code deleted');
    }
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = customCode.trim().toUpperCase() || ('PBD-' + Math.random().toString(36).substring(2, 8).toUpperCase());

    let expiryDate: string | null = null;
    if (hasExpiry) {
      const d = new Date();
      d.setDate(d.getDate() + expiresInDays);
      expiryDate = d.toISOString();
    }

    storage.createInvitationCode({
      code: finalCode,
      agentId: assignedAgentId,
      type: codeType,
      maxUses: codeType === 'ONE_TIME' ? 1 : maxUses,
      expiresAt: expiryDate
    });

    onShowToast(`Created invitation code ${finalCode}`);
    setShowCreateModal(false);
    setCustomCode('');
  };

  return (
    <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold mb-1">
            <KeyRound className="w-3.5 h-3.5" /> INVITATION CODE PROTOCOL
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Broker Invitation Codes ({invitations.length})
          </h2>
          <p className="text-xs text-slate-400">
            Mandatory registration gateway. Control assigned broker routing, redemption caps, and validity windows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-blue-500/20 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(0,82,255,0.3)]"
          >
            <Plus className="w-4 h-4" /> Generate Code
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Total Codes</div>
          <div className="text-lg font-bold font-mono text-white">{invitations.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Active Codes</div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {invitations.filter(c => c.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Total Redemptions</div>
          <div className="text-lg font-bold font-mono text-blue-400">
            {invitations.reduce((acc, c) => acc + c.usedCount, 0)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Default Sub-Agent Keys</div>
          <div className="text-lg font-bold font-mono text-amber-300">5 Pre-Seeded</div>
        </div>
      </div>

      {/* Codes Table */}
      <div className="overflow-x-auto cb-scroll">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/5 text-slate-400">
              <th className="py-2.5 px-3">Code String</th>
              <th className="py-2.5 px-3">Assigned Broker / Desk</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Usage / Cap</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Expiration</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filtered.map((inv) => {
              const isActive = inv.status === 'ACTIVE';
              const isDefault = inv.code.startsWith('PBD-AGENT-ae') || inv.code.startsWith('PBD-AGENT-00');

              return (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300 text-sm tracking-wider">
                        {inv.code}
                      </span>
                      <button
                        onClick={() => handleCopy(inv.code)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === inv.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      {isDefault && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                          SEED
                        </span>
                      )}
                    </div>
                    {inv.status === 'REVOKED' && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <CountdownTimer 
                          targetDateIso={inv.viewOnlyCountdownEndsAt}
                          prefix="Lockout: "
                          className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-500/40 px-1.5 py-0.5 rounded"
                        />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-white font-medium">{inv.agentName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.type === 'ONE_TIME' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {inv.type === 'ONE_TIME' ? '1-Time' : 'Unlimited'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">
                    <span className="text-emerald-400">{inv.usedCount}</span>
                    <span className="text-slate-500"> / {inv.type === 'ONE_TIME' ? 1 : inv.maxUses}</span>
                  </td>
                  <td className="py-3 px-3">
                    {inv.status === 'REVOKED' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        REVOKED / VIEW-ONLY
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {inv.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCodeDetails(inv)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="View Registered Users"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(inv.id)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                          isActive 
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isActive ? 'Revoke' : 'Activate'}
                      </button>

                      {!isDefault && (
                        <button
                          onClick={() => handleDeleteCode(inv.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Code"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CODE DETAILS / REDEEMED TRADERS MODAL */}
      {selectedCodeDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Code Activity: {selectedCodeDetails.code}
                </h3>
                <div className="text-xs font-mono text-slate-400">
                  Broker: {selectedCodeDetails.agentName} • Redeemed {selectedCodeDetails.usedCount} times
                </div>
              </div>
              <button
                onClick={() => setSelectedCodeDetails(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto cb-scroll">
              {selectedCodeDetails.usedByUsers.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-mono">
                  No traders registered with this code yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedCodeDetails.usedByUsers.map((u, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-white">{u.userName}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">${u.totalDeposited.toLocaleString()} USDT</div>
                        <div className="text-[10px] text-slate-500">{new Date(u.registeredAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Status: <strong className="text-white">{selectedCodeDetails.status}</strong></span>
              <button
                onClick={() => setSelectedCodeDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVITATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" /> Generate Invitation Code
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCode} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Custom Code String (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. PBD-VIP-2026 (or auto-generate)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Assign to Sub-Agent Desk</label>
                <select
                  value={assignedAgentId}
                  onChange={(e) => setAssignedAgentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                >
                  {agents.map(ag => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.invitationCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Redemption Type</label>
                  <select
                    value={codeType}
                    onChange={(e) => setCodeType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="UNLIMITED">Unlimited Uses</option>
                    <option value="ONE_TIME">One-Time Only</option>
                  </select>
                </div>

                {codeType === 'UNLIMITED' && (
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Max Redemption Cap</label>
                    <input
                      type="number"
                      min="1"
                      value={maxUses}
                      onChange={(e) => setMaxUses(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasExpiry}
                    onChange={(e) => setHasExpiry(e.target.checked)}
                    className="rounded text-blue-500"
                  />
                  <span className="text-slate-300 font-bold">Set Expiration Window</span>
                </label>

                {hasExpiry && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-slate-400">Expires in (days):</span>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                )}
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
                  Publish Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
