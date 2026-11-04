// Сервис-воркер нужен, чтобы сайт можно было установить как приложение.
// Кешируем только оболочку: шрифты, иконки, стикеры и собранные файлы.
// Сеть всегда в приоритете — комнаты и видео работают только онлайн.
const CACHE = 'petuh-party-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith('/ws') || url.pathname === '/health') return;
  const isStatic = /^\/(assets|fonts|stickers)\//.test(url.pathname) || /\.(png|svg|webmanifest)$/.test(url.pathname);
  if (!isStatic) return; // страницы и видео — напрямую из сети
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok && res.status === 200) cache.put(req, res.clone());
      return res;
    }),
  );
});
