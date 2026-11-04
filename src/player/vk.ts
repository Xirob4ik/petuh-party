import { loadScript, makeIframe, PlayerAdapter } from './types';

/**
 * VK Видео через официальный JS API (https://vk.com/js/api/videoplayer.js).
 *
 * События API: inited, started, resumed, paused, ended, timeupdate {time},
 * error, adStarted, adEnded. Событий play/pause/seeking у VK НЕТ —
 * перемотку движок определяет по скачкам времени.
 * Методы: play, pause, seek(sec), getCurrentTime, getDuration, getState,
 * mute, unmute, isMuted, setVolume, getVolume, destroy, on, off.
 */

interface VkPlayer {
  play(): void;
  pause(): void;
  seek(t: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getState(): 'uninited' | 'unstarted' | 'playing' | 'paused' | 'ended' | 'error';
  mute?(): void;
  unmute?(): void;
  isMuted?(): boolean;
  on(event: string, fn: (...a: any[]) => void): void;
  off?(event: string, fn: (...a: any[]) => void): void;
  destroy?(): void;
}

declare global {
  interface Window {
    VK?: { VideoPlayer?: ((el: HTMLIFrameElement) => VkPlayer) & { Events?: Record<string, string> } };
  }
}

const API = 'https://vk.com/js/api/videoplayer.js';

export class VkAdapter extends PlayerAdapter {
  readonly tolerance = 1.6;
  readonly seekCooldown = 3200;
  private iframe: HTMLIFrameElement | null = null;
  private player: VkPlayer | null = null;
  private lastTime = 0;
  private duration = 0;
  private state = 'uninited';
  private destroyed = false;

  constructor(private src: { oid: string; id: string; hash?: string }) {
    super();
  }

  async mount(host: HTMLElement) {
    try {
      await loadScript(API, () => !!window.VK?.VideoPlayer);
    } catch {
      throw new Error('Не удалось загрузить плеер VK. Проверьте, что vk.com открывается');
    }
    if (this.destroyed) return;

    const url = new URL('https://vk.com/video_ext.php');
    url.searchParams.set('oid', this.src.oid);
    url.searchParams.set('id', this.src.id);
    if (this.src.hash) url.searchParams.set('hash', this.src.hash);
    url.searchParams.set('hd', '2');
    url.searchParams.set('js_api', '1');
    url.searchParams.set('__ref', 'vk.web2');

    this.iframe = makeIframe(url.href, 'VK Видео');
    host.appendChild(this.iframe);

    const player = window.VK!.VideoPlayer!(this.iframe);
    this.player = player;
    const E = window.VK!.VideoPlayer!.Events || {};
    const ev = (key: string, fallback: string) => E[key] || fallback;

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('VK не отвечает. Возможно, автор запретил встраивание этого видео')),
        25000,
      );
      player.on(ev('INITED', 'inited'), () => {
        clearTimeout(timer);
        this.state = this.safeState();
        this.duration = this.safe(() => player.getDuration(), 0);
        resolve();
      });
      player.on(ev('ERROR', 'error'), (e: any) => {
        clearTimeout(timer);
        const msg = 'VK не может воспроизвести это видео: оно удалено, закрыто или запрещено для встраивания';
        this.emit({ type: 'error', message: msg });
        reject(new Error(msg));
        void e;
      });
    });
    if (this.destroyed) return;

    player.on(ev('STARTED', 'started'), () => {
      this.state = 'playing';
      this.emit({ type: 'play' });
    });
    player.on(ev('RESUMED', 'resumed'), () => {
      this.state = 'playing';
      this.emit({ type: 'play' });
    });
    player.on(ev('PAUSED', 'paused'), () => {
      this.state = 'paused';
      this.emit({ type: 'pause' });
    });
    player.on(ev('ENDED', 'ended'), () => {
      this.state = 'ended';
      this.emit({ type: 'ended' });
    });
    player.on(ev('TIMEUPDATE', 'timeupdate'), (data: any) => {
      const t = typeof data === 'number' ? data : Number(data?.time);
      if (Number.isFinite(t)) this.lastTime = t;
    });
    player.on(ev('AD_STARTED', 'adStarted'), () => this.emit({ type: 'ad', on: true }));
    player.on(ev('AD_ENDED', 'adEnded'), () => this.emit({ type: 'ad', on: false }));

    this.emit({ type: 'ready' });
  }

  private safe<T>(fn: () => T, fallback: T): T {
    try {
      const v = fn();
      return v === undefined || v === null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  private safeState() {
    return this.player ? this.safe(() => this.player!.getState(), this.state) : this.state;
  }

  play() {
    this.safe(() => this.player?.play(), undefined);
  }
  pause() {
    this.safe(() => this.player?.pause(), undefined);
  }
  seek(t: number) {
    this.lastTime = t;
    this.safe(() => this.player?.seek(t), undefined);
  }
  getTime() {
    const t = this.player ? this.safe(() => Number(this.player!.getCurrentTime()), NaN) : NaN;
    return Number.isFinite(t) ? t : this.lastTime;
  }
  getDuration() {
    const d = this.player ? this.safe(() => Number(this.player!.getDuration()), 0) : 0;
    if (Number.isFinite(d) && d > 0) this.duration = d;
    return this.duration;
  }
  isPaused() {
    return this.safeState() !== 'playing';
  }
  unmute() {
    this.safe(() => this.player?.unmute?.(), undefined);
  }
  setMuted(m: boolean) {
    this.safe(() => (m ? this.player?.mute?.() : this.player?.unmute?.()), undefined);
  }
  destroy() {
    this.destroyed = true;
    this.safe(() => this.player?.destroy?.(), undefined);
    this.iframe?.remove();
    this.player = null;
  }
}
