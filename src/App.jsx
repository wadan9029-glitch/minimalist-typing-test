import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TypingArea from './components/TypingArea.jsx';
import StatsBar from './components/StatsBar.jsx';
import ModeSelector from './components/ModeSelector.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import { WORDS } from './data/words.js';
import { QUOTES } from './data/quotes.js';

const DEFAULT_SETTINGS = {
  sound: false,
  cursor: 'line',
  accent: '#f5c851'
};

const DEFAULT_CUSTOM_TEXT = 'Paste your own text here to practice with it.';

function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage failures
    }
  }, [key, value]);

  return [value, setValue];
}

function randomWords(count) {
  const result = [];
  for (let i = 0; i < count; i += 1) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    result.push(word);
  }
  return result;
}

function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function calculateStats(words, typedWords) {
  let correct = 0;
  let total = 0;
  let errors = 0;

  for (let i = 0; i < typedWords.length; i += 1) {
    const typed = typedWords[i] || '';
    if (!typed) continue;
    const target = words[i] || '';
    const limit = typed.length;
    for (let j = 0; j < limit; j += 1) {
      total += 1;
      if (j < target.length && typed[j] === target[j]) {
        correct += 1;
      } else {
        errors += 1;
      }
    }
  }

  return { correct, total, errors };
}

