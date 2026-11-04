import React from 'react';
import type { Person, Position, VideoState } from '../../shared/types';
import { formatTime } from '../lib/util';
import { Avatar } from './ui';

interface Props {
  people: Person[];
  positions: Record<string, Position>;
  video: VideoState;
  meId: string;
}

function roomPosAt(video: VideoState, at: number) {
  return video.playing ? video.pos + (at - video.at) / 1000 : video.pos;
}

export function People({ people, positions, video, meId }: Props) {
  const sorted = [...people].sort((a, b) => (a.id === meId ? -1 : b.id === meId ? 1 : a.name.localeCompare(b.name)));
  return (
    <ul className="people">
      {sorted.map((p) => {
        const pos = positions[p.id];
        let line = 'подключается';
        let time: string | null = null;
        let drift: number | null = null;
        if (!video.source) line = 'в комнате';
        else if (pos) {
          if (pos.state === 'loading') line = 'загружает плеер';
          else if (pos.state === 'blocked') line = 'браузер не дал запустить видео';
          else if (pos.state === 'ad') line = 'смотрит рекламу VK';
          else if (pos.state === 'error') line = 'видео не открылось';
          else {
            line = pos.playing ? 'смотрит' : 'на паузе';
            time = formatTime(pos.pos);
            drift = pos.pos - roomPosAt(video, pos.at);
          }
        }
        const ok = drift !== null && Math.abs(drift) < 2;
        return (
          <li key={p.id} className="person">
            <Avatar name={p.name} avatar={p.avatar} color={p.color} size={36} />
            <div className="person-text">
              <span className="person-name">
                {p.name}
                {p.id === meId && <span className="you">вы</span>}
              </span>
              <span className="person-line">
                {line}
                {time && <span className="tc"> {time}</span>}
              </span>
            </div>
            {drift !== null && video.source?.kind !== 'iframe' && (
              <span className={`drift${ok ? ' ok' : ''}`} title="Расхождение с комнатой">
                {ok ? 'вместе' : `${drift > 0 ? '+' : '−'}${Math.abs(drift).toFixed(1).replace('.', ',')} с`}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ── полоса «кто на какой секунде» под видео ─────────────────
interface WatchersProps {
  people: Person[];
  positions: Record<string, Position>;
  video: VideoState;
  meId: string;
  /** свежие данные своего плеера — точнее, чем отчёт с сервера */
  self: { time: number; drift: number; status: string } | null;
  serverNow: () => number;
}

function fmtDrift(d: number) {
  return `${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(1).replace('.', ',')} с`;
}

export function Watchers({ people, positions, video, meId, self, serverNow }: WatchersProps) {
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  if (!video.source || video.source.kind === 'iframe') return null;

  const now = serverNow();
  const sorted = [...people].sort((a, b) => (a.id === meId ? -1 : b.id === meId ? 1 : a.name.localeCompare(b.name)));

  return (
    <div className="watchers" aria-label="Кто на какой секунде">
      {sorted.map((p) => {
        const me = p.id === meId;
        const pos = positions[p.id];
        let time: number | null = null;
        let drift: number | null = null;
        let note: string | null = null;

        if (me && self && (self.status === 'synced' || self.status === 'syncing')) {
          time = self.time;
          drift = self.drift;
        } else if (pos) {
          if (pos.state === 'loading') note = 'загружает';
          else if (pos.state === 'blocked') note = 'не запустилось';
          else if (pos.state === 'ad') note = 'реклама';
          else if (pos.state === 'error') note = 'ошибка';
          else {
            time = pos.playing ? pos.pos + Math.max(0, now - pos.at) / 1000 : pos.pos;
            drift = pos.pos - roomPosAt(video, pos.at);
          }
        } else note = 'подключается';

        const ok = drift !== null && Math.abs(drift) < 2;
        const behind = drift !== null && drift < 0;
        return (
          <div
            key={p.id}
            className={`watcher${me ? ' me' : ''}`}
            title={
              drift === null
                ? `${p.name}: ${note}`
                : ok
                  ? `${p.name}: смотрит вместе со всеми`
                  : `${p.name}: ${behind ? 'отстаёт' : 'впереди'} на ${Math.abs(drift).toFixed(1)} с`
            }
          >
            <Avatar name={p.name} avatar={p.avatar} color={p.color} size={22} />
            <span className="watcher-name">{me ? 'Вы' : p.name}</span>
            {time !== null && <span className="watcher-time">{formatTime(time)}</span>}
            {note && <span className="watcher-note">{note}</span>}
            {drift !== null && (
              <span className={`watcher-drift${ok ? ' ok' : behind ? ' behind' : ' ahead'}`}>
                {ok ? '✓' : fmtDrift(drift)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
