import React, { memo } from 'react';

const Word = memo(function Word({ word, typed, isActive, showCursor, cursorStyle }) {
  const letters = word.split('');
  const typedChars = typed.split('');
  const extraChars = typedChars.slice(letters.length);
  const cursorIndex = typedChars.length;

  return (
    <span className={`word ${isActive ? 'word-active' : ''}`}>
      {letters.map((char, index) => {
        const typedChar = typedChars[index];
        let className = 'text-muted';
        if (typedChar != null) {
          className = typedChar === char ? 'text-text' : 'text-error';
        }
        return (
          <span key={index} className={className}>
            {char}
          </span>
        );
      })}
      {extraChars.map((char, index) => (
        <span key={`extra-${index}`} className="text-error underline decoration-error">
          {char}
        </span>
      ))}
      {isActive && showCursor && (
        <span
          className={`cursor ${cursorStyle === 'block' ? 'cursor--block' : ''}`}
          style={{ '--cursor-x': cursorIndex }}
        />
      )}
    </span>
  );
});

const TypingArea = memo(function TypingArea({
  words,
  typedWords,
  currentWordIndex,
  cursorStyle,
  showCursor
}) {
  return (
    <div className="typing-area flex flex-wrap gap-x-3 gap-y-2">
      {words.map((word, index) => (
        <Word
          key={`${word}-${index}`}
          word={word}
          typed={typedWords[index] || ''}
          isActive={index === currentWordIndex}
          showCursor={showCursor}
          cursorStyle={cursorStyle}
        />
      ))}
    </div>
  );
});

export default TypingArea;
