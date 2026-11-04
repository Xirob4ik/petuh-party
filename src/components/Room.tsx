import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SOURCE_LABEL } from '../../shared/sources';
import type { Message, Person, Position, ServerMsg, Source, VideoState } from '../../shared/types';
import type { Nav } from '../App';
import { RoomClient, type NetStatus } from '../lib/net';
import { loadFloats } from '../lib/reactions';
import { playChime, playPop } from '../lib/sound';
import { rememberRoom, type UserProfile } from '../lib/user';
import { copyText, formatTime, roomUrl, timeAgo } from '../lib/util';
import type { SyncEngine, SyncInfo } from '../player/sync';
import { Chat } from './Chat';
import { ShortcutsDialog } from './Extras';
import { FloatingOverlay, FloatsDialog, type FloatItem } from './Floats';
import { People, Watchers } from './People';
import { Player } from './Player';
import { SourceForm } from './SourceForm';
import { Avatar, Dialog, Icon, Logo, Mark, toast } from './ui';

interface Props {
  roomId: string;
  nav: Nav;
  user: UserProfile;
  onUserChange: (u: UserProfile) => void;
  onHome: () => void;
  onOpenProfile: () => void;
}

const EMPTY_VIDEO: VideoState = { source: null, playing: false, pos: 0, at: 0, v: -1, last: null };