export default function App() {
  const [mode, setMode] = useLocalStorageState('typing.mode', 'time');
  const [timeOption, setTimeOption] = useLocalStorageState('typing.timeOption', 30);
  const [wordOption, setWordOption] = useLocalStorageState('typing.wordOption', 25);
  const [settings, setSettings] = useLocalStorageState('typing.settings', DEFAULT_SETTINGS);
  const [bestWpm, setBestWpm] = useLocalStorageState('typing.bestWpm', {});
  const [customText, setCustomText] = useLocalStorageState('typing.customText', '');
  const [customDraft, setCustomDraft] = useState(customText);

  const [words, setWords] = useState([]);
  const [typedWords, setTypedWords] = useState(['']);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [, setTick] = useState(0);

  const audioRef = useRef(null);

  const hasTimer = mode === 'time';
  const isInfinite = mode === 'time' || mode === 'zen';

  const playClick = useCallback(() => {
    if (!settings.sound) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioRef.current) {
      audioRef.current = new AudioContext();
    }
    const ctx = audioRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 320 + Math.random() * 40;
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [settings.sound]);

  const generateTest = useCallback(() => {
    if (mode === 'time') {
      const count = Math.max(120, timeOption * 4);
      return randomWords(count);
    }
    if (mode === 'zen') {
      return randomWords(120);
    }
    if (mode === 'words') {
      return randomWords(wordOption);
    }
    if (mode === 'quote') {
      const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      return normalizeText(quote).split(' ');
    }
    if (mode === 'custom') {
      const raw = normalizeText(customText);
      const text = raw || DEFAULT_CUSTOM_TEXT;
      return text.split(' ');
    }
    return randomWords(120);
  }, [mode, timeOption, wordOption, customText]);

  const resetTest = useCallback(() => {
    const nextWords = generateTest();
    setWords(nextWords);
    setTypedWords(['']);
    setCurrentWordIndex(0);
    setStatus('idle');
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(hasTimer ? timeOption : null);
  }, [generateTest, hasTimer, timeOption]);

  const endTest = useCallback(() => {
    setStatus((prev) => (prev === 'ended' ? prev : 'ended'));
    setEndTime(Date.now());
    if (hasTimer) setTimeLeft(0);
  }, [hasTimer]);

  const startTest = useCallback(() => {
    if (status !== 'idle') return;
    const now = Date.now();
    setStatus('running');
    setStartTime(now);
    setEndTime(null);
    if (hasTimer) setTimeLeft(timeOption);
  }, [status, hasTimer, timeOption]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  useEffect(() => {
    if (!settings.accent) return;
    document.documentElement.style.setProperty('--accent', settings.accent);
  }, [settings.accent]);

  useEffect(() => {
    if (status !== 'running' || !hasTimer) return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, timeOption - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) {
        endTest();
      }
    }, 200);
    return () => clearInterval(id);
  }, [status, hasTimer, startTime, timeOption, endTest]);

  useEffect(() => {
    if (status !== 'running' || hasTimer) return;
    const id = setInterval(() => setTick((value) => value + 1), 200);
    return () => clearInterval(id);
  }, [status, hasTimer, setTick]);

  useEffect(() => {
    setCustomDraft(customText);
  }, [customText, mode]);

  const stats = useMemo(() => calculateStats(words, typedWords), [words, typedWords]);

  const now = status === 'running' ? Date.now() : endTime || Date.now();
  const elapsedSeconds = startTime ? (now - startTime) / 1000 : 0;
  const boundedElapsed = hasTimer ? Math.min(elapsedSeconds, timeOption) : elapsedSeconds;
  const minutes = Math.max(boundedElapsed / 60, 1 / 60);
  const wpm = boundedElapsed > 0 ? (stats.correct / 5) / minutes : 0;
  const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 100;

  useEffect(() => {
    if (status !== 'ended') return;
    const modeKey = mode === 'time' ? `time-${timeOption}` : mode === 'words' ? `words-${wordOption}` : mode;
    const rounded = Math.round(wpm);
    setBestWpm((prev) => {
      const current = prev[modeKey] || 0;
      if (rounded > current) {
        return { ...prev, [modeKey]: rounded };
      }
      return prev;
    });
  }, [status, mode, timeOption, wordOption, wpm, setBestWpm]);

  const timeDisplay = hasTimer
    ? formatTime(status === 'ended' ? 0 : timeLeft ?? timeOption)
    : formatTime(boundedElapsed);

  const summary = {
    wpm: Math.round(wpm),
    accuracy: Number(accuracy.toFixed(1)),
    time: formatTime(hasTimer ? timeOption : boundedElapsed),
    errors: stats.errors
  };

  const displayStats = {
    wpm: Math.round(wpm),
    accuracy: Number(accuracy.toFixed(1)),
    time: timeDisplay,
    characters: stats.total,
    errors: stats.errors
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      const key = event.key;

      if (key === 'Tab' || key === 'Enter') {
        event.preventDefault();
        resetTest();
        return;
      }

      if (status === 'ended') return;

      if (key === 'Backspace') {
        event.preventDefault();
        const nextTyped = typedWords.slice();
        const currentTyped = nextTyped[currentWordIndex] || '';
        if (currentTyped.length > 0) {
          nextTyped[currentWordIndex] = currentTyped.slice(0, -1);
          setTypedWords(nextTyped);
        } else if (currentWordIndex > 0) {
          const prevIndex = currentWordIndex - 1;
          const prevTyped = nextTyped[prevIndex] || '';
          nextTyped[prevIndex] = prevTyped.slice(0, -1);
          setTypedWords(nextTyped);
          setCurrentWordIndex(prevIndex);
        }
        return;
      }

      if (key === ' ') {
        event.preventDefault();
        if (status === 'idle') startTest();
        const nextTyped = typedWords.slice();
        const atLastWord = currentWordIndex >= words.length - 1;

        if (atLastWord && !isInfinite) {
          endTest();
          return;
        }

        let nextIndex = currentWordIndex + 1;
        if (atLastWord && isInfinite) {
          setWords((prev) => [...prev, ...randomWords(50)]);
        }

        if (!nextTyped[nextIndex]) nextTyped[nextIndex] = '';
        setTypedWords(nextTyped);
        setCurrentWordIndex(nextIndex);
        playClick();
        return;
      }

      if (key.length !== 1) return;

      if (status === 'idle') startTest();
      const nextTyped = typedWords.slice();
      const currentTyped = nextTyped[currentWordIndex] || '';
      nextTyped[currentWordIndex] = currentTyped + key;
      setTypedWords(nextTyped);
      playClick();

      if (!hasTimer && mode !== 'zen') {
        const atLast = currentWordIndex === words.length - 1;
        const typedLength = nextTyped[currentWordIndex].length;
        const targetLength = (words[currentWordIndex] || '').length;
        if (atLast && typedLength === targetLength) {
          endTest();
        }
      }
    },
    [
      status,
      typedWords,
      currentWordIndex,
      words,
      resetTest,
      startTest,
      endTest,
      hasTimer,
      isInfinite,
      mode,
      playClick
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
  };

  const applyCustomText = () => {
    setCustomText(customDraft);
  };

  const modeKey = mode === 'time' ? `time-${timeOption}` : mode === 'words' ? `words-${wordOption}` : mode;
  const bestForMode = bestWpm[modeKey];

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-muted">Minimalist</div>
            <h1 className="text-2xl font-semibold mt-2">Typing Test</h1>
          </div>
          <SettingsPanel settings={settings} onChange={setSettings} />
        </header>

        <div className="mt-10">
          <ModeSelector
            mode={mode}
            timeOption={timeOption}
            wordOption={wordOption}
            onModeChange={handleModeChange}
            onTimeChange={setTimeOption}
            onWordChange={setWordOption}
            onQuoteRefresh={resetTest}
          />

          {mode === 'custom' && (
            <div className="mt-6">
              <textarea
                value={customDraft}
                onChange={(event) => setCustomDraft(event.target.value)}
                placeholder={DEFAULT_CUSTOM_TEXT}
                className="w-full min-h-[120px] rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-text focus:outline-none focus:border-white/20"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-muted">Paste text and press Apply to load.</div>
                <button
                  type="button"
                  onClick={applyCustomText}
                  className="px-4 py-2 rounded-full border border-white/10 text-sm text-muted hover:text-text transition"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          <StatsBar stats={displayStats} timeLabel={hasTimer ? 'Time Left' : 'Time'} bestWpm={bestForMode} />
        </div>

        <div className="mt-10">
          {status === 'ended' ? (
            <ResultsScreen
              results={summary}
              onRestart={resetTest}
              onChangeMode={resetTest}
            />
          ) : (
            <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/5">
              <TypingArea
                words={words}
                typedWords={typedWords}
                currentWordIndex={currentWordIndex}
                cursorStyle={settings.cursor}
                showCursor={status !== 'ended'}
              />
            </div>
          )}
        </div>

        <footer className="mt-8 text-sm text-muted">
          Tab or Enter to restart. Start typing to begin.
        </footer>
      </div>
    </div>
  );
}

