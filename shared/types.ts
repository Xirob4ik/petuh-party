// Общие типы клиента и сервера.

export type Source =
  | { kind: 'vk'; url: string; title: string; oid: string; id: string; hash?: string }
  | { kind: 'youtube'; url: string; title: string; id: string }
  | { kind: 'rutube'; url: string; title: string; id: string; p?: string }
  | { kind: 'file'; url: string; title: string; hls: boolean }
  | { kind: 'iframe'; url: string; title: string };

export type ActionKind = 'play' | 'pause' | 'seek' | 'source';

/** Состояние видео в комнате. Источник правды — сервер. */
export interface VideoState {
  source: Source | null;
  playing: boolean;
  /** позиция (сек) в момент `at` */
  pos: number;
  /** серверное время (мс), к которому относится `pos` */
  at: number;
  /** растёт при каждом изменении */
  v: number;
  /** кто и что сделал последним */
  last: { by: string; name: string; action: ActionKind; at: number } | null;
}

export interface Person {
  id: string;
  name: string;
  avatar: string | null;
  color: string;
  online: boolean;
}

export interface Position {
  pos: number;
  playing: boolean;
  state: 'ok' | 'loading' | 'blocked' | 'error' | 'ad' | 'idle';
  at: number;
}

export interface Reaction {
  emoji: string;
  users: string[]; // userId
}

export interface Message {
  id: string;
  user: string; // userId или 'system'
  name: string;
  text: string;
  image?: string;
  /** id стикера из shared/stickers.ts */
  sticker?: string;
  replyTo?: { id: string; name: string; text: string };
  reactions: Reaction[];
  ts: number;
}

export interface RoomSnapshot {
  id: string;
  video: VideoState;
  people: Person[];
  messages: Message[];
  positions: Record<string, Position>;
}

// ── Сообщения клиента ───────────────────────────────────────────
export type ClientMsg =
  | { t: 'hello'; room: string; user: { id: string; name: string; avatar: string | null; color: string } }
  | { t: 'ping'; c: number }
  | { t: 'source'; url: string }
  | { t: 'ctl'; action: 'play' | 'pause' | 'seek'; pos: number }
  | { t: 'pos'; pos: number; playing: boolean; state: Position['state'] }
  | { t: 'profile'; name: string; avatar: string | null; color: string }
  | { t: 'chat'; text: string; image?: string; sticker?: string; replyTo?: string }
  | { t: 'float'; emoji: string }
  | { t: 'react'; id: string; emoji: string }
  | { t: 'typing'; on: boolean };

// ── Сообщения сервера ───────────────────────────────────────────
export type ServerMsg =
  | { t: 'welcome'; room: RoomSnapshot; now: number }
  | { t: 'pong'; c: number; s: number }
  | { t: 'video'; video: VideoState }
  | { t: 'people'; people: Person[] }
  | { t: 'positions'; positions: Record<string, Position> }
  | { t: 'msg'; message: Message }
  | { t: 'reactions'; id: string; reactions: Reaction[] }
  | { t: 'typing'; users: string[] }
  /** реакция, которая пролетает поверх видео у всех */
  | { t: 'float'; id: string; emoji: string; user: string; name: string; x: number }
  | { t: 'error'; message: string };

export const LIMITS = {
  name: 24,
  text: 1000,
  image: 900_000, // длина data:URL
  avatar: 160_000,
  messages: 150,
};
