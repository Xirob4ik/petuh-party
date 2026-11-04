import type { ClientMsg, ServerMsg } from '../../shared/types';

type Listener = (msg: ServerMsg) => void;
export type NetStatus = 'connecting' | 'online' | 'offline';

/**
 * Соединение с сервером: переподключение, очередь сообщений
 * и оценка разницы часов (серверное время нужно, чтобы все считали
 * позицию видео одинаково).
 */
export class RoomClient {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<(s: NetStatus) => void>();
  private queue: string[] = [];
  private retry = 0;
  private closed = false;
  private retryTimer: number | null = null;
  private pingTimer: number | null = null;
  private samples: { rtt: number; offset: number }[] = [];
  private hello: ClientMsg;

  /** serverNow = Date.now() + offset */
  offset = 0;
  rtt = 0;
  status: NetStatus = 'connecting';

  constructor(hello: ClientMsg) {
    this.hello = hello;
    this.connect();
  }

  serverNow() {
    return Date.now() + this.offset;
  }

  on(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  onStatus(fn: (s: NetStatus) => void) {
    this.statusListeners.add(fn);
    fn(this.status);
    return () => this.statusListeners.delete(fn);
  }

  /** Обновить данные для повторного входа (имя/аватар после правки профиля). */
  setHello(hello: ClientMsg) {
    this.hello = hello;
  }

  send(msg: ClientMsg) {
    const data = JSON.stringify(msg);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(data);
    else if (msg.t !== 'pos' && msg.t !== 'typing' && msg.t !== 'ping') {
      this.queue.push(data);
      if (this.queue.length > 50) this.queue.shift();
    }
  }

  close() {
    this.closed = true;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.ws?.close();
  }

  private setStatus(s: NetStatus) {
    if (s === this.status) return;
    this.status = s;
    this.statusListeners.forEach((fn) => fn(s));
  }

  private connect() {
    if (this.closed) return;
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${location.host}/ws`);
    this.ws = ws;
    this.setStatus('connecting');

    ws.onopen = () => {
      this.retry = 0;
      ws.send(JSON.stringify(this.hello));
      const pending = this.queue.splice(0);
      pending.forEach((d) => ws.send(d));
      this.setStatus('online');
      // серия пингов для точной оценки часов, дальше — раз в 20 секунд
      this.samples = [];
      for (let i = 0; i < 5; i++) setTimeout(() => this.ping(), i * 250);
      if (this.pingTimer) clearInterval(this.pingTimer);
      this.pingTimer = window.setInterval(() => this.ping(), 20_000);
    };

    ws.onmessage = (e) => {
      let msg: ServerMsg;
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }
      if (msg.t === 'pong') {
        this.onPong(msg.c, msg.s);
        return;
      }
      if (msg.t === 'welcome' && this.samples.length === 0) {
        // грубая оценка до первых пингов
        this.offset = msg.now - Date.now();
      }
      this.listeners.forEach((fn) => fn(msg));
    };

    ws.onclose = () => {
      if (this.pingTimer) clearInterval(this.pingTimer);
      if (this.closed) return;
      this.setStatus('offline');
      const delay = Math.min(5000, 400 * 2 ** this.retry++);
      this.retryTimer = window.setTimeout(() => this.connect(), delay);
    };
    ws.onerror = () => ws.close();
  }

  private ping() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ t: 'ping', c: Date.now() } satisfies ClientMsg));
    }
  }

  private onPong(c: number, s: number) {
    const now = Date.now();
    const rtt = now - c;
    if (rtt < 0 || rtt > 10_000) return;
    this.samples.push({ rtt, offset: s + rtt / 2 - now });
    if (this.samples.length > 8) this.samples.shift();
    // берём замер с наименьшей задержкой — он самый точный
    const best = this.samples.reduce((a, b) => (b.rtt < a.rtt ? b : a));
    this.offset = best.offset;
    this.rtt = best.rtt;
  }
}
