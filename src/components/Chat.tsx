import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getSticker, stickerUrl } from '../../shared/stickers';
import { LIMITS, type Message, type Person } from '../../shared/types';
import { storage } from '../lib/storage';
import { clockTime, compressImage, copyText } from '../lib/util';
import { ReactionBar } from './Floats';
import { StickerPicker } from './StickerPicker';
import { Avatar, Icon, toast } from './ui';

const QUICK = ['😭', '😂', '🔥', '❤️', '😱', '👍', '🍿', '🐓'];
/** Реакция по двойному нажатию на сообщение. */
const DOUBLE_TAP = '😭';
const TIP_KEY = 'pp.tip.reactions';
const isTouch = () => window.matchMedia?.('(hover: none)').matches ?? false;

interface Props {
  messages: Message[];
  people: Map<string, Person>;
  meId: string;
  typing: string[];
  onSend: (text: string, image?: string, replyTo?: string, sticker?: string) => void;
  onReact: (id: string, emoji: string) => void;
  onTyping: (on: boolean) => void;
  floats: string[];
  floatsDisabled: boolean;
  onFloat: (emoji: string) => void;
  onEditFloats: () => void;
}

async function imageFromFile(file: File) {
  let data = await compressImage(file, 1280, 0.8);
  if (data.length > LIMITS.image) data = await compressImage(file, 900, 0.7);
  if (data.length > LIMITS.image) throw new Error('Картинка слишком большая');
  return data;
}

