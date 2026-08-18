import React, { useEffect, useState, useCallback } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import LeadTable from '../components/LeadTable.jsx';
import LeadDrawer from '../components/LeadDrawer.jsx';

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'converted', label: 'Converted' },
  { key: 'lost', label: 'Lost' },
];

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/leads', { params: { status, search } });
      setLeads(data.leads);
    } catch (err) {
      setError('Could not load leads. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 250); // debounce search
    return () => clearTimeout(t);
  }, [fetchLeads]);

  async function handleStatusChange(id, newStatus) {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l)));
    try {
      await client.patch(`/leads/${id}/status`, { status: newStatus });
    } catch (err) {
      fetchLeads(); // revert on failure
    }
  }

  function handleLeadUpdated(updated) {
    setLeads((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
    setSelected(updated);
  }

  const counts = {
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  };

  return (
    <div className="min-h-screen bg-brass-50">
      <header className="bg-ink text-brass-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-brass-400 uppercase">Ledger CRM</p>
            <h1 className="font-display italic text-2xl">Leads</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-brass-200/70 font-mono">{admin?.name}</span>
            <button
              onClick={logout}
              className="text-xs font-mono uppercase tracking-wide text-brass-200/70 hover:text-brass-50 border border-brass-200/30 rounded px-3 py-1.5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <SummaryCard label="New" value={counts.new} accent="pine" />
          <SummaryCard label="Contacted" value={counts.contacted} accent="brass" />
          <SummaryCard label="Converted" value={counts.converted} accent="ink" />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex gap-1 bg-white border border-ink/10 rounded-full p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatus(tab.key)}
                className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors ${
                  status === tab.key ? 'bg-pine-600 text-brass-50' : 'text-ink/60 hover:bg-brass-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] text-sm border border-ink/15 rounded-full px-4 py-2 bg-white focus:border-pine-500 outline-none"
          />

          <button
            onClick={() => setShowNewForm(true)}
            className="text-sm font-semibold bg-pine-600 hover:bg-pine-500 text-brass-50 px-4 py-2 rounded-full"
          >
            + New lead
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center py-16 text-ink/40 font-mono text-sm">Loading leads…</p>
        ) : (
          <LeadTable leads={leads} onOpen={setSelected} onStatusChange={handleStatusChange} />
        )}
      </main>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} onUpdated={handleLeadUpdated} />

      {showNewForm && (
        <NewLeadForm
          onClose={() => setShowNewForm(false)}
          onCreated={(lead) => {
            setLeads((prev) => [lead, ...prev]);
            setShowNewForm(false);
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  const accentClass = { pine: 'text-pine-600', brass: 'text-brass-600', ink: 'text-ink' }[accent];
  return (
    <div className="bg-white border border-ink/10 rounded-sm p-5">
      <p className="text-[11px] font-mono uppercase tracking-wide text-ink/50 mb-1">{label}</p>
      <p className={`font-display text-3xl ${accentClass}`}>{value}</p>
    </div>
  );
}

function NewLeadForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', source: 'manual entry', message: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await client.post('/leads', form);
      onCreated(data.lead);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the lead.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-brass-50 border-t-4 border-pine-600 rounded-sm p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="font-display italic text-xl mb-4">Add a lead manually</h3>
        {error && <p className="text-xs text-red-700 mb-3">{error}</p>}
        <div className="space-y-3">
          <input required placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-sm border border-ink/15 rounded px-3 py-2 bg-white" />
          <input required type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full text-sm border border-ink/15 rounded px-3 py-2 bg-white" />
          <input placeholder="Phone (optional)" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full text-sm border border-ink/15 rounded px-3 py-2 bg-white" />
          <input placeholder="Source" value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full text-sm border border-ink/15 rounded px-3 py-2 bg-white" />
          <textarea placeholder="Message (optional)" rows={3} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full text-sm border border-ink/15 rounded px-3 py-2 bg-white resize-none" />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onClose} className="text-sm px-4 py-2 text-ink/60">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="text-sm font-semibold bg-pine-600 hover:bg-pine-500 disabled:opacity-60 text-brass-50 px-4 py-2 rounded">
            {saving ? 'Saving…' : 'Add lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
