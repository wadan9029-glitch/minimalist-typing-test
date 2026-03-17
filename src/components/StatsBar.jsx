import React from 'react';

function Stat({ label, value, sub }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-[0.3em] text-muted mt-1">{label}</div>
      {sub ? <div className="text-[11px] text-muted mt-2">{sub}</div> : null}
    </div>
  );
}

export default function StatsBar({ stats, timeLabel, bestWpm }) {
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-6">
      <Stat label="WPM" value={stats.wpm} sub={bestWpm ? `Best ${bestWpm}` : null} />
      <Stat label="Accuracy" value={`${stats.accuracy}%`} />
      <Stat label={timeLabel} value={stats.time} />
      <Stat label="Chars" value={stats.characters} />
      <Stat label="Errors" value={stats.errors} />
    </div>
  );
}