export function Chat({
  messages,
  people,
  meId,
  typing,
  onSend,
  onReact,
  onTyping,
  floats,
  floatsDisabled,
  onFloat,
  onEditFloats,
}: Props) {
  const [stickersOpen, setStickersOpen] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [reply, setReply] = useState<Message | null>(null);
  const [sheet, setSheet] = useState<Message | null>(null); // меню сообщения на телефоне
  const [picker, setPicker] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ id: string; key: number } | null>(null);
  const [tip, setTip] = useState(() => !storage.get(TIP_KEY));
  const lastTap = useRef<{ id: string; t: number } | null>(null);
  const press = useRef<{ timer: number; x: number; y: number; fired: boolean } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stick = useRef(true);
  const typingTimer = useRef<number | null>(null);

  // автопрокрутка, если пользователь и так внизу
  useLayoutEffect(() => {
    const el = listRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages, typing.length]);

  // список сжимается при открытой клавиатуре — держим последние сообщения на виду
  useEffect(() => {
    const el = listRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (stick.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [text]);

  const onScroll = () => {
    const el = listRef.current;
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  const send = () => {
    const t = text.trim();
    if (!t && !image) return;
    onSend(t, image ?? undefined, reply?.id);
    setText('');
    setImage(null);
    setReply(null);
    stick.current = true;
    onTyping(false);
    if (typingTimer.current) clearTimeout(typingTimer.current);
  };

  const onChange = (v: string) => {
    setText(v);
    onTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => onTyping(false), 2000);
  };

  const attach = async (file: File | undefined | null) => {
    if (!file) return;
    try {
      setImage(await imageFromFile(file));
      inputRef.current?.focus();
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  };

  // мини-меню реакций на компьютере закрывается кликом мимо
  useEffect(() => {
    if (!picker) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.msg-actions')) setPicker(null);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [picker]);

  const closeTip = () => {
    setTip(false);
    storage.set(TIP_KEY, '1');
  };

  // Двойное нажатие — 😭, удержание — меню реакций и ответа
  const onTap = (m: Message) => {
    if (press.current?.fired) return;
    const now = Date.now();
    const last = lastTap.current;
    if (last && last.id === m.id && now - last.t < 350) {
      lastTap.current = null;
      onReact(m.id, DOUBLE_TAP);
      setBurst({ id: m.id, key: now });
      if (tip) closeTip();
    } else {
      lastTap.current = { id: m.id, t: now };
    }
  };

  const sheetAt = useRef(0);
  const openMenu = (m: Message) => {
    sheetAt.current = Date.now();
    if (isTouch()) setSheet(m);
    else setPicker(m.id);
    navigator.vibrate?.(12);
  };

  const pressStart = (m: Message, e: React.PointerEvent) => {
    if (press.current) clearTimeout(press.current.timer);
    const st = { timer: 0, x: e.clientX, y: e.clientY, fired: false };
    st.timer = window.setTimeout(() => {
      st.fired = true;
      openMenu(m);
    }, 480);
    press.current = st;
  };

  const pressMove = (e: React.PointerEvent) => {
    const st = press.current;
    if (st && !st.fired && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 10) {
      clearTimeout(st.timer);
      press.current = null;
    }
  };

  const pressEnd = () => {
    const st = press.current;
    if (!st) return;
    clearTimeout(st.timer);
    // после долгого нажатия «клик» не считаем касанием
    if (st.fired) setTimeout(() => (press.current = null), 0);
    else press.current = null;
  };

  const typingNames = typing
    .filter((id) => id !== meId)
    .map((id) => people.get(id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="chat">
      <div className="chat-list" ref={listRef} onScroll={onScroll}>
        {tip && messages.some((m) => m.user !== 'system') && (
          <div className="tip">
            <span>
              <b>Двойное нажатие</b> на сообщение ставит {DOUBLE_TAP}.{' '}
              <span className="tip-touch">
                <b>Удержание</b> — другие реакции и ответ.
              </span>
              <span className="tip-mouse">Остальные реакции и ответ — в кнопках справа при наведении.</span>
            </span>
            <button className="icon-btn small" onClick={closeTip} aria-label="Понятно">
              <Icon name="x" size={14} />
            </button>
          </div>
        )}
        {messages.length === 0 && (
          <p className="chat-empty">Здесь пока тихо. Напишите первым — или киньте ссылку друзьям, чтобы было с кем.</p>
        )}
        {messages.map((m, i) => {
          if (m.user === 'system') {
            return (
              <div key={m.id} className="sys">
                {m.text}
              </div>
            );
          }
          const prev = messages[i - 1];
          const grouped = prev && prev.user === m.user && m.ts - prev.ts < 3 * 60_000 && !m.replyTo;
          const person = people.get(m.user);
          const mine = m.user === meId;
          return (
            <div
              key={m.id}
              className={`msg${grouped ? ' grouped' : ''}${picker === m.id || sheet?.id === m.id ? ' active' : ''}`}
              onClick={() => onTap(m)}
              onMouseDown={(e) => e.detail > 1 && e.preventDefault()}
              onPointerDown={(e) => pressStart(m, e)}
              onPointerMove={pressMove}
              onPointerUp={pressEnd}
              onPointerCancel={pressEnd}
              onPointerLeave={pressEnd}
              onContextMenu={(e) => {
                if (isTouch()) e.preventDefault();
              }}
            >
              {burst?.id === m.id && (
                <span key={burst.key} className="burst" aria-hidden="true" onAnimationEnd={() => setBurst(null)}>
                  {DOUBLE_TAP}
                </span>
              )}
              <div className="msg-avatar">
                {!grouped && (
                  <Avatar
                    name={m.name}
                    avatar={person?.avatar ?? null}
                    color={person?.color ?? '#5a5363'}
                    size={30}
                    dim={!person}
                  />
                )}
              </div>
              <div className="msg-body">
                {!grouped && (
                  <div className="msg-head">
                    <span className={`msg-name${mine ? ' mine' : ''}`}>{m.name}</span>
                    <time>{clockTime(m.ts)}</time>
                  </div>
                )}
                {m.replyTo && (
                  <div className="msg-quote">
                    <span>{m.replyTo.name}</span> {m.replyTo.text}
                  </div>
                )}
                {m.sticker && getSticker(m.sticker) && (
                  <img
                    className="msg-sticker"
                    src={stickerUrl(getSticker(m.sticker)!)}
                    alt={getSticker(m.sticker)!.name}
                    title={getSticker(m.sticker)!.name}
                    loading="lazy"
                    draggable={false}
                  />
                )}
                {m.image && (
                  <button
                    className="msg-image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox(m.image!);
                    }}
                  >
                    <img src={m.image} alt="Картинка из чата" loading="lazy" />
                  </button>
                )}
                {m.text && <p className="msg-text">{m.text}</p>}
                {m.reactions.length > 0 && (
                  <div className="reactions">
                    {m.reactions.map((r) => (
                      <button
                        key={r.emoji}
                        className={`reaction${r.users.includes(meId) ? ' on' : ''}`}
                        title={r.users.map((u) => people.get(u)?.name || 'кто-то').join(', ')}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReact(m.id, r.emoji);
                        }}
                      >
                        {r.emoji} <span>{r.users.length}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="msg-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="icon-btn small"
                  aria-label="Реакция"
                  onClick={() => setPicker(picker === m.id ? null : m.id)}
                >
                  <Icon name="smile" size={16} />
                </button>
                <button
                  className="icon-btn small"
                  aria-label="Ответить"
                  onClick={() => {
                    setReply(m);
                    setPicker(null);
                    inputRef.current?.focus();
                  }}
                >
                  <Icon name="reply" size={16} />
                </button>
                {picker === m.id && (
                  <div className="quick">
                    {QUICK.map((e) => (
                      <button
                        key={e}
                        onClick={() => {
                          onReact(m.id, e);
                          setPicker(null);
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="composer">
        <ReactionBar emojis={floats} onSend={onFloat} onEdit={onEditFloats} disabled={floatsDisabled} />
        <div className="typing" aria-live="polite">
          {typingNames.length > 0 && `${typingNames.join(', ')} ${typingNames.length > 1 ? 'пишут' : 'пишет'}…`}
        </div>
        {reply && (
          <div className="composer-note">
            <Icon name="reply" size={15} />
            <span className="clip">
              Ответ <b>{reply.name}</b>: {reply.text || (reply.sticker ? 'Стикер' : 'Фото')}
            </span>
            <button className="icon-btn small" onClick={() => setReply(null)} aria-label="Отменить ответ">
              <Icon name="x" size={15} />
            </button>
          </div>
        )}
        {image && (
          <div className="composer-image">
            <img src={image} alt="Прикреплённая картинка" />
            <button className="icon-btn small" onClick={() => setImage(null)} aria-label="Убрать картинку">
              <Icon name="x" size={15} />
            </button>
          </div>
        )}
        <div className="composer-row">
          <button className="icon-btn" onClick={() => fileRef.current?.click()} aria-label="Прикрепить картинку">
            <Icon name="image" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              attach(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            maxLength={LIMITS.text}
            placeholder="Сообщение"
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              stick.current = true;
              setTimeout(() => {
                const el = listRef.current;
                if (el) el.scrollTop = el.scrollHeight;
              }, 250);
            }}

            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            onPaste={(e) => {
              const file = [...e.clipboardData.files].find((f) => f.type.startsWith('image/'));
              if (file) {
                e.preventDefault();
                attach(file);
              }
            }}
          />
          <button
            className={`icon-btn${stickersOpen ? ' on' : ''}`}
            onClick={() => setStickersOpen((v) => !v)}
            aria-label="Стикеры"
            title="Стикеры"
            data-sticker-toggle
          >
            <Icon name="sticker" />
          </button>
          <button
            className="send"
            // компьютер: не уводим фокус из поля ввода
            onMouseDown={(e) => e.preventDefault()}
            // телефон: отправляем по отпусканию пальца на кнопке. Safari на iPhone не присылает «клик»,
            // если отменить нажатие, а без отмены прячет клавиатуру — поэтому обрабатываем касание сами
            onTouchEnd={(e) => {
              e.preventDefault();
              const t = e.changedTouches[0];
              const el = t && document.elementFromPoint(t.clientX, t.clientY);
              if (el && e.currentTarget.contains(el)) send();
            }}
            onClick={send} disabled={!text.trim() && !image} aria-label="Отправить">
            <Icon name="send" />
          </button>
        </div>
      </div>

      {sheet && (
        <>
          <div
            className="sheet-scrim show"
            onClick={() => {
              // отпускание пальца после удержания не должно сразу закрывать меню
              if (Date.now() - sheetAt.current > 500) setSheet(null);
            }}
          />
          <div className="msg-sheet" role="dialog" aria-label="Действия с сообщением">
            <p className="msg-sheet-preview">
              <b>{sheet.name}</b> {sheet.text || (sheet.sticker ? 'Стикер' : sheet.image ? 'Фото' : '')}
            </p>
            <div className="msg-sheet-emoji">
              {QUICK.map((e) => {
                const on = sheet.reactions.find((r) => r.emoji === e)?.users.includes(meId);
                return (
                  <button
                    key={e}
                    className={on ? 'on' : ''}
                    onClick={() => {
                      onReact(sheet.id, e);
                      setSheet(null);
                    }}
                    aria-label={`Реакция ${e}`}
                  >
                    {e}
                  </button>
                );
              })}
            </div>
            <button
              className="msg-sheet-row"
              onClick={() => {
                setReply(sheet);
                setSheet(null);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
            >
              <Icon name="reply" /> Ответить
            </button>
            {sheet.text && (
              <button
                className="msg-sheet-row"
                onClick={async () => {
                  if (await copyText(sheet.text)) toast('Текст скопирован');
                  setSheet(null);
                }}
              >
                <Icon name="copy" /> Скопировать текст
              </button>
            )}
          </div>
        </>
      )}

      {stickersOpen && (
        <StickerPicker
          onClose={() => setStickersOpen(false)}
          onPick={(id) => {
            onSend('', undefined, reply?.id, id);
            setReply(null);
            setStickersOpen(false);
            stick.current = true;
          }}
        />
      )}

      {lightbox && (
        <div className="scrim lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Картинка из чата" />
        </div>
      )}
    </div>
  );
}
