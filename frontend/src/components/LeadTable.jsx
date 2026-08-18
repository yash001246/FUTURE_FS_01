import React from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function LeadTable({ leads, onOpen, onStatusChange }) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-20 text-ink/40">
        <p className="font-display italic text-xl mb-1">No leads here yet</p>
        <p className="text-sm">New submissions from your contact form will land in this list.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-ink/10 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-[11px] uppercase tracking-wide text-ink/50 font-mono">
            <th className="px-4 py-3 font-medium">Lead</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Notes</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr
              key={lead._id}
              onClick={() => onOpen(lead)}
              className={`cursor-pointer hover:bg-brass-50/60 transition-colors ${
                i !== leads.length - 1 ? 'border-b border-ink/5' : ''
              }`}
            >
              <td className="px-4 py-3">
                <p className="font-semibold text-ink">{lead.name}</p>
                <p className="font-mono text-xs text-ink/50">{lead.email}</p>
              </td>
              <td className="px-4 py-3 text-ink/70">{lead.source}</td>
              <td className="px-4 py-3 font-mono text-xs text-ink/50">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead._id, e.target.value)}
                  className="text-xs border border-ink/15 rounded px-2 py-1 bg-white cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </td>
              <td className="px-4 py-3 text-right text-ink/50 font-mono text-xs">
                {lead.notes?.length || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
