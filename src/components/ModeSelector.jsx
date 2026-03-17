import React from 'react';

const MODES = [
  { id: 'time', label: 'Time' },
  { id: 'words', label: 'Words' },
  { id: 'custom', label: 'Custom' },
  { id: 'quote', label: 'Quote' },
  { id: 'zen', label: 'Zen' }
];

const TIME_OPTIONS = [15, 30, 60];
const WORD_OPTIONS = [10, 25, 50, 100];

function OptionButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition ${
        active ? 'bg-white/10 text-text' : 'text-muted hover:text-text'
      }`}
      style={active ? { color: 'var(--accent)' } : undefined}
    >
      {label}
    </button>
  );
}

export default function ModeSelector({
  mode,
  timeOption,
  wordOption,
  onModeChange,
  onTimeChange,
  onWordChange,
  onQuoteRefresh
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MODES.map((item) => {
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onModeChange(item.id)}
              className={`px-4 py-2 rounded-full border text-sm uppercase tracking-[0.2em] transition ${
                active ? 'border-white/20 bg-white/5' : 'border-white/5 text-muted hover:text-text'
              }`}
              style={active ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {mode === 'time' && (
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((value) => (
            <OptionButton
              key={value}
              label={`${value}s`}
              active={timeOption === value}
              onClick={() => onTimeChange(value)}
            />
          ))}
        </div>
      )}
      {mode === 'words' && (
        <div className="flex flex-wrap gap-2">
          {WORD_OPTIONS.map((value) => (
            <OptionButton
              key={value}
              label={`${value} words`}
              active={wordOption === value}
              onClick={() => onWordChange(value)}
            />
          ))}
        </div>
      )}
      {mode === 'quote' && (
        <div>
          <button
            type="button"
            onClick={onQuoteRefresh}
            className="px-3 py-1 rounded-full text-sm text-muted hover:text-text transition"
          >
            New quote
          </button>
        </div>
      )}
    </div>
  );
}
