import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  getSticker,
  searchStickers,
  STICKER_CATEGORIES,
  stickerUrl,
  type Sticker,
  type StickerCategory,
} from '../../shared/stickers';
import { playPop } from '../lib/sound';
import { storage } from '../lib/storage';
import { Icon } from './ui';

const RECENT_KEY = 'pp.stickers.recent';
const SUGGEST = ['ору', 'кринж', 'база', 'лагает', 'пауза', 'шедевр', 'попкорн'];

function loadRecent(): Sticker[] {
  return (storage.getJSON<string[]>(RECENT_KEY) || []).map((id) => getSticker(id)).filter(Boolean) as Sticker[];
}

function rememberSticker(id: string) {
  const ids = (storage.getJSON<string[]>(RECENT_KEY) || []).filter((x) => x !== id);
  storage.setJSON(RECENT_KEY, [id, ...ids].slice(0, 8));
}

export function StickerPicker({ onPick, onClose }: { onPick: (id: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<'all' | StickerCategory>('all');
  const recent = useMemo(loadRecent, []);
  const found = useMemo(() => searchStickers(query, cat), [query, cat]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (boxRef.current && !boxRef.current.contains(t) && !t.closest('[data-sticker-toggle]')) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [onClose]);

  const pick = (s: Sticker) => {
    rememberSticker(s.id);
    playPop('🐔');
    onPick(s.id);
  };

  const grid = (list: Sticker[]) => (
    <div className="sticker-grid">
      {list.map((s) => (
        <button key={s.id} onClick={() => pick(s)} title={s.name} aria-label={s.name}>
          <img src={stickerUrl(s)} alt="" loading="lazy" draggable={false} />
        </button>
      ))}
    </div>
  );

  const showRecent = recent.length > 0 && !query.trim() && cat === 'all';

  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="stickers" ref={boxRef} role="dialog" aria-label="Стикеры">
        <div className="stickers-head">
          <div className="stickers-search">
            <Icon name="search" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск: ору, кринж, лагает"
              aria-label="Поиск стикеров"
            />
            {query && (
              <button className="icon-btn small" onClick={() => setQuery('')} aria-label="Очистить">
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <Icon name="x" />
          </button>
        </div>
        <div className="chips" role="tablist">
          {STICKER_CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              className={cat === c.id ? 'on' : ''}
              onClick={() => {
                setCat(c.id);
                setQuery('');
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="stickers-body">
          {showRecent && (
            <>
              <h3>Недавние</h3>
              {grid(recent)}
              <h3>Все</h3>
            </>
          )}
          {found.length > 0 ? (
            grid(found)
          ) : (
            <div className="stickers-empty">
              <p>По запросу «{query}» ничего нет. Попробуйте:</p>
              <div className="chips">
                {SUGGEST.map((t) => (
                  <button key={t} onClick={() => setQuery(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