export function Room({ roomId, nav, user, onUserChange, onHome, onOpenProfile }: Props) {
  // Вход по прямой ссылке требует одного клика: иначе браузер не даст запустить видео со звуком
  const [joined, setJoined] = useState(nav.activated);
  const [client, setClient] = useState<RoomClient | null>(null);
  const [net, setNet] = useState<NetStatus>('connecting');
  const [loaded, setLoaded] = useState(false);
  const [video, setVideo] = useState<VideoState>(EMPTY_VIDEO);
  const [people, setPeople] = useState<Person[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [typing, setTyping] = useState<string[]>([]);
  const [info, setInfo] = useState<SyncInfo | null>(null);
  const [tab, setTab] = useState<'chat' | 'people'>('chat');
  const [unread, setUnread] = useState(0);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [floats, setFloats] = useState<string[]>(loadFloats);
  const [floatItems, setFloatItems] = useState<FloatItem[]>([]);
  const [floatsOpen, setFloatsOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const [composing, setComposing] = useState(false);
  const isPhone = useMedia('(max-width: 899px)');
  const isTouch = useMedia('(hover: none)');
  const engineRef = useRef<SyncEngine | null>(null);
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const initialSent = useRef(false);

  const hello = useCallback(
    () => ({
      t: 'hello' as const,
      room: roomId,
      user: { id: user.id, name: user.name, avatar: user.avatar, color: user.color },
    }),
    [roomId, user],
  );

  // ── подключение ───────────────────────────────────
  useEffect(() => {
    if (!joined) return;
    const c = new RoomClient(hello());
    setClient(c);
    const offStatus = c.onStatus(setNet);
    const off = c.on((msg: ServerMsg) => {
      switch (msg.t) {
        case 'welcome':
          setVideo(msg.room.video);
          setPeople(msg.room.people);
          setMessages(msg.room.messages);
          setPositions(msg.room.positions);
          setLoaded(true);
          if (nav.initialUrl && !initialSent.current && !msg.room.video.source) {
            initialSent.current = true;
            c.send({ t: 'source', url: nav.initialUrl });
          }
          break;
        case 'video':
          setVideo(msg.video);
          break;
        case 'people':
          setPeople(msg.people);
          break;
        case 'positions':
          setPositions(msg.positions);
          break;
        case 'msg':
          setMessages((prev) => [...prev, msg.message].slice(-150));
          if (msg.message.user !== user.id && msg.message.user !== 'system') {
            playChime();
            if (tabRef.current !== 'chat') setUnread((n) => n + 1);
          }
          break;
        case 'reactions':
          setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, reactions: msg.reactions } : m)));
          break;
        case 'typing':
          setTyping(msg.users);
          break;
        case 'float':
          if (msg.user !== user.id) playPop(msg.emoji);
          setFloatItems((prev) => [...prev.slice(-39), { id: msg.id, emoji: msg.emoji, name: msg.name, x: msg.x }]);
          break;
        case 'error':
          toast(msg.message, 'error');
          break;
      }
    });
    return () => {
      off();
      offStatus();
      c.close();
      setClient(null);
    };
    // профиль меняем отдельным сообщением, без переподключения
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, roomId]);

  // изменения профиля
  useEffect(() => {
    if (!client) return;
    client.setHello(hello());
    client.send({ t: 'profile', name: user.name, avatar: user.avatar, color: user.color });
  }, [client, user, hello]);

  useEffect(() => {
    if (loaded) rememberRoom(roomId, video.source?.title ?? null);
  }, [loaded, roomId, video.source?.title]);

  useEffect(() => {
    if (tab === 'chat') setUnread(0);
  }, [tab]);

  // ── режим «пишу и смотрю»: включён, пока фокус в поле сообщения ──
  useEffect(() => {
    let t: number | undefined;
    const check = () => {
      clearTimeout(t);
      // небольшая задержка: тап по «Отправить» не должен дёргать раскладку
      t = window.setTimeout(() => setComposing(!!document.activeElement?.matches('.composer textarea')), 120);
    };
    document.addEventListener('focusin', check);
    document.addEventListener('focusout', check);
    return () => {
      clearTimeout(t);
      document.removeEventListener('focusin', check);
      document.removeEventListener('focusout', check);
    };
  }, []);

  // ── телефон: держим комнату ровно в видимой области, чтобы клавиатура не уводила видео вверх ──
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;
    const update = () => {
      root.style.setProperty('--vvh', `${vv.height}px`);
      root.style.setProperty('--vvtop', `${vv.offsetTop}px`);
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      root.style.removeProperty('--vvh');
      root.style.removeProperty('--vvtop');
    };
  }, []);

  // ── полноэкранный режим сайта: в нём видны летающие реакции ──
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === screenRef.current && !!screenRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = screenRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => toast('Браузер не разрешил полноэкранный режим', 'error'));
    else toast('Этот браузер не умеет открывать сайт на весь экран — используйте кнопку в самом плеере');
  }, []);

  // ── горячие клавиши ───────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [contenteditable="true"]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector('.scrim')) return;
      if (e.key === '?') {
        e.preventDefault();
        setKeysOpen(true);
        return;
      }
      if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (e.code === 'KeyC') {
        e.preventDefault();
        setTab('chat');
        setTimeout(() => document.querySelector<HTMLTextAreaElement>('.composer textarea')?.focus(), 0);
        return;
      }
      const eng = engineRef.current;
      if (!eng) return;
      if (e.code === 'KeyM') {
        e.preventDefault();
        toast(eng.toggleMute() ? 'Звук выключен у вас' : 'Звук включён');
        return;
      }
      if (e.code === 'Space' || e.code === 'KeyK') {
        e.preventDefault();
        eng.togglePlay();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyJ') {
        e.preventDefault();
        eng.seekBy(-10);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyL') {
        e.preventDefault();
        eng.seekBy(10);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleFullscreen]);

  const sendFloat = (emoji: string) => {
    if (!client || !video.source) return;
    playPop(emoji);
    client.send({ t: 'float', emoji });
  };

  const peopleMap = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);
  const online = people.filter((p) => p.online);
  const others = online.filter((p) => p.id !== user.id);

  const invite = async () => {
    const ok = await copyText(roomUrl(roomId));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast('Ссылка на комнату скопирована — отправьте её друзьям');
    } else {
      toast(roomUrl(roomId));
    }
  };

  const setSource = (url: string) => {
    client?.send({ t: 'source', url });
    setSourceOpen(false);
  };

  // ── экран входа ───────────────────────────────────
  if (!joined) {
    return (
      <JoinGate
        roomId={roomId}
        user={user}
        onJoin={(name) => {
          if (name !== user.name) onUserChange({ ...user, name });
          setJoined(true);
        }}
        onHome={onHome}
      />
    );
  }

  const source = video.source;
  // на телефоне таймкоды стоят в одной строке со статусом — больше места под чат
  const watchersEl =
    client && isPhone ? (
      <Watchers
        people={online}
        positions={positions}
        video={video}
        meId={user.id}
        self={info ? { time: info.time, drift: info.drift, status: info.status } : null}
        serverNow={() => client.serverNow()}
      />
    ) : null;

  return (
    <div className={`room${composing && isTouch && isPhone ? ' composing' : ''}`}>
      <header className="room-top">
        <Logo onClick={onHome} />
        <button className="room-code" onClick={invite} title="Скопировать ссылку-приглашение">
          <span className="room-code-label">Комната</span>
          <span className="room-code-id">{roomId}</span>
          <Icon name={copied ? 'check' : 'copy'} size={16} />
        </button>
        <div className="top-source">{video.source && <SourceForm onSubmit={setSource} compact />}</div>
        {video.source && (
          <button className="btn ghost small top-video-btn" onClick={() => setSourceOpen(true)}>
            <Icon name="film" size={17} />
            <span>Видео</span>
          </button>
        )}
        <div className="top-right">
          <div className="stack" title={others.map((p) => p.name).join(', ')}>
            {others.slice(0, 4).map((p) => (
              <Avatar key={p.id} name={p.name} avatar={p.avatar} color={p.color} size={28} />
            ))}
            {others.length > 4 && <span className="stack-more">+{others.length - 4}</span>}
          </div>
          <button className="me compact" onClick={onOpenProfile} title="Профиль">
            <Avatar name={user.name} avatar={user.avatar} color={user.color} size={32} />
          </button>
        </div>
      </header>

      <main className="room-main">
        <section className="stage">
          <div className={`screen${fullscreen ? ' is-full' : ''}`} ref={screenRef}>
            {source && client ? (
              <Player
                video={video as VideoState & { source: Source }}
                client={client}
                onInfo={setInfo}
                onEngine={(e) => {
                  engineRef.current = e;
                  if (!e) setInfo(null);
                }}
              />
            ) : (
              <div className="screen-empty">
                {loaded ? (
                  <>
                    <Mark size={44} />
                    <h2>Что смотрим?</h2>
                    <p>Вставьте ссылку — видео откроется у всех в комнате.</p>
                    <SourceForm onSubmit={setSource} autoFocus />
                  </>
                ) : (
                  <p className="muted">{net === 'offline' ? 'Нет связи с сервером, переподключаемся…' : 'Подключаемся…'}</p>
                )}
              </div>
            )}
            <FloatingOverlay items={floatItems} onDone={(id) => setFloatItems((prev) => prev.filter((r) => r.id !== id))} />
            {fullscreen && source && (
              <div className="full-bar">
                {floats.map((e, i) => (
                  <button key={`${i}-${e}`} onClick={() => sendFloat(e)} aria-label={`Отправить ${e} на экран`}>
                    {e}
                  </button>
                ))}
                <button className="full-exit" onClick={toggleFullscreen} aria-label="Выйти из полноэкранного режима">
                  <Icon name="x" size={18} />
                </button>
              </div>
            )}
          </div>
          <StatusBar
            watchers={watchersEl}
            video={video}
            info={info}
            net={net}
            onResync={() => {
              engineRef.current?.resync();
              toast('Подтягиваемся к остальным');
            }}
            onUnblock={() => engineRef.current?.unblock()}
            onFullscreen={toggleFullscreen}
          />
          {client && !isPhone && (
            <Watchers
              people={online}
              positions={positions}
              video={video}
              meId={user.id}
              self={info ? { time: info.time, drift: info.drift, status: info.status } : null}
              serverNow={() => client.serverNow()}
            />
          )}
        </section>

        <aside className="side">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'chat'} className={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}>
              Чат{unread > 0 && <span className="badge">{unread}</span>}
            </button>
            <button
              role="tab"
              aria-selected={tab === 'people'}
              className={tab === 'people' ? 'on' : ''}
              onClick={() => setTab('people')}
            >
              Зрители <span className="count">{online.length}</span>
            </button>
          </div>
          {tab === 'chat' || isPhone ? (
            <Chat
              messages={messages}
              people={peopleMap}
              meId={user.id}
              typing={typing}
              onSend={(text, image, replyTo, sticker) => client?.send({ t: 'chat', text, image, replyTo, sticker })}
              onReact={(id, emoji) => client?.send({ t: 'react', id, emoji })}
              onTyping={(on) => client?.send({ t: 'typing', on })}
              floats={floats}
              floatsDisabled={!source}
              onFloat={sendFloat}
              onEditFloats={() => setFloatsOpen(true)}
            />
          ) : (
            <div className="people-wrap">
              <People people={online} positions={positions} video={video} meId={user.id} />
              <button className="btn ghost invite-wide" onClick={invite}>
                <Icon name="link" size={17} /> Скопировать приглашение
              </button>
              <button className="link-btn" onClick={() => setKeysOpen(true)}>
                <Icon name="keyboard" size={17} /> Горячие клавиши
              </button>
            </div>
          )}
        </aside>
      </main>

      {floatsOpen && <FloatsDialog current={floats} onSave={setFloats} onClose={() => setFloatsOpen(false)} />}
      {keysOpen && <ShortcutsDialog onClose={() => setKeysOpen(false)} />}

      {sourceOpen && (
        <Dialog title="Сменить видео" onClose={() => setSourceOpen(false)}>
          <SourceForm onSubmit={setSource} autoFocus />
          <p className="hint">Подходят ссылки на VK Видео, YouTube, Rutube, прямые ссылки на .mp4 и .m3u8, а также код вставки &lt;iframe&gt;.</p>
        </Dialog>
      )}
    </div>
  );
}

