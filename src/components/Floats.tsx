import React, { useEffect, useState } from 'react';
import { DEFAULT_FLOATS, FLOAT_MAX, FLOAT_MIN, firstGrapheme, POPULAR_FLOATS, saveFloats } from '../lib/reactions';
import { playPop } from '../lib/sound';
import { Dialog, Icon } from './ui';

export interface FloatItem {
  id: string;
  emoji: string;
  name: string;
  x: number;
}

/** Реакции, которые пролетают поверх видео. Видны всем, в том числе в полноэкранном режиме сайта. */
export function FloatingOverlay({ items, onDone }: { items: FloatItem[]; onDone: (id: string) => void }) {
  return (
    <div className="floats" aria-hidden="true">
      {items.map((r) => {
        // устойчивый «случайный» разброс по id
        const seed = [...r.id].reduce((a, c) => a + c.charCodeAt(0), 0);
        const style = {
          left: `${r.x}%`,
          '--drift': `${(seed % 60) - 30}px`,
          '--rot': `${(seed % 30) - 15}deg`,
        } as React.CSSProperties;
        return (
          <div key={r.id} className="float" style={style} onAnimationEnd={() => onDone(r.id)}>
            <span className="float-emoji">{r.emoji}</span>
            {r.name && <span className="float-name">{r.name}</span>}
          </div>
        );
      })}
    </div>
  );
}

/** Строка эмодзи над полем сообщения: нажал — реакция полетела на экран у всех. */
export function ReactionBar({
  emojis,
  onSend,
  onEdit,
  disabled,
}: {
  emojis: string[];
  onSend: (emoji: string) => void;
  onEdit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="reaction-bar" role="toolbar" aria-label="Реакции на экран">
      <div className="reaction-bar-list">
        {emojis.map((e, i) => (
          <button
            key={`${i}-${e}`}
            onClick={() => onSend(e)}
            disabled={disabled}
            title={disabled ? 'Сначала включите видео' : `Отправить ${e} на экран`}
          >
            {e}
          </button>
        ))}
      </div>
      <button className="icon-btn small" onClick={onEdit} title="Настроить реакции" aria-label="Настроить реакции">
        <Icon name="sliders" size={16} />
      </button>
    </div>
  );
}

export function FloatsDialog({
  current,
  onSave,
  onClose,
}: {
  current: string[];
  onSave: (list: string[]) => void;
  onClose: () => void;
}) {
  const [list, setList] = useState<string[]>(current);
  const [slot, setSlot] = useState(0);
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (slot >= list.length) setSlot(Math.max(0, list.length - 1));
  }, [list.length, slot]);

  const put = (emoji: string) => {
    if (!emoji) return;
    playPop(emoji);
    const next = [...list];
    next[slot] = emoji;
    setList(next);
    if (slot < next.length - 1) setSlot(slot + 1);
  };

  const add = () => {
    if (list.length >= FLOAT_MAX) return;
    const spare = POPULAR_FLOATS.find((e) => !list.includes(e)) || '🎉';
    setList([...list, spare]);
    setSlot(list.length);
  };

  const remove = (i: number) => {
    if (list.length <= FLOAT_MIN) return;
    setList(list.filter((_, j) => j !== i));
  };

  return (
    <Dialog title="Реакции на экран" onClose={onClose} wide>
      <p className="dialog-lede">
        Эти эмодзи стоят над полем сообщения. Нажатие отправляет реакцию поверх видео — её увидят все в комнате.
        Выберите ячейку, потом эмодзи для неё.
      </p>

      <div className="slots" role="radiogroup" aria-label="Ваша панель">
        {list.map((e, i) => (
          <div key={i} className={`slot${i === slot ? ' on' : ''}`}>
            <button role="radio" aria-checked={i === slot} onClick={() => setSlot(i)} aria-label={`Ячейка ${i + 1}: ${e}`}>
              {e}
            </button>
            {list.length > FLOAT_MIN && (
              <button className="slot-x" onClick={() => remove(i)} aria-label={`Убрать ${e}`}>
                <Icon name="x" size={12} />
              </button>
            )}
          </div>
        ))}
        {list.length < FLOAT_MAX && (
          <button className="slot add" onClick={add} aria-label="Добавить ячейку">
            <Icon name="plus" size={18} />
          </button>
        )}
      </div>

      <div className="emoji-grid">
        {POPULAR_FLOATS.map((e) => (
          <button key={e} onClick={() => put(e)} aria-label={e}>
            {e}
          </button>
        ))}
      </div>

      <form
        className="custom-emoji"
        onSubmit={(ev) => {
          ev.preventDefault();
          put(firstGrapheme(custom));
          setCustom('');
        }}
      >
        <input
          className="field"
          value={custom}
          onChange={(ev) => setCustom(ev.target.value)}
          placeholder="Или вставьте любой эмодзи"
          aria-label="Свой эмодзи"
          maxLength={16}
        />
        <button className="btn ghost" type="submit" disabled={!custom.trim()}>
          Поставить
        </button>
      </form>

      <div className="dialog-actions spread">
        <button className="btn ghost" onClick={() => setList(DEFAULT_FLOATS)}>
          Как было
        </button>
        <button
          className="btn primary"
          onClick={() => {
            saveFloats(list);
            onSave(list);
            onClose();
          }}
        >
          Сохранить
        </button>
      </div>
    </Dialog>
  );
}
