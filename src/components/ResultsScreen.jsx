import React from 'react';

export default function ResultsScreen({ results, onRestart, onChangeMode }) {
  return (
    <div className="bg-white/5 rounded-2xl p-8 md:p-10 shadow-soft border border-white/10 text-center transition">
      <div className="text-sm uppercase tracking-[0.3em] text-muted">Results</div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-3xl font-semibold">{results.wpm}</div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted mt-1">WPM</div>
        </div>
        <div>
          <div className="text-3xl font-semibold">{results.accuracy}%</div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted mt-1">Accuracy</div>
        </div>
        <div>
          <div className="text-3xl font-semibold">{results.time}</div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted mt-1">Time</div>
        </div>
        <div>
          <div className="text-3xl font-semibold">{results.errors}</div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted mt-1">Errors</div>
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="px-6 py-2 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 transition"
          style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
        >
          Restart
        </button>
        <button
          type="button"
          onClick={onChangeMode}
          className="px-6 py-2 rounded-full border border-white/10 text-muted hover:text-text transition"
        >
          Change mode
        </button>
      </div>
    </div>
  );
}
