import { storage } from './storage';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string | null; // data:URL загруженного фото
  color: string;
}

const KEY = 'pp.profile.v2';

export const AVATAR_COLORS = ['#f6c445', '#ff7a59', '#7bd389', '#6cc4ff', '#c79bff', '#ff8fc7', '#e8e2d6'];

const ADJ = ['Сонный', 'Бодрый', 'Тихий', 'Хитрый', 'Ранний', 'Смелый', 'Важный', 'Добрый'];
const NOUN = ['петух', 'цыплёнок', 'кочет', 'гусь', 'индюк', 'селезень', 'фазан'];

function randomId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'u' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadProfile(): UserProfile {
  const saved = storage.getJSON<UserProfile>(KEY);
  if (saved && saved.id && saved.name) {
    return { ...saved, color: saved.color || AVATAR_COLORS[0], avatar: saved.avatar ?? null };
  }
  const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  const fresh: UserProfile = {
    id: randomId(),
    name: `${pick(ADJ)} ${pick(NOUN)}`,
    avatar: null,
    color: pick(AVATAR_COLORS),
  };
  storage.setJSON(KEY, fresh);
  return fresh;
}

export function saveProfile(p: UserProfile) {
  storage.setJSON(KEY, p);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// ── недавние комнаты ─────────────────────────────────
export interface RecentRoom {
  id: string;
  title: string | null;
  at: number;
}
const RECENT_KEY = 'pp.recent';

export function loadRecent(): RecentRoom[] {
  return (storage.getJSON<RecentRoom[]>(RECENT_KEY) || []).slice(0, 5);
}

export function rememberRoom(id: string, title: string | null) {
  const list = loadRecent().filter((r) => r.id !== id);
  list.unshift({ id, title, at: Date.now() });
  storage.setJSON(RECENT_KEY, list.slice(0, 5));
}
