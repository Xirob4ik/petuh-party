import React, { useState } from 'react';
import { parseSource } from '../../shared/sources';
import { Icon } from './ui';

export function SourceForm({
  onSubmit,
  autoFocus = false,
  compact = false,
}: {
  onSubmit: (url: string) => void;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseSource(value);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    onSubmit(value.trim());
    setValue('');
    setError(null);
  };

  return (
    <form className={`source-form${compact ? ' compact' : ''}`} onSubmit={submit}>
      <div className="source-row">
        <Icon name="link" size={17} />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="Ссылка на VK Видео, YouTube, Rutube или .mp4"
          aria-label="Ссылка на видео"
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
        />
        <button className="btn primary small" type="submit" disabled={!value.trim()}>
          Включить
        </button>
      </div>
      {error && <p className="hint error">{error}</p>}
    </form>
  );
}
