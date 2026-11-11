import React, { useEffect, useRef, useState } from 'react';
import type { DjLine, DjMood } from '../lib/dj';

const INK = '#1a1229';

/** Глаза под настроение */
function Eyes({ mood }: { mood: DjMood }) {
  const arc = (x: number, up = true) => (
    <path d={up ? `M${x - 6.5} 60 Q${x} 51 ${x + 6.5} 60` : `M${x - 6.5} 58 Q${x} 64 ${x + 6.5} 58`} fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
  );
  const open = (x: number, dx = 0, dy = 0, r = 7.2, pr = 3.7) => (
    <g>
      <circle cx={x} cy={58} r={r} fill="#fff" />
      <circle cx={x + dx} cy={58 + dy} r={pr} fill={INK} />
      <circle cx={x + dx + 1.3} cy={58 + dy - 1.4} r={1.25} fill="#fff" />
    </g>
  );
  const heart = (x: number) => (
    <path
      transform={`translate(${x} 58) scale(0.62)`}
      d="M0 9 C-14 -1 -13 -13 -5.5 -13 C-2 -13 0 -10 0 -8 C0 -10 2 -13 5.5 -13 C13 -13 14 -1 0 9Z"
      fill="#ff3d7f"
    />
  );
  switch (mood) {
    case 'hi':
    case 'party':
    case 'laugh':
      return <g className="dj-eyes static">{arc(47)}{arc(73)}</g>;
    case 'sleep':
      return <g className="dj-eyes static">{arc(47, false)}{arc(73, false)}</g>;
    case 'wink':
      return <g className="dj-eyes static">{open(47)}{arc(73)}</g>;
    case 'love':
      return <g className="dj-eyes static dj-love-eyes">{heart(47)}{heart(73)}</g>;
    case 'shock':
      return <g className="dj-eyes">{open(47, 0, 0, 9, 2.6)}{open(73, 0, 0, 9, 2.6)}</g>;
    case 'think':
      return (
        <g className="dj-eyes">
          {open(47, 2.2, -2.2)}
          {open(73, 2.2, -2.2)}
          <path d="M66 46 L79 43" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'cry':
      return (
        <g className="dj-eyes">
          {open(47, 0, 1.5, 7, 3.2)}
          {open(73, 0, 1.5, 7, 3.2)}
          <path d="M39 47 L53 51 M81 47 L67 51" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'hype':
    case 'cool':
      return (
        <g className="dj-eyes static dj-shades">
          <path d="M33 52 h26 v6 a8 8 0 0 1 -8 8 h-10 a8 8 0 0 1 -8 -8Z M61 52 h26 v6 a8 8 0 0 1 -8 8 h-10 a8 8 0 0 1 -8 -8Z" fill={INK} />
          <path d="M57 54 h6" stroke={INK} strokeWidth="3" />
          <path className="dj-shine" d="M37 55 l6 -3 M65 55 l6 -3" stroke="#ff7ad1" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
  }
}

function Beak({ open }: { open: boolean }) {
  return open ? (
    <g className="dj-beak open">
      <ellipse cx="60" cy="75" rx="6.5" ry="5.5" fill="#4a1630" />
      <path d="M51.5 68 L68.5 68 L60 74 Z" fill="#ffd166" stroke="#ffd166" strokeWidth="2" strokeLinejoin="round" />
      <path d="M54 79 L66 79 L60 84 Z" fill="#f5b83d" stroke="#f5b83d" strokeWidth="2" strokeLinejoin="round" />
    </g>
  ) : (
    <path className="dj-beak" d="M52 68 L68 68 L60 78.5 Z" fill="#ffd166" stroke="#ffd166" strokeWidth="2.2" strokeLinejoin="round" />
  );
}

/** Ноты, слёзы, «zzz», сердечки — вокруг головы */
function Extras({ mood }: { mood: DjMood }) {
  const note = (x: number, y: number, cls: string) => (
    <g transform={`translate(${x} ${y})`}>
      <g className={`dj-fx ${cls}`}>
        <path d="M4 0 L12 -3 L12 9 a3.4 3 0 1 1 -2 -2.6 L10 1.2 L6 2.6 L6 11 a3.4 3 0 1 1 -2 -2.6Z" fill="#c9a8ff" />
      </g>
    </g>
  );
  switch (mood) {
    case 'party':
    case 'hype':
    case 'cool':
    case 'hi':
      return (
        <g>
          {note(96, 30, 'n1')}
          {note(8, 38, 'n2')}
          {note(100, 58, 'n3')}
        </g>
      );
    case 'cry':
      return (
        <g>
          <path className="dj-fx tear t1" d="M44 66 q3 6 0 8 q-3 -2 0 -8Z" fill="#7cc8ff" />
          <path className="dj-fx tear t2" d="M76 66 q3 6 0 8 q-3 -2 0 -8Z" fill="#7cc8ff" />
        </g>
      );
    case 'sleep':
      return (
        <g className="dj-z" fill="#c9a8ff" fontFamily="Unbounded, sans-serif" fontWeight="800">
          <text className="dj-fx z1" x="92" y="36" fontSize="13">z</text>
          <text className="dj-fx z2" x="100" y="24" fontSize="10">z</text>
          <text className="dj-fx z3" x="106" y="14" fontSize="8">z</text>
        </g>
      );
    case 'love':
      return (
        <g fill="#ff4f9a">
          <g transform="translate(98 34) scale(.42)">
            <path className="dj-fx h1" d="M0 9 C-14 -1 -13 -13 -5.5 -13 C-2 -13 0 -10 0 -8 C0 -10 2 -13 5.5 -13 C13 -13 14 -1 0 9Z" />
          </g>
          <g transform="translate(14 40) scale(.34)">
            <path className="dj-fx h2" d="M0 9 C-14 -1 -13 -13 -5.5 -13 C-2 -13 0 -10 0 -8 C0 -10 2 -13 5.5 -13 C13 -13 14 -1 0 9Z" />
          </g>
        </g>
      );
    case 'shock':
      return <path className="dj-fx sweat" d="M92 40 q4 7 0 10 q-4 -3 0 -10Z" fill="#7cc8ff" />;
    case 'think':
      return (
        <text className="dj-fx q" x="96" y="32" fontSize="18" fill="#c9a8ff" fontFamily="Unbounded, sans-serif" fontWeight="800">
          ?
        </text>
      );
    case 'laugh':
      return (
        <g>
          <path className="dj-fx tear t1" d="M36 58 q3 6 0 8 q-3 -2 0 -8Z" fill="#7cc8ff" />
          <path className="dj-fx tear t2" d="M84 58 q3 6 0 8 q-3 -2 0 -8Z" fill="#7cc8ff" />
        </g>
      );
    default:
      return null;
  }
}

export function DjAvatar({ mood, size = 64 }: { mood: DjMood; size?: number }) {
  const id = React.useId().replace(/:/g, '');
  const beakOpen = mood === 'hi' || mood === 'party' || mood === 'laugh' || mood === 'shock' || mood === 'hype';
  return (
    <svg className={`dj-svg mood-${mood}`} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}h`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#b18cff" />
          <stop offset="1" stopColor="#e04dd6" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7ab6" />
          <stop offset="1" stopColor="#ff3d7f" />
        </linearGradient>
      </defs>
      <ellipse className="dj-shadow" cx="60" cy="112" rx="26" ry="4.5" fill="#000" opacity=".35" />
      <g className="dj-head">
        <path d="M20 66 C14 8 106 8 100 66" fill="none" stroke="#211733" strokeWidth="7" strokeLinecap="round" />
        <path d="M24 46 C30 20 90 20 96 46" fill="none" stroke="#ff4f9a" strokeWidth="1.6" strokeLinecap="round" opacity=".5" />
        <g className="dj-comb">
          <circle cx="47" cy="27" r="9.5" fill={`url(#${id}c)`} />
          <circle cx="60" cy="20" r="11" fill={`url(#${id}c)`} />
          <circle cx="73" cy="27" r="9.5" fill={`url(#${id}c)`} />
        </g>
        <ellipse cx="60" cy="66" rx="35" ry="37" fill={`url(#${id}h)`} />
        <ellipse cx="50" cy="50" rx="17" ry="12" fill="#fff" opacity=".13" />
        <ellipse cx="37" cy="74" rx="6" ry="3.6" fill="#ff7ab6" opacity=".55" />
        <ellipse cx="83" cy="74" rx="6" ry="3.6" fill="#ff7ab6" opacity=".55" />
        <Eyes mood={mood} />
        <path className="dj-wattle" d="M60 82 c5 2 6 10 1 13 c-4 2 -7 -4 -1 -13Z" fill={`url(#${id}c)`} />
        <Beak open={beakOpen} />
        {/* наушники */}
        <g className="dj-cups">
          <rect x="11" y="53" width="18" height="29" rx="9" fill="#211733" />
          <rect x="91" y="53" width="18" height="29" rx="9" fill="#211733" />
          <rect className="dj-glow" x="15" y="58" width="10" height="19" rx="5" fill={`url(#${id}c)`} />
          <rect className="dj-glow" x="95" y="58" width="10" height="19" rx="5" fill={`url(#${id}c)`} />
        </g>
      </g>
      <Extras mood={mood} />
    </svg>
  );
}

/**
 * DJ Петух всплывает в углу чата, над строкой ввода — не поверх видео.
 * Нажатие на облачко прячет реплику.
 */
export function DjPetuh({ line, onDismiss }: { line: DjLine | null; onDismiss: () => void }) {
  const [shown, setShown] = useState<DjLine | null>(line);
  const [leaving, setLeaving] = useState(false);
  const [typed, setTyped] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(leaveTimer.current);
    if (line) {
      setShown(line);
      setLeaving(false);
      setTyped(false);
      const t = setTimeout(() => setTyped(true), 520);
      return () => clearTimeout(t);
    }
    if (shown) {
      setLeaving(true);
      leaveTimer.current = setTimeout(() => {
        setShown(null);
        setLeaving(false);
      }, 380);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line]);

  if (!shown) return null;
  return (
    <div className={`dj${leaving ? ' out' : ''}`} key={shown.id} role="status" aria-live="polite">
      <button className="dj-bubble" onClick={onDismiss} aria-label={`DJ Петух: ${shown.text}. Нажмите, чтобы скрыть`}>
        <span className="dj-name">DJ Петух</span>
        {typed ? (
          <span className="dj-text">{shown.text}</span>
        ) : (
          <span className="dj-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </button>
      <div className="dj-char" onClick={onDismiss}>
        <DjAvatar mood={shown.mood} size={72} />
      </div>
    </div>
  );
}
