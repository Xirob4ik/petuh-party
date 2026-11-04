// Дополнительные сведения о видео: embed-hash для VK и названия роликов.
// Всё best-effort: если внешний сервис не ответил, видео всё равно запускается.
import type { Source } from '../shared/types';

const cache = new Map<string, { value: unknown; until: number }>();

async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.until > Date.now()) return hit.value as T;
  const value = await fn();
  cache.set(key, { value, until: Date.now() + ttlMs });
  if (cache.size > 2000) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  return value;
}

async function getJson(url: string, timeoutMs = 6000): Promise<any> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'petuh-party/1.0' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * VK требует hash в ссылке встраивания для большинства роликов.
 * Публичный метод video.getOembed отдаёт готовый iframe с hash и без токена.
 */
async function resolveVk(oid: string, id: string): Promise<{ hash?: string; title?: string }> {
  return cached(`vk:${oid}_${id}`, 6 * 3600_000, async () => {
    const page = `https://vkvideo.ru/video${oid}_${id}`;
    const api = new URL('https://api.vk.com/method/video.getOembed');
    api.searchParams.set('url', page);
    api.searchParams.set('v', '5.199');
    const data = await getJson(api.href);
    const html: string = data?.response?.html ?? '';
    const title: string | undefined = data?.response?.title;
    const m = html.match(/src=(["'])(.*?)\1/i);
    let hash: string | undefined;
    if (m) {
      try {
        const src = new URL(m[2].replace(/&amp;/g, '&').replace(/^\/\//, 'https://'));
        if (src.searchParams.get('oid') === oid && src.searchParams.get('id') === id) {
          const h = src.searchParams.get('hash');
          if (h && /^[\w-]{4,128}$/.test(h)) hash = h;
        }
      } catch {
        /* ignore */
      }
    }
    return { hash, title };
  });
}

async function youtubeTitle(id: string): Promise<string | undefined> {
  return cached(`yt:${id}`, 24 * 3600_000, async () => {
    const u = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
    const data = await getJson(u);
    return typeof data?.title === 'string' ? data.title : undefined;
  });
}

async function rutubeTitle(id: string, p?: string): Promise<string | undefined> {
  return cached(`rt:${id}`, 24 * 3600_000, async () => {
    const u = `https://rutube.ru/api/video/${id}/?format=json${p ? `&p=${encodeURIComponent(p)}` : ''}`;
    const data = await getJson(u);
    return typeof data?.title === 'string' ? data.title : undefined;
  });
}

/** Дополняет источник: hash для VK, человеческое название. Никогда не бросает. */
export async function enrichSource(src: Source): Promise<Source> {
  try {
    if (src.kind === 'vk') {
      const info = await resolveVk(src.oid, src.id);
      return {
        ...src,
        hash: src.hash || info.hash,
        title: info.title?.trim() || src.title,
      };
    }
    if (src.kind === 'youtube') {
      const title = await youtubeTitle(src.id);
      return title ? { ...src, title } : src;
    }
    if (src.kind === 'rutube') {
      const title = await rutubeTitle(src.id, src.p);
      return title ? { ...src, title } : src;
    }
  } catch (err) {
    console.warn(`[meta] ${src.kind}: ${(err as Error).message}`);
  }
  return src;
}
