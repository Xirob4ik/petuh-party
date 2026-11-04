import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { WebSocketServer, type WebSocket } from 'ws';
import type { ClientMsg, ServerMsg } from '../shared/types';
import { getRoom, ROOM_ID_RE, rooms, sweepRooms, type Conn } from './rooms';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
// В собранном виде сервер лежит в dist/server.js, а клиент — в dist/public
const PUBLIC_DIR = resolve(process.env.PUBLIC_DIR || join(__dirname, 'public'));

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
};

function sendFile(req: IncomingMessage, res: ServerResponse, file: string, cache: string) {
  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  const size = statSync(file).size;
  const headers: Record<string, string | number> = {
    'Content-Type': type,
    'Cache-Control': cache,
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  // Range нужен браузеру для перемотки видеофайлов
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end();
      return;
    }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { ...headers, 'Content-Length': size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
}

function serveStatic(req: IncomingMessage, res: ServerResponse, pathname: string): boolean {
  let rel: string;
  try {
    rel = decodeURIComponent(pathname);
  } catch {
    return false;
  }
  const file = normalize(join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR)) return false;
  if (!existsSync(file) || !statSync(file).isFile()) return false;
  const immutable = rel.startsWith('/assets/') || rel.startsWith('/fonts/');
  const cache = immutable
    ? 'public, max-age=31536000, immutable'
    : rel === '/sw.js' || rel.endsWith('.webmanifest')
      ? 'no-cache'
      : 'public, max-age=86400';
  sendFile(req, res, file, cache);
  return true;
}

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://local');
  const path = url.pathname;

  if (path === '/health' || path === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size, uptime: Math.round(process.uptime()) }));
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }

  if (path !== '/' && serveStatic(req, res, path)) return;

  // SPA: главная и /room/КОД отдают index.html
  const index = join(PUBLIC_DIR, 'index.html');
  if (existsSync(index)) {
    sendFile(req, res, index, 'no-cache');
  } else {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Клиент не собран. Выполните: npm run build');
  }
});

// ── WebSocket ─────────────────────────────────────────
const wss = new WebSocketServer({ noServer: true, maxPayload: 1_500_000 });

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url || '/', 'http://local');
  if (url.pathname !== '/ws') {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
});

const alive = new WeakMap<WebSocket, boolean>();

wss.on('connection', (ws: WebSocket) => {
  const conn: Conn = { ws, room: null, userId: null, chatTimes: [], floatTimes: [] };
  alive.set(ws, true);
  ws.on('pong', () => alive.set(ws, true));

  ws.on('message', (raw) => {
    let msg: ClientMsg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (!msg || typeof msg !== 'object') return;

    if (msg.t === 'ping') {
      ws.send(JSON.stringify({ t: 'pong', c: msg.c, s: Date.now() } satisfies ServerMsg));
      return;
    }

    if (msg.t === 'hello') {
      const id = String(msg.room || '').toUpperCase();
      if (!ROOM_ID_RE.test(id)) {
        ws.send(JSON.stringify({ t: 'error', message: 'Неверный код комнаты' } satisfies ServerMsg));
        return;
      }
      if (conn.room) conn.room.leave(conn);
      getRoom(id).join(conn, msg.user);
      return;
    }

    conn.room?.handle(conn, msg).catch((err) => console.error('[room]', err));
  });

  ws.on('close', () => conn.room?.leave(conn));
  ws.on('error', () => {});
});

// Пинг соединений: отваливаются «зависшие» вкладки, а хостинг видит активность
setInterval(() => {
  for (const ws of wss.clients) {
    if (alive.get(ws) === false) {
      ws.terminate();
      continue;
    }
    alive.set(ws, false);
    try {
      ws.ping();
    } catch {
      /* ignore */
    }
  }
}, 20_000);

// Позиции участников рассылаем пачкой, а не на каждое сообщение
setInterval(() => {
  for (const room of rooms.values()) room.flushPositions();
}, 1_000);

setInterval(sweepRooms, 10 * 60_000);

server.listen(PORT, HOST, () => {
  console.log(`[petuh-party] http://localhost:${PORT}`);
});

for (const sig of ['SIGTERM', 'SIGINT'] as const) {
  process.on(sig, () => {
    console.log(`[petuh-party] ${sig}, останавливаюсь`);
    for (const ws of wss.clients) ws.close(1012, 'restart');
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref();
  });
}
