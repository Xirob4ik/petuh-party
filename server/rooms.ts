import type { WebSocket } from 'ws';
import { parseSource } from '../shared/sources';
import { getSticker } from '../shared/stickers';
import {
  LIMITS,
  type ClientMsg,
  type Message,
  type Person,
  type Position,
  type ServerMsg,
  type VideoState,
} from '../shared/types';
import { enrichSource } from './meta';

const OFFLINE_GRACE_MS = 6_000; // переподключение без «вышел/зашёл»
const EMPTY_ROOM_TTL_MS = 12 * 3600_000;
const IMAGE_BUDGET = 12_000_000; // байт картинок в истории одной комнаты
const MAX_POS = 60 * 60 * 24; // сутки — с запасом для любого фильма

interface Member {
  person: Person;
  conns: Set<WebSocket>;
  offlineTimer: NodeJS.Timeout | null;
}

export interface Conn {
  ws: WebSocket;
  room: Room | null;
  userId: string | null;
  chatTimes: number[];
  floatTimes: number[];
}

const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const clampText = (s: unknown, n: number) => (typeof s === 'string' ? s.trim().slice(0, n) : '');
const COLOR_RE = /^#[0-9a-f]{6}$/i;

function cleanAvatar(a: unknown): string | null {
  if (typeof a !== 'string') return null;
  if (a.startsWith('data:image/') && a.length <= LIMITS.avatar) return a;
  return null;
}

function validPos(p: unknown): number | null {
  return typeof p === 'number' && Number.isFinite(p) ? Math.min(Math.max(0, p), MAX_POS) : null;
}

export class Room {
  readonly id: string;
  video: VideoState;
  members = new Map<string, Member>();
  messages: Message[] = [];
  positions: Record<string, Position> = {};
  typing = new Set<string>();
  lastActive = Date.now();
  private positionsDirty = false;
  private sourceToken = 0;

  constructor(id: string) {
    this.id = id;
    this.video = { source: null, playing: false, pos: 0, at: Date.now(), v: 0, last: null };
  }

  // ── рассылка ──────────────────────────────────────
  broadcast(msg: ServerMsg, except?: WebSocket) {
    const data = JSON.stringify(msg);
    for (const m of this.members.values()) {
      for (const ws of m.conns) {
        if (ws !== except && ws.readyState === 1) ws.send(data);
      }
    }
  }

  private people(): Person[] {
    return [...this.members.values()].map((m) => m.person);
  }

  private broadcastPeople() {
    this.broadcast({ t: 'people', people: this.people() });
  }

  get onlineCount() {
    let n = 0;
    for (const m of this.members.values()) if (m.person.online) n++;
    return n;
  }

  flushPositions() {
    if (!this.positionsDirty) return;
    this.positionsDirty = false;
    this.broadcast({ t: 'positions', positions: this.positions });
  }

  private system(text: string) {
    this.pushMessage({ id: rid(), user: 'system', name: '', text, reactions: [], ts: Date.now() });
  }

