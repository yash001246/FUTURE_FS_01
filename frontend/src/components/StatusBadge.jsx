import React from 'react';

const STYLES = {
  new: 'bg-pine-50 text-pine-600 border-pine-400/40',
  contacted: 'bg-brass-50 text-brass-600 border-brass-400/50',
  converted: 'bg-pine-600 text-brass-50 border-pine-600',
  lost: 'bg-ink/5 text-ink/40 border-ink/10',
};

const LABELS = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted',
  lost: 'Lost',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide border rounded-full px-2.5 py-1 ${STYLES[status] || STYLES.new}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {LABELS[status] || status}
    </span>
  );
}