// ── строка состояния под видео ─────────────────────
const VERB: Record<string, string> = {
  play: 'запускает',
  pause: 'ставит на паузу',
  source: 'включает видео',
};

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const m = window.matchMedia?.(query);
    if (!m) return;
    const fn = () => setMatch(m.matches);
    fn();
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, [query]);
  return match;
}

function StatusBar({
  watchers,
  video,
  info,
  net,
  onResync,
  onUnblock,
  onFullscreen,
}: {
  video: VideoState;
  info: SyncInfo | null;
  net: NetStatus;
  onResync: () => void;
  onUnblock: () => void;
  onFullscreen: () => void;
  watchers?: React.ReactNode;
}) {
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, []);

  if (!video.source) return <div className="status" />;

  let tone = 'wait';
  let text = 'Загружаем плеер';
  if (net === 'offline') {
    tone = 'bad';
    text = 'Нет связи, переподключаемся';
  } else if (info) {
    switch (info.status) {
      case 'synced':
        tone = 'ok';
        text = 'Вместе со всеми';
        break;
      case 'syncing':
        tone = 'wait';
        text = 'Подтягиваемся';
        break;
      case 'blocked':
        tone = 'bad';
        text = 'Браузер не дал запустить видео';
        break;
      case 'ad':
        tone = 'wait';
        text = 'Реклама VK, потом догоним';
        break;
      case 'error':
        tone = 'bad';
        text = info.error || 'Видео не открылось';
        break;
      case 'unsynced':
        tone = 'wait';
        text = 'Этот плеер не синхронизируется — управляйте вручную';
        break;
    }
  }

  const last = video.last;
  const lastText =
    last && Date.now() - last.at < 30 * 60_000
      ? `${last.name} ${last.action === 'seek' ? `перематывает на ${formatTime(video.pos)}` : VERB[last.action]}, ${timeAgo(last.at)}`
      : null;

  return (
    <div className={`status ${tone}`}>
      <span className={`status-dot ${tone}`} aria-hidden="true" title={text} />
      <div className="status-main">
        <span className="status-text">{text}</span>
        {info?.status === 'blocked' && (
          <button className="btn primary small" onClick={onUnblock}>
            <Icon name="play" size={15} /> Запустить
          </button>
        )}
        {info?.mutedAutoplay && (
          <button className="btn primary small" onClick={onUnblock}>
            <Icon name="volume" size={15} /> Включить звук
          </button>
        )}
        <span className="status-title" title={video.source.url}>
          <span className="status-kind">{SOURCE_LABEL[video.source.kind]}</span> {video.source.title}
        </span>
      </div>
      {watchers && <div className="status-watchers">{watchers}</div>}
      {lastText && <span className="status-last">{lastText}</span>}
      {info && info.status !== 'unsynced' && info.status !== 'error' && (
        <span className="status-time">
          {formatTime(info.time)}
          {info.duration > 0 && <span className="muted"> / {formatTime(info.duration)}</span>}
        </span>
      )}
      {info && info.status !== 'unsynced' && (
        <button className="icon-btn" onClick={onResync} title="Синхронизировать заново" aria-label="Синхронизировать заново">
          <Icon name="refresh" />
        </button>
      )}
      <button className="icon-btn" onClick={onFullscreen} title="Во весь экран (F)" aria-label="Во весь экран">
        <Icon name="expand" />
      </button>
    </div>
  );
}

// ── вход в комнату ────────────────────────────────
function JoinGate({
  roomId,
  user,
  onJoin,
  onHome,
}: {
  roomId: string;
  user: UserProfile;
  onJoin: (name: string) => void;
  onHome: () => void;
}) {
  const [name, setName] = useState(user.name);
  return (
    <div className="gate">
      <header className="home-top">
        <Logo onClick={onHome} />
      </header>
      <form
        className="gate-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onJoin(name.trim());
        }}
      >
        <p className="gate-kicker">Вас позвали в комнату</p>
        <h1 className="gate-code">{roomId}</h1>
        <label className="label" htmlFor="gate-name">
          Как вас называть
        </label>
        <input
          id="gate-name"
          className="field big"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          autoComplete="nickname"
        />
        <button className="btn primary big" type="submit" disabled={!name.trim()}>
          Войти
        </button>
      </form>
    </div>
  );
}
