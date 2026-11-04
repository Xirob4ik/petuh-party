import type { Source } from './types';

/** Достаёт src из вставленного кода <iframe ...>. */
function extractIframeSrc(input: string): string | null {
  const m = input.match(/<iframe[^>]*\ssrc\s*=\s*(["'])(.*?)\1/i);
  if (!m) return null;
  return m[2].replace(/&amp;/g, '&');
}

function toUrl(raw: string): URL | null {
  let s = raw.trim();
  if (s.startsWith('//')) s = 'https:' + s;
  if (!/^https?:\/\//i.test(s)) {
    // «vk.com/video-1_2» без протокола
    if (/^[\w-]+(\.[\w-]+)+\//.test(s)) s = 'https://' + s;
    else return null;
  }
  try {
    return new URL(s);
  } catch {
    return null;
  }
}

const VK_HOSTS = /(^|\.)(vk\.com|vk\.ru|vkvideo\.ru)$/i;
const YT_HOSTS = /(^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/i;
const RUTUBE_HOSTS = /(^|\.)rutube\.ru$/i;
const FILE_EXT = /\.(mp4|m4v|webm|ogv|ogg|mov|mkv|m3u8)(\?|#|$)/i;

export type ParseResult = { ok: true; source: Source } | { ok: false; error: string };

export function parseSource(input: string): ParseResult {
  const trimmed = (input || '').trim();
  if (!trimmed) return { ok: false, error: 'Вставьте ссылку на видео' };

  const fromIframe = extractIframeSrc(trimmed);
  const url = toUrl(fromIframe ?? trimmed);
  if (!url) return { ok: false, error: 'Это не похоже на ссылку' };
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { ok: false, error: 'Нужна ссылка, начинающаяся с https://' };
  }
  const host = url.hostname.toLowerCase();
  const full = decodeURIComponent(url.href);

  // ── VK Видео ─────────────────────────────────────
  if (VK_HOSTS.test(host)) {
    let oid = url.searchParams.get('oid');
    let id = url.searchParams.get('id');
    const hash = url.searchParams.get('hash') || undefined;
    if (!(oid && id && /^-?\d+$/.test(oid) && /^\d+$/.test(id))) {
      // video-123_456, clip-123_456, ?z=video-123_456/pl_..., /playlist/.../video-1_2
      const m = full.match(/(?:video|clip)(-?\d+)_(\d+)/);
      if (!m) return { ok: false, error: 'В ссылке VK не нашлось номера видео. Откройте ролик и скопируйте адрес из строки браузера' };
      oid = m[1];
      id = m[2];
    }
    return {
      ok: true,
      source: {
        kind: 'vk',
        url: `https://vkvideo.ru/video${oid}_${id}`,
        title: 'VK Видео',
        oid,
        id,
        hash: hash && /^[\w-]{4,128}$/.test(hash) ? hash : undefined,
      },
    };
  }

  // ── YouTube ───────────────────────────────────────
  if (YT_HOSTS.test(host)) {
    let id: string | null = null;
    if (host.endsWith('youtu.be')) id = url.pathname.slice(1).split('/')[0];
    else if (url.searchParams.get('v')) id = url.searchParams.get('v');
    else {
      const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
      if (m) id = m[1];
    }
    if (!id || !/^[\w-]{6,20}$/.test(id)) return { ok: false, error: 'Не удалось найти id ролика YouTube' };
    return {
      ok: true,
      source: { kind: 'youtube', url: `https://www.youtube.com/watch?v=${id}`, title: 'YouTube', id },
    };
  }

  // ── Rutube ───────────────────────────────────────
  if (RUTUBE_HOSTS.test(host)) {
    const m = url.pathname.match(/\/(?:video|play\/embed|shorts|video\/private)\/([0-9a-f]{32})/i);
    if (!m) return { ok: false, error: 'Не удалось найти id ролика Rutube' };
    const p = url.searchParams.get('p') || undefined;
    return {
      ok: true,
      source: {
        kind: 'rutube',
        url: `https://rutube.ru/video/${m[1]}/${p ? `?p=${encodeURIComponent(p)}` : ''}`,
        title: 'Rutube',
        id: m[1].toLowerCase(),
        p: p && /^[\w-]{4,128}$/.test(p) ? p : undefined,
      },
    };
  }

  // ── Вставленный iframe с другого сайта — показываем, но без синхронизации
  if (fromIframe && !FILE_EXT.test(url.pathname)) {
    return { ok: true, source: { kind: 'iframe', url: url.href, title: host } };
  }

  // ── Прямая ссылка на файл / поток ────────────────
  const name = decodeURIComponent(url.pathname.split('/').pop() || '') || host;
  return {
    ok: true,
    source: {
      kind: 'file',
      url: url.href,
      title: name.replace(/\.[a-z0-9]{2,4}$/i, '') || host,
      hls: /\.m3u8(\?|#|$)/i.test(url.pathname + url.search),
    },
  };
}

/** Похоже ли введённое на ссылку (а не на код комнаты). */
export function looksLikeLink(input: string): boolean {
  const s = input.trim();
  return /<iframe/i.test(s) || /^https?:\/\//i.test(s) || /^[\w-]+(\.[\w-]+)+\//.test(s);
}

export const SOURCE_LABEL: Record<Source['kind'], string> = {
  vk: 'VK Видео',
  youtube: 'YouTube',
  rutube: 'Rutube',
  file: 'Файл',
  iframe: 'Встроенный плеер',
};