  private pushMessage(msg: Message) {
    this.messages.push(msg);
    if (this.messages.length > LIMITS.messages) this.messages.splice(0, this.messages.length - LIMITS.messages);
    // держим память под контролем: у старых сообщений убираем картинки
    let total = 0;
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const m = this.messages[i];
      if (!m.image) continue;
      total += m.image.length;
      if (total > IMAGE_BUDGET) {
        m.image = undefined;
        if (!m.text) m.text = '[фото удалено из истории]';
      }
    }
    this.broadcast({ t: 'msg', message: msg });
  }

  /** Текущая позиция с учётом прошедшего времени. */
  currentPos(now = Date.now()) {
    const v = this.video;
    return v.playing ? Math.min(v.pos + (now - v.at) / 1000, MAX_POS) : v.pos;
  }

  // ── участники ─────────────────────────────────────
  join(conn: Conn, user: Extract<ClientMsg, { t: 'hello' }>['user']) {
    const id = clampText(user?.id, 64);
    if (!id) return;
    conn.room = this;
    conn.userId = id;
    this.lastActive = Date.now();

    const name = clampText(user.name, LIMITS.name) || 'Гость';
    let member = this.members.get(id);
    const wasOnline = member?.person.online ?? false;
    if (!member) {
      member = {
        person: { id, name, avatar: null, color: '#f6c445', online: true },
        conns: new Set(),
        offlineTimer: null,
      };
      this.members.set(id, member);
    }
    if (member.offlineTimer) {
      clearTimeout(member.offlineTimer);
      member.offlineTimer = null;
    }
    member.conns.add(conn.ws);
    member.person = {
      ...member.person,
      name,
      avatar: cleanAvatar(user.avatar),
      color: COLOR_RE.test(user.color) ? user.color : member.person.color,
      online: true,
    };

    const welcome: ServerMsg = {
      t: 'welcome',
      now: Date.now(),
      room: {
        id: this.id,
        video: this.video,
        people: this.people(),
        messages: this.messages,
        positions: this.positions,
      },
    };
    conn.ws.send(JSON.stringify(welcome));
    this.broadcastPeople();
    if (!wasOnline) this.system(`${name} в комнате`);
  }

  leave(conn: Conn) {
    const id = conn.userId;
    if (!id) return;
    const member = this.members.get(id);
    if (!member) return;
    member.conns.delete(conn.ws);
    this.lastActive = Date.now();
    if (member.conns.size > 0) return;
    member.offlineTimer = setTimeout(() => {
      member.offlineTimer = null;
      if (member.conns.size > 0) return;
      member.person = { ...member.person, online: false };
      delete this.positions[id];
      this.typing.delete(id);
      this.members.delete(id);
      this.broadcastPeople();
      this.broadcast({ t: 'typing', users: [...this.typing] });
      this.system(`${member.person.name} покидает комнату`);
    }, OFFLINE_GRACE_MS);
  }

  // ── обработка сообщений ───────────────────────────
  async handle(conn: Conn, msg: ClientMsg) {
    const uid = conn.userId;
    const member = uid ? this.members.get(uid) : undefined;
    if (!uid || !member) return;
    this.lastActive = Date.now();
    const name = member.person.name;

    switch (msg.t) {
      case 'source': {
        const parsed = parseSource(String(msg.url || '').slice(0, 4000));
        if (!parsed.ok) {
          conn.ws.send(JSON.stringify({ t: 'error', message: parsed.error } satisfies ServerMsg));
          return;
        }
        const token = ++this.sourceToken;
        const source = await enrichSource(parsed.source);
        if (token !== this.sourceToken) return; // кто-то успел поставить другое видео
        const now = Date.now();
        this.video = {
          source,
          playing: false,
          pos: 0,
          at: now,
          v: this.video.v + 1,
          last: { by: uid, name, action: 'source', at: now },
        };
        this.positions = {};
        this.broadcast({ t: 'video', video: this.video });
        this.system(`${name} включает «${source.title}»`);
        return;
      }

      case 'ctl': {
        if (!this.video.source) return;
        const pos = validPos(msg.pos);
        if (pos === null) return;
        const now = Date.now();
        const v = this.video;
        if (msg.action === 'play') v.playing = true;
        else if (msg.action === 'pause') v.playing = false;
        else if (msg.action !== 'seek') return;
        this.video = { ...v, pos, at: now, v: v.v + 1, last: { by: uid, name, action: msg.action, at: now } };
        this.broadcast({ t: 'video', video: this.video });
        return;
      }

      case 'pos': {
        const pos = validPos(msg.pos);
        if (pos === null) return;
        const state = (['ok', 'loading', 'blocked', 'error', 'ad', 'idle'] as const).includes(msg.state as any)
          ? msg.state
          : 'ok';
        this.positions[uid] = { pos, playing: !!msg.playing, state, at: Date.now() };
        this.positionsDirty = true;
        return;
      }

      case 'profile': {
        const newName = clampText(msg.name, LIMITS.name);
        if (!newName) return;
        member.person = {
          ...member.person,
          name: newName,
          avatar: cleanAvatar(msg.avatar),
          color: COLOR_RE.test(msg.color) ? msg.color : member.person.color,
        };
        this.broadcastPeople();
        return;
      }

      case 'chat': {
        // простая защита от флуда: не больше 6 сообщений за 4 секунды
        const now = Date.now();
        conn.chatTimes = conn.chatTimes.filter((t) => now - t < 4000);
        if (conn.chatTimes.length >= 6) return;
        conn.chatTimes.push(now);

        const text = clampText(msg.text, LIMITS.text);
        const sticker = getSticker(typeof msg.sticker === 'string' ? msg.sticker : undefined)?.id;
        const image =
          !sticker &&
          typeof msg.image === 'string' &&
          msg.image.startsWith('data:image/') &&
          msg.image.length <= LIMITS.image
            ? msg.image
            : undefined;
        if (!text && !image && !sticker) return;
        const replied = msg.replyTo ? this.messages.find((m) => m.id === msg.replyTo) : undefined;
        this.typing.delete(uid);
        this.pushMessage({
          id: rid(),
          user: uid,
          name,
          text,
          image,
          sticker,
          replyTo: replied
            ? {
                id: replied.id,
                name: replied.name,
                text: replied.text.slice(0, 140) || (replied.sticker ? 'Стикер' : replied.image ? 'Фото' : ''),
              }
            : undefined,
          reactions: [],
          ts: now,
        });
        this.broadcast({ t: 'typing', users: [...this.typing] });
        return;
      }

      case 'react': {
        const m = this.messages.find((x) => x.id === msg.id);
        const emoji = clampText(msg.emoji, 16);
        if (!m || !emoji || m.user === 'system') return;
        let r = m.reactions.find((x) => x.emoji === emoji);
        if (!r) {
          if (m.reactions.length >= 12) return;
          r = { emoji, users: [] };
          m.reactions.push(r);
        }
        const i = r.users.indexOf(uid);
        if (i >= 0) r.users.splice(i, 1);
        else r.users.push(uid);
        m.reactions = m.reactions.filter((x) => x.users.length > 0);
        this.broadcast({ t: 'reactions', id: m.id, reactions: m.reactions });
        return;
      }

      case 'float': {
        // не больше 8 реакций за 2 секунды с одного соединения
        const now = Date.now();
        conn.floatTimes = conn.floatTimes.filter((t) => now - t < 2000);
        if (conn.floatTimes.length >= 8) return;
        const emoji = clampText(msg.emoji, 16);
        if (!emoji || /[<>]/.test(emoji)) return;
        conn.floatTimes.push(now);
        this.broadcast({ t: 'float', id: rid(), emoji, user: uid, name, x: 10 + Math.round(Math.random() * 80) });
        return;
      }

      case 'typing': {
        const had = this.typing.has(uid);
        if (msg.on) this.typing.add(uid);
        else this.typing.delete(uid);
        if (had !== this.typing.has(uid)) this.broadcast({ t: 'typing', users: [...this.typing] });
        return;
      }
    }
  }
}

// ── реестр комнат ───────────────────────────────────
export const rooms = new Map<string, Room>();

export const ROOM_ID_RE = /^[A-Z0-9]{4,12}$/;

export function getRoom(id: string): Room {
  let room = rooms.get(id);
  if (!room) {
    room = new Room(id);
    rooms.set(id, room);
  }
  return room;
}

export function sweepRooms() {
  const now = Date.now();
  for (const [id, room] of rooms) {
    if (room.members.size === 0 && now - room.lastActive > EMPTY_ROOM_TTL_MS) rooms.delete(id);
  }
}
