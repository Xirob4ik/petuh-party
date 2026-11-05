import React, { useMemo, useState } from 'react';
import { looksLikeLink, parseSource } from '../../shared/sources';
import { loadRecent, type UserProfile } from '../lib/user';
import { copyText, makeRoomCode, roomUrl, timeAgo } from '../lib/util';
import { InstallButton } from './Extras';
import { Avatar, Icon, Logo, Mark, toast } from './ui';

/** Открытые фильмы для пробы: можно сразу проверить синхронизацию с другом. */
const DEMOS = [
  { title: 'Big Buck Bunny', note: 'мультфильм, 10 минут', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { title: 'Sintel', note: 'фэнтези, 15 минут', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { title: 'Tears of Steel', note: 'фантастика, 12 минут', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { title: 'Пример из VK Видео', note: 'проверить VK', url: 'https://vkvideo.ru/video-220754053_456241372' },
];

interface Props {
  user: UserProfile;
  onGo: (room: string, initialUrl?: string) => void;
  onOpenProfile: () => void;
}

export function Home({ user, onGo, onOpenProfile }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recent = useMemo(loadRecent, []);

  const trimmed = value.trim();
  const roomInLink = trimmed.match(/\/room\/([A-Za-z0-9]{4,12})/)?.[1];
  const isCode = !roomInLink && /^[A-Za-z0-9]{4,12}$/.test(trimmed) && !looksLikeLink(trimmed);
  const label = roomInLink || isCode ? 'Войти в комнату' : 'Создать комнату';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!trimmed) return onGo(makeRoomCode());
    if (roomInLink) return onGo(roomInLink.toUpperCase());
    if (isCode) return onGo(trimmed.toUpperCase());
    const parsed = parseSource(trimmed);
    if (!parsed.ok) return setError(parsed.error);
    onGo(makeRoomCode(), trimmed);
  };

  return (
    <div className="home">
      <header className="home-top">
        <Logo />
        <div className="home-top-right">
          <span className="only-wide">
            <InstallButton />
          </span>
          <button className="me" onClick={onOpenProfile} title="Профиль">
          <span className="me-name">{user.name}</span>
          <Avatar name={user.name} avatar={user.avatar} color={user.color} size={32} />
          </button>
        </div>
      </header>

      <div className="hero-art" aria-hidden="true">
        <Mark bare size={520} />
      </div>
      <main className="home-main">
        <h1 className="hero">
          Смотрите кино вместе, где&nbsp;бы вы ни&nbsp;были
        </h1>
        <p className="lede">
          Вставьте ссылку и отправьте друзьям приглашение. Пауза, перемотка и запуск — общие: у всех видео идёт на одной
          секунде.
        </p>

        <form className="start" onSubmit={submit}>
          <label className="sr-only" htmlFor="start-input">
            Ссылка на видео или код комнаты
          </label>
          <input
            id="start-input"
            className="field big"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder="Ссылка на видео или код комнаты"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <button className="btn primary big" type="submit">
            {label}
          </button>
        </form>
        {error ? (
          <p className="hint error">{error}</p>
        ) : (
          <p className="hint">Можно и без ссылки: создайте пустую комнату и выберите видео внутри.</p>
        )}

        {recent.length > 0 && (
          <section className="recent" aria-label="Недавние комнаты">
            <h2>Недавние комнаты</h2>
            <ul>
              {recent.map((r) => (
                <li key={r.id}>
                  <button className="recent-go" onClick={() => onGo(r.id)}>
                    <span className="recent-code">{r.id}</span>
                    <span className="recent-title">{r.title || 'Без видео'}</span>
                    <span className="recent-time">{timeAgo(r.at)}</span>
                  </button>
                  <button
                    className="icon-btn"
                    title="Скопировать ссылку на комнату"
                    aria-label={`Скопировать ссылку на комнату ${r.id}`}
                    onClick={async () => {
                      if (await copyText(roomUrl(r.id))) toast('Ссылка на комнату скопирована');
                    }}
                  >
                    <Icon name="copy" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="recent demos" aria-label="Демо-видео">
          <h2>Нет ссылки под рукой? Проверьте на открытом фильме</h2>
          <ul>
            {DEMOS.map((d) => (
              <li key={d.url}>
                <button className="recent-go" onClick={() => onGo(makeRoomCode(), d.url)}>
                  <span className="recent-title">
                    <b>{d.title}</b> <span className="muted">{d.note}</span>
                  </span>
                  <Icon name="arrow" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="home-foot">
        Работает с VK Видео, YouTube, Rutube и прямыми ссылками на файлы .mp4 и потоки .m3u8
      </footer>
    </div>
  );
}
