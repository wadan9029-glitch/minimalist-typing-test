import React, { useState } from 'react';

const ACCENTS = [
  { label: 'Amber', value: '#f5c851' },
  { label: 'Blue', value: '#5ba8ff' },
  { label: 'Green', value: '#7bd389' }
];

function Toggle({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-10 h-6 rounded-full transition ${enabled ? 'bg-white/20' : 'bg-white/10'}`}
      style={enabled ? { backgroundColor: 'var(--accent)' } : undefined}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white transition transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );
}

export default function SettingsPanel({ settings, onChange }) {
  const [open, setOpen] = useState(false);

  const updateSetting = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm uppercase tracking-[0.3em] text-muted hover:text-text transition"
      >
        Settings
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#141414] border border-white/10 p-4 shadow-soft z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">Sound</div>
              <Toggle enabled={settings.sound} onClick={() => updateSetting('sound', !settings.sound)} />
            </div>
            <div>
              <div className="text-sm text-muted mb-2">Cursor</div>
              <div className="flex gap-2">
                {['line', 'block'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => updateSetting('cursor', style)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      settings.cursor === style ? 'bg-white/10 text-text' : 'text-muted hover:text-text'
                    }`}
                    style={settings.cursor === style ? { color: 'var(--accent)' } : undefined}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted mb-2">Accent</div>
              <div className="flex gap-2">
                {ACCENTS.map((accent) => (
                  <button
                    key={accent.value}
                    type="button"
                    onClick={() => updateSetting('accent', accent.value)}
                    className={`h-8 w-8 rounded-full border transition ${
                      settings.accent === accent.value ? 'border-white/40' : 'border-white/10'
                    }`}
                    style={{ backgroundColor: accent.value }}
                    aria-label={accent.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
