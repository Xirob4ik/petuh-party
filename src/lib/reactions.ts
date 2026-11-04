import { storage } from './storage';

/** Панель реакций, которые вылетают на экран. Каждый настраивает свою. */
export const DEFAULT_FLOATS = ['🔥', '🐔', '🍿', '😭', '💀', '😳', '🥲', '👏'];

export const POPULAR_FLOATS = [
  '🔥', '🐔', '🐓', '🍿', '😭', '💀', '❤️', '😱',
  '👏', '🥳', '🗿', '💯', '😈', '🤡', '🤣', '👀',
  '✨', '⚡', '💣', '🎉', '🤯', '🍕', '🍻', '👑',
  '😳', '🥲', '😂', '🤔', '🙈', '💩', '🫡', '👍',
];

export const FLOAT_MIN = 2;
export const FLOAT_MAX = 10;
const KEY = 'pp.floats';

export function loadFloats(): string[] {
  const saved = storage.getJSON<string[]>(KEY);
  if (Array.isArray(saved) && saved.length >= FLOAT_MIN) return saved.slice(0, FLOAT_MAX);
  return DEFAULT_FLOATS;
}

export function saveFloats(list: string[]) {
  storage.setJSON(KEY, list.slice(0, FLOAT_MAX));
}

/** Первый «символ» строки с учётом составных эмодзи (флаги, ZWJ-последовательности). */
export function firstGrapheme(s: string): string {
  const t = s.trim();
  if (!t) return '';
  const Seg = (Intl as any).Segmenter;
  if (Seg) {
    for (const { segment } of new Seg('ru', { granularity: 'grapheme' }).segment(t)) return segment;
  }
  return Array.from(t)[0] ?? '';
}
