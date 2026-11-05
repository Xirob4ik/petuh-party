import React, { useEffect, useState } from 'react';
import { initials } from '../lib/user';

type IconName =
  | 'copy'
  | 'check'
  | 'send'
  | 'image'
  | 'reply'
  | 'x'
  | 'refresh'
  | 'smile'
  | 'film'
  | 'arrow'
  | 'link'
  | 'play'
  | 'volume'
  | 'sliders'
  | 'plus'
  | 'search'
  | 'sticker'
  | 'expand'
  | 'keyboard'
  | 'download'
  | 'share';

const PATHS: Record<IconName, React.ReactNode> = {
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  send: <path d="M5 12h13m-5-6 6 6-6 6" />,
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m20.5 16-4.8-4.8a1 1 0 0 0-1.4 0L6 19.5" />
    </>
  ),
  reply: <path d="M10 8 5 12.5l5 4.5M5.5 12.5H14a5 5 0 0 1 5 5v1" />,
  x: <path d="M6.5 6.5l11 11m0-11-11 11" />,
  refresh: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.5 4.5v4h-4" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14.2a4.5 4.5 0 0 0 7 0" />
      <path d="M9.2 9.8h.01M14.8 9.8h.01" strokeWidth="2.4" />
    </>
  ),
  film: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" />
    </>
  ),
  arrow: <path d="M5 12h13m-5-6 6 6-6 6" />,
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  volume: (
    <>
      <path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" />
      <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h9m4 0h3M4 17h3m4 0h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  sticker: (
    <>
      <path d="M20.5 12.5V7a3.5 3.5 0 0 0-3.5-3.5H7A3.5 3.5 0 0 0 3.5 7v10A3.5 3.5 0 0 0 7 20.5h5.5z" />
      <path d="M20.5 12.5h-4.5a3.5 3.5 0 0 0-3.5 3.5v4.5" />
      <path d="M8.5 9.5h.01M14.5 9.5h.01" strokeWidth="2.4" />
    </>
  ),
  expand: <path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" />,
  keyboard: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" strokeWidth="2" />
    </>
  ),
  download: <path d="M12 4.5v11m-4.5-4.5L12 15.5l4.5-4.5M5 19.5h14" />,
  share: (
    <>
      <path d="M12 15V4.5m-4 4L12 4.5l4 4" />
      <path d="M8 11.5H6.5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H16" />
    </>
  ),
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Знак: голова петуха, она же кнопка «плей». */
export function Mark({ size = 30, bare = false }: { size?: number; bare?: boolean }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={bare ? 'mark bare' : 'mark'}>
      <defs>
        <linearGradient id={`${id}b`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#a77bff" />
          <stop offset="1" stopColor="#e04dd6" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6fb0" />
          <stop offset="1" stopColor="#ff3d7f" />
        </linearGradient>
      </defs>
      {!bare && <rect width="64" height="64" rx="18" fill="#1a1229" />}
      <g transform="translate(1 2)">
        <path
          d="M22 19C20 14 23 10 27 11.5c.5-4.5 6-5.5 8-1.5 2-3.5 7.5-2 6.5 2.5 3.5 0 4.5 4.5.5 7Z"
          fill={`url(#${id}c)`}
        />
        <path
          d="M43 24c-1.5-7-10-9.5-16-6.5s-7.5 9.5-6.5 14.5l-8 4 7 2.5-8.5 6 9.5 1-6.5 7.5 12.5-3c6-1.5 11-5 13-10.5 1.5-4 3.5-8 4.5-11Z"
          fill={`url(#${id}b)`}
        />
        <path d="M42.5 23.2l10 4.4-9.1 3.4Z" fill="#ffe08a" stroke="#ffe08a" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M42.8 32c3.2 1 3.4 6.5.2 7.6-2.4.7-3-3.6-.2-7.6Z" fill={`url(#${id}c)`} />
        <circle cx="35" cy="23" r="2.6" fill="#1a1229" />
        <circle cx="35.9" cy="22.1" r="0.9" fill="#fff" />
      </g>
    </svg>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <a
      className="logo"
      href="/"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Mark />
      <span className="logo-word">petuh party</span>
    </a>
  );
}

export function Avatar({
  name,
  avatar,
  color,
  size = 32,
  dim = false,
}: {
  name: string;
  avatar: string | null;
  color: string;
  size?: number;
  dim?: boolean;
}) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) } as React.CSSProperties;
  if (avatar) {
    return <img className={`avatar${dim ? ' dim' : ''}`} src={avatar} alt="" style={style} />;
  }
  return (
    <span className={`avatar${dim ? ' dim' : ''}`} style={{ ...style, background: color }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

// ── всплывающие уведомления ───────────────────────────
type Toast = { id: number; text: string; tone: 'info' | 'error' };
let push: ((t: Toast) => void) | null = null;
let seq = 0;

export function toast(text: string, tone: Toast['tone'] = 'info') {
  push?.({ id: ++seq, text, tone });
}

export function Toasts() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    push = (t) => {
      setItems((prev) => [...prev.slice(-2), t]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), t.tone === 'error' ? 5000 : 2200);
    };
    return () => {
      push = null;
    };
  }, []);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.tone}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function Dialog({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`dialog${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="dialog-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
