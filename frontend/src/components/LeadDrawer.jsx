import React, { useState } from 'react';
import StatusBadge from './StatusBadge.jsx';
import client from '../api/client';

export default function LeadDrawer({ lead, onClose, onUpdated }) {
  const [noteText, setNoteText] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!lead) return null;

  async function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await client.post(`/leads/${lead._id}/notes`, {
        text: noteText,
        followUpDate: followUp || null,
      });
      onUpdated(data.lead);
      setNoteText('');
      setFollowUp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the note. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-brass-50 h-full overflow-y-auto shadow-2xl border-l-4 border-brass-500 animate-[slidein_0.2s_ease-out]">
        <div className="p-6 border-b border-ink/10 bg-white">
          <button onClick={onClose} className="text-xs font-mono text-ink/40 hover:text-ink mb-4">
            ← Close
          </button>
          <h2 className="font-display italic text-2xl">{lead.name}</h2>
          <p className="font-mono text-sm text-ink/50">{lead.email}</p>
          {lead.phone && <p className="font-mono text-sm text-ink/50">{lead.phone}</p>}
          <div className="mt-3 flex items-center gap-2">
            <StatusBadge status={lead.status} />
            <span className="text-xs text-ink/40 font-mono">
              via {lead.source} · {new Date(lead.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {lead.message && (
          <div className="p-6 border-b border-ink/10">
            <p className="text-[11px] uppercase tracking-wide font-mono text-ink/50 mb-2">
              Original message
            </p>
            <p className="text-sm text-ink/80 leading-relaxed">{lead.message}</p>
          </div>
        )}

        <div className="p-6">
          <p className="text-[11px] uppercase tracking-wide font-mono text-ink/50 mb-3">
            Notes &amp; follow-ups
          </p>

          <div className="space-y-3 mb-6">
            {(!lead.notes || lead.notes.length === 0) && (
              <p className="text-sm text-ink/40 italic">No notes yet.</p>
            )}
            {lead.notes?.slice().reverse().map((note) => (
              <div key={note._id} className="bg-white border border-ink/10 rounded-sm p-3">
                <p className="text-sm text-ink/80">{note.text}</p>
                <div className="flex justify-between mt-2 text-[11px] font-mono text-ink/40">
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                  {note.followUpDate && (
                    <span className="text-brass-600">
                      Follow up {new Date(note.followUpDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddNote} className="bg-white border border-ink/10 rounded-sm p-4">
            {error && <p className="text-xs text-red-700 mb-2">{error}</p>}
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Log a call, email, or next step…"
              rows={3}
              className="w-full text-sm border border-ink/15 rounded px-3 py-2 mb-3 focus:border-pine-500 outline-none resize-none"
            />
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono text-ink/50">
                Follow-up
                <input
                  type="date"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="ml-2 text-xs border border-ink/15 rounded px-2 py-1"
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="ml-auto bg-pine-600 hover:bg-pine-500 disabled:opacity-60 text-brass-50 text-sm font-semibold px-4 py-2 rounded"
              >
                {saving ? 'Saving…' : 'Add note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
