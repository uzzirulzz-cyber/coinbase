import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, User } from '../../types';
import { storage } from '../../lib/storage';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Trash2,
  Phone,
  Mail,
  Globe,
  Plus
} from 'lucide-react';

interface LeadManagementSectionProps {
  onShowToast: (msg: string) => void;
}

export const LeadManagementSection: React.FC<LeadManagementSectionProps> = ({ onShowToast }) => {
  const [leads, setLeads] = useState<Lead[]>(() => storage.getLeads());
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<Lead | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  // New Lead Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newSource, setNewSource] = useState<Lead['source']>('WEBSITE');
  const [newAgentId, setNewAgentId] = useState('agent-001');
  const [newStatus, setNewStatus] = useState<LeadStatus>('NEW');
  const [newValue, setNewValue] = useState(50000);
  const [newFollowUp, setNewFollowUp] = useState('');
  const [initialNote, setInitialNote] = useState('');

  useEffect(() => {
    return storage.subscribe(() => {
      setLeads(storage.getLeads());
      setUsers(storage.getUsers());
    });
  }, []);

  const agents = users.filter(u => u.role === 'SUB_AGENT');

  const filtered = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.assignedAgentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    storage.updateLead(leadId, { status });
    onShowToast(`Updated lead status to ${status}`);
  };

  const handleConvertLead = (lead: Lead) => {
    if (confirm(`Convert ${lead.name} into an active trader account with 1,000 USDT welcome credit?`)) {
      const result = storage.convertLeadToTrader(lead.id);
      if (result.success && result.user) {
        onShowToast(`Successfully converted ${lead.name} to active Trader (UID: ${result.user.uid})!`);
      } else {
        onShowToast(result.error || 'Conversion failed');
      }
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForNotes || !newNoteContent.trim()) return;

    storage.addLeadNote(selectedLeadForNotes.id, newNoteContent.trim());
    setNewNoteContent('');
    // Refresh modal lead
    const updated = storage.getLeads().find(l => l.id === selectedLeadForNotes.id);
    if (updated) setSelectedLeadForNotes(updated);
    onShowToast('Lead note recorded');
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Delete this prospect lead?')) {
      storage.deleteLead(id);
      onShowToast('Lead deleted');
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    storage.createLead({
      name: newName,
      email: newEmail,
      phone: newPhone,
      country: newCountry,
      source: newSource,
      assignedAgentId: newAgentId,
      status: newStatus,
      estimatedValue: newValue,
      followUpDate: newFollowUp || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      initialNote: initialNote.trim() || undefined
    });

    onShowToast(`Lead ${newName} created and assigned.`);
    setShowCreateModal(false);

    // Reset
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setInitialNote('');
  };

  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.status !== 'LOST' ? l.estimatedValue : 0), 0);
  const convertedCount = leads.filter(l => l.status === 'CONVERTED').length;

  return (
    <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold mb-1">
            <UserCheck className="w-3.5 h-3.5" /> INSTITUTIONAL CRM & PIPELINE
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Investor Lead Management ({leads.length})
          </h2>
          <p className="text-xs text-slate-400">
            Prospect acquisition, desk follow-ups, and one-click conversion to live authenticated trader accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-blue-500/20 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(0,82,255,0.3)]"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Total Pipeline Value</div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            ${totalPipelineValue.toLocaleString()}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Active Prospects</div>
          <div className="text-lg font-bold font-mono text-blue-400">
            {leads.filter(l => l.status !== 'LOST' && l.status !== 'CONVERTED').length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Converted Traders</div>
          <div className="text-lg font-bold font-mono text-white">{convertedCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Conversion Rate</div>
          <div className="text-lg font-bold font-mono text-purple-300">
            {leads.length > 0 ? ((convertedCount / leads.length) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {st} ({st === 'ALL' ? leads.length : leads.filter(l => l.status === st).length})
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto cb-scroll">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/5 text-slate-400">
              <th className="py-2.5 px-3">Lead Name</th>
              <th className="py-2.5 px-3">Contact Details</th>
              <th className="py-2.5 px-3">Assigned Desk</th>
              <th className="py-2.5 px-3">Est. Value</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Follow-Up</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filtered.map((lead) => {
              const isConverted = lead.status === 'CONVERTED';

              return (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white text-sm">{lead.name}</div>
                    <div className="text-[10px] text-slate-400">{lead.country} • via {lead.source}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200">{lead.email}</div>
                    <div className="text-[10px] text-slate-500">{lead.phone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                      {lead.assignedAgentName}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    ${lead.estimatedValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      disabled={isConverted}
                      className="bg-slate-900 border border-white/10 text-white rounded px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-blue-400"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-slate-300 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {lead.followUpDate}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedLeadForNotes(lead)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="View / Add Notes"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      {!isConverted ? (
                        <button
                          onClick={() => handleConvertLead(lead)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        >
                          <Sparkles className="w-3 h-3" /> Convert
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          ✓ Onboarded
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* LEAD NOTES MODAL */}
      {selectedLeadForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  CRM Activity Notes: {selectedLeadForNotes.name}
                </h3>
                <div className="text-xs font-mono text-slate-400">
                  Target: ${selectedLeadForNotes.estimatedValue.toLocaleString()} • Broker: {selectedLeadForNotes.assignedAgentName}
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadForNotes(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto cb-scroll flex-1">
              {selectedLeadForNotes.notes.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-mono">
                  No notes recorded yet. Add your initial meeting outcome below.
                </div>
              ) : (
                selectedLeadForNotes.notes.map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-bold text-purple-300">{n.author}</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-white/10">
              <textarea
                required
                rows={2}
                placeholder="Log a call outcome, client preferences, OTC volume requirements..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE LEAD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" /> New Investor Lead
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Investor / Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Drake"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="investor@fund.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 415 555 0122"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Country</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Acquisition Channel</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="WEBSITE">Website Organic</option>
                    <option value="REFERRAL">Institutional Referral</option>
                    <option value="TELEGRAM">Telegram Channel</option>
                    <option value="LINKEDIN">LinkedIn Direct</option>
                    <option value="OFFLINE_EVENT">Crypto Summit Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Assign Broker Desk</label>
                  <select
                    value={newAgentId}
                    onChange={(e) => setNewAgentId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  >
                    {agents.map(ag => (
                      <option key={ag.id} value={ag.id}>{ag.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Target Deploy ($)</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Initial Context Note</label>
                <textarea
                  rows={2}
                  placeholder="Notes about prospective contract volume or onboarding requirements..."
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                />
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
                  Register Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
