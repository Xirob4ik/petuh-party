import { makeIframe, PlayerAdapter } from './types';

/**
 * Rutube: управление через postMessage.
 * Команды: player:play, player:pause, player:setCurrentTime {time}.
 * События: player:ready / player:init, player:changeState {state},
 * player:currentTime {time}, player:durationChange {duration}, player:error.
 */
export class RutubeAdapter extends PlayerAdapter {
  readonly tolerance = 1.6;
  readonly seekCooldown = 3200;
  private iframe: HTMLIFrameElement | null = null;
  private state = 'idle';
  private time = 0;
  private duration = 0;
  private destroyed = false;
  private onMessage = (e: MessageEvent) => this.handle(e);
  private resolveReady: (() => void) | null = null;

  constructor(private src: { id: string; p?: string }) {
    super();
  }

  async mount(host: HTMLElement) {
    const q = this.src.p ? `?p=${encodeURIComponent(this.src.p)}` : '';
    this.iframe = makeIframe(`https://rutube.ru/play/embed/${this.src.id}${q}`, 'Rutube');
    window.addEventListener('message', this.onMessage);
    host.appendChild(this.iframe);
    await new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      setTimeout(() => reject(new Error('Rutube-плеер не ответил')), 25000);
    });
    if (!this.destroyed) this.emit({ type: 'ready' });
  }

  private post(type: string, data: Record<string, unknown> = {}) {
    this.iframe?.contentWindow?.postMessage(JSON.stringify({ type, data }), '*');
  }

  private handle(e: MessageEvent) {
    if (this.destroyed || e.source !== this.iframe?.contentWindow) return;
    let msg: any;
    try {
      msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    } catch {
      return;
    }
    if (!msg?.type) return;
    const d = msg.data || {};
    switch (msg.type) {
      case 'player:ready':
      case 'player:init':
        this.resolveReady?.();
        this.resolveReady = null;
        break;
      case 'player:changeState': {
        const s = String(d.state || '');
        this.state = s;
        if (s === 'playing') this.emit({ type: 'play' });
        else if (s === 'pause' || s === 'paused') this.emit({ type: 'pause' });
        else if (s === 'stopped' || s === 'completed') this.emit({ type: 'ended' });
        break;
      }
      case 'player:currentTime': {
        const t = Number(d.time ?? d.currentTime);
        if (Number.isFinite(t)) this.time = t;
        break;
      }
      case 'player:durationChange': {
        const dur = Number(d.duration);
        if (Number.isFinite(dur)) this.duration = dur;
        break;
      }
      case 'player:error':
        this.emit({ type: 'error', message: 'Rutube не может воспроизвести это видео' });
        break;
    }
  }

  play() {
    this.post('player:play');
  }
  pause() {
    this.post('player:pause');
  }
  seek(t: number) {
    this.time = t;
    this.post('player:setCurrentTime', { time: t });
  }
  setMuted(m: boolean) {
    this.post(m ? 'player:mute' : 'player:unMute');
  }
  getTime() {
    return this.time;
  }
  getDuration() {
    return this.duration;
  }
  isPaused() {
    // buffering/seeking — не пауза
    return !(this.state === 'playing' || this.state === 'buffering' || this.state === 'seeking');
  }
  destroy() {
    this.destroyed = true;
    window.removeEventListener('message', this.onMessage);
    this.iframe?.remove();
  }
}
